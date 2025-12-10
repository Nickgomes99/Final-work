/**
 * Third Places API - OpenStreetMap Overpass Integration
 *
 * "Third places" = sociological term for community gathering spaces
 * (coined by Ray Oldenburg, 1989)
 *
 * First place = Home
 * Second place = Work
 * Third place = Social anchors (cafes, libraries, parks, etc.)
 *
 * Research shows: High third place density correlates with lower loneliness
 *
 * Data source: OpenStreetMap via Overpass API
 * - Free, unlimited
 * - Real-time community-maintained data
 * - No API key required
 */

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
const CACHE_KEY_PREFIX = "thirdplaces_";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Types of third places we're looking for
 */
const THIRD_PLACE_TYPES = {
  cafes: 'node["amenity"="cafe"]',
  restaurants: 'node["amenity"="restaurant"]',
  libraries: 'node["amenity"="library"]',
  community_centers: 'node["amenity"="community_centre"]',
  parks: 'node["leisure"="park"]',
  places_of_worship: 'node["amenity"="place_of_worship"]',
  pubs: 'node["amenity"="pub"]',
  bars: 'node["amenity"="bar"]',
  theaters: 'node["amenity"="theatre"]',
  cinemas: 'node["amenity"="cinema"]',
};

/**
 * Fetch third places count near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusMeters - Search radius in meters (default 1000m = 1km)
 * @returns {Promise<Object>} Third places data
 */
