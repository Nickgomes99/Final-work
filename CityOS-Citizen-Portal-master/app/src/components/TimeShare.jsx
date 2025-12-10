import { useState, useEffect, useRef } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { useApp } from "../contexts/AppContext";
import { torontoRentalData } from "../data/rentalData";
import { torontoWards } from "../data/torontoWards";
import {
  calculateTier,
  formatCountdown,
  generateRelocationMessage,
} from "../utils/housingCalculations";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "your-token-here";

export default function TimeShare({ onSwitchView }) {
  const { currentNeighborhood, relocateUser } = useApp();
  const mapRef = useRef();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [relocationPath, setRelocationPath] = useState(null);
  const [systemMessage, setSystemMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const housingData = torontoRentalData[currentNeighborhood];
  const tierData = calculateTier(currentNeighborhood);
  const countdown = timeRemaining ? formatCountdown(timeRemaining) : null;

  useEffect(() => {
    if (tierData) {
      setTimeRemaining(tierData.daysRemaining);
    }
  }, [tierData]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1 / 86400;
        return newTime <= 0 ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleRelocate = async () => {
    setSystemMessage("⚙️ CityOS: Processing relocation request...");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newNeighborhood = relocateUser();
    const currentWard = Object.entries(torontoWards).find(
      ([_, ward]) => ward.name === currentNeighborhood
    );
    const newWard = Object.entries(torontoWards).find(
      ([_, ward]) => ward.name === newNeighborhood
    );

    if (currentWard && newWard) {
      setRelocationPath({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [currentWard[1].lng, currentWard[1].lat],
            [newWard[1].lng, newWard[1].lat],
          ],
        },
      });

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [newWard[1].lng, newWard[1].lat],
          duration: 2000,
          essential: true,
        });
      }

      setTimeout(() => {
        const message = generateRelocationMessage(
          currentNeighborhood,
          newNeighborhood,
          "expired"
        );
        setSystemMessage(message);
        setRelocationPath(null);

        const newTierData = calculateTier(newNeighborhood);
        setTimeRemaining(newTierData.daysRemaining);
      }, 2000);

      setTimeout(() => setSystemMessage(""), 5000);
    }
  };

  if (!housingData || !tierData) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-deep">
      {/* Sidebar */}
      <aside
        className={`bg-bg-layer border-r border-white/10 flex flex-col shadow-2xl transition-all duration-300 ${
          sidebarCollapsed
            ? "w-0 opacity-0 overflow-hidden"
            : "w-[400px] opacity-100"
        }`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-display text-text-bright tracking-tight">
              CityOS
            </h1>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                tierData.tier === "bronze"
                  ? "bg-alert/10 text-alert border border-alert/20"
                  : tierData.tier === "silver"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "bg-connected/10 text-connected border border-connected/20"
              }`}>
              {tierData.tier === "bronze"
                ? "⚡ Bronze"
                : tierData.tier === "silver"
                ? "✨ Silver"
                : "👑 Gold"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchView}
              className="px-4 py-2 text-xs font-medium text-text-dim hover:text-text-bright border border-white/10 rounded-lg hover:bg-white/5 transition-all">
              ← Empathic Grid
            </button>
            <div className="flex-1 px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
              <span className="text-xs font-medium text-accent">
                Time Share
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm text-text-dim leading-relaxed">
                Housing stability as a subscription service. Your tenure is
                calculated based on market conditions.
              </p>
            </div>

            {/* Current Residence */}
            <div className="bg-bg-deep/50 rounded-xl p-5 border border-white/5">
              <div className="text-xs text-text-ghost mb-2">
                Current Residence
              </div>
              <div className="text-lg font-display text-text-bright mb-1">
                Unit #{Math.floor(Math.random() * 9999)}
              </div>
              <div className="text-sm text-text-dim">{currentNeighborhood}</div>

              {/* Countdown */}
              {countdown && (
                <div className="mt-6 text-center py-6 bg-bg-deep/50 rounded-lg">
                  <div className="text-xs text-text-ghost mb-2">
                    Time Remaining
                  </div>
                  <div
                    className={`font-mono text-4xl font-bold ${
                      countdown.urgency === "critical" ||
                      countdown.urgency === "high"
                        ? "text-alert animate-pulse"
                        : countdown.urgency === "medium"
                        ? "text-lonely"
                        : "text-accent"
                    }`}>
                    {countdown.display}
                  </div>
                  <div className="text-xs text-text-ghost mt-2">
                    {countdown.message}
                  </div>
                </div>
              )}
            </div>

            {/* Market Data */}
            <div className="bg-bg-deep/50 rounded-xl p-5 border border-white/5">
              <div className="text-xs text-text-ghost mb-4">
                Market Analysis
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs text-text-ghost mb-1">Avg Rent</div>
                  <div className="text-xl font-mono font-semibold text-text-bright">
                    ${housingData.avgRent}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-ghost mb-1">
                    YoY Increase
                  </div>
                  <div className="text-xl font-mono font-semibold text-alert">
                    +{(housingData.yoyIncrease * 100).toFixed(0)}%
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-ghost mb-1">Turnover</div>
                  <div className="text-xl font-mono font-semibold text-lonely">
                    {(housingData.turnoverRate * 100).toFixed(0)}%
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-ghost mb-1">
                    Rent Stress
                  </div>
                  <div className="text-xl font-mono font-semibold text-alert">
                    {(tierData.stressRatio * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="text-xs text-text-ghost pt-3 border-t border-white/5">
                📊 Source: CMHC Rental Market Report 2024
              </div>
            </div>

            {/* Relocation Button */}
            <button
              onClick={handleRelocate}
              disabled={timeRemaining > 1}
              className={`w-full py-4 font-semibold rounded-xl transition-all duration-200 ${
                timeRemaining > 1
                  ? "bg-white/5 text-text-ghost cursor-not-allowed border border-white/5"
                  : "bg-accent text-bg-deep hover:bg-accent/90 active:scale-[0.98] shadow-lg hover:shadow-xl"
              }`}>
              {timeRemaining > 1
                ? "Relocation Locked"
                : "Acknowledge Relocation"}
            </button>

            {/* System Message */}
            {systemMessage && (
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <p className="text-xs text-accent font-mono">{systemMessage}</p>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-bg-deep/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="text-accent text-lg">ℹ️</div>
                <p className="text-xs text-text-ghost leading-relaxed">
                  Housing stability is now a luxury. The transient majority
                  moves every 7 days. Static living costs 12,000 Time Credits
                  per month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-4 left-4 z-10 bg-bg-layer border border-white/10 rounded-lg px-4 py-3 text-text-bright hover:bg-bg-layer/90 transition-all shadow-xl hover:shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">{sidebarCollapsed ? "→" : "←"}</span>
            <span className="text-sm font-medium">
              {sidebarCollapsed ? "Show Panel" : "Hide Panel"}
            </span>
          </div>
        </button>

        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude:
              torontoWards[
                Object.keys(torontoWards).find(
                  (k) => torontoWards[k].name === currentNeighborhood
                )
              ]?.lng || -79.3832,
            latitude:
              torontoWards[
                Object.keys(torontoWards).find(
                  (k) => torontoWards[k].name === currentNeighborhood
                )
              ]?.lat || 43.6532,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v11">
          {Object.entries(torontoWards)
            .filter(([_, ward]) => ward.name === currentNeighborhood)
            .map(([id, ward]) => (
              <Marker
                key={id}
                longitude={ward.lng}
                latitude={ward.lat}
                anchor="center">
                <div className="relative">
                  <div className="w-6 h-6 bg-accent rounded-full shadow-[0_0_30px_rgba(251,191,36,0.8)] animate-pulse">
                    <div className="absolute inset-1.5 bg-white rounded-full" />
                  </div>
                </div>
              </Marker>
            ))}

          {relocationPath && (
            <Source type="geojson" data={relocationPath}>
              <Layer
                type="line"
                paint={{
                  "line-color": "#fbbf24",
                  "line-width": 3,
                  "line-dasharray": [2, 4],
                  "line-opacity": 0.8,
                }}
              />
            </Source>
          )}
        </Map>
      </main>
    </div>
  );
}
