import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, ShieldAlert, CheckCircle2, Mail, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { EmergencyContact, GeoLocationData, VoiceLanguage } from '../../types/echonav';
import { geoService } from '../../utils/geolocationService';
import { speechService } from '../../utils/speechAlerts';
import { fetchEmailConfig, sendSOSEmail, SOSEmailRecipient } from '../../utils/emailApiClient';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  language: VoiceLanguage;
  onEmergencyDispatched: (location: GeoLocationData, contact: EmergencyContact) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  contacts,
  language,
  onEmergencyDispatched,
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [location, setLocation] = useState<GeoLocationData | null>(null);
  const [status, setStatus] = useState<'counting' | 'dispatched' | 'cancelled'>('counting');
  const [emailRecipients, setEmailRecipients] = useState<SOSEmailRecipient[]>([]);
  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'sending' | 'success' | 'partial' | 'error' | 'no_emails' | 'offline'
  >('idle');
  const [emailStatusMsg, setEmailStatusMsg] = useState<string>('');

  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const idempotencyKeyRef = useRef<string>('');
  const isDispatchedRef = useRef<boolean>(false);

  // Play synthetic tick sound during countdown
  const playTickSound = (freq = 880) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio playback suppressed
    }
  };

  useEffect(() => {
    if (!isOpen) {
      clearInterval(timerRef.current);
      setCountdown(5);
      setStatus('counting');
      setEmailStatus('idle');
      setEmailStatusMsg('');
      isDispatchedRef.current = false;
      return;
    }

    // Set idempotency key for this SOS session to prevent duplicate dispatches
    idempotencyKeyRef.current = `sos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    isDispatchedRef.current = false;
    setEmailStatus('idle');
    setEmailStatusMsg('');

    // Fetch configured emergency email recipients
    fetchEmailConfig().then((cfg) => {
      setEmailRecipients(cfg.sosEmails || []);
    });

    // Announce emergency initiation
    const announceMsg =
      language === 'ta'
        ? 'அவசர உதவி தொடங்கப்பட்டது. ரத்து செய்ய பொத்தானை அழுத்தவும்.'
        : 'Emergency SOS initiated. Alert will send in 5 seconds. Tap cancel to abort.';
    speechService.speakCustom(
      'Emergency SOS initiated. Alert will send in 5 seconds. Tap cancel to abort.',
      announceMsg,
      language
    );

    // Fetch live coordinates
    geoService.getCurrentLocation().then((loc) => {
      setLocation(loc);
    });

    // Start 5-second countdown
    setCountdown(5);
    setStatus('counting');

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTriggerDispatch();
          return 0;
        }
        playTickSound(prev % 2 === 0 ? 980 : 840);
        return prev - 1;
      });
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, language]);

  if (!isOpen) return null;

  const defaultContact: EmergencyContact = contacts[0] || {
    id: 'default',
    name: 'Primary Emergency Caregiver',
    phone: '+919876543210',
    relation: 'Guardian',
  };

  const dispatchSOSEmail = (loc: GeoLocationData, recipients: SOSEmailRecipient[]) => {
    if (!navigator.onLine) {
      setEmailStatus('offline');
      setEmailStatusMsg('Offline: No internet connection. Emergency email could not be sent.');
      return;
    }

    if (recipients.length === 0) {
      setEmailStatus('no_emails');
      setEmailStatusMsg('No emergency email addresses configured. You can add them in Settings.');
      return;
    }

    setEmailStatus('sending');
    setEmailStatusMsg(`Sending emergency email notification to ${recipients.length} contact(s)...`);

    sendSOSEmail({
      recipientEmails: recipients,
      userName: 'EchoNav User',
      location: loc,
      triggeredAt: new Date().toISOString(),
      idempotencyKey: idempotencyKeyRef.current,
    })
      .then((res) => {
        if (res.deduplicated) {
          setEmailStatus('success');
          setEmailStatusMsg('Emergency email alert already sent.');
        } else if (res.sent > 0 && res.failed === 0) {
          setEmailStatus('success');
          setEmailStatusMsg(`Emergency email successfully delivered to ${res.sent} recipient(s).`);
        } else if (res.sent > 0 && res.failed > 0) {
          setEmailStatus('partial');
          setEmailStatusMsg(`Delivered to ${res.sent} recipient(s), ${res.failed} failed.`);
        } else {
          setEmailStatus('error');
          setEmailStatusMsg(
            res._error || res.errors?.[0] || 'Email delivery failed. Please check Resend API key.'
          );
        }
      })
      .catch((err) => {
        setEmailStatus('error');
        setEmailStatusMsg(err.message || 'Network error occurred while sending emergency email.');
      });
  };

  const handleTriggerDispatch = () => {
    if (isDispatchedRef.current) return;
    isDispatchedRef.current = true;
    clearInterval(timerRef.current);

    setStatus('dispatched');
    const loc = location || {
      latitude: 13.0827,
      longitude: 80.2707,
      accuracy: 20,
      mapsUrl: 'https://maps.google.com/?q=13.0827,80.2707',
      timestamp: Date.now(),
    };

    // Notify user via Speech
    const confirmMsg =
      language === 'ta'
        ? 'அவசர உதவி செய்தி அனுப்பப்பட்டது. இருப்பிடம் பகிரப்பட்டது.'
        : 'Emergency SOS broadcast confirmed. Your GPS location has been shared.';
    speechService.speakCustom(
      'Emergency SOS broadcast confirmed. Your GPS location has been shared.',
      confirmMsg,
      language
    );

    onEmergencyDispatched(loc, defaultContact);

    // Trigger REAL Email Integration
    dispatchSOSEmail(loc, emailRecipients);

    // Prepare direct SMS / WhatsApp intent
    const msg = geoService.generateEmergencyMessage(defaultContact, loc);
    const smsUrl = geoService.getSMSLink(defaultContact.phone, msg);

    try {
      window.open(smsUrl, '_blank');
    } catch {
      // Window popup block handling
    }
  };

  const handleRetryEmail = () => {
    const loc = location || {
      latitude: 13.0827,
      longitude: 80.2707,
      accuracy: 20,
      mapsUrl: 'https://maps.google.com/?q=13.0827,80.2707',
      timestamp: Date.now(),
    };
    idempotencyKeyRef.current = `retry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    dispatchSOSEmail(loc, emailRecipients);
  };

  const handleCancel = () => {
    clearInterval(timerRef.current);
    setStatus('cancelled');
    const cancelMsg =
      language === 'ta' ? 'அவசர உதவி ரத்து செய்யப்பட்டது.' : 'Emergency SOS cancelled.';
    speechService.speakCustom('Emergency SOS cancelled.', cancelMsg, language);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
    >
      <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl border-4 border-red-500 flex flex-col items-center text-center relative select-none animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Top Header Warning */}
        <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center text-red-600 mb-3 animate-pulse shrink-0">
          <ShieldAlert className="w-9 h-9 stroke-[2.2]" />
        </div>

        <h2 id="sos-title" className="text-2xl font-black text-[#991B1B] tracking-tight leading-tight">
          EMERGENCY SOS ALERT
        </h2>
        <p className="text-xs font-bold text-red-700 mt-1">
          {language === 'ta'
            ? 'அவசர உதவி உறுதிப்படுத்தல்'
            : 'User Safety Safeguard & Emergency Broadcast'}
        </p>

        {status === 'counting' && (
          <>
            {/* Countdown Display Ring */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-red-200 flex items-center justify-center bg-red-50">
                <span className="text-4xl font-black text-red-600 animate-bounce">
                  {countdown}s
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-neutral-800 leading-relaxed max-w-[280px]">
              {language === 'ta'
                ? 'அவசர உதவி அறிவிப்பு 5 வினாடிகளில் அனுப்பப்படும். தவறுதலாக அழுத்தியிருந்தால் கீழே ரத்து செய்யவும்.'
                : 'Emergency broadcast will transmit automatically in 5 seconds. Tap CANCEL below to abort.'}
            </p>

            {/* Target Contact Info: Phone */}
            <div className="w-full bg-red-50/70 border border-red-200 rounded-2xl p-3 my-2 text-left">
              <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>SMS / Phone Contact:</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-[#0B3821]">
                    {defaultContact.name} ({defaultContact.relation})
                  </div>
                  <div className="text-xs font-bold text-neutral-600">
                    {defaultContact.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Target Contact Info: Email */}
            <div className="w-full bg-[#F4F9F4] border border-[#D5EAD8] rounded-2xl p-3 my-2 text-left">
              <div className="text-[11px] font-bold text-[#0D8249] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Emergency Email Notification:</span>
              </div>
              {emailRecipients.length > 0 ? (
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#0B3821]">
                    {emailRecipients.map((r) => r.name || r.email).join(', ')}
                  </div>
                  <div className="text-[11px] text-[#5F7E6C]">
                    {emailRecipients.map((r) => r.email).join(' · ')}
                  </div>
                </div>
              ) : (
                <div className="text-xs font-semibold text-[#7A9586] italic">
                  No emergency email configured (Add in Settings → Email)
                </div>
              )}
            </div>

            {/* GPS Preview */}
            <div className="w-full flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-[#F4F9F4] p-2.5 rounded-xl border border-[#D5EAD8] mb-4 text-left">
              <MapPin className="w-4 h-4 text-[#0D8249] shrink-0" />
              <span className="truncate">
                {location
                  ? `GPS: ${location.latitude}, ${location.longitude} (Acc: ±${location.accuracy}m)`
                  : 'Retrieving precise satellite coordinates...'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={handleCancel}
                className="min-h-[48px] py-3 px-4 rounded-2xl text-xs font-black text-neutral-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors focus-visible:ring-4 focus-visible:ring-slate-500"
              >
                CANCEL / ABORT
              </button>

              <button
                onClick={handleTriggerDispatch}
                className="min-h-[48px] py-3 px-4 rounded-2xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-lg transition-colors focus-visible:ring-4 focus-visible:ring-red-600 animate-pulse"
              >
                SEND NOW
              </button>
            </div>
          </>
        )}

        {status === 'dispatched' && (
          <div className="my-4 space-y-3.5 w-full">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0D8249] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 stroke-[2.4]" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#0B3821]">
                SOS Alert Broadcasted!
              </h3>
              <p className="text-xs text-[#5F7E6C] mt-0.5">
                Distress signal and coordinates have been transmitted.
              </p>
            </div>

            {/* SMS Status */}
            <div className="w-full bg-[#F4F9F4] border border-[#D5EAD8] rounded-2xl p-3 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B3821]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>SMS Alert Link Dispatched:</span>
              </div>
              <div className="text-[11px] text-[#5F7E6C] mt-1 pl-6">
                Direct SMS link created for {defaultContact.name} ({defaultContact.phone}).
              </div>
            </div>

            {/* Real Email Dispatch Status */}
            <div
              className={`w-full border rounded-2xl p-3 text-left ${
                emailStatus === 'success'
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : emailStatus === 'error' || emailStatus === 'offline'
                  ? 'bg-red-50/80 border-red-200'
                  : emailStatus === 'partial'
                  ? 'bg-amber-50/80 border-amber-200'
                  : emailStatus === 'sending'
                  ? 'bg-blue-50/80 border-blue-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0B3821] shrink-0" />
                  <span className="text-xs font-extrabold text-[#0B3821]">
                    Emergency Email Status:
                  </span>
                </div>
                {emailStatus === 'sending' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </span>
                )}
                {emailStatus === 'success' && (
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ✓ Delivered
                  </span>
                )}
                {emailStatus === 'partial' && (
                  <span className="text-[11px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Partial
                  </span>
                )}
                {(emailStatus === 'error' || emailStatus === 'offline') && (
                  <span className="text-[11px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    Failed
                  </span>
                )}
              </div>

              <div className="text-xs font-medium text-neutral-700 mt-2 pl-6 leading-relaxed">
                {emailStatusMsg || (emailRecipients.length === 0 ? 'No emergency email addresses configured.' : 'Processing email delivery...')}
              </div>

              {/* Retry button on error or offline */}
              {(emailStatus === 'error' || emailStatus === 'offline') && emailRecipients.length > 0 && (
                <div className="mt-2 pl-6">
                  <button
                    onClick={handleRetryEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Email Dispatch</span>
                  </button>
                </div>
              )}
            </div>

            {/* Clickable Google Maps Location Link */}
            {location && location.mapsUrl && (
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-[#D5EAD8] hover:bg-[#F4F9F4] transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-[#0D8249] shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#0B3821]">
                      Clickable GPS Map Location
                    </div>
                    <div className="text-[11px] text-[#5F7E6C] truncate">
                      {location.latitude}, {location.longitude}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#0D8249] shrink-0" />
              </a>
            )}

            <button
              onClick={onClose}
              className="w-full min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#0B3821] text-white text-xs font-bold hover:bg-[#15803D] transition-colors shadow-sm mt-2"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

