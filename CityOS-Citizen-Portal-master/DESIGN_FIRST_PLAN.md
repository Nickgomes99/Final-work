# CityOS Citizen Portal - 2-Week Design-First Plan

## 🎭 **Focus: Storytelling > Technical Complexity**

---

## 🎯 Core Philosophy

**"Make people FEEL the dystopia, not just see data."**

This isn't a data dashboard. It's an interactive story about two possible urban futures. Every design choice should evoke emotion:

- **Empathic Grid:** Hope vs. Loneliness (Warm oranges vs. Cold blues)
- **Time Share:** Anxiety of displacement (Ticking countdown, forced relocation)

---

## 🛠️ Simplified Tech Stack (Learn-Friendly)

### Core (Non-Negotiable)

- **React 18** via **Vite** - Modern, fast
- **Mapbox GL JS** via `react-map-gl` - The star of the show
- **Tailwind CSS** - Rapid styling, dark mode built-in
- **React Context API** - Simple state management (no extra libraries)

### Removed (To Save Time)

- ❌ Zustand - Too much for this scope
- ❌ Framer Motion - CSS animations are enough
- ❌ Toast libraries - Build a simple one (15 minutes)

### Design Tools

- **Figma/Excalidraw** - Sketch the 3 key screens before coding
- **Coolors.co** - Generate the color palette
- **Google Fonts** - Typography selection

---

## 📅 2-WEEK EXECUTION PLAN

---

## **WEEK 1: Foundation + Visual Design**

### **Day 1: Learning Day + Design Sprint**

**Morning (2 hours): Mapbox Crash Course**

