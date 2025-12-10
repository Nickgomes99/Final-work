import { createContext, useContext, useState, useEffect } from "react";
import { fetch311Data, calculateEmotions } from "../services/torontoData";
import { calculateCityBrainScore } from "../services/cityBrain";
import { torontoWards } from "../data/torontoWards";
import { generateSyntheticEmotions } from "../data/syntheticFallback";
import { generateRelocationTarget } from "../data/rentalData";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [emotions, setEmotions] = useState([]);
  const [dataSource, setDataSource] = useState("loading");
  const [currentNeighborhood, setCurrentNeighborhood] =
    useState("Downtown Core");
  const [connectionLine, setConnectionLine] = useState(null);
  const [cityBrainData, setCityBrainData] = useState({});

  // Load emotion data on mount
  useEffect(() => {
    loadEmotionData();
  }, []);

  const loadEmotionData = async () => {
    try {
      // Load 311 data first (fast fallback)
      const wardCounts = await fetch311Data();

      if (wardCounts) {
        const liveEmotions = calculateEmotions(wardCounts, torontoWards);
        setEmotions(liveEmotions);
        setDataSource("live");

        // Enhance with City Brain data in background (slower, but richer)
        enhanceWithCityBrain(liveEmotions);
      } else {
        const syntheticData = generateSyntheticEmotions();
        setEmotions(syntheticData);
        setDataSource("synthetic");
      }
    } catch (error) {
      console.error("Failed to load emotion data:", error);
      const syntheticData = generateSyntheticEmotions();
      setEmotions(syntheticData);
      setDataSource("synthetic");
    }
  };

  const enhanceWithCityBrain = async (emotionData) => {
    console.log("[AppContext] Enhancing with City Brain analysis...");

    // Process only first 5 wards to start (avoid overwhelming API)
    const wardsToAnalyze = emotionData.slice(0, 5);

    for (const emotion of wardsToAnalyze) {
      try {
        const wardKey = Object.keys(torontoWards).find(
          (k) =>
            torontoWards[k].name === emotion.neighborhood ||
            k === emotion.neighborhood
        );

        if (!wardKey) continue;

        const ward = torontoWards[wardKey];
        const address = `${emotion.neighborhood}, Toronto, ON`;

        const brainScore = await calculateCityBrainScore(
          ward.lat,
          ward.lng,
          address,
          emotion.neighborhood,
          ward.population
        );

        setCityBrainData((prev) => ({
          ...prev,
          [emotion.neighborhood]: brainScore,
        }));

        // Small delay to avoid hammering APIs
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.warn(
          `[AppContext] City Brain failed for ${emotion.neighborhood}:`,
          error
        );
      }
    }

    console.log("[AppContext] City Brain enhancement complete");
  };

  const updateMood = (ids, newMood) => {
    setEmotions((prev) =>
      prev.map((emotion) =>
        ids.includes(emotion.id) ? { ...emotion, mood: newMood } : emotion
      )
    );
  };

  const relocateUser = () => {
    const newNeighborhood = generateRelocationTarget(currentNeighborhood);
    if (newNeighborhood) {
      setCurrentNeighborhood(newNeighborhood);
      return newNeighborhood;
    }
    return currentNeighborhood;
  };

  const value = {
    emotions,
    dataSource,
    currentNeighborhood,
    setCurrentNeighborhood,
    connectionLine,
    setConnectionLine,
    cityBrainData,
    updateMood,
    relocateUser,
    reloadData: loadEmotionData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
