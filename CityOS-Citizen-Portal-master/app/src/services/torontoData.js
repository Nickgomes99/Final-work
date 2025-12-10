/**
 * Toronto 311 API Integration
 * Fetches real-time service request data to calculate community engagement scores
 *
 * Narrative Logic:
 * - High 311 engagement = Connected community (people care about their area)
 * - Low engagement = Isolated/lonely (disengaged residents)
 */

const CKAN_API =
  "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search";
const RESOURCE_ID = "8124c10c-76f9-4e32-bb18-ccf8bcd07de6"; // 311 Service Requests
const CACHE_KEY = "311-cache";
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetch Toronto 311 service request data
 * Implements: API call → Cache → Fallback pattern
 *
 * @returns {Promise<Object|null>} Ward counts or null if failed
 */
export async function fetch311Data() {
  try {
    // Attempt API fetch with 5-second timeout
    const response = await fetch(
      `${CKAN_API}?resource_id=${RESOURCE_ID}&limit=5000`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!data.result?.records) {
      throw new Error("Invalid API response structure");
    }

    // Cache successful response
    const cacheData = {
      data: data.result.records,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    console.log(
      `✅ Fetched ${data.result.records.length} 311 records from API`
    );

    return groupByWard(data.result.records);
  } catch (error) {
    console.warn("⚠️ 311 API fetch failed:", error.message);

    // Try cache as fallback
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        if (age < CACHE_TTL) {
          console.log(
            `📦 Using cached 311 data (${Math.round(age / 60000)}m old)`
          );
          return groupByWard(data);
        } else {
          console.log("🕒 Cache expired");
        }
      }
    } catch (cacheError) {
      console.error("❌ Cache read failed:", cacheError);
    }

    // No cache available or cache expired
    return null;
  }
}

/**
 * Group 311 records by Toronto ward
 *
 * @param {Array} records - Raw 311 service request records
 * @returns {Object} Ward names mapped to request counts
 */
function groupByWard(records) {
  const wardCounts = {};

  records.forEach((record) => {
    // Handle different possible ward field names
    const ward = record.Ward || record.ward || record.WARD || "Unknown";

    if (ward !== "Unknown") {
      wardCounts[ward] = (wardCounts[ward] || 0) + 1;
    }
  });

  return wardCounts;
}

/**
 * Calculate emotion scores from 311 engagement data
 * Maps real community engagement to narrative loneliness scores
 *
 * @param {Object} wardCounts - Ward names mapped to 311 request counts
 * @param {Array} wardLocations - Ward metadata (coordinates, names)
 * @returns {Array} Emotion markers ready for map display
 */
export function calculateEmotions(wardCounts, wardLocations) {
  const counts = Object.values(wardCounts);
  const maxCount = Math.max(...counts, 1); // Avoid division by zero
  const minCount = Math.min(...counts);

  return Object.entries(wardLocations).map(([wardId, location]) => {
    const count = wardCounts[wardId] || 0;

    // Normalize engagement score (0-1)
    const engagementScore = (count - minCount) / (maxCount - minCount || 1);

    // Invert for loneliness (high engagement = low loneliness)
    const lonelinessScore = 1 - engagementScore;

    // Determine mood (threshold at 0.6 loneliness)
    const mood = lonelinessScore > 0.6 ? "lonely" : "connected";

    return {
      id: wardId,
      lat: location.lat,
      lng: location.lng,
      neighborhood: location.name,
      ward: wardId,
      mood: mood,
      intensity: lonelinessScore,
      count311: count, // Raw count for debugging
      dataSource: "311-live",
      lastUpdated: new Date().toISOString(),

      // Generate contextual persona based on data
      persona: generatePersona(location.name, mood, count),
    };
  });
}

/**
 * Generate narrative persona based on neighborhood and mood
 * Adds storytelling depth to data points
 */
function generatePersona(neighborhood, mood, requestCount) {
  const lonelyPersonas = [
    `New condo resident, hasn't met neighbors yet`,
    `Freelancer working from home, limited social interaction`,
    `Recent immigrant, navigating the city alone`,
    `Remote worker, moved here during pandemic`,
  ];

  const connectedPersonas = [
    `Active community member, attends local events`,
    `Long-time resident, knows the neighborhood well`,
    `Parent involved in community programs`,
    `Local business owner, embedded in area`,
  ];

  const personas = mood === "lonely" ? lonelyPersonas : connectedPersonas;
  const randomIndex = Math.floor(Math.random() * personas.length);

  return personas[randomIndex];
}

/**
 * Check data freshness for UI display
 *
 * @returns {string} 'live' | 'cached' | 'stale' | 'none'
 */
export function getDataFreshness() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return "none";

    const { timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < 300000) return "live"; // < 5 minutes = "live"
    if (age < CACHE_TTL) return "cached"; // < 1 hour = cached but valid
    return "stale"; // > 1 hour = stale
  } catch {
    return "none";
  }
}
