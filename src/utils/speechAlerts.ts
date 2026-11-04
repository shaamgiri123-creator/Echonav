import { DangerLevel, VoiceLanguage } from '../types/echonav';

class SpeechAlertService {
  private lastSpokenLevel: DangerLevel | null = null;
  private lastSpokenTime: number = 0;
  private cooldownMs = 3000; // minimum 3 seconds between repeated speech for same level
  private language: VoiceLanguage = 'en';

  setLanguage(lang: VoiceLanguage) {
    this.language = lang;
  }

  getLanguage(): VoiceLanguage {
    return this.language;
  }

  speakDangerAlert(level: DangerLevel, enabled: boolean, langOverride?: VoiceLanguage) {
    if (!enabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return; // Graceful fallback if unsupported
    }

    const currentLang = langOverride || this.language;
    const now = Date.now();
    // Prevent repeating the same announcement continuously
    if (this.lastSpokenLevel === level && now - this.lastSpokenTime < this.cooldownMs) {
      return;
    }

    let phrase = '';
    if (currentLang === 'ta') {
      if (level === 'High') {
        phrase = 'எச்சரிக்கை! தடை மிக அருகில் உள்ளது.';
      } else if (level === 'Medium') {
        phrase = 'முன்னால் தடை கண்டறியப்பட்டது.';
      } else {
        phrase = 'பாதை தெளிவாக உள்ளது.';
      }
    } else {
      if (level === 'High') {
        phrase = 'Warning! Obstacle very close.';
      } else if (level === 'Medium') {
        phrase = 'Obstacle detected ahead.';
      } else {
        phrase = 'Path is clear.';
      }
    }

    try {
      window.speechSynthesis.cancel(); // Stop pending speech
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 1.0;
      utterance.pitch = level === 'High' ? 1.15 : 1.0;
      utterance.volume = 0.95;
      utterance.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';

      // Pick matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (currentLang === 'ta') {
        const taVoice = voices.find((v) => v.lang.startsWith('ta'));
        if (taVoice) utterance.voice = taVoice;
      }

      this.lastSpokenLevel = level;
      this.lastSpokenTime = now;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Gracefully handle browser speech restrictions
    }
  }

  speakCustom(textEn: string, textTa?: string, langOverride?: VoiceLanguage) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const currentLang = langOverride || this.language;
    const text = (currentLang === 'ta' && textTa) ? textTa : textEn;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';

      const voices = window.speechSynthesis.getVoices();
      if (currentLang === 'ta') {
        const taVoice = voices.find((v) => v.lang.startsWith('ta'));
        if (taVoice) utterance.voice = taVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }

  reset() {
    this.lastSpokenLevel = null;
    this.lastSpokenTime = 0;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }
}

export const speechService = new SpeechAlertService();
