/**
 * DataSources Component
 * Shows data credibility footer with links to official sources
 *
 * Adds authenticity to the speculative fiction by grounding it in real data
 */

import React from "react";

export default function DataSources({ dataSource = "synthetic" }) {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50">
      <div className="bg-bg-layer/90 backdrop-blur-xl border border-accent/20 rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-text-bright">
            Data Sources
          </h4>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`relative w-2 h-2 rounded-full ${
                dataSource === "live"
                  ? "bg-green-500"
                  : dataSource === "cached"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}>
              {dataSource === "live" && (
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              )}
            </div>
            <span className="text-xs text-text-dim">
              {dataSource === "live"
                ? "Live"
                : dataSource === "cached"
                ? "Cached"
                : "Synthetic"}
            </span>
          </div>
        </div>

        <ul className="text-xs text-text-dim space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-accent">📍</span>
            <div>
              <a
                href="https://open.toronto.ca/dataset/311-service-requests/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors underline">
                Toronto 311 Service Requests
              </a>
              <div className="text-text-ghost mt-0.5">
                {dataSource === "live"
                  ? "Live community engagement data"
                  : dataSource === "cached"
                  ? "Cached (updated hourly)"
                  : "Synthetic data (API unavailable)"}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-amber-500">🏠</span>
            <div>
              <a
                href="https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/housing-data"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors underline">
                CMHC Rental Market Report 2024
              </a>
              <div className="text-text-ghost mt-0.5">
                Housing affordability & turnover rates
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-lonely">📊</span>
            <div>
              <a
                href="https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/ward-profiles/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors underline">
                Toronto Ward Profiles
              </a>
              <div className="text-text-ghost mt-0.5">
                Demographics & census data
              </div>
            </div>
          </li>
        </ul>

        <div className="mt-3 pt-3 border-t border-accent/10">
          <p className="text-xs text-text-ghost italic">
            * Emotional scores algorithmically derived from structural urban
            factors
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for sidebar
 */
export function DataSourceBadge({ dataSource = "synthetic", lastUpdated }) {
  const getStatusColor = () => {
    switch (dataSource) {
      case "live":
        return "bg-green-500";
      case "cached":
        return "bg-yellow-500";
      case "synthetic":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (dataSource) {
      case "live":
        return "🔴 Live Toronto Data";
      case "cached":
        return "⚠️ Cached Data (1h old)";
      case "synthetic":
        return "⚠️ Synthetic Data";
      default:
        return "Loading...";
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full">
      <div className={`relative w-2 h-2 rounded-full ${getStatusColor()}`}>
        {dataSource === "live" && (
          <div
            className={`absolute inset-0 rounded-full animate-pulse ${getStatusColor()}`}
          />
        )}
      </div>
      <span className="text-xs text-text-dim">{getStatusText()}</span>
      {lastUpdated && (
        <span className="text-xs text-text-ghost ml-1">
          • {formatTimeSince(lastUpdated)}
        </span>
      )}
    </div>
  );
}

/**
 * Helper to format time since last update
 */
function formatTimeSince(timestamp) {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
