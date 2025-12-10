import { useState } from "react";
import IntroSequence from "./components/IntroSequence";
import EmpathicGrid from "./components/EmpathicGrid";
import TimeShare from "./components/TimeShare";
import { AppProvider } from "./contexts/AppContext";

function App() {
  const [currentView, setCurrentView] = useState("intro");

  return (
    <AppProvider>
      <div className="w-full h-full bg-bg-deep">
        {currentView === "intro" && (
          <IntroSequence onComplete={() => setCurrentView("empathic")} />
        )}

        {currentView === "empathic" && (
          <EmpathicGrid onSwitchView={() => setCurrentView("timeshare")} />
        )}

        {currentView === "timeshare" && (
          <TimeShare onSwitchView={() => setCurrentView("empathic")} />
        )}
      </div>
    </AppProvider>
  );
}

export default App;
