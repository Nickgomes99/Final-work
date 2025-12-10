/**
 * City Brain - Multi-Source Social Connection Analysis
 *
 * Combines three data sources to calculate neighborhood "connection score":
 * 1. Walkability (Walk Score API) - 40% weight
 * 2. Third Places Density (OSM) - 35% weight
 * 3. Civic Engagement (Toronto 311) - 25% weight
 *
 * Connection score = inverse of social isolation
 * High connection = low loneliness risk
 */

import { fetchWalkScore } from "./walkScoreAPI";
import { fetchThirdPlaces } from "./thirdPlacesAPI";
import { fetch311Data } from "./torontoData";

/**
 * Calculate comprehensive City Brain score for a ward
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} address - Full address for Walk Score API
 * @param {string} wardName - Toronto ward name
 * @param {number} population - Ward population (for per-capita metrics)
 * @returns {Promise<Object>} Comprehensive connection analysis
 */
export async function calculateCityBrainScore(
  lat,
  lng,
  address,
  wardName,
  population = 100000
) {
  console.log(`[CityBrain] Analyzing ${wardName}...`);

  try {
    // Fetch all three data sources in parallel
    const [walkData, thirdPlaces, civic311Data] = await Promise.all([
      fetchWalkScore(lat, lng, address).catch((err) => {
        console.warn("[CityBrain] Walk Score failed:", err);
        return null;
      }),
      fetchThirdPlaces(lat, lng, 1000).catch((err) => {
        console.warn("[CityBrain] Third Places failed:", err);
        return null;
      }),
      fetch311Data().catch((err) => {
        console.warn("[CityBrain] 311 Data failed:", err);
        return null;
      }),
    ]);

    // Calculate individual scores
    const walkConnection = walkData?.connectionScore || 0.5;
    const placeConnection = thirdPlaces?.connectionScore || 0.5;
    const civicConnection = calculateCivicConnection(civic311Data, wardName);

    // Weighted composite score
    const connectionScore =
      walkConnection * 0.4 + // Walkability (most important)
      placeConnection * 0.35 + // Third places
      civicConnection * 0.25; // Civic engagement

    // Determine mood
    const mood = connectionScore > 0.5 ? "connected" : "lonely";
    const loneliness = 1 - connectionScore;

    // Risk assessment
    const isolationRisk =
      connectionScore > 0.7
        ? "low"
        : connectionScore > 0.5
        ? "moderate"
        : connectionScore > 0.3
        ? "high"
        : "critical";

    const result = {
      wardName,
      connectionScore,
      loneliness,
      mood,
      isolationRisk,

      // Individual metric breakdowns
      metrics: {
        walkability: {
          score: walkData?.walkScore || 50,
          transitScore: walkData?.transitScore || 40,
          bikeScore: walkData?.bikeScore || 30,
          description: walkData?.description || "Unknown",
          connectionContribution: walkConnection * 0.4,
          weight: 0.4,
          dataSource: walkData?.dataSource || "synthetic",
        },
        thirdPlaces: {
          count: thirdPlaces?.total || 0,
          density: thirdPlaces?.density || 0,
          breakdown: thirdPlaces?.breakdown || {},
          interpretation: thirdPlaces?.interpretation?.level || "unknown",
          connectionContribution: placeConnection * 0.35,
          weight: 0.35,
          dataSource: thirdPlaces?.dataSource || "synthetic",
        },
        civicEngagement: {
          requestCount: getCivic311Count(civic311Data, wardName),
          percentile: civicConnection * 100,
          connectionContribution: civicConnection * 0.25,
          weight: 0.25,
          dataSource: civic311Data ? "live" : "synthetic",
        },
      },

      // Recommendations based on weak points
      recommendations: generateRecommendations(
        walkConnection,
        placeConnection,
        civicConnection
      ),

      // Timestamp
      analyzedAt: new Date().toISOString(),
    };

    console.log(
      `[CityBrain] ✓ ${wardName}: ${(connectionScore * 100).toFixed(
        0
      )}% connected (${mood})`
    );

    return result;
  } catch (error) {
    console.error("[CityBrain] Analysis failed:", error);

    // Return basic synthetic score on total failure
    return {
      wardName,
      connectionScore: 0.5,
      loneliness: 0.5,
      mood: "unknown",
      isolationRisk: "unknown",
      metrics: {},
      recommendations: [],
      analyzedAt: new Date().toISOString(),
      error: error.message,
    };
  }
}

