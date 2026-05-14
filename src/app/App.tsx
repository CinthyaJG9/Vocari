import { useState, useRef } from "react";
import { AnimatePresence } from "motion/react";
import type { Screen } from "../types";
import { useProfiles } from "../hooks/userProfile";
import { useWarmAssistant } from "../hooks/userWarmAssistant";
import { VoiceSetupScreen } from "../components/screens/VoiceSetupScreen";
import { ProfileSelectScreen } from "../components/screens/ProfileSelectScreen";
import { MenuScreen } from "../components/screens/MenuScreen";
import { RewardsScreen } from "../components/screens/RewardsScreen";
import { Activity1 } from "../components/activities/Activity1";
import { Activity2 } from "../components/activities/Activity2";
import { Activity3 } from "../components/activities/Activity3";
import { FloatingAssistant } from "../components/assistant/FloatingAssistant";
import { EditProfileModal } from "../components/common/EditProfileModal";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("profile-select");
  const { profiles, currentProfile, setCurrentProfile, addProfile, updateStars, deleteProfile, updateAvatar } = useProfiles();
  const [starsEarned, setStarsEarned] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { sayWelcome, sayProfileSaved, sayProfileDeleted, sayAvatarChanged } = useWarmAssistant();

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

  const handleAddProfile = async (profile: any) => {
    addProfile(profile);
    setCurrentScreen("menu");
    await sayProfileSaved();
  };

  const handleUpdateStars = (amount: number) => {
    if (currentProfile) {
      updateStars(currentProfile.id, amount);
      setStarsEarned((prev) => prev + amount);
    }
  };

  const handleDeleteProfile = async () => {
    if (currentProfile) {
      const remaining = deleteProfile(currentProfile.id);
      setShowEditModal(false);
      await sayProfileDeleted();
      if (remaining.length === 0) {
        setCurrentScreen("profile-select");
      }
    }
  };

  const handleUpdateAvatar = async (newAvatar: string) => {
    if (currentProfile) {
      updateAvatar(currentProfile.id, newAvatar);
      await sayAvatarChanged();
    }
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
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 relative">
      <div className="max-w-7xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {currentScreen === "voice-setup" && (
            <VoiceSetupScreen 
              onComplete={handleAddProfile}
              onBack={() => setCurrentScreen("profile-select")}
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
              onEditProfile={() => setShowEditModal(true)}
              onScrollLeft={() => scrollCarousel("left")}
              onScrollRight={() => scrollCarousel("right")}
            />
          )}

          {currentScreen === "activity1" && currentProfile && (
            <Activity1
              age={currentProfile.age}
              stars={currentProfile.stars}
              onAwardStars={handleUpdateStars}
              onFinish={() => setCurrentScreen("rewards")}
              onExit={resetToMenu}
            />
          )}

          {currentScreen === "activity2" && currentProfile && (
            <Activity2
              age={currentProfile.age}
              stars={currentProfile.stars}
              onAwardStars={handleUpdateStars}
              onFinish={() => setCurrentScreen("rewards")}
              onExit={resetToMenu}
            />
          )}

          {currentScreen === "activity3" && currentProfile && (
            <Activity3
              age={currentProfile.age}
              stars={currentProfile.stars}
              onAwardStars={handleUpdateStars}
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
      </div>

      {/* Asistente flotante - visible en toda la app excepto en rewards y voice-setup */}
      {currentScreen !== "rewards" && currentScreen !== "voice-setup" && (
        <FloatingAssistant 
          showHelp={currentScreen === "menu"}
          onHelpClick={() => {
            if (currentScreen === "menu") {

            }
          }}
        />
      )}

      {/* Modal de edición de perfil */}
      {showEditModal && currentProfile && (
        <EditProfileModal
          profile={currentProfile}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateAvatar}
          onDelete={handleDeleteProfile}
        />
      )}
    </div>
  );
}

<style>{`
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`}</style>