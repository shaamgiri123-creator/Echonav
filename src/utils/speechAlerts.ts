import { DangerLevel } from '../types/echonav';

class SpeechAlertService {
  private lastSpokenLevel: DangerLevel | null = null;
  private lastSpokenTime: number = 0;
  private cooldownMs = 3000; // minimum 3 seconds between repeated speech for same level

  speakDangerAlert(level: DangerLevel, enabled: boolean) {
    if (!enabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return; // Graceful fallback if unsupported
    }

    const now = Date.now();
    // Prevent repeating the same announcement continuously
    if (this.lastSpokenLevel === level && now - this.lastSpokenTime < this.cooldownMs) {
      return;
    }

    let phrase = '';
    if (level === 'High') {
      phrase = 'Warning! Obstacle very close.';
    } else if (level === 'Medium') {
      phrase = 'Obstacle detected ahead.';
    } else {
      phrase = 'Path is clear.';
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 1.05;
      utterance.pitch = level === 'High' ? 1.15 : 1.0;
      utterance.volume = 0.9;

      this.lastSpokenLevel = level;
      this.lastSpokenTime = now;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Gracefully handle browser speech restrictions
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