- [ ] Watch: [Mapbox GL JS Tutorial](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/) (30 min)
- [ ] Create free Mapbox account
- [ ] Play with [Mapbox Studio](https://studio.mapbox.com) - customize dark map style
- [ ] Test: Create a basic HTML file with a map (just to understand how it works)

**Afternoon (2 hours): Story Design**

- [ ] Write the **narrative copy** for intro sequence:
  ```
  Screen 1: "The year is 2045..."
  Screen 2: "Cities no longer measure productivity..."
  Screen 3: "They measure connection."
  Screen 4: "And mobility."
  Screen 5: "Welcome to CityOS."
  ```
- [ ] Sketch 3 screens on paper:
  1. Intro sequence (black screen with text)
  2. Empathic Grid view (sidebar + map)
  3. Time Share view (different sidebar + same map)
- [ ] Choose your **color palette** (example below)

**Design Specs:**

```
🎨 COLOR PALETTE (Dystopian Tech Noir)

Background:
--bg-deep: #0a0e1a        (Almost black)
--bg-layer: #12182b       (Slightly lighter)
--bg-glass: rgba(18,24,43,0.7)  (Glassmorphism)

Accents:
--lonely-blue: #3b82f6    (Pulsing, cold)
--connected-warm: #f59e0b (Amber, not orange - feels hopeful)
--alert-red: #ef4444      (Time running out)
--accent-cyan: #06b6d4    (UI highlights)

Text:
--text-bright: #f1f5f9    (Headlines)
--text-dim: #64748b       (Body)
--text-ghost: #334155     (Deemphasized)

Typography:
Headings: "Space Grotesk" (Free, futuristic, geometric)
Body: "Inter" (Clean, readable)
Mono: "JetBrains Mono" (Countdown timer, data)
```

**Deliverable:** Color palette saved, intro text written, sketches done

---

### **Day 2-3: Project Setup + Intro Sequence**

**Goal:** Get Vite + Mapbox working, build the intro animation

**Setup (1 hour):**

```bash
cd C:\Users\User\Downloads\CityOS-Citizen-Portal
npm create vite@latest app -- --template react
cd app
npm install
npm install react-map-gl mapbox-gl
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure Tailwind (`tailwind.config.js`):**

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-deep": "#0a0e1a",
        "bg-layer": "#12182b",
        lonely: "#3b82f6",
        connected: "#f59e0b",
        alert: "#ef4444",
        accent: "#06b6d4",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
};
```

**Build Intro Sequence (3 hours):**

- [ ] Create `<IntroSequence>` component
- [ ] Use CSS keyframes for text fade-in/fade-out
- [ ] 5 screens, 3 seconds each = 15 seconds total
- [ ] Final screen has "Enter CityOS" button
- [ ] Store in localStorage: Skip intro on revisit

**Code Pattern:**

```jsx
// src/components/IntroSequence.jsx
const screens = [
  { text: "The year is 2045...", delay: 0 },
  { text: "Cities no longer measure productivity.", delay: 3000 },
  { text: "They measure connection.", delay: 6000 },
  { text: "And they charge you for stability.", delay: 9000 },
  { text: "Welcome to CityOS.", delay: 12000, showButton: true },
];
```

**CSS Animation:**

```css
@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
  }
  10%,
  90% {
    opacity: 1;
  }
}

.intro-text {
  animation: fadeInOut 3s ease-in-out;
}
```

**Deliverable:** Black screen intro that feels cinematic

---

### **Day 4-5: Map Setup + Visual Styling**

**Goal:** Get the map looking STUNNING

**Map Configuration (2 hours):**

- [ ] Create `.env` file with Mapbox token
- [ ] Set up basic map in `<App>`
- [ ] Center on Toronto: `[-79.3832, 43.6532]`, zoom 11
- [ ] Apply dark style: `mapbox://styles/mapbox/dark-v11`

**Visual Enhancements (4 hours):**

- [ ] **Customize map style in Mapbox Studio:**
  - Make water darker (more dramatic)
  - Reduce label clutter (hide minor roads)
  - Increase building heights (3D effect)
  - Export custom style URL
- [ ] **Add atmospheric effects:**

  ```jsx
  <Map
    fog={{
      range: [0.5, 10],
      color: "#0a0e1a",
      "horizon-blend": 0.1,
    }}
    terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
  />
  ```

- [ ] **Add subtle vignette overlay** (CSS):
  ```css
  .map-container::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 0 200px rgba(10, 14, 26, 0.8);
  }
  ```

**Deliverable:** A map that looks like it's from Blade Runner 2049

---

### **Day 6-7: Sidebar UI + Toggle**

**Goal:** Build the control interface

**Layout (2 hours):**

```jsx
<div className="flex h-screen bg-bg-deep">
  {/* Sidebar - Fixed left */}
  <aside className="w-96 bg-bg-layer/80 backdrop-blur-xl border-r border-accent/20">
    <Header />
    <ViewToggle />
    <div className="p-6">
      {currentView === "empathic" ? <EmpathicView /> : <TimeShareView />}
    </div>
  </aside>

  {/* Map - Full screen */}
  <main className="flex-1 relative">
    <Map />
  </main>
</div>
```

**Toggle Switch Design (2 hours):**

- [ ] Create pill-shaped toggle (not a boring switch)
- [ ] Active view glows with accent color
- [ ] Smooth transition animation (300ms)
- [ ] Icons: 🧠 for Empathic, 🏠 for Time Share

**Visual Detail:**

```jsx
<div className="flex gap-2 p-2 bg-bg-deep/50 rounded-full">
  <button
    className={`
      flex items-center gap-2 px-6 py-3 rounded-full
      transition-all duration-300
      ${
        active
          ? "bg-accent text-bg-deep shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          : "text-text-dim"
      }
    `}>
    🧠 Empathic Grid
  </button>
  <button>🏠 Time Share</button>
</div>
```

**Typography Hierarchy:**

- [ ] Import fonts from Google Fonts in `index.html`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@700&display=swap"
    rel="stylesheet" />
  ```

**Deliverable:** Sidebar that feels tactile and futuristic

---

## **WEEK 2: Interactive Storytelling**

### **Day 1-2: Empathic Grid with REAL DATA (Toronto 311 API)**

**Goal:** Make loneliness visible using real community engagement data

**API Integration (2 hours):**

- [ ] **Use the prepared `torontoData.js` service** (already created!)
- [ ] Import and fetch real 311 data:

  ```jsx
  import { fetch311Data, calculateEmotions } from "../services/torontoData";
  import { torontoWards } from "../data/torontoWards";

  useEffect(() => {
    async function loadData() {
      const wardCounts = await fetch311Data();

      if (wardCounts) {
        const liveEmotions = calculateEmotions(wardCounts, torontoWards);
        setEmotions(liveEmotions);
        setDataSource("live"); // Show green "Live Data" badge
      } else {
        // Fallback to synthetic data
        const syntheticData = generateSyntheticEmotions();
        setEmotions(syntheticData);
        setDataSource("synthetic");
      }
    }
    loadData();
  }, []);
  ```

**Data Logic:**

- ✅ High 311 requests = Engaged community = **Connected** (amber)
- ✅ Low 311 requests = Disengaged = **Lonely** (blue)
- ✅ All 25 Toronto wards mapped with real coordinates
- ✅ Automatic cache fallback (1-hour TTL)
- ✅ Synthetic data backup if API fails

**Data Badge (30 min):**

```jsx
<div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full">
  <div
    className={`w-2 h-2 rounded-full ${
      dataSource === "live" ? "bg-green-500 animate-pulse" : "bg-gray-500"
    }`}
  />
  <span className="text-xs">
    {dataSource === "live" ? "🔴 Live Toronto 311 Data" : "⚠️ Synthetic Data"}
  </span>
</div>
```

**Marker Visualization (3 hours):**

- [ ] Render markers with `<Marker>` component
- [ ] **Visual design:**

  ```jsx
  <div
    className={`
    relative w-4 h-4 rounded-full
    ${
      mood === "lonely"
        ? "bg-lonely shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse"
        : "bg-connected shadow-[0_0_15px_rgba(245,158,11,0.6)]"
    }
  `}>
    {/* Inner dot */}
    <div className="absolute inset-1 bg-white/30 rounded-full" />
  </div>
  ```

- [ ] **Hover interaction:**
  - Show tooltip with persona ("Office worker, relocated 3x")
  - Increase marker size (scale transform)
  - Brighten glow

**Sidebar Content:**

- [ ] Stats panel (minimalist cards):
  ```
  📊 Grid Status
  • Lonely Nodes: 18
  • Connected: 7
  • Active Events: 0
  ```
- [ ] "Generate Micro-Event" button (large, glowing)

**Deliverable:** A map that tells a story at a glance

---

### **Day 3-4: Connection Interaction**

**Goal:** Let users "fix" loneliness

**Connection Logic (2 hours):**

```jsx
const handleGenerateEvent = () => {
  // 1. Find 2 closest lonely markers
  const lonelyNodes = emotions.filter((e) => e.mood === "lonely");
  const [node1, node2] = findClosestPair(lonelyNodes);

  // 2. Draw animated line between them
  setConnectionLine({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [node1.lng, node1.lat],
        [node2.lng, node2.lat],
      ],
    },
  });

  // 3. Change their mood to 'connected'
  updateMood([node1.id, node2.id], "connected");

  // 4. Show narrative message
  showMessage(generateEventText(node1, node2));
};
```

**Event Text Generator (Storytelling!):**

```js
const eventTexts = [
  (n1, n2) =>
    `Micro-Event Generated: Coffee meetup between ${n1.neighborhood} and ${n2.neighborhood}`,
  (n1, n2) => `Community Dinner scheduled for ${n1.neighborhood} residents`,
  (n1, n2) => `Book club formed. Participants detected within 2km radius.`,
  (n1, n2) => `🎨 Art walk event: Connecting isolated creatives`,
];
```

**Line Animation (1 hour):**

- [ ] Use Mapbox `<Layer>` with dashed line
- [ ] Animate dash offset (appears to "draw" itself):
  ```css
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  ```

**Notification Component (1 hour):**

- [ ] Simple toast (top-right corner)
- [ ] 3-second auto-dismiss
- [ ] Success color (accent cyan)

**Deliverable:** Clicking button creates visible change + narrative feedback

---

### **Day 5-6: Time Share with REAL RENTAL DATA**

**Goal:** Make displacement feel urgent using actual Toronto housing market

**CMHC Data Integration (1.5 hours):**

- [ ] **Use the prepared `rentalData.js`** (already created!)
- [ ] Import housing calculations:

  ```jsx
  import { torontoRentalData, calculateRentStress } from "../data/rentalData";
  import { calculateTier, formatCountdown } from "../utils/housingCalculations";

  const currentNeighborhood = "Downtown Core";
  const housingData = torontoRentalData[currentNeighborhood];
  const { tier, daysRemaining, stressRatio } =
    calculateTier(currentNeighborhood);
  ```

**Market Data Display (1 hour):**

```jsx
<div className="bg-bg-deep/50 border border-accent/20 rounded-xl p-6 mb-6">
  <h3 className="text-sm text-text-dim mb-4">Market Analysis</h3>

  <div className="grid grid-cols-2 gap-4 text-sm">
    <div>
      <div className="text-text-ghost">Avg Rent</div>
      <div className="text-xl font-mono text-alert">${housingData.avgRent}</div>
    </div>

    <div>
      <div className="text-text-ghost">YoY Increase</div>
      <div className="text-xl font-mono text-alert">
        +{(housingData.yoyIncrease * 100).toFixed(0)}%
      </div>
    </div>

    <div>
      <div className="text-text-ghost">Turnover Rate</div>
      <div className="text-xl font-mono text-lonely">
        {(housingData.turnoverRate * 100).toFixed(0)}%
      </div>
    </div>

    <div>
      <div className="text-text-ghost">Rent Stress</div>
      <div className="text-xl font-mono text-alert">
        {(stressRatio * 100).toFixed(0)}%
      </div>
    </div>
  </div>

  <p className="text-xs text-text-ghost mt-4 pt-4 border-t border-accent/10">
    📊 Source: CMHC Rental Market Report 2024
  </p>
