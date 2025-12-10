# CityOS Citizen Portal - 3-Week Development Plan

## 🎯 Project Overview
A single-page web application showcasing two urban futures through an interactive map interface:
- **View A: Empathic Grid** - Emotional heatmap showing community connection states
- **View B: Urban Time Share** - Personal housing countdown and relocation visualization

**Live Demo Goal**: Deployable to GitHub Pages, fully interactive, no backend required.

---

## 🛠️ Tech Stack

### Core Framework
- **React 18** (Vite for faster build times than CRA)
  - Why: Modern, fast setup, excellent dev experience
  - Build time: ~30 seconds vs 2+ minutes with CRA

### Map Engine
- **Mapbox GL JS** via `react-map-gl`
  - Style: Monochrome Dark (pre-built in Mapbox Studio)
  - Features: Smooth animations, markers, flyTo camera, draw layers
  - Free tier: 50k loads/month (sufficient for portfolio)

### Styling & UI
- **Tailwind CSS** + **Headless UI**
  - Why: Rapid prototyping, dark mode built-in, no custom CSS needed
  - Components: Pre-styled toggles, modals, cards
- **Framer Motion** (optional animation library)
  - For smooth transitions between views
  - Toast notifications

### State Management
- **React Context API** or **Zustand** (lightweight)
  - Managing: Current view (Empathic/TimeShare), selected location, timer state
  - No need for Redux - keep it simple

### Data Source
- **Static JSON Files**
  - `emotions.json` - 50 coordinate points with mood states
  - `relocations.json` - 10 pre-defined housing units
  - `messages.json` - Pre-written AI-like system messages

### Deployment
- **GitHub Pages** with Vite build
  - Custom domain ready
  - Auto-deploy via GitHub Actions

---

## 📅 3-Week Execution Plan

### **WEEK 1: Foundation & Map Setup**

#### Day 1-2: Project Scaffolding
**Tasks:**
- [ ] Initialize Vite + React project
  ```bash
  npm create vite@latest cityos-portal -- --template react
  ```
- [ ] Install dependencies:
  ```bash
  npm install react-map-gl mapbox-gl tailwindcss framer-motion zustand
  ```
- [ ] Configure Tailwind CSS (dark mode enabled)
- [ ] Set up Mapbox account & get API token
- [ ] Create `.env` file for Mapbox token
- [ ] Test basic map rendering

**Deliverable:** Black screen with a Mapbox map rendered

---

#### Day 3-4: Map Styling & Dark Mode
**Tasks:**
- [ ] Apply Mapbox Studio "Monochrome Dark" style
  - Style URL: `mapbox://styles/mapbox/dark-v11`
- [ ] Configure map viewport:
  - Center on Toronto: `[-79.3832, 43.6532]`
  - Initial zoom: 11
- [ ] Add fog/atmosphere effect for futuristic feel
- [ ] Set up responsive container (fullscreen)

**Code Snippet:**
```jsx
<Map
  mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
  initialViewState={{
    longitude: -79.3832,
    latitude: 43.6532,
    zoom: 11
  }}
  style={{width: '100vw', height: '100vh'}}
  mapStyle="mapbox://styles/mapbox/dark-v11"
/>
```

**Deliverable:** Stunning dark map with Toronto centered

---

#### Day 5-7: Sidebar UI & View Toggle
**Tasks:**
- [ ] Create `<Sidebar>` component (left side, 380px wide)
- [ ] Build toggle switch using Headless UI:
  ```
  [ 🧠 Empathic Grid | 🏠 Time Share ]
  ```
- [ ] Set up Zustand store:
  ```js
  const useStore = create((set) => ({
    currentView: 'empathic', // 'empathic' | 'timeshare'
    toggleView: () => set((state) => ({ 
      currentView: state.currentView === 'empathic' ? 'timeshare' : 'empathic' 
    }))
  }))
  ```
- [ ] Add fade-in/fade-out transitions with Framer Motion
- [ ] Style sidebar with glassmorphism effect:
  ```css
  bg-slate-900/80 backdrop-blur-xl border-r border-slate-700
  ```

**Deliverable:** Functional toggle that switches sidebar content

