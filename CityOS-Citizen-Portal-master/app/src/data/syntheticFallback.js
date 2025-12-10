/**
 * Synthetic Fallback Data
 * Used when 311 API is unavailable
 *
 * Based on real Toronto demographic patterns but procedurally generated
 * Ensures the demo never breaks due to API failures
 */

import { torontoWards } from "./torontoWards.js";

/**
 * Generate synthetic emotion markers
 * Mimics real API response structure but with controlled randomness
 *
 * Logic:
 * - Downtown/high-rent areas: 70-80% lonely
 * - Suburban/family areas: 60-80% connected
 * - Add some randomness to feel organic
 */
export function generateSyntheticEmotions() {
  const emotions = [];

  Object.entries(torontoWards).forEach(([wardId, ward]) => {
    // Determine loneliness baseline from demographics
    const baselineLoneliness = calculateBaselineLoneliness(ward);

    // Add random variance (±15%)
    const variance = (Math.random() - 0.5) * 0.3;
    const lonelinessScore = Math.max(
      0,
      Math.min(1, baselineLoneliness + variance)
    );

    // Determine mood
    const mood = lonelinessScore > 0.6 ? "lonely" : "connected";

    emotions.push({
      id: wardId,
      lat: ward.lat,
      lng: ward.lng,
      neighborhood: ward.name,
      ward: wardId,
      mood: mood,
      intensity: lonelinessScore,
      dataSource: "synthetic",
      lastUpdated: new Date().toISOString(),
      persona: generatePersona(ward.name, mood),
    });
  });

  return emotions;
}

/**
 * Calculate baseline loneliness from ward characteristics
 * Uses multiple factors to create realistic distribution
 */
function calculateBaselineLoneliness(ward) {
  const { demographics, population } = ward;

  if (!demographics) return 0.5; // Neutral if no data

  // Factors that increase loneliness:
  // 1. High renter percentage (transient population)
  const renterFactor = demographics.rentersPercent * 0.35;

  // 2. Long commute times (isolation)
  const commuteFactor = Math.min(1, demographics.avgCommute / 60) * 0.3;

  // 3. Young age (less established)
  const ageFactor = demographics.avgAge < 35 ? 0.2 : 0;

  // 4. High density (anomie effect)
  const densityFactor = population > 130000 ? 0.15 : 0;

  const loneliness = renterFactor + commuteFactor + ageFactor + densityFactor;

  return Math.max(0, Math.min(1, loneliness));
}

/**
 * Generate contextual persona
 */
function generatePersona(neighborhood, mood) {
  const lonelyPersonas = [
    `New condo resident, hasn't met neighbors yet`,
    `Freelancer working from home, limited social interaction`,
    `Recent immigrant, navigating the city alone`,
    `Remote worker, moved here during pandemic`,
    `Office worker, relocated ${Math.floor(
      Math.random() * 5 + 1
    )} times this year`,
  ];

  const connectedPersonas = [
    `Active community member, attends local events`,
    `Long-time resident, knows the neighborhood well`,
    `Parent involved in community programs`,
    `Local business owner, embedded in area`,
    `Community garden volunteer, strong social ties`,
  ];

  const personas = mood === "lonely" ? lonelyPersonas : connectedPersonas;
  return personas[Math.floor(Math.random() * personas.length)];
}

/**
 * Generate synthetic 311 request counts
 * Used to populate charts/stats when API is down
 */
export function generateSynthetic311Counts() {
  const wardCounts = {};

  Object.entries(torontoWards).forEach(([wardId, ward]) => {
    // Base count on population (larger wards = more requests)
    const baseCount = Math.floor(ward.population / 500);

    // Add demographic factor (higher income = more engagement)
    const engagementMultiplier =
      ward.demographics?.rentersPercent < 0.5 ? 1.3 : 0.8;

    // Random variance (±30%)
    const variance = (Math.random() - 0.5) * 0.6;

    wardCounts[wardId] = Math.max(
      10,
      Math.floor(baseCount * engagementMultiplier * (1 + variance))
    );
  });

  return wardCounts;
}

/**
 * Generate sample 311 records for testing
 * Mimics CKAN API response structure
 */
export function generateSample311Records() {
  const serviceTypes = [
    "Street Light Repair",
    "Pothole Repair",
    "Graffiti Removal",
    "Tree Maintenance",
    "Garbage Collection",
    "Snow Removal",
    "Park Maintenance",
  ];

  const records = [];

  Object.keys(torontoWards).forEach((wardId) => {
    const count = Math.floor(Math.random() * 50) + 10;

    for (let i = 0; i < count; i++) {
      records.push({
        Ward: wardId,
        Service: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        Status: Math.random() > 0.3 ? "Resolved" : "Open",
        CreatedDate: generateRandomDate(),
      });
    }
  });

  return records;
}

/**
 * Generate random date within last 30 days
 */
function generateRandomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

/**
 * Check if we should use synthetic data
 * Used in UI to determine which badge to show
 */
export function shouldUseSyntheticData() {
  // Check if 311 API was recently successful
  try {
    const cached = localStorage.getItem("311-cache");
    if (!cached) return true;

    const { timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    // If cache is older than 6 hours, assume API might be down
    return age > 6 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

/**
 * Generate demo statistics for Time Share view
 * Used when showing market trends
 */
export function generateMarketStats() {
  return {
    avgRentIncrease: "+15.2%",
    avgTenure: "8.3 months",
    mobilityRate: "68%",
    bronzeTier: "45%",
    silverTier: "38%",
    goldTier: "17%",
    lastUpdated: "Q4 2024",
  };
}

/**
 * Export all synthetic generators as convenience
 */
export default {
  generateSyntheticEmotions,
  generateSynthetic311Counts,
  generateSample311Records,
  shouldUseSyntheticData,
  generateMarketStats,
};