</div>
```

**UI Layout (2 hours):**

```jsx
<div className="space-y-6">
  {/* Status Card */}
  <div className="bg-bg-deep/50 border border-accent/20 rounded-xl p-6">
    <div className="text-text-dim text-sm mb-2">Current Residence</div>
    <h3 className="text-2xl font-display text-text-bright">Unit #2847</h3>
    <p className="text-text-dim">King West, Downtown Core</p>

    {/* Countdown */}
    <div className="mt-6 text-center">
      <div className="text-text-dim text-sm mb-2">Time Remaining</div>
      <div className="font-mono text-5xl text-alert">
        {days}d {hours}h {minutes}m
      </div>
    </div>

    {/* Tier Badge */}
    <div className="mt-4 inline-block px-4 py-2 bg-alert/20 border border-alert rounded-full">
      <span className="text-alert font-semibold">
        ⚡ Tier: Bronze (High Mobility)
      </span>
    </div>
  </div>

  {/* Relocation Button */}
  <button
    onClick={handleRelocate}
    className="w-full py-4 bg-accent text-bg-deep font-semibold rounded-xl
               shadow-[0_0_30px_rgba(6,182,212,0.4)]
               hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
               transition-all">
    Acknowledge Relocation
  </button>
</div>
```

**Countdown Timer (1 hour):**

```jsx
const [timeLeft, setTimeLeft] = useState({
  days: 2,
  hours: 4,
  minutes: 23,
  seconds: 45,
});

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      let { days, hours, minutes, seconds } = prev;

      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
      if (minutes < 0) {
        minutes = 59;
        hours--;
      }
      if (hours < 0) {
        hours = 23;
        days--;
      }

      return { days, hours, minutes, seconds };
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