---

### **WEEK 2: Empathic Grid Implementation**

#### Day 1-3: Data Layer & Visualization
**Tasks:**
- [ ] Create `src/data/emotions.json`:
  ```json
  [
    {
      "id": 1,
      "lat": 43.6532,
      "lng": -79.3832,
      "mood": "lonely",
      "intensity": 0.8,
      "neighborhood": "Downtown Core"
    },
    // ... 49 more random Toronto coordinates
  ]
  ```
- [ ] Generate coordinates using script (distribute across Toronto):
  ```js
  // Helper to generate random points in Toronto bounds
  const bounds = {
    north: 43.855, south: 43.581,
    east: -79.116, west: -79.639
  };
  ```
- [ ] Render markers using `react-map-gl`'s `<Marker>` component
- [ ] Style markers:
  - **Lonely** (Blue): Pulsing animation, larger size
  - **Connected** (Orange): Steady glow, smaller size

**Code Snippet:**
```jsx
{emotions.map(point => (
  <Marker key={point.id} longitude={point.lng} latitude={point.lat}>
    <div className={`
      w-4 h-4 rounded-full
      ${point.mood === 'lonely' ? 'bg-blue-500 animate-pulse' : 'bg-orange-500'}
      shadow-[0_0_20px_rgba(59,130,246,0.8)]
    `} />
  </Marker>
))}
```

**Deliverable:** Map with 50 glowing emotional markers

---

#### Day 4-5: Connection Interaction
**Tasks:**
- [ ] Add "Generate Micro-Event" button to sidebar
- [ ] On click:
  1. Select 2 random "lonely" markers
  2. Draw animated line between them using `<Source>` + `<Layer>`
  3. Change their color to orange
  4. Update Zustand store
- [ ] Implement line drawing:
  ```jsx
  <Source type="geojson" data={connectionLine}>
    <Layer
      type="line"
      paint={{
        'line-color': '#f97316',
        'line-width': 2,
        'line-dasharray': [2, 4]
      }}
    />
  </Source>
  ```

**Deliverable:** Clickable interaction that "connects" lonely people

---

#### Day 6-7: Toast Notifications & Polish
**Tasks:**
- [ ] Install `react-hot-toast`
- [ ] Create notification messages:
  ```js
  const events = [
    "Micro-Event Generated: Community Dinner at Queen & Spadina",
    "Connection Established: 2 neighbors matched for coffee",
    "Empathic Link Active: Book club forming in Liberty Village"
  ];
  ```
- [ ] Show toast on connection
- [ ] Add sidebar stats panel:
  - Total Connections: 12
  - Lonely Nodes: 38
  - Active Events: 3
- [ ] Add hover tooltips to markers

**Deliverable:** Fully interactive Empathic Grid view

---

### **WEEK 3: Urban Time Share + Deployment**

#### Day 1-3: Status Card & Countdown
**Tasks:**
- [ ] Create `<StatusCard>` component for Time Share view
- [ ] Build countdown timer:
  ```jsx
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 4,
    minutes: 23
  });
  
  // Fake countdown (decrements every second)
  useEffect(() => {
    const timer = setInterval(() => {
      // Update logic
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  ```
- [ ] Display user info:
  - **Current Unit:** #2847, King West
  - **Tier:** Bronze (High Mobility)
  - **Next Relocation:** Countdown
  - **Credits:** 340 TC
- [ ] Style with gradient cards and badges

**Deliverable:** Live countdown timer in sidebar

---

#### Day 4-5: Relocation Animation
**Tasks:**
- [ ] Create `relocations.json` with 10 Toronto housing units:
  ```json
  [
    {
      "id": "unit-404",
      "name": "Skyline Tower",
      "lat": 43.6426,
      "lng": -79.3871,
      "tier": "silver",
      "sqft": 450
    }
  ]
  ```
- [ ] Add "Acknowledge Relocation" button
- [ ] On click:
  1. Get random unit from array
  2. Use `mapRef.current.flyTo()` to zoom to new location
  3. Draw dashed path from current → new
  4. Update status card with new unit info
  5. Reset countdown to 7 days

