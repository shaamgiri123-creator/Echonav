import { VoiceLanguage } from '../types/echonav';

export interface CommandMatch {
  action: 'distance' | 'status' | 'battery' | 'home' | 'history' | 'settings' | 'about' | 'sos' | 'vision';
  rawText: string;
  responseEn: string;
  responseTa: string;
}

// Window speech recognition types
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class VoiceCommandService {
  private recognition: any = null;
  private isListening: boolean = false;
  private language: VoiceLanguage = 'en';

  constructor() {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : ({} as IWindow);
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
      } catch {
        this.recognition = null;
      }
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  setLanguage(lang: VoiceLanguage) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
    }
  }

  startListening(
    onResult: (match: CommandMatch) => void,
    onStateChange?: (listening: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) {
      if (onError) onError('Speech Recognition is not supported on this browser.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = this.language === 'ta' ? 'ta-IN' : 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStateChange) onStateChange(true);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onStateChange) onStateChange(false);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      if (onStateChange) onStateChange(false);
      if (onError) onError(event.error || 'Speech recognition error');
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const match = this.parseCommand(transcript);
      if (match) {
        onResult(match);
      } else {
        if (onError) {
          const fallbackMsg =
            this.language === 'ta'
              ? `கட்டளை புரியவில்லை: "${transcript}"`
              : `Unrecognized command: "${transcript}". Try saying "distance", "status", "battery", or "help".`;
          onError(fallbackMsg);
        }
      }
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      if (onError) onError(e?.message || 'Could not start microphone');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
      this.isListening = false;
    }
  }

  private parseCommand(text: string): CommandMatch | null {
    const t = text.toLowerCase();

    // Distance
    if (t.includes('distance') || t.includes('how far') || t.includes('தூரம்') || t.includes('தொலைவு')) {
      return {
        action: 'distance',
        rawText: text,
        responseEn: 'Checking obstacle distance...',
        responseTa: 'தடை தூரத்தை சரிபார்க்கிறது...',
      };
    }

    // Status / Danger
    if (t.includes('status') || t.includes('safe') || t.includes('path') || t.includes('நிலைமை') || t.includes('பாதை')) {
      return {
        action: 'status',
        rawText: text,
        responseEn: 'Reporting current safety status...',
        responseTa: 'தற்போதைய பாதுகாப்பு நிலைமையை அறிவிக்கிறது...',
      };
    }

    // Battery
    if (t.includes('battery') || t.includes('charge') || t.includes('பேட்டரி') || t.includes('மின்சாரம்')) {
      return {
        action: 'battery',
        rawText: text,
        responseEn: 'Checking battery level...',
        responseTa: 'பேட்டரி அளவை சரிபார்க்கிறது...',
      };
    }

    // Navigation: Home
    if (t.includes('home') || t.includes('dashboard') || t.includes('radar') || t.includes('முகப்பு')) {
      return {
        action: 'home',
        rawText: text,
        responseEn: 'Navigating to Home Radar Dashboard.',
        responseTa: 'முகப்பு ரேடார் பக்கத்திற்கு செல்கிறது.',
      };
    }

    // Navigation: History
    if (t.includes('history') || t.includes('logs') || t.includes('record') || t.includes('வரலாறு')) {
      return {
        action: 'history',
        rawText: text,
        responseEn: 'Opening Detection History.',
        responseTa: 'கண்டறிதல் வரலாற்றைத் திறக்கிறது.',
      };
    }

    // Navigation: Settings
    if (t.includes('setting') || t.includes('preference') || t.includes('control') || t.includes('அமைப்புகள்')) {
      return {
        action: 'settings',
        rawText: text,
        responseEn: 'Opening Settings.',
        responseTa: 'அமைப்புகள் பக்கத்திற்கு செல்கிறது.',
      };
    }

    // Navigation: About
    if (t.includes('about') || t.includes('info') || t.includes('help me') || t.includes('பற்றி')) {
      return {
        action: 'about',
        rawText: text,
        responseEn: 'Opening About EchoNav.',
        responseTa: 'எக்கோநேவ் பற்றிய தகவலுக்கு செல்கிறது.',
      };
    }

    // Emergency SOS
    if (t.includes('sos') || t.includes('emergency') || t.includes('danger') || t.includes('help') || t.includes('உதவி') || t.includes('அவசரம்')) {
      return {
        action: 'sos',
        rawText: text,
        responseEn: 'Emergency SOS command received. Opening confirmation.',
        responseTa: 'அவசர உதவி கட்டளை பெறப்பட்டது. உறுதிப்படுத்தல் திறக்கிறது.',
      };
    }

    // Vision / Camera
    if (t.includes('camera') || t.includes('vision') || t.includes('see') || t.includes('scan') || t.includes('look') || t.includes('பார்வை') || t.includes('கேமரா')) {
      return {
        action: 'vision',
        rawText: text,
        responseEn: 'Opening AI Object Recognition camera.',
        responseTa: 'பொருட்களை கண்டறியும் கேமராவை திறக்கிறது.',
      };
    }

    return null;
  }
}

export const voiceCommandService = new VoiceCommandService();
