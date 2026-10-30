import React from 'react';
import { useEchoNavStore } from './state/useEchoNavStore';
import { Sidebar } from './components/common/Sidebar';
import { DesktopHeader } from './components/common/DesktopHeader';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DrawerMenu } from './components/common/DrawerMenu';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';

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
    isMenuOpen,
    setIsMenuOpen,
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

  // Dynamic accessibility styles
  const accessibilityClasses = `${
    settings.largeText ? 'text-[106%]' : ''
  } ${
    settings.highContrast ? 'contrast-[1.1] saturate-[1.1]' : ''
  }`;

  return (
    <div
      className={`min-h-screen w-full bg-[#F3F8F2] flex flex-col md:flex-row font-sans select-none antialiased ${accessibilityClasses}`}
    >
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
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header (Hidden on Desktop) */}
        <Header
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onMenuToggle={() => setIsMenuOpen(true)}
        />

        {/* Desktop Header (Hidden on Mobile) */}
        <DesktopHeader
          currentTab={currentTab}
          settings={settings}
          onOpenDemoPanel={() => setIsMenuOpen(true)}
        />

        {/* Main Dashboard Screen Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {currentTab === 'home' && (
            <HomeScreen
              distance={currentDistance}
              dangerLevel={dangerLevel}
              vibrationLevel={vibrationLevel}
              batteryPercentage={batteryPercentage}
              isConnected={settings.bluetoothConnected}
              onSetDistance={(d) => updateDistance(d, true)}
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
    </div>
  );
};
