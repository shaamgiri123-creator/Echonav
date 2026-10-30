import React, { useState } from 'react';
import { useEchoNavStore } from './state/useEchoNavStore';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DrawerMenu } from './components/common/DrawerMenu';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { Wifi, BatteryMedium, Signal, SlidersHorizontal, Mic } from 'lucide-react';

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

  const [currentTime] = useState('9:41');

  // Dynamic accessibility styles
  const accessibilityClasses = `${
    settings.largeText ? 'text-[108%]' : ''
  } ${
    settings.highContrast ? 'contrast-[1.12] saturate-[1.1]' : ''
  }`;

  return (
    <div className={`min-h-screen bg-[#DDE9DF] flex flex-col items-center justify-center p-0 md:py-6 md:px-4 font-sans select-none antialiased ${accessibilityClasses}`}>
      {/* Top Demo Evaluation Toolbar for Presentation */}
      <aside
        aria-label="Demo Bar"
        className="w-full max-w-[400px] mb-2 px-3 hidden md:flex items-center justify-between text-xs text-[#0B3821] bg-white/85 backdrop-blur-md rounded-2xl py-1.5 px-4 shadow-sm border border-[#CDE0D1]"
      >
        <div className="flex items-center gap-1.5 font-bold">
          <span className={`w-2 h-2 rounded-full ${
            simulationState === 'running' ? 'bg-[#16A34A] animate-ping' : 'bg-[#D97706]'
          }`} />
          <span>EchoNav Demo {simulationState === 'running' ? 'Running' : simulationState === 'paused' ? 'Paused' : 'Active'}</span>
          {settings.voiceAlerts && settings.soundNotification && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#0D8249] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              <Mic className="w-2.5 h-2.5" />
              Voice
            </span>
          )}
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-1 text-[11px] font-extrabold text-[#0D8249] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Demo Controls</span>
        </button>
      </aside>

      {/* Main Mobile Screen Viewport (100% matches reference mockup on mobile or simulated iPhone) */}
      <main
        className="relative w-full max-w-[400px] h-[100dvh] md:h-[844px] bg-[#F3F8F2] md:rounded-[50px] shadow-[0_25px_60px_rgba(11,56,33,0.18)] border-0 md:border-[10px] md:border-[#1E2922] flex flex-col justify-between overflow-hidden"
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="flex-shrink-0 relative pt-3 px-7 pb-0 flex items-center justify-between text-xs font-semibold text-[#0B3821] z-30 select-none">
          {/* Status Bar Clock */}
          <span className="font-bold tracking-tight text-[13px]">{currentTime}</span>

          {/* Dynamic Island Pill */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-2.5 w-24 h-6 bg-black rounded-full shadow-inner flex items-center justify-end pr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A]" />
          </div>

          {/* Status Bar Icons */}
          <div className="flex items-center gap-1.5 text-[#0B3821]">
            <Signal className="w-3.5 h-3.5 stroke-[2.4]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.4]" />
            <BatteryMedium className="w-4 h-4 stroke-[2.4]" />
          </div>
        </div>

        {/* Top Navigation Header */}
        <Header
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onMenuToggle={() => setIsMenuOpen(true)}
        />

        {/* Viewport Screen Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {currentTab === 'home' && (
            <HomeScreen
              distance={currentDistance}
              dangerLevel={dangerLevel}
              vibrationLevel={vibrationLevel}
              batteryPercentage={batteryPercentage}
              isConnected={settings.bluetoothConnected}
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
        </div>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />

        {/* Slide-out Menu Drawer containing the Complete Demo Suite */}
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
      </main>
    </div>
  );
};
