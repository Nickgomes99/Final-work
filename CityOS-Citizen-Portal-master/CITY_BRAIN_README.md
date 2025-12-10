# 🧠 City Brain Integration Guide

## What Changed

Your app now uses **real urban data** to measure social connection, not just 311 calls. The new "City Brain" system combines three data sources to create a comprehensive connection score.

---

## 🎯 The Three Data Sources

### 1. **Walkability Score** (Walk Score API)

- **What it measures:** How walkable/transit-friendly a neighborhood is
- **Why it matters:** Walkable areas = more spontaneous encounters = less isolation
- **Weight:** 40% of connection score
- **API:** https://www.walkscore.com/professional/api.php (free: 5k/day)

**Scores:**

- 90-100: Walker's Paradise → Very Connected
- 70-89: Very Walkable → Connected
- 50-69: Somewhat Walkable → Moderate
- 25-49: Car-Dependent → Lonely
- 0-24: Car-Dependent → Very Lonely

---

### 2. **Third Places Density** (OpenStreetMap)

- **What it measures:** Cafes, libraries, parks, community centers nearby
- **Why it matters:** "Third places" = social anchors (sociological term)
- **Weight:** 35% of connection score
- **API:** Overpass API (free, unlimited)

**Counts per km²:**

- 25+: Excellent community infrastructure
- 15-24: Good
- 8-14: Moderate
- 3-7: Limited
- <3: Sparse (high isolation risk)

---

### 3. **Civic Engagement** (Toronto 311)

- **What it measures:** Service requests (potholes, graffiti, etc.)
- **Why it matters:** High requests = people care about their area
- **Weight:** 25% of connection score
- **API:** Toronto Open Data (free)

---

## 🚀 Setup Instructions

### Step 1: Get Walk Score API Key (Optional but Recommended)

1. Go to https://www.walkscore.com/professional/api.php
2. Sign up for free tier (5,000 requests/day)
3. Copy your API key
4. Add to `.env`:
   ```bash
   VITE_WALKSCORE_API_KEY=your_actual_key_here
   ```

**Note:** App works without it! It uses realistic synthetic data based on Toronto geography if API key is missing.

### Step 2: Run the App

```bash
cd app
npm run dev
```

The app will:

1. Load 311 data immediately (fast)
2. Enhance first 5 neighborhoods with City Brain data in background (slower)
3. Show enriched data when you click markers

---

## 📊 How to Read City Brain Data

When you click a neighborhood marker, the popup now shows:

### **Connection Score** (0-100%)

- Composite of walkability + third places + civic engagement
- <50% = Lonely (blue marker)
- > 50% = Connected (amber marker)

### **Metrics Breakdown:**

```
🚶 Walkability: 85/100        ← From Walk Score API
🏛️ Third Places: 23 nearby   ← From OpenStreetMap
📞 Civic Engagement: 78%      ← From Toronto 311
```

### **Isolation Risk:**

- **Low:** Strong community infrastructure
- **Moderate:** Some gaps in connectivity
- **High:** Multiple risk factors
- **Critical:** Urgent intervention needed

---

## 🎨 What This Changes Narratively

### **Before:**

> "High 311 calls = connected" (oversimplified)

### **After:**

> "Connection score based on actual urban infrastructure: walkability, gathering spaces, and civic engagement"

### **The Critique:**

The app now shows that "loneliness" isn't about individual psychology—it's about **urban design failures**:

- Car-dependent suburbs lack spontaneous social encounters
- Missing third places = nowhere to gather
- Low walkability = physical isolation

The "City Brain" detects these **infrastructure gaps**, not emotions.

---

## 🔧 Technical Details

### File Structure

```
app/src/
├── services/
│   ├── cityBrain.js          ← Main orchestrator
│   ├── walkScoreAPI.js       ← Walk Score integration
│   ├── thirdPlacesAPI.js     ← OpenStreetMap third places
│   └── torontoData.js        ← 311 data (existing)
├── contexts/
│   └── AppContext.jsx        ← Now includes cityBrainData
└── components/
    └── EmpathicGrid.jsx      ← Shows enriched popup
```

### Caching Strategy

- **Walk Score:** 7 days (walkability doesn't change often)
- **Third Places:** 7 days (OSM updates slowly)
- **311 Data:** 1 hour (more dynamic)

### API Rate Limiting

- Walk Score: 100ms delay between requests
- Overpass: 200ms delay between requests
- Processes first 5 wards on load (expand to 25 as needed)

---

## 🎯 Next Steps

### **Week 2, Day 2-3:** Expand Coverage

Currently only first 5 neighborhoods get City Brain analysis. To analyze all 25:

```javascript
// In AppContext.jsx, change:
const wardsToAnalyze = emotionData.slice(0, 5);
// To:
const wardsToAnalyze = emotionData; // All wards
```

**Warning:** This makes 75 API calls (25 wards × 3 APIs). Takes ~1 minute. Consider doing this once and caching results.

### **Week 2, Day 4:** Add Loading Indicators

Show users that City Brain is analyzing in background:

```jsx
{
  !cityBrainData[neighborhood] && (
    <div className="text-xs text-text-ghost">
      🧠 Analyzing infrastructure...
    </div>
  );
}
```

### **Week 2, Day 5:** Update Sidebar Stats

Show City Brain stats in sidebar:

```jsx
<div className="stats">
  <div>Avg Walkability: {avgWalkScore}/100</div>
  <div>Total Third Places: {totalThirdPlaces}</div>
</div>
```

---

## 🐛 Troubleshooting

### "Walk Score API returning errors"

→ Check `.env` has correct API key
→ Or leave as `your-walkscore-key` to use synthetic data

### "Overpass API timeout"

→ Normal, it's a public API. App falls back to synthetic data automatically

### "No City Brain data showing"

→ Takes 5-10 seconds to load in background. Click marker again after waiting

### "Console shows CORS errors"

→ Walk Score API requires actual address strings, check `address` parameter

---

## 📚 Research Sources

This isn't made up. Real urban planning research:

1. **Walk Score & Loneliness:**

   - "Walkability and Social Capital" (Rogers et al., 2013)
   - Found inverse correlation between walkability and social isolation

2. **Third Places:**

   - "The Great Good Place" (Ray Oldenburg, 1989)
   - Foundational sociology on community gathering spaces

3. **Civic Engagement & Community:**
   - "Bowling Alone" (Robert Putnam, 2000)
   - Civic participation as indicator of social capital

---

## 💡 Philosophy

**The old version said:**

> "We detect loneliness through 311 calls"

**The new version says:**

> "We detect isolation RISK through infrastructure gaps. Loneliness isn't a personal failure—it's a design failure."

**The dystopian twist:**
The "City Brain" sees these gaps... but instead of fixing infrastructure (expensive), it tries to "optimize" people by relocating them (cheap). That's the connection to Time Share.

---

## 🎭 Narrative Integration Ideas

### Connect to Time Share View:

```jsx
// When relocation countdown expires, show:
"Your isolation risk score (0.72) exceeds acceptable thresholds.
Relocation to higher-walkability district recommended."
```

Show the system using "wellness" language to justify economic displacement.

### Add System Recommendations:

```jsx
{
  cityBrainData.isolationRisk === "high" && (
    <div className="alert">
      ⚠️ CityOS Recommendation: Voluntary relocation to optimized connectivity
      zone available.
      <button>View Options</button>
    </div>
  );
}
```

The app becomes more sinister when you realize the "caring" system is really about real estate optimization.

---

**Questions?** Check the code comments in `cityBrain.js` for detailed implementation notes.