export async function fetchThirdPlaces(lat, lng, radiusMeters = 1000) {
  // Check cache first
  const cached = getCachedPlaces(lat, lng, radiusMeters);
  if (cached) {
    console.log(`[ThirdPlaces] Using cached data for (${lat}, ${lng})`);
    return cached;
  }

  try {
    // Build Overpass query
    const query = buildOverpassQuery(lat, lng, radiusMeters);

    console.log(
      `[ThirdPlaces] Fetching within ${radiusMeters}m of (${lat}, ${lng})...`
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(OVERPASS_ENDPOINT, {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "text/plain",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse results
    const breakdown = categorizeThirdPlaces(data.elements);
    const total = data.elements.length;

    // Calculate area in km²
    const areaKm2 = Math.PI * Math.pow(radiusMeters / 1000, 2);
    const density = total / areaKm2;

    const result = {
      total,
      breakdown,
      density, // per km²
      radiusMeters,

      // Calculate connection score
      // Research benchmark: ~20 third places per km² = healthy
      connectionScore: Math.min(1, density / 20),

      // Interpret density
      interpretation: interpretDensity(density),

      dataSource: "osm-live",
      fetchedAt: new Date().toISOString(),
    };

    // Cache the result
    cachePlaces(lat, lng, radiusMeters, result);

    console.log(
      `[ThirdPlaces] ✓ Found ${total} places (density: ${density.toFixed(
        1
      )}/km²)`
    );

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("[ThirdPlaces] Request timeout, using synthetic data");
    } else {
      console.error("[ThirdPlaces] Fetch error:", error.message);
    }

    return generateSyntheticThirdPlaces(lat, lng, radiusMeters);
  }
}

/**
 * Build Overpass QL query
 */
function buildOverpassQuery(lat, lng, radiusMeters) {
  const queries = Object.values(THIRD_PLACE_TYPES)
    .map((type) => `${type}(around:${radiusMeters},${lat},${lng});`)
    .join("\n    ");

  return `
    [out:json][timeout:10];
    (
      ${queries}
    );
    out body;
  `;
}

/**
 * Categorize OSM elements by type
 */
function categorizeThirdPlaces(elements) {
  const breakdown = {
    cafes: 0,
    restaurants: 0,
    libraries: 0,
    community_centers: 0,
    parks: 0,
    places_of_worship: 0,
    pubs: 0,
    bars: 0,
    theaters: 0,
    cinemas: 0,
    other: 0,
  };

  elements.forEach((el) => {
    const tags = el.tags || {};

    if (tags.amenity === "cafe") breakdown.cafes++;
    else if (tags.amenity === "restaurant") breakdown.restaurants++;
    else if (tags.amenity === "library") breakdown.libraries++;
    else if (tags.amenity === "community_centre") breakdown.community_centers++;
    else if (tags.leisure === "park") breakdown.parks++;
    else if (tags.amenity === "place_of_worship") breakdown.places_of_worship++;
    else if (tags.amenity === "pub") breakdown.pubs++;
    else if (tags.amenity === "bar") breakdown.bars++;
    else if (tags.amenity === "theatre") breakdown.theaters++;
    else if (tags.amenity === "cinema") breakdown.cinemas++;
    else breakdown.other++;
  });

  return breakdown;
}

/**
 * Interpret density into human-readable categories
 */
function interpretDensity(density) {
  if (density >= 25)
    return {
      level: "excellent",
      description: "Rich community infrastructure",
      color: "#00d26a",
      isolationRisk: "very-low",
    };

  if (density >= 15)
    return {
      level: "good",
      description: "Strong neighborhood amenities",
      color: "#7ebc59",
      isolationRisk: "low",
    };

  if (density >= 8)
    return {
      level: "moderate",
      description: "Some gathering spaces available",
      color: "#f7ba0b",
      isolationRisk: "medium",
    };

  if (density >= 3)
    return {
      level: "limited",
      description: "Few community spaces",
      color: "#f79407",
      isolationRisk: "high",
    };

  return {
    level: "sparse",
    description: "Minimal gathering infrastructure",
    color: "#f54f4f",
    isolationRisk: "very-high",
  };
}

/**
 * Generate synthetic third places based on Toronto patterns
 */
function generateSyntheticThirdPlaces(lat, lng, radiusMeters) {
  const downtownLat = 43.6532;
  const downtownLng = -79.3832;

  const distance = Math.sqrt(
    Math.pow(lat - downtownLat, 2) + Math.pow(lng - downtownLng, 2)
  );

  // Downtown = dense, suburbs = sparse
  let baseDensity;
  if (distance < 0.02) baseDensity = 30; // Downtown core
  else if (distance < 0.05) baseDensity = 18; // Inner city
  else if (distance < 0.1) baseDensity = 10; // Midtown
  else baseDensity = 4; // Suburbs

  // Add randomness
  const density = baseDensity + (Math.random() * 5 - 2.5);
  const areaKm2 = Math.PI * Math.pow(radiusMeters / 1000, 2);
  const total = Math.round(density * areaKm2);

  // Distribute across categories
  const breakdown = {
    cafes: Math.round(total * 0.25),
    restaurants: Math.round(total * 0.2),
    libraries: Math.round(total * 0.05),
    community_centers: Math.round(total * 0.05),
    parks: Math.round(total * 0.15),
    places_of_worship: Math.round(total * 0.1),
    pubs: Math.round(total * 0.08),
    bars: Math.round(total * 0.05),
    theaters: Math.round(total * 0.03),
    cinemas: Math.round(total * 0.02),
    other: Math.round(total * 0.02),
  };

  return {
    total,
    breakdown,
    density,
    radiusMeters,
    connectionScore: Math.min(1, density / 20),
    interpretation: interpretDensity(density),
    dataSource: "osm-synthetic",
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Cache management
 */
function getCacheKey(lat, lng, radius) {
  const roundedLat = lat.toFixed(3);
  const roundedLng = lng.toFixed(3);
  return `${CACHE_KEY_PREFIX}${roundedLat},${roundedLng}_${radius}`;
}

function getCachedPlaces(lat, lng, radius) {
  try {
    const key = getCacheKey(lat, lng, radius);
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
    console.error("[ThirdPlaces] Cache read error:", error);
    return null;
  }
}

function cachePlaces(lat, lng, radius, data) {
  try {
    const key = getCacheKey(lat, lng, radius);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("[ThirdPlaces] Cache write error:", error);
  }
}

export default {
  fetchThirdPlaces,
  THIRD_PLACE_TYPES,
};