**Relocation Data (30 min):**

```json
// src/data/relocations.json
[
  {
    "id": "unit-404",
    "name": "Skyline Tower",
    "lat": 43.6426,
    "lng": -79.3871,
    "tier": "silver",
    "neighborhood": "Financial District"
  }
  // ... 9 more units
]
```

**Deliverable:** Ticking countdown that creates anxiety

---

### **Day 7: Relocation Animation (The Climax)**

**Goal:** The most dramatic moment in the experience

**Animation Sequence (3 hours):**

```jsx
const handleRelocate = async () => {
  const newUnit = relocations[Math.floor(Math.random() * relocations.length)];

  // 1. Show system message
  showMessage("⚙️ CityOS: Processing relocation request...");

  await delay(1000);

  // 2. Draw path
  setRelocationPath({
    type: "LineString",
    coordinates: [
      [currentUnit.lng, currentUnit.lat],
      [newUnit.lng, newUnit.lat],
    ],
  });

  await delay(500);

  // 3. Animate camera
  mapRef.current?.flyTo({
    center: [newUnit.lng, newUnit.lat],
    zoom: 15,
    duration: 2000,
    curve: 1.2, // Makes the arc more dramatic
    essential: true,
  });

  await delay(2000);

  // 4. Update UI
  setCurrentUnit(newUnit);
  setTimeLeft({ days: 7, hours: 0, minutes: 0, seconds: 0 });
  showMessage(
    `✅ Relocation Complete: ${newUnit.name}, ${newUnit.neighborhood}`
  );
};
```

**Path Styling:**

```jsx
<Source type="geojson" data={relocationPath}>
  <Layer
    type="line"
    paint={{
      "line-color": "#06b6d4",
      "line-width": 3,
      "line-dasharray": [2, 4],
      "line-opacity": 0.8,
    }}
  />
</Source>
```

**Deliverable:** Smooth, cinematic camera movement that feels like you're being displaced

---

