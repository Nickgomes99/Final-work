/**
 * Walk Score API Integration
 * Measures walkability, transit access, and bike-ability
 *
 * Research shows walkability inversely correlates with social isolation:
 * - WalkScore > 70 = "Walker's Paradise" → Lower loneliness
 * - WalkScore < 50 = "Car-Dependent" → Higher isolation
 *
 * API Docs: https://www.walkscore.com/professional/api.php
 * Free tier: 5,000 requests/day
 */

const WALKSCORE_API_KEY = import.meta.env.VITE_WALKSCORE_API_KEY;
const CACHE_KEY_PREFIX = "walkscore_";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days (walkability doesn't change often)

/**
 * Fetch Walk Score data for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} address - Full address (required by API)
 * @returns {Promise<Object>} Walk score data
 */
export async function fetchWalkScore(lat, lng, address) {
  // Check cache first
  const cached = getCachedScore(lat, lng);
  if (cached) {
    console.log(`[WalkScore] Using cached data for ${address}`);
    return cached;
  }

  // Check if API key exists
  if (!WALKSCORE_API_KEY || WALKSCORE_API_KEY === "your-walkscore-key") {
    console.warn("[WalkScore] API key not configured, using synthetic data");
    return generateSyntheticWalkScore(lat, lng, address);
  }

  try {
    const url = new URL("https://api.walkscore.com/score");
    url.searchParams.set("format", "json");
    url.searchParams.set("address", address);
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lng);
    url.searchParams.set("transit", "1");
    url.searchParams.set("bike", "1");
    url.searchParams.set("wsapikey", WALKSCORE_API_KEY);

    console.log(`[WalkScore] Fetching for ${address}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WalkScore API error: ${response.status}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.status !== 1) {
      console.warn(
        `[WalkScore] API returned status ${data.status}: ${
          data.error || "Unknown error"
        }`
      );
      return generateSyntheticWalkScore(lat, lng, address);
    }

    const result = {
      walkScore: data.walkscore || 0,
      transitScore: data.transit?.score || 0,
      bikeScore: data.bike?.score || 0,
      description: data.description || "Unknown",
      transitDescription: data.transit?.description || "Unknown",

      // Calculate connection score (inverse of isolation)
      connectionScore: calculateConnectionFromWalkability(
        data.walkscore || 0,
        data.transit?.score || 0,
        data.bike?.score || 0
      ),

      dataSource: "walkscore-live",
      fetchedAt: new Date().toISOString(),
    };

    // Cache the result
    cacheScore(lat, lng, result);

    console.log(
      `[WalkScore] ✓ ${address}: Walk=${result.walkScore}, Transit=${result.transitScore}`
    );

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("[WalkScore] Request timeout, using synthetic data");
    } else {
      console.error("[WalkScore] Fetch error:", error.message);
    }

    return generateSyntheticWalkScore(lat, lng, address);
  }
}

/**
 * Calculate connection score from walkability metrics
 * Higher walkability = more spontaneous social encounters = less isolation
 */
function calculateConnectionFromWalkability(
  walkScore,
  transitScore,
  bikeScore
) {
  // Weighted average (walkability most important)
  const composite = walkScore * 0.5 + transitScore * 0.35 + bikeScore * 0.15;

  // Normalize to 0-1 scale
  return Math.min(1, composite / 100);
}

/**
 * Generate synthetic walk score based on Toronto geography
 * Uses known patterns: downtown = walkable, suburbs = car-dependent
 */
function generateSyntheticWalkScore(lat, lng, address) {
  // Toronto downtown core: ~43.65N, 79.38W
  const downtownLat = 43.6532;
  const downtownLng = -79.3832;

  // Calculate distance from downtown (rough proxy for walkability)
  const distance = Math.sqrt(
    Math.pow(lat - downtownLat, 2) + Math.pow(lng - downtownLng, 2)
  );

  // Downtown = high scores, suburbs = low scores
  let walkScore, transitScore, bikeScore;

  if (distance < 0.02) {
    // Downtown core (Financial District, Entertainment District)
    walkScore = 90 + Math.random() * 10;
    transitScore = 85 + Math.random() * 15;
    bikeScore = 75 + Math.random() * 15;
  } else if (distance < 0.05) {
    // Inner city (The Annex, Little Italy, Leslieville)
    walkScore = 70 + Math.random() * 20;
    transitScore = 65 + Math.random() * 20;
    bikeScore = 60 + Math.random() * 20;
  } else if (distance < 0.1) {
    // Midtown (North York, Etobicoke central)
    walkScore = 50 + Math.random() * 20;
    transitScore = 45 + Math.random() * 20;
    bikeScore = 40 + Math.random() * 20;
  } else {
    // Outer suburbs (Scarborough, outer Etobicoke)
    walkScore = 30 + Math.random() * 20;
    transitScore = 25 + Math.random() * 20;
    bikeScore = 20 + Math.random() * 20;
  }

  const description =
    walkScore >= 90
      ? "Walker's Paradise"
      : walkScore >= 70
      ? "Very Walkable"
      : walkScore >= 50
      ? "Somewhat Walkable"
      : walkScore >= 25
      ? "Car-Dependent"
      : "Car-Dependent (Driving Only)";

  return {
    walkScore: Math.round(walkScore),
    transitScore: Math.round(transitScore),
    bikeScore: Math.round(bikeScore),
    description,
    transitDescription:
      transitScore > 50 ? "Excellent Transit" : "Some Transit",
    connectionScore: calculateConnectionFromWalkability(
      walkScore,
      transitScore,
      bikeScore
    ),
    dataSource: "walkscore-synthetic",
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Cache management
 */
function getCacheKey(lat, lng) {
  // Round to 4 decimals (~11m precision) to increase cache hits
  const roundedLat = lat.toFixed(4);
  const roundedLng = lng.toFixed(4);
  return `${CACHE_KEY_PREFIX}${roundedLat},${roundedLng}`;
}

function getCachedScore(lat, lng) {
  try {
    const key = getCacheKey(lat, lng);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const data = JSON.parse(cached);
    const age = Date.now() - new Date(data.fetchedAt).getTime();

    if (age > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error("[WalkScore] Cache read error:", error);
    return null;
  }
}

function cacheScore(lat, lng, data) {
  try {
    const key = getCacheKey(lat, lng);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("[WalkScore] Cache write error:", error);
  }
}

/**
 * Batch fetch walk scores for multiple locations
 * Adds small delays to respect API rate limits
 */
export async function fetchWalkScoresBatch(locations) {
  const results = [];

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    const score = await fetchWalkScore(loc.lat, loc.lng, loc.address);
    results.push({ ...loc, ...score });

    // Add 100ms delay between requests to avoid rate limiting
    if (i < locations.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Get human-readable interpretation of walk score
 */
export function interpretWalkScore(score) {
  if (score >= 90)
    return {
      label: "Walker's Paradise",
      description: "Daily errands do not require a car",
      color: "#00d26a",
      isolationRisk: "very-low",
    };

  if (score >= 70)
    return {
      label: "Very Walkable",
      description: "Most errands can be accomplished on foot",
      color: "#7ebc59",
      isolationRisk: "low",
    };

  if (score >= 50)
    return {
      label: "Somewhat Walkable",
      description: "Some errands can be accomplished on foot",
      color: "#f7ba0b",
      isolationRisk: "medium",
    };

  if (score >= 25)
    return {
      label: "Car-Dependent",
      description: "Most errands require a car",
      color: "#f79407",
      isolationRisk: "high",
    };

  return {
    label: "Car-Dependent",
    description: "Almost all errands require a car",
    color: "#f54f4f",
    isolationRisk: "very-high",
  };
}

export default {
  fetchWalkScore,
  fetchWalkScoresBatch,
  interpretWalkScore,
};
