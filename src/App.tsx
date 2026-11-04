import React from 'react';
import { useEchoNavStore } from './state/useEchoNavStore';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { Sidebar } from './components/common/Sidebar';
import { DesktopHeader } from './components/common/DesktopHeader';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DrawerMenu } from './components/common/DrawerMenu';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { VoiceAssistantModal } from './components/common/VoiceAssistantModal';
import { SOSModal } from './components/sos/SOSModal';
import { ObjectRecognitionModal } from './components/vision/ObjectRecognitionModal';

export const App: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    currentDistance,
    dangerLevel,
    vibrationLevel,
    batteryPercentage,
    history,
    clearHistory,
    settings,
    setSettings,
    emergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
    dispatchEmergencySOS,
    isMenuOpen,
    setIsMenuOpen,
    isSOSModalOpen,
    setIsSOSModalOpen,
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    isVisionModalOpen,
    setIsVisionModalOpen,
    simulationState,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetDemo,
    updateDistance,
    toggleConnection,
    playAlertSound,
    lastReadingTime,
  } = useEchoNavStore();

  // Phase 3: Network status awareness (announces online/offline in selected language)
  const { isOnline } = useNetworkStatus(settings.voiceLanguage);

  // Synchronize accessibility modes with document root for robust global scaling & contrast
  React.useEffect(() => {
    document.documentElement.classList.toggle('large-text', !!settings.largeText);
  }, [settings.largeText]);

  React.useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', !!settings.highContrast);
  }, [settings.highContrast]);

  const accessibilityClasses = `${
    settings.largeText ? 'large-text' : ''
  } ${
    settings.highContrast ? 'high-contrast' : ''
  }`;

  return (
    <div
      className={`min-h-screen w-full bg-[#F3F8F2] flex flex-col md:flex-row font-sans select-none antialiased ${accessibilityClasses}`}
    >
      {/* Skip to Main Content Accessible Keyboard Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#0B3821] focus:text-white focus:rounded-xl focus:shadow-xl focus:ring-2 focus:ring-[#16A34A] text-sm font-bold tracking-tight"
      >
        Skip to Main Content
      </a>

      {/* Screen Reader Page Transition Live Announcer */}
      <div role="status" aria-live="polite" className="sr-only">
        {currentTab === 'home' && 'Live Navigation Dashboard loaded'}
        {currentTab === 'history' && 'Detection History loaded'}
        {currentTab === 'settings' && 'System Settings loaded'}
        {currentTab === 'about' && 'About EchoNav loaded'}
      </div>

      {/* Desktop Left Sidebar (Navigation & Persistent Testing Panel) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        settings={settings}
        currentDistance={currentDistance}
        simulationState={simulationState}
        onStartSimulation={startSimulation}
        onPauseSimulation={pauseSimulation}
        onResumeSimulation={resumeSimulation}
        onResetDemo={resetDemo}
        onSetDistance={(d) => updateDistance(d, true)}
        onToggleConnection={toggleConnection}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenVision={() => setIsVisionModalOpen(true)}
        onTriggerSOS={() => setIsSOSModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header (Hidden on Desktop) */}
        <Header
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onMenuToggle={() => setIsMenuOpen(true)}
          onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          onTriggerSOS={() => setIsSOSModalOpen(true)}
        />

        {/* Desktop Header (Hidden on Mobile) */}
        <DesktopHeader
          currentTab={currentTab}
          settings={settings}
          onOpenDemoPanel={() => setIsMenuOpen(true)}
          isOnline={isOnline}
          onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          onOpenVision={() => setIsVisionModalOpen(true)}
          onTriggerSOS={() => setIsSOSModalOpen(true)}
        />

        {/* Main Dashboard Screen Container */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 focus:outline-none"
        >
          {currentTab === 'home' && (
            <HomeScreen
              distance={currentDistance}
              dangerLevel={dangerLevel}
              vibrationLevel={vibrationLevel}
              batteryPercentage={batteryPercentage}
              isConnected={settings.bluetoothConnected}
              onSetDistance={(d) => updateDistance(d, true)}
              highThresholdCm={settings.highThresholdCm || 40}
              distanceThresholdCm={settings.distanceThresholdCm || 80}
              isVoiceAlertActive={settings.soundNotification && settings.voiceAlerts}
            />
          )}

          {currentTab === 'history' && (
            <HistoryScreen
              history={history}
              onClearHistory={clearHistory}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={setSettings}
              onPlayBeep={playAlertSound}
              onToggleConnection={toggleConnection}
              lastReadingTime={lastReadingTime}
              simulationState={simulationState}
              emergencyContacts={emergencyContacts}
              onAddContact={addEmergencyContact}
              onRemoveContact={removeEmergencyContact}
            />
          )}

          {currentTab === 'about' && (
            <AboutScreen />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>

      {/* Comprehensive Testing Suite Drawer / Modal */}
      <DrawerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectTab={setCurrentTab}
        settings={settings}
        currentDistance={currentDistance}
        simulationState={simulationState}
        onStartSimulation={startSimulation}
        onPauseSimulation={pauseSimulation}
        onResumeSimulation={resumeSimulation}
        onResetDemo={resetDemo}
        onSetDistance={(d) => updateDistance(d, true)}
        onToggleConnection={toggleConnection}
        onUpdateBattery={(b) => setSettings((prev) => ({ ...prev, batteryPercentage: b }))}
      />

      {/* ── Phase 3 Smart Feature Modals ── */}

      {/* Voice Assistant (Push-to-Talk, EN/TA bilingual, voice commands) */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        language={settings.voiceLanguage}
        onLanguageChange={(lang) => setSettings((prev) => ({ ...prev, voiceLanguage: lang }))}
        currentDistance={currentDistance}
        dangerLevel={dangerLevel}
        batteryPercentage={settings.batteryPercentage}
        onNavigateTab={setCurrentTab}
        onTriggerSOS={() => { setIsVoiceAssistantOpen(false); setIsSOSModalOpen(true); }}
        onOpenVision={() => { setIsVoiceAssistantOpen(false); setIsVisionModalOpen(true); }}
      />

      {/* Emergency SOS (5-second countdown, GPS, SMS dispatch) */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        contacts={emergencyContacts}
        language={settings.voiceLanguage}
        onEmergencyDispatched={dispatchEmergencySOS}
      />

      {/* AI Object Recognition (camera / simulated, fully local) */}
      <ObjectRecognitionModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        language={settings.voiceLanguage}
      />
    </div>
  );
};
