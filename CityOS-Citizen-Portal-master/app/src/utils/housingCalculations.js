/**
 * Housing Calculations & Tier Assignment Logic
 * Converts rental market data into Time Share countdown mechanics
 *
 * Narrative Formula:
 * Rent stress → Tier assignment → Time remaining → Displacement anxiety
 */

import {
  MEDIAN_INCOME_TORONTO,
  torontoRentalData,
} from "../data/rentalData.js";

/**
 * Calculate housing tier based on rent-to-income ratio
 *
 * Bronze: >50% of income on rent (financially stressed, high mobility)
 * Silver: 35-50% of income on rent (moderate stress)
 * Gold: <35% of income on rent (stable, rare in Toronto 2024)
 *
 * @param {string} neighborhood - Neighborhood name
 * @returns {Object} { tier, daysRemaining, stressRatio }
 */
export function calculateTier(neighborhood) {
  const data = torontoRentalData[neighborhood];
  if (!data) {
    return { tier: "bronze", daysRemaining: 7, stressRatio: 0.5 };
  }

  const annualRent = data.avgRent * 12;
  const stressRatio = annualRent / MEDIAN_INCOME_TORONTO;

  // Tier thresholds based on CMHC housing affordability guidelines
  let tier, daysRemaining;

  if (stressRatio > 0.5) {
    tier = "bronze";
    daysRemaining = 7; // Weekly relocations
  } else if (stressRatio > 0.35) {
    tier = "silver";
    daysRemaining = 30; // Monthly relocations
  } else {
    tier = "gold";
    daysRemaining = 365; // Annual (stable housing)
  }

  return {
    tier,
    daysRemaining,
    stressRatio,
    avgRent: data.avgRent,
    turnoverRate: data.turnoverRate,
  };
}

/**
 * Calculate time remaining with random variance
 * Adds unpredictability to dystopian system
 *
 * @param {string} tier - 'bronze' | 'silver' | 'gold'
 * @returns {number} Days until forced relocation
 */
export function calculateTimeRemaining(tier) {
  const baseDays = {
    bronze: 7,
    silver: 30,
    gold: 365,
  };

  const base = baseDays[tier] || 7;

  // Add ±20% random variance (system feels arbitrary)
  const variance = base * 0.2;
  const randomOffset = (Math.random() - 0.5) * variance * 2;

  return Math.max(1, Math.floor(base + randomOffset));
}

/**
 * Format countdown display based on urgency
 *
 * @param {number} days - Days remaining
 * @returns {Object} { display, urgency, color }
 */
export function formatCountdown(days) {
  if (days < 1) {
    return {
      display: `${Math.floor(days * 24)}h ${Math.floor(
        (days * 24 * 60) % 60
      )}m`,
      urgency: "critical",
      color: "alert", // Red, pulsing
      message: "⚠️ RELOCATION IMMINENT",
    };
  } else if (days === 1) {
    return {
      display: "1 day",
      urgency: "high",
      color: "alert",
      message: "⏰ Final day in current unit",
    };
  } else if (days < 7) {
    return {
      display: `${days} days`,
      urgency: "high",
      color: "alert",
      message: "Prepare for relocation",
    };
  } else if (days < 30) {
    return {
      display: `${days} days`,
      urgency: "medium",
      color: "lonely", // Blue
      message: "Relocation approaching",
    };
  } else if (days < 90) {
    return {
      display: `${Math.floor(days / 7)} weeks`,
      urgency: "low",
      color: "accent", // Cyan
      message: "Temporary stability",
    };
  } else {
    return {
      display: `${Math.floor(days / 30)} months`,
      urgency: "stable",
      color: "connected", // Amber
      message: "Rare housing security",
    };
  }
}

/**
 * Calculate displacement risk score
 * Used for map visualization intensity
 *
 * @param {string} neighborhood - Neighborhood name
 * @returns {number} Risk score (0-1)
 */
