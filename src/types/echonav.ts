export type TabType = 'home' | 'history' | 'settings' | 'about';

export type VibrationLevel = 'Strong' | 'Medium' | 'Low' | 'None';

export type DangerLevel = 'High' | 'Medium' | 'Safe';

export interface DetectionReading {
  id: string;
  time: string;
  status: 'Obstacle Detected' | 'Clear Path';
  distance?: number; // in cm
  level: DangerLevel;
  vibration?: VibrationLevel;
  timestamp: number;
}

export interface DeviceSettings {
  distanceSensitivity: 'Low' | 'Medium' | 'High';
  distanceThresholdCm: number; // e.g. 80 cm
  highThresholdCm: number; // default 40 cm
  vibrationIntensity: 'Low' | 'Medium' | 'High';
  soundNotification: boolean;
  voiceAlerts: boolean;
  largeText: boolean;
  highContrast: boolean;
  batteryPercentage: number;
  deviceName: string;
  firmwareVersion: string;
  bluetoothConnected: boolean;
  isDemoMode: boolean;
}
