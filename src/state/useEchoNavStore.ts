import { useState, useEffect, useCallback, useRef } from 'react';
import { TabType, DetectionReading, DeviceSettings, DangerLevel, VibrationLevel } from '../types/echonav';
import { speechService } from '../utils/speechAlerts';

const STORAGE_KEYS = {
  HISTORY: 'echonav_history',
  SETTINGS: 'echonav_settings',
  DISTANCE: 'echonav_distance',
};

const initialSampleHistory: DetectionReading[] = [
  { id: '1', time: '09:41 AM', status: 'Obstacle Detected', distance: 30, level: 'High', vibration: 'Strong', timestamp: Date.now() - 60000 },
  { id: '2', time: '09:40 AM', status: 'Obstacle Detected', distance: 60, level: 'Medium', vibration: 'Medium', timestamp: Date.now() - 120000 },
  { id: '3', time: '09:39 AM', status: 'Clear Path', level: 'Safe', vibration: 'None', timestamp: Date.now() - 180000 },
  { id: '4', time: '09:38 AM', status: 'Obstacle Detected', distance: 75, level: 'Medium', vibration: 'Medium', timestamp: Date.now() - 240000 },
  { id: '5', time: '09:37 AM', status: 'Obstacle Detected', distance: 20, level: 'High', vibration: 'Strong', timestamp: Date.now() - 300000 },
  { id: '6', time: '09:36 AM', status: 'Clear Path', level: 'Safe', vibration: 'None', timestamp: Date.now() - 360000 },
];

const defaultSettings: DeviceSettings = {
  distanceSensitivity: 'Medium',
  distanceThresholdCm: 80,
  highThresholdCm: 40,
  vibrationIntensity: 'Medium',
  soundNotification: true,
  voiceAlerts: true,
  largeText: false,
  highContrast: false,
  batteryPercentage: 82,
  deviceName: 'Echonav Glove',
  firmwareVersion: 'v1.0.0',
  bluetoothConnected: true,
  isDemoMode: true,
};