export function calculateDisplacementRisk(neighborhood) {
  const data = torontoRentalData[neighborhood];
  if (!data) return 0.5;

  // Multi-factor risk assessment
  const rentStress = (data.avgRent * 12) / MEDIAN_INCOME_TORONTO;
  const turnoverWeight = data.turnoverRate;
  const vacancyPressure = 1 - data.vacancyRate; // Low vacancy = high pressure
  const growthRate = data.yoyIncrease;

  // Weighted formula
  const riskScore =
    rentStress * 0.35 + // Affordability (35%)
    turnoverWeight * 0.3 + // Turnover rate (30%)
    vacancyPressure * 0.2 + // Vacancy pressure (20%)
    growthRate * 0.15; // Rent growth (15%)

  // Normalize to 0-1
  return Math.min(1, riskScore);
}

/**
 * Generate relocation message based on context
 *
 * @param {string} fromNeighborhood - Current location
 * @param {string} toNeighborhood - New location
 * @param {string} reason - 'expired' | 'upgrade' | 'downgrade'
 * @returns {string} System message in dystopian voice
 */
export function generateRelocationMessage(
  fromNeighborhood,
  toNeighborhood,
  reason
) {
  const fromData = torontoRentalData[fromNeighborhood];
  const toData = torontoRentalData[toNeighborhood];

  if (!fromData || !toData) {
    return "⚙️ CityOS: Relocation processing...";
  }

  const messages = {
    expired: [
      `⚙️ CityOS: Tenure expired. Unit ${Math.floor(
        Math.random() * 9999
      )} allocated.`,
      `⏱️ Time Share protocol enforced. Transferring to ${toNeighborhood}...`,
      `🔄 Mobility requirement met. New unit assignment in progress.`,
    ],
    upgrade: [
      `📈 Performance bonus: ${toData.tier.toUpperCase()} tier access granted.`,
      `✨ Social credit sufficient. Upgraded housing tier authorized.`,
      `🎯 Efficiency metrics exceeded. Premium unit allocated.`,
    ],
    downgrade: [
      `📉 Allocation adjustment: Moved to ${toData.tier.toUpperCase()} tier housing.`,
      `⚠️ Market conditions require unit reassignment.`,
      `🔻 Housing tier recalibrated based on city metrics.`,
    ],
  };

  const pool = messages[reason] || messages.expired;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Calculate affordability timeline
 * Shows how many hours of work needed for 1 month rent
 *
 * @param {number} avgRent - Monthly rent
 * @param {number} hourlyWage - Hourly wage (default: Toronto min wage)
 * @returns {Object} { hoursNeeded, daysOfWork, percentage }
 */
export function calculateAffordability(avgRent, hourlyWage = 17.2) {
  const hoursNeeded = Math.ceil(avgRent / hourlyWage);
  const daysOfWork = Math.ceil(hoursNeeded / 8); // 8-hour workday
  const percentage = ((avgRent * 12) / MEDIAN_INCOME_TORONTO) * 100;

  return {
    hoursNeeded,
    daysOfWork,
    percentage: percentage.toFixed(1),
    message: `${daysOfWork} days of work to afford 1 month of housing`,
  };
}

/**
 * Predict next relocation date
 * Used for countdown timer initialization
 *
 * @param {string} neighborhood - Current neighborhood
 * @param {Date} moveInDate - When user moved to current unit
 * @returns {Date} Predicted relocation date
 */
export function predictRelocationDate(neighborhood, moveInDate = new Date()) {
  const { daysRemaining } = calculateTier(neighborhood);
  const relocationDate = new Date(moveInDate);
  relocationDate.setDate(relocationDate.getDate() + daysRemaining);

  return relocationDate;
}

/**
 * Check if countdown should pulse (urgency indicator)
 *
 * @param {number} daysRemaining - Days until relocation
 * @returns {boolean} Should animate urgently
 */
export function shouldPulse(daysRemaining) {
  return daysRemaining < 2;
}
