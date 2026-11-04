import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, AlertCircle } from 'lucide-react';
import { VoiceLanguage, DangerLevel } from '../../types/echonav';
import { voiceCommandService, CommandMatch } from '../../utils/voiceCommands';import { speechService } from '../../utils/speechAlerts';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: VoiceLanguage;
  onLanguageChange: (lang: VoiceLanguage) => void;
  currentDistance: number;
  dangerLevel: DangerLevel;
  batteryPercentage: number;
  onNavigateTab: (tab: 'home' | 'history' | 'settings' | 'about') => void;
  onTriggerSOS: () => void;
  onOpenVision: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  currentDistance,
  dangerLevel,
  batteryPercentage,
  onNavigateTab,
  onTriggerSOS,
  onOpenVision,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const micBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      voiceCommandService.stopListening();
      setIsListening(false);
      return;
    }

    voiceCommandService.setLanguage(language);
    setStatusText(
      language === 'ta'
        ? 'மைக் பட்டனைத் தட்டி பேசவும்...'
        : 'Tap microphone and speak a command...'
    );
    setErrorMessage('');

    // Focus mic button on open
    setTimeout(() => {
      micBtnRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      voiceCommandService.stopListening();
    };
  }, [isOpen, language, onClose]);

  if (!isOpen) return null;

  const handleToggleListening = () => {
    if (isListening) {
      voiceCommandService.stopListening();
      setIsListening(false);
      setStatusText(
        language === 'ta' ? 'கேட்டல் நிறுத்தப்பட்டது.' : 'Listening stopped.'
      );
      return;
    }

    setErrorMessage('');

    voiceCommandService.startListening(
      (match) => {
        setStatusText(language === 'ta' ? match.responseTa : match.responseEn);

        // Execute action
        executeCommand(match);
      },
      (listening) => {
        setIsListening(listening);
        if (listening) {
          setStatusText(
            language === 'ta' ? 'கேட்கிறது... பேசவும்' : 'Listening... Speak now'
          );
        }
      },
      (err) => {
        setErrorMessage(err);
        setStatusText(
          language === 'ta'
            ? 'மீண்டும் முயற்சிக்கவும்.'
            : 'Could not recognize command. Please try again.'
        );
      }
    );
  };

  const executeCommand = (match: CommandMatch) => {
    // Speak spoken feedback
    speechService.speakCustom(match.responseEn, match.responseTa, language);

    setTimeout(() => {
      switch (match.action) {
        case 'distance': {
          const distMsg =
            language === 'ta'
              ? `தடை தூரம் ${currentDistance} சென்டிமீட்டர்.`
              : `Current obstacle distance is ${currentDistance} centimeters.`;
          speechService.speakCustom(
            `Current obstacle distance is ${currentDistance} centimeters.`,
            distMsg,
            language
          );
          break;
        }
        case 'status': {
          const statusMsg =
            dangerLevel === 'High'
              ? language === 'ta'
                ? 'அதிக ஆபத்து! தடை மிக அருகில் உள்ளது.'
                : 'High danger! Obstacle very close.'
              : dangerLevel === 'Medium'
              ? language === 'ta'
                ? 'எச்சரிக்கை! முன்னால் தடை உள்ளது.'
                : 'Caution zone! Obstacle detected ahead.'
              : language === 'ta'
              ? 'பாதுகாப்பானது! பாதை தெளிவாக உள்ளது.'
              : 'Safe path. No immediate obstacle.';
          speechService.speakCustom(statusMsg, statusMsg, language);
          break;
        }
        case 'battery': {
          const batMsg =
            language === 'ta'
              ? `பேட்டரி அளவு ${batteryPercentage} சதவீதம்.`
              : `Battery level is ${batteryPercentage} percent.`;
          speechService.speakCustom(
            `Battery level is ${batteryPercentage} percent.`,
            batMsg,
            language
          );
          break;
        }
        case 'home':
          onNavigateTab('home');
          onClose();
          break;
        case 'history':
          onNavigateTab('history');
          onClose();
          break;
        case 'settings':
          onNavigateTab('settings');
          onClose();
          break;
        case 'about':
          onNavigateTab('about');
          onClose();
          break;
        case 'sos':
          onClose();
          onTriggerSOS();
          break;
        case 'vision':
          onClose();
          onOpenVision();
          break;
      }
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-assistant-title"
    >
      <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl border-2 border-[#E7EFE8] flex flex-col items-center text-center relative select-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl text-[#0B3821] hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#0D8249]"
          aria-label="Close voice assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#EAF6ED] text-[#0D8249] flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <h2 id="voice-assistant-title" className="text-xl font-extrabold text-[#0B3821] tracking-tight">
            EchoNav Voice Assistant
          </h2>
        </div>
        <p className="text-xs text-[#5F7E6C] mb-4">
          Bilingual Hands-Free Navigation & Assistance
        </p>

        {/* Language Switcher Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F9F4] rounded-2xl border border-[#D8EADB] mb-6">
          <button
            onClick={() => {
              onLanguageChange('en');
              voiceCommandService.setLanguage('en');
            }}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              language === 'en'
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'text-[#0B3821] hover:bg-white/80'
            }`}
          >
            English
          </button>
          <button
            onClick={() => {
              onLanguageChange('ta');
              voiceCommandService.setLanguage('ta');
            }}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              language === 'ta'
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'text-[#0B3821] hover:bg-white/80'
            }`}
          >
            தமிழ் (Tamil)
          </button>
        </div>

        {/* Main Central Push-to-Talk Mic Circle */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Animated Wave Rings when listening */}
          {isListening && (
            <>
              <div className="absolute w-32 h-32 rounded-full bg-emerald-300/40 animate-ping pointer-events-none" />
              <div className="absolute w-28 h-28 rounded-full bg-emerald-400/30 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            ref={micBtnRef}
            onClick={handleToggleListening}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl focus-visible:ring-4 focus-visible:ring-[#0D8249] ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700 scale-105'
                : 'bg-[#16A34A] text-white hover:bg-[#15803D]'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice command listening'}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-bounce" />
            ) : (
              <Mic className="w-8 h-8 stroke-[2.2]" />
            )}
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
              {isListening ? 'Listening' : 'Tap to Speak'}
            </span>
          </button>
        </div>

        {/* Live Status / Transcript Output */}
        <div
          role="status"
          aria-live="polite"
          className="mt-5 w-full min-h-[54px] p-3 rounded-2xl bg-[#F8FAF8] border border-[#E7EFE8] flex items-center justify-center text-center text-xs font-bold text-[#0B3821]"
        >
          {errorMessage ? (
            <span className="text-red-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </span>
          ) : (
            <span className={isListening ? 'text-[#0D8249] font-extrabold animate-pulse' : 'text-[#0B3821]'}>
              {statusText}
            </span>
          )}
        </div>

        {/* Command Cheat-Sheet Quick Guide */}
        <div className="mt-4 w-full text-left pt-3 border-t border-[#F0F5F1]">
          <span className="text-[10px] font-extrabold uppercase text-[#7A9586] tracking-wider block mb-2 text-center">
            {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட கட்டளைகள்' : 'Recommended Voice Commands'}
          </span>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
            <div className="p-2 rounded-xl bg-[#F3F8F2] text-[#0B3821] border border-[#E0ECE2]">
              💬 &quot;Distance&quot; / &quot;தூரம்&quot;
            </div>
            <div className="p-2 rounded-xl bg-[#F3F8F2] text-[#0B3821] border border-[#E0ECE2]">
              💬 &quot;Status&quot; / &quot;நிலைமை&quot;
            </div>
            <div className="p-2 rounded-xl bg-[#F3F8F2] text-[#0B3821] border border-[#E0ECE2]">
              💬 &quot;Battery&quot; / &quot;பேட்டரி&quot;
            </div>
            <div className="p-2 rounded-xl bg-[#F3F8F2] text-[#0B3821] border border-[#E0ECE2]">
              💬 &quot;Vision&quot; / &quot;பார்வை&quot;
            </div>
            <div className="col-span-2 p-2 rounded-xl bg-red-50 text-red-800 border border-red-200 text-center font-extrabold">
              🚨 &quot;Emergency SOS&quot; / &quot;உதவி&quot;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