**Code Snippet:**
```jsx
const handleRelocate = () => {
  const newUnit = relocations[Math.floor(Math.random() * relocations.length)];
  
  mapRef.current?.flyTo({
    center: [newUnit.lng, newUnit.lat],
    zoom: 14,
    duration: 2000,
    essential: true
  });
  
  // Draw path animation
  drawRelocatePath(currentUnit, newUnit);
};
```

**Deliverable:** Smooth camera fly animation with path drawing

---

#### Day 6-7: Final Polish & Deployment
**Tasks:**
- [ ] Create intro modal (shows on first visit):
  - Project explanation
  - View descriptions
  - "Enter CityOS" button
- [ ] Add loading states for map
- [ ] Create 404 fallback
- [ ] Optimize bundle size:
  ```bash
  npm run build
  # Check dist/ size (target: <500kb)
  ```
- [ ] Set up GitHub Pages deployment:
  - Update `vite.config.js` with base path
  - Create GitHub Action for auto-deploy
- [ ] Test on mobile (responsive breakpoints)
- [ ] Add meta tags for social sharing
- [ ] Write documentation in README

**Deployment Checklist:**
- [ ] Environment variables in GitHub Secrets
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional - Plausible/Simple Analytics)
- [ ] Performance test (Lighthouse score >90)

**Deliverable:** Live site at `yourusername.github.io/cityos-portal`

---

## 🎨 Design Specifications

### Color Palette (Dark Mode)
```css
--bg-primary: #0f172a     /* slate-900 */
--bg-secondary: #1e293b   /* slate-800 */
--accent-lonely: #3b82f6  /* blue-500 */
--accent-connected: #f97316 /* orange-500 */
--text-primary: #f1f5f9   /* slate-100 */
--text-secondary: #94a3b8 /* slate-400 */
--border: #334155          /* slate-700 */
```

### Typography
- **Headings:** Inter or Space Grotesk (futuristic)
- **Body:** SF Pro or system font
- **Monospace:** JetBrains Mono (for countdown)

### Component Hierarchy
```
App
├── IntroModal (first visit only)
├── Map (Mapbox GL)
│   ├── EmpathicLayer (conditional)
│   │   └── EmotionMarkers
│   └── TimeShareLayer (conditional)
│       └── RelocationMarkers
├── Sidebar
│   ├── Header (logo + toggle)
│   ├── EmpathicView (conditional)
│   │   ├── StatsPanel
│   │   └── ActionButton
│   └── TimeShareView (conditional)
│       ├── StatusCard
│       └── RelocationButton
└── ToastContainer
```

---

## 📦 File Structure
```
cityos-portal/
├── public/
│   └── cityos-logo.svg
├── src/
│   ├── components/
│   │   ├── Map.jsx
│   │   ├── Sidebar.jsx
│   │   ├── IntroModal.jsx
│   │   ├── EmpathicView.jsx
│   │   ├── TimeShareView.jsx
│   │   └── StatusCard.jsx
│   ├── data/
│   │   ├── emotions.json
│   │   ├── relocations.json
│   │   └── messages.json
│   ├── hooks/
│   │   ├── useCountdown.js
│   │   └── useMapAnimation.js
│   ├── store/
│   │   └── useStore.js (Zustand)
│   ├── utils/
│   │   ├── generateCoordinates.js
│   │   └── pathDrawing.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Key Technical "Cheats"

### 1. Fake the AI
```js
// messages.json
const systemMessages = [
  "🧠 Analyzing emotional patterns...",
  "🔗 Detecting loneliness clusters in Downtown Core...",
  "✨ Micro-event optimization complete",
  "🏠 Allocating Unit #404...",
  "📍 Calculating optimal relocation path...",
  "⏱️ Time credit adjustment: +40 TC"
];

// Display randomly with 2s delay
const showFakeAI = () => {
  const msg = systemMessages[Math.floor(Math.random() * systemMessages.length)];
  toast(msg, { icon: '🤖', duration: 3000 });
};
```

### 2. Pre-Generated Coordinates
Use this script to generate `emotions.json`:
```js
const fs = require('fs');

