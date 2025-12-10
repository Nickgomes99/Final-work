# CityOS Real Data Integration

This directory contains all the prepared files for integrating real Toronto data into your project.

## 📁 What's Included

### API Service

- **`services/torontoData.js`** - Toronto 311 API integration with caching & fallback

### Data Files

- **`data/torontoWards.js`** - 25 Toronto ward locations with demographics
- **`data/rentalData.js`** - CMHC rental market data (rents, turnover, tiers)
- **`data/syntheticFallback.js`** - Backup data generator when API fails

### Utilities

- **`utils/housingCalculations.js`** - Tier assignment, countdown logic, risk scores

### Components

- **`components/DataSources.jsx`** - Data credibility footer & status badges

## 🚀 Quick Start

### 1. Empathic Grid (Day 1-2)

```jsx
// In your EmpathicGrid component
import { fetch311Data, calculateEmotions } from "../services/torontoData";
import { torontoWards } from "../data/torontoWards";
import { DataSourceBadge } from "../components/DataSources";

function EmpathicGrid() {
  const [emotions, setEmotions] = useState([]);
  const [dataSource, setDataSource] = useState("loading");

  useEffect(() => {
    async function loadData() {
      const wardCounts = await fetch311Data();

      if (wardCounts) {
        const liveEmotions = calculateEmotions(wardCounts, torontoWards);
        setEmotions(liveEmotions);
        setDataSource("live");
      } else {
        // Use synthetic fallback
        const { generateSyntheticEmotions } = await import(
          "../data/syntheticFallback"
        );
        setEmotions(generateSyntheticEmotions());
        setDataSource("synthetic");
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <DataSourceBadge dataSource={dataSource} />
      {/* Your map with emotion markers */}
    </div>
  );
}
```

### 2. Time Share (Day 5-6)

```jsx
// In your TimeShare component
import { torontoRentalData } from "../data/rentalData";
import {
  calculateTier,
  formatCountdown,
  generateRelocationMessage,
} from "../utils/housingCalculations";

function TimeShare() {
  const [currentNeighborhood, setCurrentNeighborhood] =
    useState("Downtown Core");

  const housingData = torontoRentalData[currentNeighborhood];
  const { tier, daysRemaining, stressRatio } =
    calculateTier(currentNeighborhood);
  const countdown = formatCountdown(daysRemaining);

  return (
    <div>
      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-text-ghost">Avg Rent</div>
          <div className="text-2xl font-mono text-alert">
            ${housingData.avgRent}
          </div>
        </div>

        <div>
          <div className="text-text-ghost">Turnover Rate</div>
          <div className="text-2xl font-mono text-lonely">
            {(housingData.turnoverRate * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className={`font-mono text-5xl text-${countdown.color}`}>
        {countdown.display}
      </div>

      {/* Data Citation */}
      <p className="text-xs text-text-ghost mt-4">
        📊 Source: CMHC Rental Market Report 2024
      </p>
    </div>
  );
}
```

## 📊 Data Sources

### Toronto 311 Service Requests

- **API:** https://open.toronto.ca/dataset/311-service-requests/
- **Update Frequency:** Daily
- **Free:** Yes (no API key required)
- **Narrative Use:** Community engagement = connection vs. loneliness

### CMHC Rental Data

- **Source:** https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research
- **Update Frequency:** Quarterly
- **Type:** Static data (manually updated)
- **Narrative Use:** Rent stress = displacement tier assignment

### Toronto Ward Profiles

- **Source:** https://www.toronto.ca/city-government/data-research-maps/
- **Data:** Demographics, population, coordinates
- **Type:** Static (from 2021 Census)

## 🛡️ Error Handling

All services implement the **API → Cache → Synthetic** fallback pattern:

```
1. Try live API fetch (5s timeout)
   ↓ Success → Cache & display

2. If fail, check localStorage cache (1h TTL)
   ↓ Valid cache → Use cached data

3. If cache expired, use synthetic fallback
   ↓ Always works → Demo never breaks
```

## 🎨 UI Components

### Data Source Badge (Live Indicator)

```jsx
<DataSourceBadge
  dataSource="live" // 'live' | 'cached' | 'synthetic'
  lastUpdated={new Date().toISOString()}
/>
```

Shows:

- 🟢 Green pulse = Live data
- 🟡 Yellow = Cached (< 1h old)
- ⚪ Gray = Synthetic fallback

### Data Sources Footer (Credibility)

```jsx
<DataSources dataSource="live" />
```

Shows clickable links to all data sources (fixed bottom-right).

## ⏱️ Time Investment

- **Week 2, Day 1-2:** Empathic Grid API (2 hours)
- **Week 2, Day 5-6:** Time Share data (1.5 hours)
- **Total:** 3.5 hours for full real data integration

## 🚨 Testing Checklist

- [ ] Test with live API (check network tab for 200 status)
- [ ] Test with API blocked (simulate failure, verify synthetic fallback)
- [ ] Test cache (wait 1 hour, reload, check if cached data used)
- [ ] Verify all 25 Toronto wards display on map
- [ ] Check data source badges show correct status
- [ ] Test relocation between different tier neighborhoods

## 📝 Notes

- All files use ES6 modules (`import/export`)
- Toronto ward coordinates are official from Toronto Open Data
- Rental data based on Q4 2024 CMHC reports
- Synthetic data uses real demographic patterns (not random)

---

**Questions?** Check `.github/copilot-instructions.md` for full documentation.
