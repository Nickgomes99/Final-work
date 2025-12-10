// SIMPLIFIED PANEL CONTENT - Use this to replace the complex tabs

/* Replace everything between "THE MOST IMPORTANT DATA" and "City Brain Section" with this: */

{
  /* 1. ISOLATION SCORE - Most Critical */
}
{
  cityBrainData[selectedMarker.neighborhood] && (
    <div className="p-4 bg-gradient-to-br from-lonely/10 via-transparent to-accent/5 border border-white/10 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-text-ghost">
          ISOLATION RISK
        </span>
        <div
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            cityBrainData[selectedMarker.neighborhood].isolationRisk === "low"
              ? "bg-connected/20 text-connected"
              : cityBrainData[selectedMarker.neighborhood].isolationRisk ===
                "moderate"
              ? "bg-accent/20 text-accent"
              : "bg-alert/20 text-alert"
          }`}>
          {cityBrainData[
            selectedMarker.neighborhood
          ].isolationRisk.toUpperCase()}
        </div>
      </div>
      <div
        className="text-4xl font-bold font-mono mb-1"
        style={{
          color:
            cityBrainData[selectedMarker.neighborhood].mood === "connected"
              ? "#F59E0B"
              : "#5A87CC",
        }}>
        {(
          cityBrainData[selectedMarker.neighborhood].connectionScore * 100
        ).toFixed(0)}
        %
      </div>
      <div className="text-xs text-text-dim">Connection Score</div>
    </div>
  );
}

{
  /* 2. HOUSING CRISIS - The Dystopian Reality */
}
{
  torontoRentalData[selectedMarker.neighborhood] && (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-text-bright flex items-center gap-2 mb-2">
        <Home className="w-4 h-4" />
        Housing Market
      </div>

      {/* Rent Price */}
      <div className="p-3 bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-lg">
        <div className="text-xs text-text-ghost mb-1">Average Monthly Rent</div>
        <div className="text-2xl font-bold text-accent">
          $
          {torontoRentalData[
            selectedMarker.neighborhood
          ].avgRent.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3 text-alert" />
          <span className="text-xs text-alert font-semibold">
            +
            {(
              torontoRentalData[selectedMarker.neighborhood].yoyIncrease * 100
            ).toFixed(1)}
            % this year
          </span>
        </div>
      </div>

      {/* Displacement Warning */}
      {torontoRentalData[selectedMarker.neighborhood].yoyIncrease > 0.05 && (
        <div className="flex items-start gap-2 p-3 bg-alert/10 border border-alert/30 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-alert flex-shrink-0 mt-0.5" />
          <div className="text-xs text-text-dim">
            <div className="font-semibold text-alert mb-1">
              Displacement Risk
            </div>
            Rapid rent increases may force residents to relocate. System
            recommendation: Consider relocation to lower-cost ward.
          </div>
        </div>
      )}

      {/* Turnover Rate */}
      <div className="flex items-center justify-between p-2.5 bg-bg-deep/30 rounded-lg">
        <div className="text-xs text-text-ghost">Tenant Turnover</div>
        <div className="text-sm font-bold text-text-bright">
          {(
            torontoRentalData[selectedMarker.neighborhood].turnoverRate * 100
          ).toFixed(0)}
          % annually
        </div>
      </div>
    </div>
  );
}

{
  /* 3. WHY THEY'RE ISOLATED - Infrastructure */
}
{
  cityBrainData[selectedMarker.neighborhood]?.metrics && (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-text-bright flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-accent" />
        Infrastructure Analysis
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-deep/30 rounded-lg p-2 text-center">
          <Footprints className="w-4 h-4 mx-auto mb-1 text-accent" />
          <div className="text-lg font-mono font-bold text-text-bright">
            {cityBrainData[selectedMarker.neighborhood].metrics.walkability
              ?.score || "—"}
          </div>
          <div className="text-xs text-text-ghost">Walkability</div>
        </div>
        <div className="bg-bg-deep/30 rounded-lg p-2 text-center">
          <Building2 className="w-4 h-4 mx-auto mb-1 text-accent" />
          <div className="text-lg font-mono font-bold text-text-bright">
            {cityBrainData[selectedMarker.neighborhood].metrics.thirdPlaces
              ?.count || 0}
          </div>
          <div className="text-xs text-text-ghost">Third Places</div>
        </div>
        <div className="bg-bg-deep/30 rounded-lg p-2 text-center">
          <Phone className="w-4 h-4 mx-auto mb-1 text-accent" />
          <div className="text-lg font-mono font-bold text-text-bright">
            {cityBrainData[
              selectedMarker.neighborhood
            ].metrics.civicEngagement?.percentile?.toFixed(0) || "—"}
          </div>
          <div className="text-xs text-text-ghost">Civic Engagement</div>
        </div>
      </div>

      <div className="text-xs text-text-ghost text-center pt-2 border-t border-white/5">
        Data: Walk Score • OpenStreetMap • Toronto 311
      </div>
    </div>
  );
}

{
  /* 4. DEMOGRAPHICS - Quick facts */
}
<div className="space-y-2">
  <div className="text-sm font-semibold text-text-bright flex items-center gap-2 mb-2">
    <Users className="w-4 h-4" />
    Community Profile
  </div>

  <div className="grid grid-cols-2 gap-2">
    <div className="bg-bg-deep/30 rounded-lg p-2.5">
      <div className="text-xs text-text-ghost mb-1">Population</div>
      <div className="text-sm font-bold text-text-bright">
        {(
          (torontoWards[
            Object.keys(torontoWards).find(
              (k) =>
                torontoWards[k].name === selectedMarker.neighborhood ||
                k === selectedMarker.neighborhood
            )
          ]?.population || 95000) / 1000
        ).toFixed(0)}
        k
      </div>
    </div>
    <div className="bg-bg-deep/30 rounded-lg p-2.5">
      <div className="text-xs text-text-ghost mb-1">Renters</div>
      <div className="text-sm font-bold text-text-bright">
        {(
          (torontoWards[
            Object.keys(torontoWards).find(
              (k) =>
                torontoWards[k].name === selectedMarker.neighborhood ||
                k === selectedMarker.neighborhood
            )
          ]?.demographics.rentersPercent || 0.7) * 100
        ).toFixed(0)}
        %
      </div>
    </div>
    <div className="bg-bg-deep/30 rounded-lg p-2.5">
      <div className="text-xs text-text-ghost mb-1">Avg Commute</div>
      <div className="text-sm font-bold text-text-bright">
        {torontoWards[
          Object.keys(torontoWards).find(
            (k) =>
              torontoWards[k].name === selectedMarker.neighborhood ||
              k === selectedMarker.neighborhood
          )
        ]?.demographics.avgCommute || 32}
        m
      </div>
    </div>
    <div className="bg-bg-deep/30 rounded-lg p-2.5">
      <div className="text-xs text-text-ghost mb-1">Median Age</div>
      <div className="text-sm font-bold text-text-bright">
        {torontoWards[
          Object.keys(torontoWards).find(
            (k) =>
              torontoWards[k].name === selectedMarker.neighborhood ||
              k === selectedMarker.neighborhood
          )
        ]?.demographics.avgAge || 32}
      </div>
    </div>
  </div>
</div>;