const bounds = {
  north: 43.855, south: 43.581,
  east: -79.116, west: -79.639
};

const emotions = Array.from({length: 50}, (_, i) => ({
  id: i + 1,
  lat: Math.random() * (bounds.north - bounds.south) + bounds.south,
  lng: Math.random() * (bounds.east - bounds.west) + bounds.west,
  mood: Math.random() > 0.6 ? 'lonely' : 'connected',
  intensity: Math.random(),
  neighborhood: ['Downtown', 'Liberty Village', 'The Beaches', 'Yorkville'][Math.floor(Math.random() * 4)]
}));

fs.writeFileSync('emotions.json', JSON.stringify(emotions, null, 2));
```

### 3. No Real Backend
- All state in Zustand (persists in memory only)
- On page refresh, data resets (acceptable for demo)
- If need persistence: Use `localStorage` wrapper

### 4. Component Library for Speed
Use **Headless UI** (by Tailwind team):
- `<Switch>` for toggle
- `<Dialog>` for intro modal
- `<Transition>` for animations
- Pre-styled, accessible, zero custom CSS

---

## 📊 Success Metrics

### Week 1 Exit Criteria
✅ Map renders with dark theme  
✅ Sidebar toggle switches views  
✅ Basic layout responsive on mobile  

### Week 2 Exit Criteria
✅ 50 emotional markers visible  
✅ Connection interaction works  
✅ Toast notifications appear  

### Week 3 Exit Criteria
✅ Countdown timer updates in real-time  
✅ Relocation animation smooth (flyTo)  
✅ Site deployed to GitHub Pages  
✅ Lighthouse score >90  

---

## 🎯 Portfolio Presentation Tips

### Case Study Structure
1. **The Problem:** Urban isolation + housing instability
2. **The Solution:** Data visualization of two futures
3. **The Process:** Show week-by-week builds
4. **The Tech:** Mapbox + React + Vite stack
5. **The Impact:** "Tangible speculation" - making abstract concepts clickable

### Demo Video Script (60 seconds)
1. **0-10s:** Intro modal → "Enter CityOS"
2. **10-25s:** Empathic Grid view → click "Generate Event" → watch connection animate
3. **25-40s:** Switch to Time Share → countdown ticking → click "Relocate"
4. **40-55s:** Camera flies across city → new unit info appears
5. **55-60s:** Text overlay: "Built in 3 weeks | React + Mapbox"

---

## 🔧 Troubleshooting Shortcuts

### If Mapbox is slow to load:
- Use lower zoom levels (10 instead of 14)
- Disable fog effects
- Limit markers to 30 instead of 50

### If animations are janky:
- Use `transform: translate3d()` for GPU acceleration
- Reduce flyTo duration to 1000ms
- Disable Framer Motion, use CSS transitions

### If bundle is too large:
- Tree-shake unused Mapbox features
- Use dynamic imports for heavy components
- Compress images with TinyPNG

---

## 📚 Resources

### Documentation
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js)
- [react-map-gl Examples](https://visgl.github.io/react-map-gl/)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Vite GitHub Pages Deploy](https://vitejs.dev/guide/static-deploy.html)

### Inspiration
- [Uber Movement](https://movement.uber.com) - Clean data viz
- [Strava Global Heatmap](https://www.strava.com/heatmap) - Dark map aesthetics
- [Cyberpunk UI](https://www.cyberpunk.net/us/en/) - Futuristic styling

---

## ✅ Final Checklist Before Launch

- [ ] Remove all console.logs
- [ ] Add .env to .gitignore
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on iPhone & Android
- [ ] Proofread all text (no typos)
- [ ] Add favicon
- [ ] Add Open Graph meta tags
- [ ] Test with slow 3G connection
- [ ] Verify Mapbox token is restricted (no abuse)
- [ ] Create 1-minute demo video
- [ ] Write LinkedIn post announcement

---

**Total Time Estimate:** 60-80 hours over 3 weeks (~3-4 hours/day)

**Risk Level:** Low - All tech proven, no backend complexity, static hosting

**Wow Factor:** High - Interactive map + smooth animations + speculative design story

---

**Let's build this! 🚀**
