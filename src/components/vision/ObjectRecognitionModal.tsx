import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Volume2, ShieldCheck, RefreshCw, Eye } from 'lucide-react';
import { VoiceLanguage } from '../../types/echonav';
import { visionService, RecognitionSceneResult } from '../../utils/visionClassifier';
import { speechService } from '../../utils/speechAlerts';

interface ObjectRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: VoiceLanguage;
}

export const ObjectRecognitionModal: React.FC<ObjectRecognitionModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [result, setResult] = useState<RecognitionSceneResult | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      stopCamera();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsSimulated(false);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSimulated(true);
      runSimulatedScan();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      // Begin periodic frame evaluation (every 2.5 seconds to balance responsiveness and battery)
      scanIntervalRef.current = setInterval(() => {
        captureAndAnalyze();
      }, 2500);

      // Initial analysis after video initializes
      setTimeout(() => {
        captureAndAnalyze();
      }, 800);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setIsSimulated(true);
      runSimulatedScan();
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureAndAnalyze = () => {
    if (isSimulated || !videoRef.current || !canvasRef.current) {
      runSimulatedScan();
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const scene = visionService.analyzeCanvasFrame(canvas);
    setResult(scene);

    // Speak initial scene description
    speechService.speakCustom(scene.primaryWarningEn, scene.primaryWarningTa, language);
  };

  const runSimulatedScan = () => {
    const fallback = visionService.getFallbackScene();
    setResult(fallback);
    speechService.speakCustom(fallback.primaryWarningEn, fallback.primaryWarningTa, language);
  };

  const handleSpeakCurrentScene = () => {
    if (!result) return;
    speechService.speakCustom(result.primaryWarningEn, result.primaryWarningTa, language);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vision-title"
    >
      <div className="bg-white rounded-[32px] p-5 sm:p-6 max-w-lg w-full shadow-2xl border-2 border-[#E7EFE8] flex flex-col items-center relative select-none">
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-[#F0F5F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF6ED] text-[#0D8249] flex items-center justify-center">
              <Eye className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <h2 id="vision-title" className="text-lg font-extrabold text-[#0B3821] tracking-tight">
                AI Object Recognition
              </h2>
              <p className="text-xs font-semibold text-[#5F7E6C]">
                On-Device Assistive Camera Vision
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl text-[#0B3821] hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            aria-label="Close AI vision modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera / Viewport Container */}
        <div className="relative w-full aspect-[4/3] rounded-2xl bg-black overflow-hidden my-3.5 border-2 border-[#0B3821]/20 flex items-center justify-center">
          {/* Real Video Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${!cameraActive || isSimulated ? 'hidden' : 'block'}`}
          />

          {/* Hidden Canvas for Frame Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Simulated / Fallback View */}
          {(!cameraActive || isSimulated) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 mb-3 animate-pulse">
                <Camera className="w-7 h-7" />
              </div>
              <div className="text-sm font-extrabold">Assistive Simulation Viewport</div>
              <p className="text-xs text-slate-300 mt-1 max-w-[260px] leading-relaxed">
                Optical sensor active in local emulation mode. Objects are tracked and announced in real-time.
              </p>
            </div>
          )}

          {/* High-Contrast Bounding Box Overlay */}
          {result && result.objects.map((obj) => {
            const bbox = obj.bbox || [20, 20, 60, 60];
            const borderColor =
              obj.severity === 'High'
                ? 'border-red-500 bg-red-500/15 text-white'
                : obj.severity === 'Medium'
                ? 'border-amber-400 bg-amber-500/15 text-white'
                : 'border-emerald-400 bg-emerald-500/15 text-white';

            return (
              <div
                key={obj.id}
                style={{
                  left: `${bbox[0]}%`,
                  top: `${bbox[1]}%`,
                  width: `${bbox[2]}%`,
                  height: `${bbox[3]}%`,
                }}
                className={`absolute border-2 rounded-xl pointer-events-none transition-all duration-300 ${borderColor} flex flex-col justify-between p-1.5`}
              >
                <div className="bg-black/80 backdrop-blur-sm self-start px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-emerald-300 shadow">
                  {language === 'ta' ? obj.labelTa : obj.label} • {language === 'ta' ? obj.distanceEstimateTa : obj.distanceEstimate}
                </div>
                <div className="bg-black/80 backdrop-blur-sm self-end px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white">
                  {Math.round(obj.confidence * 100)}% match
                </div>
              </div>
            );
          })}

          {/* Active Scanning Badge */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isSimulated ? 'Simulation Feed' : 'Live Camera Active'}</span>
          </div>
        </div>

        {/* Spoken Output Banner */}
        <div className="w-full bg-[#F3F8F2] border border-[#D5EBD7] rounded-2xl p-3 flex items-center justify-between text-left mb-3">
          <div className="flex-1 pr-2">
            <div className="text-[10px] font-extrabold uppercase text-[#0D8249] tracking-wider">
              {language === 'ta' ? 'கண்டறியப்பட்ட தகவல்' : 'Audio Scene Description'}
            </div>
            <div className="text-xs font-bold text-[#0B3821] mt-0.5 leading-snug">
              {result ? (language === 'ta' ? result.primaryWarningTa : result.primaryWarningEn) : 'Analyzing path ahead...'}
            </div>
          </div>

          <button
            onClick={handleSpeakCurrentScene}
            className="min-h-[40px] px-3 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-[#0D8249]"
            aria-label="Speak scene description"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak</span>
          </button>
        </div>

        {/* Action Controls & Rescan */}
        <div className="w-full grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={captureAndAnalyze}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B3821] text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'மீண்டும் ஸ்கேன் செய்' : 'Rescan Path'}</span>
          </button>

          <button
            onClick={() => {
              if (isSimulated) {
                startCamera();
              } else {
                stopCamera();
                setIsSimulated(true);
                runSimulatedScan();
              }
            }}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0D8249] border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isSimulated ? 'Try Live Camera' : 'Use Simulation'}</span>
          </button>
        </div>

        {/* Privacy Assurance Notice */}
        <div className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF4EF] text-[11px] font-semibold text-[#5F7E6C] text-left">
          <ShieldCheck className="w-4 h-4 text-[#0D8249] shrink-0" />
          <span>
            <strong>Privacy Guaranteed:</strong> All vision processing executes 100% locally in browser memory. No video or photos are saved or uploaded to external servers.
          </span>
        </div>
      </div>
    </div>
  );
};