/**
 * Calculate civic engagement score from 311 data
 */
function calculateCivicConnection(civic311Data, wardName) {
  if (!civic311Data) return 0.5;

  try {
    const wardCount = civic311Data[wardName] || 0;
    const allCounts = Object.values(civic311Data);
    const maxCount = Math.max(...allCounts);

    if (maxCount === 0) return 0.5;

    // Normalize to 0-1 scale
    return wardCount / maxCount;
  } catch (error) {
    console.error("[CityBrain] Civic calculation error:", error);
    return 0.5;
  }
}

/**
 * Get 311 count for a ward
 */
function getCivic311Count(civic311Data, wardName) {
  if (!civic311Data) return 0;
  return civic311Data[wardName] || 0;
}

/**
 * Generate recommendations based on weak metrics
 */
function generateRecommendations(walkScore, placeScore, civicScore) {
  const recommendations = [];

  if (walkScore < 0.4) {
    recommendations.push({
      category: "infrastructure",
      priority: "high",
      issue: "Low walkability and transit access",
      suggestion:
        "Residents may face isolation due to car dependency. Consider transit improvements or car-sharing programs.",
    });
  }

  if (placeScore < 0.4) {
    recommendations.push({
      category: "community",
      priority: "high",
      issue: "Insufficient third places",
      suggestion:
        "Lack of gathering spaces increases isolation risk. Community centers, libraries, or public parks could help.",
    });
  }

  if (civicScore < 0.4) {
    recommendations.push({
      category: "engagement",
      priority: "medium",
      issue: "Low civic participation",
      suggestion:
        "Low 311 engagement may indicate disengagement or transient population. Outreach programs could help.",
    });
  }

  if (walkScore < 0.4 && placeScore < 0.4) {
    recommendations.push({
      category: "urgent",
      priority: "critical",
      issue: "Compounding isolation factors",
      suggestion:
        "Both infrastructure and community spaces are lacking. High risk for social isolation. Intervention recommended.",
    });
  }

  return recommendations;
}

/**
 * Batch analyze multiple wards
 * Adds delays to respect API rate limits
 */
export async function analyzeCityBrainBatch(wards) {
  console.log(
    `[CityBrain] Starting batch analysis of ${wards.length} wards...`
  );

  const results = [];

  for (let i = 0; i < wards.length; i++) {
    const ward = wards[i];

    const score = await calculateCityBrainScore(
      ward.lat,
      ward.lng,
      ward.address || `${ward.name}, Toronto, ON`,
      ward.name,
      ward.population
    );

    results.push({
      ...ward,
      cityBrain: score,
    });

    // Progress log every 5 wards
    if ((i + 1) % 5 === 0) {
      console.log(
        `[CityBrain] Progress: ${i + 1}/${wards.length} wards analyzed`
      );
    }

    // Add 200ms delay between wards to avoid rate limiting
    if (i < wards.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  console.log(`[CityBrain] ✓ Batch analysis complete`);

  return results;
}

/**
 * Get city-wide statistics
 */
export function getCityStats(wardResults) {
  const scores = wardResults.map((w) => w.cityBrain.connectionScore);

  const avgConnection = scores.reduce((a, b) => a + b, 0) / scores.length;
  const lonelyCount = wardResults.filter(
    (w) => w.cityBrain.mood === "lonely"
  ).length;
  const connectedCount = wardResults.filter(
    (w) => w.cityBrain.mood === "connected"
  ).length;

  return {
    totalWards: wardResults.length,
    averageConnection: avgConnection,
    averageLoneliness: 1 - avgConnection,
    lonelyWards: lonelyCount,
    connectedWards: connectedCount,
    highRiskWards: wardResults.filter(
      (w) =>
        w.cityBrain.isolationRisk === "critical" ||
        w.cityBrain.isolationRisk === "high"
    ).length,
  };
}

export default {
  calculateCityBrainScore,
  analyzeCityBrainBatch,
  getCityStats,
};