### **Day 8-9: Polish & Micro-Interactions**

**Goal:** Sweat the details

**Animations to Add (3 hours):**

- [ ] Sidebar fade-in on mount (400ms delay)
- [ ] Button hover states (scale 1.05, glow intensifies)
- [ ] Map marker hover: Grow + show ring
- [ ] Toggle switch: Sliding indicator (not instant jump)
- [ ] Countdown flashes red when < 1 day remaining

**Narrative Details (2 hours):**

- [ ] Add "lore" text in sidebars:

  ```
  Empathic Grid:
  "The Emotional Infrastructure Act of 2043 mandated
  real-time connection monitoring. Loneliness is now
  a solvable problem. Or is it surveillance?"

  Time Share:
  "Housing stability is now a luxury. The transient
  majority moves every 7 days. Static living costs
  12,000 Time Credits per month."
  ```

- [ ] System messages should feel dystopian:
  ```
  "CityOS: Emotional anomaly detected in grid sector 4B"
  "Allocating unit... Citizen #847391 relocated"
  "Time Credit balance: 340 TC remaining"
  ```

**Responsive Design (2 hours):**

- [ ] Mobile: Sidebar becomes bottom drawer
- [ ] Tablet: Sidebar narrows to 320px
- [ ] Touch gestures: Swipe to toggle views

**Deliverable:** Every interaction feels intentional

---

### **Day 10: Deployment + Documentation**

**Goal:** Ship it

**Pre-Deploy Checklist:**

- [ ] Remove all `console.log()`
- [ ] Add `.env` to `.gitignore`
- [ ] Optimize images (if any)
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS Safari, Android Chrome)

**Deploy to Vercel (15 minutes):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variable (Mapbox token)
# Do this in Vercel dashboard: Settings → Environment Variables
```

**Write README (1 hour):**

```markdown
# CityOS Citizen Portal

A speculative design project exploring two urban futures:

1. Empathic Grid: Algorithmic loneliness detection
2. Urban Time Share: Housing as a subscription

## The Story

In 2045, cities have become...

## Try It

