export type TabType = 'home' | 'history' | 'settings' | 'about';

export type VibrationLevel = 'Strong' | 'Medium' | 'Low' | 'None';

export type DangerLevel = 'High' | 'Medium' | 'Safe';

export type VoiceLanguage = 'en' | 'ta';

export interface DetectionReading {
  id: string;
  time: string;
  status: 'Obstacle Detected' | 'Clear Path' | 'SOS Emergency' | 'Object Recognized';
  distance?: number; // in cm
  level: DangerLevel;
  vibration?: VibrationLevel;
  timestamp: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  mapsUrl: string;
  timestamp: number;
}

export interface DetectedObject {
  id: string;
  label: string;
  labelTa: string;
  confidence: number;
  distanceEstimate: string;
  distanceEstimateTa: string;
  severity: DangerLevel;
  bbox?: [number, number, number, number]; // [x, y, w, h] in percentages
}

export interface DeviceSettings {
  distanceSensitivity: 'Low' | 'Medium' | 'High';
  distanceThresholdCm: number; // e.g. 80 cm
  highThresholdCm: number; // default 40 cm
  vibrationIntensity: 'Low' | 'Medium' | 'High';
  soundNotification: boolean;
  voiceAlerts: boolean;
  voiceLanguage: VoiceLanguage; // 'en' (English) | 'ta' (Tamil)
  largeText: boolean;
  highContrast: boolean;
  batteryPercentage: number;
  deviceName: string;
  firmwareVersion: string;
  bluetoothConnected: boolean;
  isDemoMode: boolean;
}
