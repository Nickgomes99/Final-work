/**
 * Toronto Rental Market Data
 * Based on CMHC Rental Market Report 2024 & Toronto Census 2021
 *
 * Source: https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research
 *
 * This data drives the "Time Share" view's tier assignments and countdown logic
 * High rent stress = shorter tenure = more displacement
 */

export const MEDIAN_INCOME_TORONTO = 84000; // 2024 StatCan estimate

export const torontoRentalData = {
  // Downtown & Core
  "Downtown Core": {
    avgRent: 2800,
    yoyIncrease: 0.18, // 18% increase year-over-year
    vacancyRate: 0.015, // 1.5% - very competitive
    turnoverRate: 0.85, // 85% of tenants move within a year
    medianTenure: 4.2, // months
    tier: "bronze",
    description: "Luxury condos, corporate rentals, extreme mobility",
  },

  "Financial District": {
    avgRent: 3200,
    yoyIncrease: 0.22,
    vacancyRate: 0.012,
    turnoverRate: 0.92,
    medianTenure: 3.8,
    tier: "bronze",
    description: "Highest rents, shortest stays, investor-owned units",
  },

  "The Annex": {
    avgRent: 2400,
    yoyIncrease: 0.14,
    vacancyRate: 0.028,
    turnoverRate: 0.68,
    medianTenure: 8.5,
    tier: "silver",
    description: "Student housing, academic community, moderate turnover",
  },

  // East End
  "The Danforth": {
    avgRent: 2100,
    yoyIncrease: 0.11,
    vacancyRate: 0.035,
    turnoverRate: 0.52,
    medianTenure: 14.3,
    tier: "gold",
    description: "Established community, mixed housing, stable tenancies",
  },

  "The Beaches": {
    avgRent: 2200,
    yoyIncrease: 0.08,
    vacancyRate: 0.045,
    turnoverRate: 0.25,
    medianTenure: 26.8,
    tier: "gold",
    description: "Family-oriented, low turnover, strong community ties",
  },

  "Flemingdon Park": {
    avgRent: 1850,
    yoyIncrease: 0.16,
    vacancyRate: 0.022,
    turnoverRate: 0.74,
    medianTenure: 6.2,
    tier: "silver",
    description: "High-density towers, working-class, growing displacement",
  },

  Leaside: {
    avgRent: 2500,
    yoyIncrease: 0.09,
    vacancyRate: 0.038,
    turnoverRate: 0.35,
    medianTenure: 18.7,
    tier: "gold",
    description: "Suburban character, family homes, low renter turnover",
  },

  // North
  Midtown: {
    avgRent: 2300,
    yoyIncrease: 0.13,
    vacancyRate: 0.025,
    turnoverRate: 0.58,
    medianTenure: 10.4,
    tier: "silver",
    description: "Mixed-use, transit access, moderate stability",
  },

  "North York Centre": {
    avgRent: 2150,
    yoyIncrease: 0.15,
    vacancyRate: 0.02,
    turnoverRate: 0.64,
    medianTenure: 7.8,
    tier: "silver",
    description: "Condo boom, corporate rentals, transit-oriented",
  },

  "Don Mills": {
    avgRent: 2000,
    yoyIncrease: 0.1,
    vacancyRate: 0.042,
    turnoverRate: 0.41,
    medianTenure: 16.2,
    tier: "gold",
    description: "Planned community, stable families, low displacement",
  },

  // West End
  Parkdale: {
    avgRent: 1950,
    yoyIncrease: 0.19,
    vacancyRate: 0.018,
    turnoverRate: 0.78,
    medianTenure: 5.6,
    tier: "silver",
    description: "Gentrifying rapidly, artist displacement, rent pressure",
  },

  "Corso Italia": {
    avgRent: 1900,
    yoyIncrease: 0.12,
    vacancyRate: 0.032,
    turnoverRate: 0.48,
    medianTenure: 13.1,
    tier: "gold",
    description: "Ethnic enclave, local businesses, community roots",
  },

  Weston: {
    avgRent: 1750,
    yoyIncrease: 0.14,
    vacancyRate: 0.029,
    turnoverRate: 0.62,
    medianTenure: 8.9,
    tier: "silver",
    description: "Working-class, transit improvements driving change",
  },

  "Jane & Finch": {
    avgRent: 1650,
    yoyIncrease: 0.17,
    vacancyRate: 0.015,
    turnoverRate: 0.81,
    medianTenure: 4.8,
    tier: "bronze",
    description: "High-density, low-income, high mobility despite low rents",
  },

  // Etobicoke
  Islington: {
    avgRent: 1950,
    yoyIncrease: 0.11,
    vacancyRate: 0.036,
    turnoverRate: 0.44,
    medianTenure: 15.3,
    tier: "gold",
    description: "Suburban stability, family focus, low turnover",
  },

  Mimico: {
    avgRent: 2250,
    yoyIncrease: 0.16,
    vacancyRate: 0.021,
    turnoverRate: 0.67,
    medianTenure: 7.2,
    tier: "silver",
    description: "Lakefront gentrification, new development, rising rents",
  },

  Rexdale: {
    avgRent: 1700,
    yoyIncrease: 0.13,
    vacancyRate: 0.027,
    turnoverRate: 0.59,
    medianTenure: 9.6,
    tier: "silver",
    description: "Industrial area, diverse communities, moderate stability",
  },

  // Scarborough
  "Scarborough Town Centre": {
    avgRent: 1850,
    yoyIncrease: 0.15,
    vacancyRate: 0.023,
    turnoverRate: 0.69,
    medianTenure: 7.4,
    tier: "silver",
    description: "Transit hub, high-rises, growing displacement pressure",
  },

  Agincourt: {
    avgRent: 1800,
    yoyIncrease: 0.12,
    vacancyRate: 0.031,
    turnoverRate: 0.54,
    medianTenure: 11.2,
    tier: "silver",
    description: "Diverse community, moderate density, mixed stability",
  },

  Malvern: {
    avgRent: 1650,
    yoyIncrease: 0.1,
    vacancyRate: 0.034,
    turnoverRate: 0.51,
    medianTenure: 12.8,
    tier: "gold",
    description: "Family-oriented, parks, community programs, stability",
  },

  Guildwood: {
    avgRent: 1750,
    yoyIncrease: 0.09,
    vacancyRate: 0.04,
    turnoverRate: 0.38,
    medianTenure: 17.5,
    tier: "gold",
    description: "Suburban feel, natural areas, low renter mobility",
  },

  Rouge: {
    avgRent: 1600,
    yoyIncrease: 0.08,
    vacancyRate: 0.048,
    turnoverRate: 0.28,
    medianTenure: 22.4,
    tier: "gold",
    description: "Greenest ward, low density, highest housing stability",
  },
};