👉 [Live Demo](https://cityos.vercel.app)

## Tech Stack

React • Mapbox GL • Tailwind CSS

## Case Study

[Read the full process](link)
```

**Create Demo Video (2 hours):**

- [ ] Use OBS or Loom to record 60-second demo
- [ ] Script:
  1. 0-10s: Intro sequence
  2. 10-25s: Empathic Grid interaction
  3. 25-40s: Switch to Time Share
  4. 40-55s: Relocation animation
  5. 55-60s: End card with URL
- [ ] Upload to YouTube (Unlisted)
- [ ] Embed on portfolio

**Deliverable:** Live site + demo video

---

## 🎨 Design Principles (Your North Star)

### 1. **Every Color Has Meaning**

- Blue = Cold, isolation, corporate
- Amber = Warmth, human connection
- Cyan = System actions, AI
- Red = Urgency, displacement

### 2. **Typography Tells the Story**

- Display font (Space Grotesk) = Headlines, dramatic moments
- Sans (Inter) = Body text, readable
- Mono (JetBrains) = System messages, countdown (feels coded)

### 3. **Animation = Emotional Beat**

- Slow fade-ins (800ms) = Contemplative
- Quick snaps (200ms) = Urgent, system-driven
- Camera flyTo (2s) = Loss of control

### 4. **Negative Space = Tension**

Don't fill every pixel. Let the darkness breathe. Dystopia is empty.

---

## 📊 Success Metrics

**Week 1 Exit Criteria:**
✅ Intro sequence feels cinematic  
✅ Map looks dystopian (dark, moody)  
✅ Sidebar toggle works smoothly

**Week 2 Exit Criteria:**
✅ Empathic Grid tells a story (not just dots)  
✅ Relocation animation feels like displacement  
✅ Someone can understand the concept in 30 seconds

---

## 🌐 Real Data Integration Summary

### ✅ What's Been Prepared for You

**1. Toronto 311 API Service** (`src/services/torontoData.js`)

- Fetches live community engagement data
- Automatic caching (1-hour TTL)
- Synthetic fallback if API fails
- Returns emotion scores per ward

**2. Toronto Ward Locations** (`src/data/torontoWards.js`)

- All 25 official Toronto wards
- Real coordinates, demographics, population
- Helper functions (find nearest, distance calc)

**3. CMHC Rental Market Data** (`src/data/rentalData.js`)

- Real rent prices by neighborhood
- Turnover rates, vacancy data
- Tier assignment (Bronze/Silver/Gold)
- Relocation probability logic

**4. Housing Calculations** (`src/utils/housingCalculations.js`)

- Tier assignment formulas
- Countdown formatting
- Displacement risk scores
- System message generators

**5. Synthetic Fallback** (`src/data/syntheticFallback.js`)

- Backup data if APIs fail
- Based on real demographic patterns
- Ensures demo never breaks

### 🎯 Integration Time Investment

- **Empathic Grid API:** 2 hours (Day 1-2)
- **Time Share Data:** 1.5 hours (Day 5-6)
- **Total:** 3.5 hours vs. 7 days of fake data

### 🏆 Benefits

✅ Critics can verify your data sources  
✅ Shows understanding of Toronto housing crisis  
✅ Grounds speculative fiction in reality  
✅ Demonstrates API integration skills  
✅ Makes the dystopia feel **predictive**, not just fictional

---

## 🚨 Learning Mapbox - Quick Reference

### Essential Mapbox Concepts (15-minute read):

1. **Map Styles:** Pre-designed themes (dark, light, satellite)
2. **Markers:** Points on the map (your emotion dots)
3. **Layers:** Visual elements (lines, circles, polygons)
4. **Sources:** Data that feeds into layers (GeoJSON)
5. **flyTo:** Animate camera movement

### Code Patterns You'll Use:

**1. Basic Map:**

```jsx
import Map from "react-map-gl";

<Map
  mapboxAccessToken="your_token"
  initialViewState={{ longitude: -79.38, latitude: 43.65, zoom: 11 }}
  style={{ width: "100%", height: "100vh" }}
  mapStyle="mapbox://styles/mapbox/dark-v11"
/>;
```

**2. Adding Markers:**

```jsx
import { Marker } from "react-map-gl";

{
  points.map((point) => (
    <Marker longitude={point.lng} latitude={point.lat}>
      <div className="w-4 h-4 bg-blue-500 rounded-full" />
    </Marker>
  ));
}
```

**3. Drawing Lines:**

```jsx
import { Source, Layer } from "react-map-gl";

<Source type="geojson" data={lineData}>
  <Layer type="line" paint={{ "line-color": "#06b6d4", "line-width": 3 }} />
</Source>;
```

**4. Camera Animation:**

```jsx
const mapRef = useRef();

<Map ref={mapRef} ... />

// Later:
mapRef.current?.flyTo({
  center: [lng, lat],
  zoom: 14,
  duration: 2000
});
```

That's it. Those 4 patterns = 90% of what you need.

---

## 💡 When You Get Stuck

### Mapbox Not Rendering?

- Check: Is the token in `.env` correct?
- Check: Did you import CSS? `import 'mapbox-gl/dist/mapbox-gl.css';`
- Check: Browser console for errors

### Markers Not Showing?

- Check: Are coordinates valid? (lat: -90 to 90, lng: -180 to 180)
- Check: Is zoom level appropriate? (zoom: 11-15 for city view)

### Animation Janky?

- Reduce `duration` in `flyTo` (try 1000ms instead of 2000ms)
- Limit markers to 20 instead of 25
- Disable fog effects temporarily

---

## 🎯 Final Thoughts

**This isn't a coding project. It's a storytelling project that uses code.**

Every decision should serve the narrative:

- Why dark mode? Because dystopia is dark.
- Why countdown timer? Because displacement creates anxiety.
- Why smooth animations? Because losing control should feel seamless.

**When in doubt, ask: "Does this make the story clearer?"**

If yes → build it.  
If no → cut it.

---

**Let's build something that makes people uncomfortable in the best way. 🚀**

---

## 📋 Day-by-Day Checklist

### Week 1

- [ ] Day 1: Learn Mapbox basics + Design sprint
- [ ] Day 2-3: Setup project + Intro sequence
- [ ] Day 4-5: Map styling (make it beautiful)
- [ ] Day 6-7: Sidebar UI + Toggle

### Week 2

- [ ] Day 1-2: Empathic Grid data + markers
- [ ] Day 3-4: Connection interaction
- [ ] Day 5-6: Time Share UI + countdown
- [ ] Day 7: Relocation animation
- [ ] Day 8-9: Polish everything
- [ ] Day 10: Deploy + document

**Total: 10 days, ~4 hours/day = 40 hours**

**You got this! 💪**
