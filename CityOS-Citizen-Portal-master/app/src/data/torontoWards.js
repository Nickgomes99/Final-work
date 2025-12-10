/**
 * Toronto Ward Locations & Metadata
 * 25 official wards as of 2024 (post-2018 restructuring)
 *
 * Coordinates are ward centroids from Toronto Open Data
 * Source: https://open.toronto.ca/dataset/city-wards/
 */

export const torontoWards = {
  // Downtown Core & Waterfront
  "Spadina-Fort York": {
    lat: 43.6426,
    lng: -79.3871,
    name: "Downtown Core",
    description: "High-rise condos, financial district, transient population",
    population: 137000,
    demographics: {
      avgAge: 32,
      rentersPercent: 0.83,
      avgCommute: 28,
    },
  },

  "Toronto Centre": {
    lat: 43.6532,
    lng: -79.3832,
    name: "Financial District",
    description: "Office towers, luxury condos, corporate headquarters",
    population: 98000,
    demographics: {
      avgAge: 34,
      rentersPercent: 0.78,
      avgCommute: 32,
    },
  },

  "University-Rosedale": {
    lat: 43.6697,
    lng: -79.3956,
    name: "The Annex",
    description: "Historic neighborhoods, students, academic institutions",
    population: 119000,
    demographics: {
      avgAge: 29,
      rentersPercent: 0.72,
      avgCommute: 25,
    },
  },

  // East End
  "Toronto-Danforth": {
    lat: 43.6868,
    lng: -79.3373,
    name: "The Danforth",
    description: "Greek Town, mixed residential, vibrant nightlife",
    population: 127000,
    demographics: {
      avgAge: 38,
      rentersPercent: 0.55,
      avgCommute: 35,
    },
  },

  "Beaches-East York": {
    lat: 43.6676,
    lng: -79.2917,
    name: "The Beaches",
    description: "Lakefront, family-oriented, strong community identity",
    population: 116000,
    demographics: {
      avgAge: 42,
      rentersPercent: 0.38,
      avgCommute: 40,
    },
  },

  "Don Valley East": {
    lat: 43.7435,
    lng: -79.2889,
    name: "Flemingdon Park",
    description: "Multicultural, apartment towers, high-density",
    population: 134000,
    demographics: {
      avgAge: 36,
      rentersPercent: 0.82,
      avgCommute: 45,
    },
  },

  "Don Valley West": {
    lat: 43.725,
    lng: -79.3619,
    name: "Leaside",
    description: "Suburban feel, single-family homes, ravine system",
    population: 108000,
    demographics: {
      avgAge: 44,
      rentersPercent: 0.32,
      avgCommute: 38,
    },
  },

  // North
  "Eglinton-Lawrence": {
    lat: 43.7076,
    lng: -79.4145,
    name: "Midtown",
    description: "Mixed-use, commercial strips, transit-oriented",
    population: 111000,
    demographics: {
      avgAge: 40,
      rentersPercent: 0.58,
      avgCommute: 33,
    },
  },

  Willowdale: {
    lat: 43.7615,
    lng: -79.4154,
    name: "North York Centre",
    description: "High-rise condos, office parks, subway hub",
    population: 142000,
    demographics: {
      avgAge: 41,
      rentersPercent: 0.62,
      avgCommute: 42,
    },
  },

  "Don Valley North": {
    lat: 43.7759,
    lng: -79.3484,
    name: "Don Mills",
    description: "Planned community, corporate offices, parks",
    population: 89000,
    demographics: {
      avgAge: 43,
      rentersPercent: 0.45,
      avgCommute: 48,
    },
  },

  // West End
  "Parkdale-High Park": {
    lat: 43.6464,
    lng: -79.4619,
    name: "Parkdale",
    description: "Bohemian, artist community, gentrifying",
    population: 105000,
    demographics: {
      avgAge: 35,
      rentersPercent: 0.75,
      avgCommute: 36,
    },
  },

  Davenport: {
    lat: 43.6764,
    lng: -79.4584,
    name: "Corso Italia",
    description: "Italian heritage, small businesses, residential",
    population: 113000,
    demographics: {
      avgAge: 39,
      rentersPercent: 0.52,
      avgCommute: 34,
    },
  },

  "York South-Weston": {
    lat: 43.6966,
    lng: -79.5165,
    name: "Weston",
    description: "Working-class, diverse, industrial heritage",
    population: 118000,
    demographics: {
      avgAge: 37,
      rentersPercent: 0.68,
      avgCommute: 52,
    },
  },

  "Humber River-Black Creek": {
    lat: 43.7359,
    lng: -79.5346,
    name: "Jane & Finch",
    description: "High-density apartments, multicultural, vibrant",
    population: 147000,
    demographics: {
      avgAge: 34,
      rentersPercent: 0.88,
      avgCommute: 58,
    },
  },

  // Etobicoke
  "Etobicoke Centre": {
    lat: 43.6435,
    lng: -79.5646,
    name: "Islington",
    description: "Suburban, mix of apartments and houses",
    population: 121000,
    demographics: {
      avgAge: 41,
      rentersPercent: 0.48,
      avgCommute: 45,
    },
  },

  "Etobicoke-Lakeshore": {
    lat: 43.6032,
    lng: -79.5039,
    name: "Mimico",
    description: "Lakefront, gentrifying, new condos",
    population: 112000,
    demographics: {
      avgAge: 38,
      rentersPercent: 0.64,
      avgCommute: 42,
    },
  },

  "Etobicoke North": {
    lat: 43.7453,
    lng: -79.5787,
    name: "Rexdale",
    description: "Industrial, diverse communities, airport area",
    population: 109000,
    demographics: {
      avgAge: 36,
      rentersPercent: 0.71,
      avgCommute: 55,
    },
  },

  // Scarborough
  "Scarborough Southwest": {
    lat: 43.7108,
    lng: -79.2653,
    name: "Scarborough Town Centre",
    description: "Shopping hub, high-rises, transit-oriented",
    population: 129000,
    demographics: {
      avgAge: 39,
      rentersPercent: 0.69,
      avgCommute: 50,
    },
  },

  "Scarborough Centre": {
    lat: 43.774,
    lng: -79.2329,
    name: "Agincourt",
    description: "Diverse, mixed housing, commercial corridors",
    population: 135000,
    demographics: {
      avgAge: 40,
      rentersPercent: 0.58,
      avgCommute: 52,
    },
  },

  "Scarborough North": {
    lat: 43.7799,
    lng: -79.2597,
    name: "Malvern",
    description: "Residential, parks, family-oriented",
    population: 118000,
    demographics: {
      avgAge: 38,
      rentersPercent: 0.63,
      avgCommute: 56,
    },
  },

  "Scarborough-Guildwood": {
    lat: 43.7476,
    lng: -79.1886,
    name: "Guildwood",
    description: "Ravine parks, GO train access, suburban",
    population: 103000,
    demographics: {
      avgAge: 43,
      rentersPercent: 0.42,
      avgCommute: 58,
    },
  },

  "Scarborough-Rouge Park": {
    lat: 43.8045,
    lng: -79.1223,
    name: "Rouge",
    description: "Greenest ward, national park, low-density",
    population: 87000,
    demographics: {
      avgAge: 41,
      rentersPercent: 0.35,
      avgCommute: 62,
    },
  },
};

/**
 * Get all ward coordinates as a simple array
 * Useful for mapping/visualization
 */
export function getWardCoordinates() {
  return Object.entries(torontoWards).map(([id, data]) => ({
    id,
    lat: data.lat,
    lng: data.lng,
    name: data.name,
  }));
}

/**
 * Find closest ward to a given coordinate
 * Uses Haversine distance formula
 */
export function findNearestWard(lat, lng) {
  let closestWard = null;
  let minDistance = Infinity;

  Object.entries(torontoWards).forEach(([id, ward]) => {
    const distance = haversineDistance(lat, lng, ward.lat, ward.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestWard = { id, ...ward, distance };
    }
  });

  return closestWard;
}

/**
 * Calculate distance between two coordinates (in km)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