/**
 * Get rental data by neighborhood name
 * Case-insensitive lookup
 */
export function getRentalData(neighborhood) {
  return torontoRentalData[neighborhood] || null;
}

/**
 * Get all neighborhoods sorted by rent stress
 * Used for generating realistic relocation sequences
 */
export function getNeighborhoodsByStress() {
  return Object.entries(torontoRentalData)
    .map(([name, data]) => ({
      name,
      ...data,
      stressScore: calculateRentStress(data.avgRent),
    }))
    .sort((a, b) => b.stressScore - a.stressScore);
}

/**
 * Calculate rent-to-income stress ratio
 */
export function calculateRentStress(avgRent) {
  const annualRent = avgRent * 12;
  return annualRent / MEDIAN_INCOME_TORONTO;
}

/**
 * Get tier statistics for UI display
 */
export function getTierDistribution() {
  const tiers = { bronze: 0, silver: 0, gold: 0 };

  Object.values(torontoRentalData).forEach((data) => {
    tiers[data.tier]++;
  });

  return tiers;
}

/**
 * Generate relocation path based on current tier
 * Bronze → tends toward Silver or Gold (system "upgrade")
 * Silver → random (lateral move)
 * Gold → can be downgraded to Silver/Bronze (dystopian twist)
 */
export function generateRelocationTarget(currentNeighborhood) {
  const currentData = torontoRentalData[currentNeighborhood];
  if (!currentData) return null;

  const neighborhoods = Object.keys(torontoRentalData);
  let candidatePool = [];

  if (currentData.tier === "bronze") {
    // 70% chance to stay bronze, 25% silver, 5% gold (slight hope)
    const roll = Math.random();
    if (roll < 0.7) {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "bronze"
      );
    } else if (roll < 0.95) {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "silver"
      );
    } else {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "gold"
      );
    }
  } else if (currentData.tier === "silver") {
    // 60% same tier, 30% downgrade, 10% upgrade
    const roll = Math.random();
    if (roll < 0.6) {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "silver"
      );
    } else if (roll < 0.9) {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "bronze"
      );
    } else {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "gold"
      );
    }
  } else {
    // gold
    // 80% stay gold, 20% downgrade (dystopian: even "winners" lose)
    const roll = Math.random();
    if (roll < 0.8) {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "gold"
      );
    } else {
      candidatePool = neighborhoods.filter(
        (n) => torontoRentalData[n].tier === "silver"
      );
    }
  }

  // Remove current neighborhood from pool
  candidatePool = candidatePool.filter((n) => n !== currentNeighborhood);

  // Random selection from pool
  return candidatePool[Math.floor(Math.random() * candidatePool.length)];
}
