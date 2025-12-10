import { useState, useRef, useEffect } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { useApp } from "../contexts/AppContext";
import { DataSourceBadge } from "./DataSources";
import { torontoWards } from "../data/torontoWards";
import { torontoRentalData } from "../data/rentalData";
import { fetchNeighborhoodImage } from "../services/neighborhoodImages";
import {
  Brain,
  Footprints,
  Building2,
  Phone,
  MessageCircle,
  Users,
  TrendingUp,
  MapPin,
  Home,
  Activity,
  AlertTriangle,
  ExternalLink,
  Share2,
  X,
  Menu,
} from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "your-token-here";

export default function EmpathicGrid({ onSwitchView }) {
  const {
    emotions,
    dataSource,
    connectionLine,
    setConnectionLine,
    cityBrainData,
    updateMood,
  } = useApp();
  const mapRef = useRef();
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [neighborhoodImage, setNeighborhoodImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true); // NEED CLEANING view
  const [showSafeZone, setShowSafeZone] = useState(true); // SAFE ZONE view
  const [showWardBoundaries, setShowWardBoundaries] = useState(true);
  const [destinationLabel, setDestinationLabel] = useState(null); // For red line label
  const [cleansingZoneInfo, setCleansingZoneInfo] = useState(null); // For heatmap click info
  const [safeZoneLines, setSafeZoneLines] = useState(null); // Lines from red dots to safe zones

  // Close cleansing zone info when switching views
  useEffect(() => {
    setCleansingZoneInfo(null);
  }, [showHeatmap, showSafeZone]);

  // Generate safe zone guidance lines when safe zone view is enabled
  useEffect(() => {
    if (showSafeZone && emotions.length > 0) {
      const redDots = emotions.filter((e) => e.mood === "lonely");
      const greenDots = emotions.filter((e) => e.mood !== "lonely");

      if (redDots.length > 0 && greenDots.length > 0) {
        const lines = redDots.map((redDot) => {
          // Find nearest green dot
          let nearestGreen = greenDots[0];
          let minDistance = Math.sqrt(
            Math.pow(redDot.lng - greenDots[0].lng, 2) +
              Math.pow(redDot.lat - greenDots[0].lat, 2)
          );

          for (const greenDot of greenDots) {
            const distance = Math.sqrt(
              Math.pow(redDot.lng - greenDot.lng, 2) +
                Math.pow(redDot.lat - greenDot.lat, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestGreen = greenDot;
            }
          }

          // Create smooth curved line
          const midLng = (redDot.lng + nearestGreen.lng) / 2;
          const midLat = (redDot.lat + nearestGreen.lat) / 2 + 0.01;

          return {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [redDot.lng, redDot.lat],
                [midLng, midLat],
                [nearestGreen.lng, nearestGreen.lat],
              ],
            },
          };
        });

        setSafeZoneLines({
          type: "FeatureCollection",
          features: lines,
        });
      } else {
        setSafeZoneLines(null);
      }
    } else {
      setSafeZoneLines(null);
    }
  }, [showSafeZone, emotions]);

  // Fetch neighborhood image when marker is selected
  useEffect(() => {
    if (selectedMarker) {
      setImageLoading(true);
      fetchNeighborhoodImage(selectedMarker.neighborhood)
        .then((image) => {
          setNeighborhoodImage(image);
          setImageLoading(false);
        })
        .catch(() => {
          setNeighborhoodImage(null);
          setImageLoading(false);
        });
    } else {
      setNeighborhoodImage(null);
    }
  }, [selectedMarker]);

  // Generate ward polygons with City Brain scores for choropleth
  const wardGeoJSON = {
    type: "FeatureCollection",
    features: Object.entries(torontoWards).map(([name, ward]) => ({
      type: "Feature",
      properties: {
        name,
        connectionScore: cityBrainData[name]?.connectionScore || 0.5,
        mood: cityBrainData[name]?.mood || "lonely",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [ward.lng - 0.02, ward.lat - 0.02],
            [ward.lng + 0.02, ward.lat - 0.02],
            [ward.lng + 0.02, ward.lat + 0.02],
            [ward.lng - 0.02, ward.lat + 0.02],
            [ward.lng - 0.02, ward.lat - 0.02],
          ],
        ],
      },
    })),
  };

  // Generate heatmap points from emotions
  const heatmapGeoJSON = {
    type: "FeatureCollection",
    features: emotions.map((emotion) => ({
      type: "Feature",
      properties: {
        intensity: emotion.mood === "lonely" ? 1 : 0,
      },
      geometry: {
        type: "Point",
        coordinates: [emotion.lng, emotion.lat],
      },
    })),
  };

  const handleGenerateEvent = () => {
    const nonCompliantNodes = emotions.filter((e) => e.mood === "lonely");
    if (nonCompliantNodes.length < 2) return;

    const node1 =
      nonCompliantNodes[Math.floor(Math.random() * nonCompliantNodes.length)];
    const remaining = nonCompliantNodes.filter((n) => n.id !== node1.id);
    const node2 = remaining[Math.floor(Math.random() * remaining.length)];

    // 50/50 split for dramatic effect
    const isCompliant = Math.random() > 0.5;

    // RED PATHS: Extend FAR beyond map boundaries (unknown destination)
    // GREEN PATHS: Smooth curved line to safe zone within Toronto
    let coordinates;
    let endLng, endLat;

    if (isCompliant) {
      // GREEN: Smooth bezier-like curve to safe zone
      endLng = node2.lng;
      endLat = node2.lat;
      const midLng = (node1.lng + node2.lng) / 2;
      const midLat = (node1.lat + node2.lat) / 2 + 0.02; // Slight curve upward
      coordinates = [
        [node1.lng, node1.lat],
        [midLng, midLat],
        [endLng, endLat],
      ];
    } else {
      // RED: Abrupt line extending far beyond map
      endLng = node1.lng - 2.5; // Even further west
      endLat = node1.lat - 1.5; // Even further south
      coordinates = [
        [node1.lng, node1.lat],
        [endLng, endLat],
      ];
    }

    setConnectionLine({
      type: "Feature",
      properties: {
        complianceScore: isCompliant ? 0.75 : 0.15, // Green >= 0.5, Red < 0.5
        status: isCompliant ? "SAFE ZONE" : "UNKNOWN",
        isRedLine: !isCompliant,
      },
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    });

    // Show destination label for red line
    if (!isCompliant) {
      setDestinationLabel({
        lng: endLng,
        lat: endLat,
        text: "DESTINATION: UNKNOWN",
      });
    } else {
      setDestinationLabel(null);
    }

    // Auto-switch to Assignment view to show the fate lines
    setShowSafeZone(true);
    setShowHeatmap(false);

    if (isCompliant) {
      updateMood([node1.id, node2.id], "connected");
    }

    setTimeout(() => {
      setConnectionLine(null);
      setDestinationLabel(null);
      setShowHeatmap(true); // Return to heatmap after 6 seconds
      setShowSafeZone(true);
    }, 6000);
  };

  return (
    <div className="relative h-screen bg-bg-deep">
      {/* Backdrop for Sidebar */}
      {!sidebarCollapsed && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Floating Sidebar Panel (Google Maps Style) */}
      <aside
        style={{ backgroundColor: "#0a0a0a" }}
        className={`absolute top-0 left-0 h-full flex flex-col shadow-2xl border-r-2 border-threat/50 transition-all duration-300 z-20 ${
          sidebarCollapsed ? "-translate-x-full" : "translate-x-0 w-[400px]"
        }`}>
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-threat">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-mono text-terminal tracking-widest terminal-text">
              THE GRID
            </h1>
            <div className="flex items-center gap-3">
              <DataSourceBadge dataSource={dataSource} />
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 hover:bg-threat/20 border border-threat transition-colors group">
                <X className="w-5 h-5 text-threat" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-2 bg-void border-2 border-caution">
              <span className="text-xs font-mono font-bold text-caution tracking-widest">
                SURVEILLANCE PROTOCOL
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Surveillance Parameters */}
            <div className="space-y-3 bg-steel border-2 border-threat p-5">
              <h3 className="text-sm font-mono font-bold text-caution uppercase tracking-widest px-1">
                MONITORING PARAMETERS
              </h3>
              <p className="text-sm text-text-dim font-mono leading-relaxed px-1">
                Citizen compliance scores calculated from behavioral
                surveillance data:
              </p>
              <ul className="text-xs text-text-dim font-mono space-y-3 ml-4 px-1">
                <li className="flex items-start gap-2">
                  <span className="text-threat mt-0.5">▸</span>
                  <span className="leading-relaxed">
                    <strong className="text-terminal">
                      MOVEMENT TRACKING:
                    </strong>{" "}
                    Pedestrian flow patterns (Walk Score API)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-threat mt-0.5">▸</span>
                  <span className="leading-relaxed">
                    <strong className="text-terminal">GATHERING ZONES:</strong>{" "}
                    Unauthorized assembly points identified (OpenStreetMap)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-threat mt-0.5">▸</span>
                  <span className="leading-relaxed">
                    <strong className="text-terminal">
                      COMPLAINT FREQUENCY:
                    </strong>{" "}
                    Deviation reports logged (Toronto 311)
                  </span>
                </li>
              </ul>
            </div>

            {/* Data Sources */}
            <div className="bg-void p-4 border-2 border-steel-light space-y-2">
              <h4 className="text-xs font-mono font-bold text-terminal uppercase tracking-widest flex items-center gap-2">
                <span className="text-terminal">▣</span> INTELLIGENCE FEEDS
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                <a
                  href="https://www.walkscore.com/professional/api.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00ff00" }}
                  className="flex items-center gap-2 text-terminal hover:text-terminal-dim transition-colors">
                  <span>MOVEMENT_TRACKING_SYS</span>
                  <span className="text-[10px]">↗</span>
                </a>
                <a
                  href="https://overpass-api.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00ff00" }}
                  className="flex items-center gap-2 text-terminal hover:text-terminal-dim transition-colors">
                  <span>LOCATION_DATABASE</span>
                  <span className="text-[10px]">↗</span>
                </a>
                <a
                  href="https://open.toronto.ca/dataset/311-service-requests/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00ff00" }}
                  className="flex items-center gap-2 text-terminal hover:text-terminal-dim transition-colors">
                  <span>COMPLAINT_REGISTRY</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center" style={{ marginTop: "3rem" }}>
              <button
                onClick={handleGenerateEvent}
                className="px-8 py-4 bg-threat text-white text-lg font-mono font-bold border-4 border-caution
                         shadow-[0_0_30px_rgba(255,0,0,0.6)]
                         hover:shadow-[0_0_50px_rgba(255,0,0,0.9)]
                         hover:bg-threat-dim
                         active:scale-95
                         transition-all duration-150
                         threat-glow">
                ⚠ EXECUTE RELOCATION PROTOCOL
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Map - Full Screen */}
      <main className="absolute inset-0 z-0 w-full h-full">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`absolute top-4 z-30 bg-steel text-terminal hover:bg-threat border-2 border-terminal hover:border-threat p-3 shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all ${
            sidebarCollapsed ? "left-4" : "left-[416px]"
          }`}>
          <Menu className="w-5 h-5" />
        </button>

        {/* View Mode Toggle */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-12">
          <div className="bg-steel border border-caution/30 px-6 py-3 shadow-[0_0_15px_rgba(255,255,0,0.3)]">
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-3 cursor-pointer group px-4 py-2 border border-transparent hover:border-threat/30 transition-all">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="w-4 h-4 accent-threat"
                />
                <span className="text-xs font-mono text-text-ghost group-hover:text-threat transition-colors">
                  NEED CLEANING
                </span>
              </label>
              <div className="w-px h-6 bg-caution/30" />
              <label className="flex items-center gap-3 cursor-pointer group px-4 py-2 border border-transparent hover:border-terminal/30 transition-all">
                <input
                  type="checkbox"
                  checked={showSafeZone}
                  onChange={(e) => setShowSafeZone(e.target.checked)}
                  className="w-4 h-4 accent-terminal"
                />
                <span className="text-xs font-mono text-text-ghost group-hover:text-terminal transition-colors">
                  SAFE ZONE
                </span>
              </label>
            </div>
          </div>
          <div className="bg-steel border border-caution/30 px-6 py-3 shadow-[0_0_15px_rgba(255,255,0,0.3)]">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showWardBoundaries}
                onChange={(e) => setShowWardBoundaries(e.target.checked)}
                className="w-4 h-4 accent-terminal"
              />
              <span className="text-xs font-mono text-text-ghost group-hover:text-terminal transition-colors">
                Sector Boundaries
              </span>
            </label>
          </div>
        </div>

        {/* Map Legend - View-specific */}
        <div
          className="absolute z-10 bg-steel border border-caution/30 px-4 py-3 shadow-[0_0_15px_rgba(255,255,0,0.3)]"
          style={{ bottom: "calc(0% + 1rem)", right: "calc(0% + 1rem)" }}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-caution/70 tracking-widest">
                {showHeatmap && !showSafeZone
                  ? "THREAT ZONES"
                  : showSafeZone && !showHeatmap
                  ? "FATE ASSIGNMENTS"
                  : "COMBINED VIEW"}
              </span>
            </div>
            {showHeatmap && !showSafeZone ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500/70 shadow-[0_0_6px_rgba(100,169,207,0.3)] border border-blue-400/30" />
                  <span className="text-xs font-mono text-text-dim">
                    DATA CLOUD (LOW DENSITY)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500/70 shadow-[0_0_6px_rgba(255,200,100,0.3)] border border-yellow-400/30" />
                  <span className="text-xs font-mono text-text-dim">
                    WARNING ZONE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-threat/70 shadow-[0_0_6px_rgba(255,0,0,0.3)] border border-threat/30" />
                  <span className="text-xs font-mono text-text-dim">
                    CLEANSING SCHEDULED
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-terminal/70 shadow-[0_0_6px_rgba(0,255,0,0.3)]" />
                  <span className="text-xs font-mono text-text-dim">
                    SAFE ZONE (VISIBLE DESTINATION)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-threat/70 shadow-[0_0_6px_rgba(255,0,0,0.3)]" />
                  <span className="text-xs font-mono text-text-dim">
                    UNKNOWN (EXTENDS OFF-MAP)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="absolute inset-0 w-full h-full">
          <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
              longitude: -79.3832,
              latitude: 43.6532,
              zoom: 11,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            onClick={(e) => {
              setHoveredMarker(null);
              setSelectedMarker(null);

              // Handle heatmap click in View A - detect red zones
              if (showHeatmap) {
                const clickedLng = e.lngLat.lng;
                const clickedLat = e.lngLat.lat;

                // Find closest lonely (red zone) emotion within reasonable distance
                const lonelyEmotions = emotions.filter(
                  (em) => em.mood === "lonely"
                );
                let closestEmotion = null;
                let minDistance = 0.03; // ~3km radius for click detection

                for (const emotion of lonelyEmotions) {
                  const distance = Math.sqrt(
                    Math.pow(emotion.lng - clickedLng, 2) +
                      Math.pow(emotion.lat - clickedLat, 2)
                  );

                  if (distance < minDistance) {
                    minDistance = distance;
                    closestEmotion = emotion;
                  }
                }

                if (closestEmotion) {
                  // Generate cleansing zone info for clicked red zone
                  const reasons = [
                    "High density of non-compliant behavioral patterns detected",
                    "Excessive unauthorized social gatherings reported",
                    "Deviation from mandated movement corridors",
                    "Abnormal communication frequency with flagged sectors",
                    "Failure to meet civic participation quotas",
                    "Pattern matching predictive crime algorithms",
                  ];
                  const reason =
                    reasons[Math.floor(Math.random() * reasons.length)];

                  setCleansingZoneInfo({
                    neighborhood: closestEmotion.neighborhood,
                    reason: reason,
                    lng: closestEmotion.lng,
                    lat: closestEmotion.lat,
                    complianceScore: Math.floor(Math.random() * 30 + 10),
                    threatLevel: "CRITICAL",
                  });
                } else {
                  setCleansingZoneInfo(null);
                }
              }
            }}>
            {/* Ward Boundaries - Minimal for context only */}
            {showWardBoundaries && (
              <Source type="geojson" data={wardGeoJSON}>
                <Layer
                  id="ward-boundaries-line"
                  type="line"
                  paint={{
                    "line-color": "#ffffff",
                    "line-width": 0.5,
                    "line-opacity": 0.2,
                  }}
                />
              </Source>
            )}

            {/* VIEW A: HEATMAP - Beautiful data cloud with red cleansing zones */}
            {showHeatmap && (
              <Source type="geojson" data={heatmapGeoJSON}>
                <Layer
                  id="isolation-heatmap"
                  type="heatmap"
                  paint={{
                    "heatmap-weight": [
                      "interpolate",
                      ["linear"],
                      ["get", "intensity"],
                      0,
                      0,
                      1,
                      3,
                    ],
                    "heatmap-intensity": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      0,
                      3,
                      12,
                      6,
                    ],
                    "heatmap-color": [
                      "interpolate",
                      ["linear"],
                      ["heatmap-density"],
                      0,
                      "rgba(100, 169, 207, 0)",
                      0.3,
                      "rgba(150, 200, 255, 0.6)", // Beautiful cool blue
                      0.5,
                      "rgba(180, 220, 255, 0.7)", // Ethereal data cloud
                      0.65,
                      "rgba(255, 180, 120, 0.8)", // Subtle warning
                      0.8,
                      "rgba(255, 80, 80, 0.9)", // Red cleansing zone
                      1,
                      "rgba(255, 0, 0, 1)", // Intense red = cleansing scheduled
                    ],
                    "heatmap-radius": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      0,
                      5,
                      12,
                      40,
                    ],
                    "heatmap-opacity": 0.85,
                  }}
                />
              </Source>
            )}

            {/* VIEW B: Safe Zone Guidance Lines */}
            {showSafeZone && safeZoneLines && (
              <Source type="geojson" data={safeZoneLines}>
                <Layer
                  id="safe-zone-glow"
                  type="line"
                  paint={{
                    "line-color": "#00ff00",
                    "line-width": 10,
                    "line-blur": 8,
                    "line-opacity": 0.6,
                  }}
                  layout={{
                    "line-cap": "round",
                    "line-join": "round",
                  }}
                />
                <Layer
                  id="safe-zone-line"
                  type="line"
                  paint={{
                    "line-color": "#00ff00",
                    "line-width": 4,
                    "line-opacity": 1,
                  }}
                  layout={{
                    "line-cap": "round",
                    "line-join": "round",
                  }}
                />
              </Source>
            )}

            {/* VIEW B: ASSIGNMENT - Fate lines (Green = safe, Red = unknown) */}
            {showSafeZone && connectionLine && (
              <Source type="geojson" data={connectionLine}>
                <Layer
                  id="connection-glow"
                  type="line"
                  paint={{
                    "line-color": [
                      "case",
                      ["<", ["get", "complianceScore"], 0.5],
                      "#ff0000",
                      "#00ff00",
                    ],
                    "line-width": 14,
                    "line-blur": 12,
                    "line-opacity": 0.8,
                  }}
                  layout={{
                    "line-cap": "round",
                    "line-join": "round",
                  }}
                />
                <Layer
                  id="connection-line"
                  type="line"
                  paint={{
                    "line-color": [
                      "case",
                      ["<", ["get", "complianceScore"], 0.5],
                      "#ff0000",
                      "#00ff00",
                    ],
                    "line-width": 6,
                    "line-opacity": 1,
                  }}
                  layout={{
                    "line-cap": "round",
                    "line-join": "round",
                  }}
                />
              </Source>
            )}

            {/* Emotion Markers - hide red (lonely) ones in heatmap view to allow clicking cleansing zones */}
            {emotions.map((emotion) => {
              // In heatmap view, skip red markers so they don't block cleansing zone clicks
              if (showHeatmap && emotion.mood === "lonely") {
                return null;
              }

              return (
                <Marker
                  key={emotion.id}
                  longitude={emotion.lng}
                  latitude={emotion.lat}
                  anchor="center">
                  <div
                    className="relative cursor-pointer transition-transform hover:scale-125 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarker(
                        selectedMarker?.id === emotion.id ? null : emotion
                      );
                      setHoveredMarker(null);
                    }}
                    onMouseEnter={() =>
                      !selectedMarker && setHoveredMarker(emotion)
                    }
                    onMouseLeave={() => setHoveredMarker(null)}>
                    <div
                      className={`flex flex-col items-center transition-transform ${
                        selectedMarker?.id === emotion.id ||
                        hoveredMarker?.id === emotion.id
                          ? "scale-125"
                          : ""
                      }`}>
                      {/* House icon marker */}
                      <div
                        className={`p-2 rounded-lg ${
                          emotion.mood === "lonely"
                            ? "bg-threat/20 text-threat shadow-[0_0_8px_rgba(255,0,0,0.4)]"
                            : "bg-terminal/20 text-terminal shadow-[0_0_8px_rgba(0,255,0,0.4)]"
                        }`}>
                        <Home className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Marker>
              );
            })}

            {/* Destination Label for Red Lines */}
            {showSafeZone && destinationLabel && (
              <Marker
                key="destination-label"
                longitude={destinationLabel.lng}
                latitude={destinationLabel.lat}>
                <div className="pointer-events-none">
                  <div className="bg-threat/90 px-3 py-1.5 shadow-[0_0_20px_rgba(255,0,0,0.6)]">
                    <span className="text-xs font-mono font-bold text-white tracking-wider">
                      Unknown Destination
                    </span>
                  </div>
                </div>
              </Marker>
            )}
          </Map>
        </div>

        {/* Cleansing Zone Info Panel - View A */}
        {showHeatmap && cleansingZoneInfo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#000000] border-2 border-threat backdrop-blur-none px-8 py-6 shadow-[0_0_40px_rgba(255,0,0,0.8)] min-w-[500px]">
            <button
              onClick={() => setCleansingZoneInfo(null)}
              className="absolute top-2 right-2 p-1 hover:bg-threat/20 border border-threat/50 transition-colors">
              <X className="w-4 h-4 text-threat" />
            </button>

            <div className="space-y-3">
              {/* Title */}
              <div className="text-center border-b-2 border-threat pb-3">
                <h2 className="text-2xl font-mono font-bold text-threat tracking-widest mb-1">
                  NEED CLEANING
                </h2>
                <div className="text-xs font-mono text-caution tracking-wider">
                  HIGH-RISK ZONE IDENTIFIED
                </div>
              </div>

              {/* Zone Info */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-mono font-bold text-caution tracking-wider mb-2 px-1">
                    ZONE DESIGNATION
                  </div>
                  <div className="text-sm font-mono text-white bg-void px-4 py-3 border border-threat/30">
                    {cleansingZoneInfo.neighborhood.toUpperCase()}
                  </div>
                </div>
                <div className="px-2 py-3">
                  <div className="text-xs font-mono font-bold text-caution tracking-wider mb-2 px-1">
                    THREAT LEVEL
                  </div>
                  <div className="text-sm font-mono text-threat bg-void px-4 py-3 border border-threat/30">
                    {cleansingZoneInfo.threatLevel}
                  </div>
                </div>
                <div className="px-2 py-3">
                  <div className="text-xs font-mono font-bold text-caution tracking-wider mb-2 px-1">
                    RISK ASSESSMENT
                  </div>
                  <div className="text-sm font-mono text-threat bg-void px-4 py-3 border border-threat/30">
                    {cleansingZoneInfo.complianceScore}% RISK SCORE
                  </div>
                </div>
                <div className="px-2 py-3">
                  <div className="text-xs font-mono font-bold text-caution tracking-wider mb-2 px-1">
                    INTERVENTION REQUIRED
                  </div>
                  <div className="text-sm font-mono text-text-dim bg-void px-4 py-3 border border-threat/30 leading-relaxed">
                    {cleansingZoneInfo.reason}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="text-center pt-3 border-t-2 border-threat/30">
                <div className="text-xs font-mono text-threat tracking-wider animate-pulse">
                  ⚠ IMMEDIATE ATTENTION REQUIRED ⚠
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Hover Preview */}
        {hoveredMarker && !selectedMarker && (
          <div className="absolute top-20 left-6 bg-steel border-2 border-caution px-3 py-2 shadow-[0_0_20px_rgba(255,255,0,0.4)] pointer-events-none">
            <div className="text-xs font-mono font-bold text-caution tracking-wider">
              SECTOR: {hoveredMarker.neighborhood.toUpperCase()}
            </div>
            <div className="text-xs font-mono text-terminal">CLICK TO SCAN</div>
          </div>
        )}

        {/* Backdrop Overlay */}
        {selectedMarker && (
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"
            onClick={() => setSelectedMarker(null)}
          />
        )}

        {/* Sliding Panel from Left */}
        {selectedMarker && (
          <div
            style={{ backgroundColor: "#0a0a0a" }}
            className={`absolute top-0 left-20 h-full w-[460px] flex flex-col shadow-2xl border-r-2 border-threat/50 z-20 transition-transform duration-300 overflow-y-auto ${
              selectedMarker ? "translate-x-0" : "-translate-x-full"
            }`}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedMarker(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-steel hover:bg-threat border-2 border-threat transition-colors group">
              <X className="w-4 h-4 text-text-ghost group-hover:text-text-bright" />
            </button>

            {/* Banner Image from API */}
            <div className="h-48 relative overflow-hidden border-b-2 border-threat">
              {imageLoading ? (
                <div className="w-full h-full bg-steel flex items-center justify-center">
                  <div className="animate-pulse text-terminal font-mono">
                    SCANNING...
                  </div>
                </div>
              ) : neighborhoodImage ? (
                <>
                  <img
                    src={neighborhoodImage.url}
                    alt={neighborhoodImage.alt}
                    className="w-full h-full object-cover grayscale opacity-80 glitch"
                    style={{ filter: "grayscale(100%) contrast(1.2)" }}
                  />
                  {/* Scanline overlay */}
                  <div className="scanline" />
                  {/* Red grid overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-threat/20 to-transparent" />
                  {/* Surveillance timestamp */}
                  <div className="absolute top-2 left-2 text-xs text-terminal font-mono bg-void/80 px-2 py-1 border border-terminal">
                    SURVEILLANCE ACTIVE
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-threat font-mono">
                    <a
                      href={neighborhoodImage.credit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-threat-dim">
                      SRC: {neighborhoodImage.credit.photographer}
                    </a>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-steel flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-threat opacity-20" />
                </div>
              )}
            </div>

            {/* Panel Content */}
            <div className="p-8 space-y-8">
              {/* Alert Header */}
              <div className="pb-0 mb-6 bg-threat p-4 border-2 border-threat">
                <h2 className="text-2xl font-mono font-bold text-white mb-2 tracking-wider">
                  ⚠ CITIZEN SURVEILLANCE REPORT
                </h2>
                <div className="text-xs text-white/90 font-mono tracking-wide">
                  SECTOR: {selectedMarker.neighborhood.toUpperCase()}
                </div>
              </div>
              <div className="border-2 border-steel-light p-4">
                <p className="text-xs text-text-dim font-mono leading-relaxed">
                  {torontoWards[
                    Object.keys(torontoWards).find(
                      (k) =>
                        torontoWards[k].name === selectedMarker.neighborhood ||
                        k === selectedMarker.neighborhood
                    )
                  ]?.description || selectedMarker.persona}
                </p>
              </div>

              {/* 1. COMPLIANCE INDEX - Grid Status */}
              {cityBrainData[selectedMarker.neighborhood] && (
                <div className="p-6 bg-steel border-2 border-threat">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-caution tracking-widest">
                      COMPLIANCE INDEX
                    </span>
                    <div
                      className={`px-3 py-1 text-xs font-mono font-bold border-2 ${
                        cityBrainData[selectedMarker.neighborhood]
                          .isolationRisk === "low"
                          ? "border-terminal text-terminal bg-terminal/10"
                          : cityBrainData[selectedMarker.neighborhood]
                              .isolationRisk === "moderate"
                          ? "border-caution text-caution bg-caution/10"
                          : "border-threat text-threat bg-threat/10"
                      }`}>
                      {cityBrainData[selectedMarker.neighborhood]
                        .isolationRisk === "low"
                        ? "GRID-ALIGNED"
                        : cityBrainData[selectedMarker.neighborhood]
                            .isolationRisk === "moderate"
                        ? "DEVIATION DETECTED"
                        : "NON-COMPLIANT"}
                    </div>
                  </div>
                  <div
                    className="text-5xl font-mono font-bold mb-2 mt-4 terminal-text"
                    style={{
                      color:
                        cityBrainData[selectedMarker.neighborhood].mood ===
                        "connected"
                          ? "#00ff00"
                          : "#ff0000",
                    }}>
                    {(
                      cityBrainData[selectedMarker.neighborhood]
                        .connectionScore * 100
                    ).toFixed(0)}
                    %
                  </div>
                  <div className="text-xs text-text-dim font-mono mt-1">
                    THE GRID MONITORS ALL DEVIATIONS
                  </div>
                </div>
              )}

              {/* 2. HOUSING UNIT STATUS */}
              {torontoRentalData[selectedMarker.neighborhood] && (
                <div className="space-y-3">
                  <h3 className="text-lg font-mono font-bold text-caution flex items-center gap-2 mb-4 border-b-2 border-caution pb-2">
                    <Home className="w-5 h-5 text-caution" />
                    HOUSING UNIT STATUS
                  </h3>

                  {/* Rent Price */}
                  <div className="p-5 bg-steel border-2 border-steel-light">
                    <div className="text-xs font-mono font-bold text-text-ghost uppercase tracking-widest mb-3">
                      MONTHLY EXTRACTION RATE
                    </div>
                    <div className="text-4xl font-mono font-bold text-caution my-3">
                      $
                      {torontoRentalData[
                        selectedMarker.neighborhood
                      ].avgRent.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-3 p-3 bg-void border-2 border-threat">
                      <TrendingUp
                        className={`w-5 h-5 ${
                          torontoRentalData[selectedMarker.neighborhood]
                            .yoyIncrease > 0
                            ? "text-threat"
                            : "text-terminal"
                        }`}
                      />
                      <span
                        className={`text-base font-mono font-bold ${
                          torontoRentalData[selectedMarker.neighborhood]
                            .yoyIncrease > 0
                            ? "text-threat"
                            : "text-terminal"
                        }`}>
                        {torontoRentalData[selectedMarker.neighborhood]
                          .yoyIncrease > 0
                          ? "+"
                          : ""}
                        {(
                          torontoRentalData[selectedMarker.neighborhood]
                            .yoyIncrease * 100
                        ).toFixed(1)}
                        %
                      </span>
                      <span className="text-sm text-text-dim font-mono">
                        ANNUAL INCREASE
                      </span>
                    </div>
                  </div>

                  {/* Relocation Protocol */}
                  {torontoRentalData[selectedMarker.neighborhood].yoyIncrease >
                    0.05 && (
                    <div className="flex items-start gap-3 p-4 bg-threat/20 border-2 border-threat mt-3">
                      <AlertTriangle className="w-5 h-5 text-threat flex-shrink-0 mt-0.5" />
                      <div className="text-xs font-mono text-text-dim">
                        <div className="font-bold text-threat mb-2 tracking-wide">
                          ⚠ MANDATORY RELOCATION IMMINENT
                        </div>
                        Extraction rate exceeds citizen capacity. Grid command:
                        Prepare for sector reassignment.
                      </div>
                    </div>
                  )}

                  {/* Turnover Rate */}
                  <div className="flex items-center justify-between p-5 bg-void border-2 border-steel-light mt-4">
                    <div className="text-sm font-mono font-bold text-text-dim">
                      UNIT TURNOVER
                    </div>
                    <div className="text-xl font-mono font-bold text-terminal">
                      {(
                        torontoRentalData[selectedMarker.neighborhood]
                          .turnoverRate * 100
                      ).toFixed(0)}
                      % annually
                    </div>
                  </div>
                </div>
              )}

              {/* 3. BEHAVIORAL METRICS */}
              {cityBrainData[selectedMarker.neighborhood]?.metrics && (
                <div className="space-y-3">
                  <h3 className="text-lg font-mono font-bold text-caution flex items-center gap-2 mb-4 border-b-2 border-caution pb-2">
                    <Brain className="w-5 h-5 text-caution" />
                    BEHAVIORAL METRICS
                  </h3>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-void border-2 border-steel-light p-2 text-center">
                      <Footprints className="w-4 h-4 mx-auto mb-1 text-terminal" />
                      <div className="text-lg font-mono font-bold text-terminal">
                        {cityBrainData[selectedMarker.neighborhood].metrics
                          .walkability?.score || "—"}
                      </div>
                      <div className="text-xs text-text-ghost font-mono">
                        MOBILITY
                      </div>
                    </div>
                    <div className="bg-void border-2 border-steel-light p-2 text-center">
                      <Building2 className="w-4 h-4 mx-auto mb-1 text-terminal" />
                      <div className="text-lg font-mono font-bold text-terminal">
                        {cityBrainData[selectedMarker.neighborhood].metrics
                          .thirdPlaces?.count || 0}
                      </div>
                      <div className="text-xs text-text-ghost font-mono">
                        GATHERINGS
                      </div>
                    </div>
                    <div className="bg-void border-2 border-steel-light p-2 text-center">
                      <Phone className="w-4 h-4 mx-auto mb-1 text-terminal" />
                      <div className="text-lg font-mono font-bold text-terminal">
                        {cityBrainData[
                          selectedMarker.neighborhood
                        ].metrics.civicEngagement?.percentile?.toFixed(0) ||
                          "—"}
                      </div>
                      <div className="text-xs text-text-ghost font-mono">
                        COMPLAINTS
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-text-ghost font-mono text-center pt-2 border-t-2 border-steel-light">
                    INTEL: MOVEMENT_SYS • LOCATION_DB • COMPLAINT_REG
                  </div>
                </div>
              )}

              {/* 4. CITIZEN INVENTORY */}
              <div className="space-y-3">
                <h3 className="text-lg font-mono font-bold text-caution flex items-center gap-2 mb-4 border-b-2 border-caution pb-2">
                  <Users className="w-5 h-5 text-caution" />
                  CITIZEN INVENTORY
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-void border-2 border-steel-light p-4">
                    <div className="text-xs font-mono font-bold text-text-ghost uppercase tracking-widest mb-2">
                      UNITS
                    </div>
                    <div className="text-2xl font-mono font-bold text-terminal">
                      {(
                        (torontoWards[
                          Object.keys(torontoWards).find(
                            (k) =>
                              torontoWards[k].name ===
                                selectedMarker.neighborhood ||
                              k === selectedMarker.neighborhood
                          )
                        ]?.population || 95000) / 1000
                      ).toFixed(0)}
                      k
                    </div>
                  </div>
                  <div className="bg-void border-2 border-steel-light p-4">
                    <div className="text-xs font-mono font-bold text-text-ghost uppercase tracking-widest mb-2">
                      TRANSIENT
                    </div>
                    <div className="text-2xl font-mono font-bold text-threat">
                      {(
                        (torontoWards[
                          Object.keys(torontoWards).find(
                            (k) =>
                              torontoWards[k].name ===
                                selectedMarker.neighborhood ||
                              k === selectedMarker.neighborhood
                          )
                        ]?.demographics.rentersPercent || 0.7) * 100
                      ).toFixed(0)}
                      <span className="text-lg text-threat">%</span>
                    </div>
                  </div>
                  <div className="bg-void border-2 border-steel-light p-4">
                    <div className="text-xs font-mono font-bold text-text-ghost uppercase tracking-widest mb-2">
                      TRANSIT TIME
                    </div>
                    <div className="text-2xl font-mono font-bold text-terminal">
                      {torontoWards[
                        Object.keys(torontoWards).find(
                          (k) =>
                            torontoWards[k].name ===
                              selectedMarker.neighborhood ||
                            k === selectedMarker.neighborhood
                        )
                      ]?.demographics.avgCommute || 32}
                      m
                    </div>
                  </div>
                  <div className="bg-void border-2 border-steel-light p-4">
                    <div className="text-xs font-mono font-bold text-text-ghost uppercase tracking-widest mb-2">
                      AVG AGE
                    </div>
                    <div className="text-2xl font-mono font-bold text-terminal">
                      {torontoWards[
                        Object.keys(torontoWards).find(
                          (k) =>
                            torontoWards[k].name ===
                              selectedMarker.neighborhood ||
                            k === selectedMarker.neighborhood
                        )
                      ]?.demographics.avgAge || 32}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-white/20 space-y-3">
                <div className="flex justify-center">
                  <a
                    href={`https://open.toronto.ca/dataset/neighbourhoods/?query=${encodeURIComponent(
                      selectedMarker.neighborhood
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#ffffff", textDecoration: "none" }}
                    className="px-8 py-4 bg-threat text-white text-lg font-mono font-bold border-4 border-caution
                             shadow-[0_0_30px_rgba(255,0,0,0.6)]
                             hover:shadow-[0_0_50px_rgba(255,0,0,0.9)]
                             hover:bg-threat-dim
                             active:scale-95
                             transition-all duration-150
                             threat-glow
                             flex items-center justify-center gap-2">
                    <ExternalLink className="w-5 h-5" />⚠ ACCESS FULL DOSSIER
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