export function useEchoNavStore() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState(false);
  const [lastReadingTime, setLastReadingTime] = useState<string>('09:41:00 AM');

  // 1. Settings state with localStorage
  const [settings, setSettings] = useState<DeviceSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage error
    }
    return defaultSettings;
  });

  // 2. Current distance state
  const [currentDistance, setCurrentDistance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISTANCE);
      if (saved) return Number(saved);
    } catch {
      // Ignore
    }
    return 35; // default 35 cm reference
  });

  // 3. History state with localStorage
  const [history, setHistory] = useState<DetectionReading[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return initialSampleHistory;
  });

  // Simulation state: 'idle' | 'running' | 'paused'
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'paused'>('idle');
  const simulationIndexRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastRecordedDistanceRef = useRef<number>(35);

  // Save settings whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Save history whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Compute current danger level and vibration feedback based on thresholds
  const computeDangerLevel = useCallback((distance: number): DangerLevel => {
    if (distance <= (settings.highThresholdCm || 40)) return 'High';
    if (distance <= (settings.distanceThresholdCm || 80)) return 'Medium';
    return 'Safe';
  }, [settings.highThresholdCm, settings.distanceThresholdCm]);

  const computeVibrationLevel = useCallback((danger: DangerLevel): VibrationLevel => {
    if (!settings.bluetoothConnected) return 'None';
    if (danger === 'High') {
      return settings.vibrationIntensity === 'Low' ? 'Medium' : 'Strong';
    }
    if (danger === 'Medium') {
      return settings.vibrationIntensity === 'Low' ? 'Low' : 'Medium';
    }
    return 'None';
  }, [settings.bluetoothConnected, settings.vibrationIntensity]);

  // Audio tone generator for obstacle alerts
  const playAlertSound = useCallback((level: DangerLevel) => {
    if (!settings.soundNotification) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      if (level === 'High') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(980, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(980, now + 0.16);
        gain2.gain.setValueAtTime(0.2, now + 0.16);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.16);
        osc2.stop(now + 0.28);
      } else if (level === 'Medium') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(620, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Audio playback suppressed if no user gesture
    }
  }, [settings.soundNotification]);

  // Main distance update dispatcher with voice alert + deduplication
  const updateDistance = useCallback((dist: number, logToHistory = true) => {
    const clampedDist = Math.max(10, Math.min(200, dist));
    setCurrentDistance(clampedDist);
    try {
      localStorage.setItem(STORAGE_KEYS.DISTANCE, String(clampedDist));
    } catch {
      // Ignore
    }

    const now = new Date();
    const timeWithSeconds = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastReadingTime(timeWithSeconds);

    const level = computeDangerLevel(clampedDist);
    const vibration = computeVibrationLevel(level);

    // Audio tones
    if (level === 'High' || level === 'Medium') {
      playAlertSound(level);
    }

    // Web Speech API Voice Announcement (respects soundNotification & voiceAlerts)
    if (settings.soundNotification && settings.voiceAlerts) {
      speechService.speakDangerAlert(level, true);
    }

    // Deduplication check: only log if distance changed or is initial
    if (logToHistory && clampedDist !== lastRecordedDistanceRef.current) {
      lastRecordedDistanceRef.current = clampedDist;
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHistory((prev) => [
        {
          id: String(Date.now() + Math.random()),
          time: timeStr,
          status: level === 'Safe' ? 'Clear Path' : 'Obstacle Detected',
          distance: level === 'Safe' ? undefined : clampedDist,
          level,
          vibration,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 49),
      ]);
    }
  }, [computeDangerLevel, computeVibrationLevel, playAlertSound, settings.soundNotification, settings.voiceAlerts]);

  // Automated simulation timer supporting start, pause, resume
  useEffect(() => {
    if (simulationState !== 'running') return;
    const sequence = [20, 35, 60, 85, 120, 25, 40, 70, 95];

    const interval = setInterval(() => {
      const nextDist = sequence[simulationIndexRef.current % sequence.length];
      simulationIndexRef.current++;
      updateDistance(nextDist, true);
    }, 3500);

    return () => clearInterval(interval);
  }, [simulationState, updateDistance]);

  const startSimulation = useCallback(() => {
    setSimulationState('running');
  }, []);

  const pauseSimulation = useCallback(() => {
    setSimulationState('paused');
  }, []);

  const resumeSimulation = useCallback(() => {
    setSimulationState('running');
  }, []);

  const resetDemo = useCallback(() => {
    setSimulationState('idle');
    simulationIndexRef.current = 0;
    setCurrentDistance(35);
    lastRecordedDistanceRef.current = 35;
    speechService.reset();
    setSettings((prev) => ({
      ...prev,
      batteryPercentage: 82,
      bluetoothConnected: true,
      distanceSensitivity: 'Medium',
      distanceThresholdCm: 80,
      highThresholdCm: 40,
      vibrationIntensity: 'Medium',
      soundNotification: true,
      voiceAlerts: true,
    }));
    setHistory(initialSampleHistory);
    try {
      localStorage.setItem(STORAGE_KEYS.DISTANCE, '35');
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initialSampleHistory));
    } catch {
      // Ignore
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // Ignore
    }
  }, []);

  const toggleConnection = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      bluetoothConnected: !prev.bluetoothConnected,
    }));
  }, []);

  const currentDangerLevel = computeDangerLevel(currentDistance);
  const currentVibration = computeVibrationLevel(currentDangerLevel);

  return {
    currentTab,
    setCurrentTab,
    currentDistance,
    dangerLevel: currentDangerLevel,
    vibrationLevel: currentVibration,
    batteryPercentage: settings.batteryPercentage,
    history,
    settings,
    setSettings,
    isMenuOpen,
    setIsMenuOpen,
    isDemoPanelOpen,
    setIsDemoPanelOpen,
    simulationState,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetDemo,
    updateDistance,
    clearHistory,
    toggleConnection,
    playAlertSound,
    lastReadingTime,
  };
}
