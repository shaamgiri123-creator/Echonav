import { useState, useEffect } from 'react';
import { speechService } from '../utils/speechAlerts';
import { VoiceLanguage } from '../types/echonav';

export function useNetworkStatus(language: VoiceLanguage = 'en') {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const msgEn = 'Network connection restored. All local telemetry synchronized.';
      const msgTa = 'இணைய இணைப்பு மீண்டும் கிடைத்தது. உள்ளூர் தரவு ஒத்திசைக்கப்பட்டது.';
      speechService.speakCustom(msgEn, msgTa, language);
    };

    const handleOffline = () => {
      setIsOnline(false);
      const msgEn = 'Internet disconnected. EchoNav is operating in offline mode. Local storage active.';
      const msgTa = 'இணைய இணைப்பு துண்டிக்கப்பட்டது. எக்கோநேவ் ஆஃப்லைனில் இயங்குகிறது.';
      speechService.speakCustom(msgEn, msgTa, language);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  return { isOnline };
}
