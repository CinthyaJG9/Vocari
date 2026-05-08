import { useState, useRef } from "react";
import { AnimatePresence } from "motion/react";
import type { UserProfile, Screen } from "../types";
import { VoiceSetupScreen } from "../components/screens/VoiceSetupScreen";
import { ProfileSelectScreen } from "../components/screens/ProfileSelectScreen";
import { MenuScreen } from "../components/screens/MenuScreen";
import { RewardsScreen } from "../components/screens/RewardsScreen";
import { Activity1 } from "../components/activities/Activity1";
import { Activity2 } from "../components/activities/Activity2";
import { Activity3 } from "../components/activities/Activity3";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("profile-select");
  const [profiles, setProfiles] = useState<UserProfile[]>([
    { id: "1", name: "Ana", age: 5, stars: 12, avatar: "cat" },
    { id: "2", name: "Pedro", age: 8, stars: 25, avatar: "dog" },
  ]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [starsEarned, setStarsEarned] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const isYoungUser = currentProfile ? currentProfile.age <= 6 : false;

  const games = [
    { name: "Escucha y Elige", color: "from-green-400 to-emerald-500", image: "game1" },
    { name: "Crea tu Frase", color: "from-pink-400 to-rose-500", image: "game2" },
    {
      name: isYoungUser ? "Encuentra el Sonido" : "Completa la Palabra",
      color: "from-blue-400 to-purple-500",
      image: "game3",
    },
  ];

  const updateStars = (amount: number) => {
    if (!currentProfile) return;
    const updated = profiles.map((p) =>
      p.id === currentProfile.id ? { ...p, stars: p.stars + amount } : p
    );
    setProfiles(updated);
    setCurrentProfile({ ...currentProfile, stars: currentProfile.stars + amount });
    setStarsEarned((prev) => prev + amount);
  };

  const resetToMenu = () => {
    setCurrentScreen("menu");
    setStarsEarned(0);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {currentScreen === "voice-setup" && (
          <VoiceSetupScreen
            onComplete={(profile) => {
              setProfiles([...profiles, profile]);
              setCurrentProfile(profile);
              setCurrentScreen("menu");
            }}
          />
        )}

        {currentScreen === "profile-select" && (
          <ProfileSelectScreen
            profiles={profiles}
            onSelectProfile={(profile) => {
              setCurrentProfile(profile);
              setCurrentScreen("menu");
            }}
            onNewProfile={() => setCurrentScreen("voice-setup")}
          />
        )}

        {currentScreen === "menu" && currentProfile && (
          <MenuScreen
            profileName={currentProfile.name}
            stars={currentProfile.stars}
            games={games}
            carouselRef={carouselRef}
            onSelectGame={(index) => setCurrentScreen(`activity${index + 1}` as Screen)}
            onChangeProfile={() => setCurrentScreen("profile-select")}
            onScrollLeft={() => scrollCarousel("left")}
            onScrollRight={() => scrollCarousel("right")}
          />
        )}

        {currentScreen === "activity1" && currentProfile && (
          <Activity1
            age={currentProfile.age}
            stars={currentProfile.stars}
            onAwardStars={updateStars}
            onFinish={() => setCurrentScreen("rewards")}
            onExit={resetToMenu}
          />
        )}

        {currentScreen === "activity2" && currentProfile && (
          <Activity2_SpeakPhrase
            age={currentProfile.age}
            stars={currentProfile.stars}
            onAwardStars={updateStars}
            onFinish={() => setCurrentScreen("rewards")}
            onExit={resetToMenu}
          />
        )}

        {currentScreen === "activity3" && currentProfile && (
          <Activity3_SoundOrComplete
            age={currentProfile.age}
            stars={currentProfile.stars}
            onAwardStars={updateStars}
            onFinish={() => setCurrentScreen("rewards")}
            onExit={resetToMenu}
          />
        )}

        {currentScreen === "rewards" && currentProfile && (
          <RewardsScreen
            starsEarned={starsEarned}
            totalStars={currentProfile.stars}
            onBackToMenu={resetToMenu}
          />
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default App;