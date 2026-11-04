import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Plus,
  Trash2,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';
import {
  EmailConfig,
  SOSEmailRecipient,
  fetchEmailConfig,
  saveEmailConfig,
  sendDailyReportNow,
} from '../../utils/emailApiClient';

interface Props {
  reportUserName?: string;
  onConfigChange?: (config: EmailConfig) => void;
}

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: '7:30 AM IST (2:00 AM UTC)',
  afternoon: '12:30 PM IST (7:00 AM UTC)',
  evening: '6:30 PM IST (1:00 PM UTC)',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function StatusBadge({
  type,
  message,
}: {
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
}) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    loading: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  const icons = {
    success: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    error: <AlertCircle className="w-3.5 h-3.5 shrink-0" />,
    info: <Info className="w-3.5 h-3.5 shrink-0" />,
    loading: <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />,
  };
  return (
    <div
      className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${styles[type]}`}
      role="status"
      aria-live="polite"
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

export const EmailSettingsCard: React.FC<Props> = ({
  reportUserName = 'EchoNav User',
  onConfigChange,
}) => {
  const [config, setConfig] = useState<EmailConfig>({
    sosEmails: [],
    reportEmail: '',
    reportEnabled: false,
    reportTimeSlot: 'morning',
    lastReportSent: null,
    reportUserName,
  });

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    { type: 'success' | 'error' | 'info' | 'loading'; message: string } | null
  >(null);
  const [reportSendStatus, setReportSendStatus] = useState<
    { type: 'success' | 'error' | 'info' | 'loading'; message: string } | null
  >(null);

  // SOS email form state
  const [newSosEmail, setNewSosEmail] = useState('');
  const [newSosName, setNewSosName] = useState('');
  const [sosFormError, setSosFormError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // ── Load from API / localStorage on mount ──────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetchEmailConfig()
      .then((loaded) => {
        setConfig({ ...loaded, reportUserName: loaded.reportUserName || reportUserName });
      })
      .finally(() => setLoading(false));
  }, [reportUserName]);

  // ── Mutation helpers ───────────────────────────────────────────────────────
  function update<K extends keyof EmailConfig>(key: K, value: EmailConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSaveStatus(null);
  }

  const handleAddSosEmail = useCallback(() => {
    setSosFormError('');
    if (!EMAIL_REGEX.test(newSosEmail)) {
      setSosFormError('Please enter a valid email address.');
      return;
    }
    if (config.sosEmails.some((e) => e.email === newSosEmail)) {
      setSosFormError('This email is already in your SOS list.');
      return;
    }
    const entry: SOSEmailRecipient = {
      email: newSosEmail.trim().toLowerCase(),
      name: newSosName.trim() || newSosEmail.trim(),
    };
    update('sosEmails', [...config.sosEmails, entry]);
    setNewSosEmail('');
    setNewSosName('');
  }, [newSosEmail, newSosName, config.sosEmails]);

  const handleRemoveSosEmail = useCallback(
    (email: string) => {
      update('sosEmails', config.sosEmails.filter((e) => e.email !== email));
    },
    [config.sosEmails]
  );

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (config.reportEmail && !EMAIL_REGEX.test(config.reportEmail)) {
      setSaveStatus({ type: 'error', message: 'Report email address is not valid.' });
      return;
    }
    setSaveStatus({ type: 'loading', message: 'Saving…' });
    const result = await saveEmailConfig(config);
    if (result._kvAvailable) {
      setSaveStatus({
        type: 'success',
        message: 'Settings saved to cloud. Daily reports will work even when app is closed.',
      });
    } else if (result.saved === false) {
      setSaveStatus({
        type: 'info',
        message: 'Saved locally only. Set up Vercel KV to enable background daily reports.',
      });
    } else {
      setSaveStatus({ type: 'success', message: 'Settings saved locally.' });
    }
    setIsDirty(false);
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  // ── Manual report send ─────────────────────────────────────────────────────
  const handleSendNow = useCallback(async () => {
    if (!config.reportEmail) {
      setReportSendStatus({ type: 'error', message: 'Set a report email address first.' });
      return;
    }
    setReportSendStatus({ type: 'loading', message: 'Sending report…' });
    const result = await sendDailyReportNow();
    if (result.sent) {
      setReportSendStatus({
        type: 'success',
        message: `Report sent to ${config.reportEmail}. Check your inbox!`,
      });
    } else {
      setReportSendStatus({
        type: 'error',
        message: result.error ?? 'Failed to send report. Check your Resend configuration.',
      });
    }
    setTimeout(() => setReportSendStatus(null), 8000);
  }, [config.reportEmail]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 justify-center text-[#5F7E6C]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-semibold">Loading email settings…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── SECTION 1: SOS Emails ─────────────────────────────────────────── */}
      <div
        className="bg-white border border-[#E5EFE7] rounded-2xl p-5 space-y-4"
        aria-labelledby="sos-email-heading"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 id="sos-email-heading" className="text-sm font-extrabold text-[#0B3821]">
              Emergency Email Contacts
            </h3>
            <p className="text-xs text-[#5F7E6C]">Sent when you trigger SOS</p>
          </div>
        </div>

        {/* Existing SOS emails */}
        {config.sosEmails.length === 0 ? (
          <p className="text-xs text-[#7A9586] italic">No emergency email contacts added yet.</p>
        ) : (
          <ul className="space-y-2" aria-label="Emergency email recipients">
            {config.sosEmails.map((entry) => (
              <li
                key={entry.email}
                className="flex items-center justify-between gap-2 bg-[#F4F9F4] px-3 py-2.5 rounded-xl border border-[#E3EDE4]"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0B3821] truncate">{entry.name}</div>
                  <div className="text-[11px] text-[#5F7E6C] truncate">{entry.email}</div>
                </div>
                <button
                  onClick={() => handleRemoveSosEmail(entry.email)}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
                  aria-label={`Remove ${entry.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add new SOS email form */}
        <div className="space-y-2.5 pt-1 border-t border-[#F0F5F1]">
          <p className="text-[11px] font-bold text-[#5F7E6C] uppercase tracking-wide">
            Add Recipient
          </p>
          <input
            type="text"
            value={newSosName}
            onChange={(e) => setNewSosName(e.target.value)}
            placeholder="Contact name (e.g. Family Guardian)"
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-[#D5E6D8] bg-[#F9FCF9] text-[#0B3821] placeholder:text-[#A8C4AE] focus:outline-none focus:ring-2 focus:ring-[#0D8249]"
            aria-label="SOS contact name"
          />
          <div className="flex gap-2">
            <input
              type="email"
              value={newSosEmail}
              onChange={(e) => setNewSosEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSosEmail()}
              placeholder="Email address"
              className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-[#D5E6D8] bg-[#F9FCF9] text-[#0B3821] placeholder:text-[#A8C4AE] focus:outline-none focus:ring-2 focus:ring-[#0D8249]"
              aria-label="SOS contact email address"
            />
            <button
              onClick={handleAddSosEmail}
              className="min-w-[44px] min-h-[44px] px-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-[#0D8249]"
              aria-label="Add SOS email contact"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {sosFormError && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {sosFormError}
            </p>
          )}
        </div>
      </div>

      {/* ── SECTION 2: Daily Reports ──────────────────────────────────────── */}
      <div
        className="bg-white border border-[#E5EFE7] rounded-2xl p-5 space-y-4"
        aria-labelledby="daily-report-heading"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF6ED] text-[#0D8249] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 id="daily-report-heading" className="text-sm font-extrabold text-[#0B3821]">
                Automatic Daily Reports
              </h3>
              <p className="text-xs text-[#5F7E6C]">Email sent even when the app is closed</p>
            </div>
          </div>
          <button
            onClick={() => update('reportEnabled', !config.reportEnabled)}
            className="focus-visible:ring-2 focus-visible:ring-[#0D8249] rounded-xl"
            aria-label={config.reportEnabled ? 'Disable daily reports' : 'Enable daily reports'}
            aria-pressed={config.reportEnabled}
          >
            {config.reportEnabled ? (
              <ToggleRight className="w-8 h-8 text-[#16A34A]" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-[#C5D9C8]" />
            )}
          </button>
        </div>

        {config.reportEnabled && (
          <div className="space-y-3">
            {/* Report email */}
            <div>
              <label
                htmlFor="report-email"
                className="text-[11px] font-bold text-[#5F7E6C] uppercase tracking-wide block mb-1.5"
              >
                Report Recipient Email
              </label>
              <input
                id="report-email"
                type="email"
                value={config.reportEmail}
                onChange={(e) => update('reportEmail', e.target.value)}
                placeholder="your@email.com"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-[#D5E6D8] bg-[#F9FCF9] text-[#0B3821] placeholder:text-[#A8C4AE] focus:outline-none focus:ring-2 focus:ring-[#0D8249]"
                aria-describedby="report-email-hint"
              />
              <p id="report-email-hint" className="text-[11px] text-[#7A9586] mt-1">
                Detection summary + obstacle stats sent here daily.
              </p>
            </div>

            {/* Delivery time slot */}
            <div>
              <p className="text-[11px] font-bold text-[#5F7E6C] uppercase tracking-wide mb-1.5">
                Preferred Delivery Time
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['morning', 'afternoon', 'evening'] as const).map((slot) => (
                  <button
                    key={slot}
                    onClick={() => update('reportTimeSlot', slot)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all focus-visible:ring-2 focus-visible:ring-[#0D8249] ${
                      config.reportTimeSlot === slot
                        ? 'bg-[#0B3821] text-white border-[#0B3821]'
                        : 'bg-white text-[#0B3821] border-[#D5E6D8] hover:border-[#0B3821]'
                    }`}
                    aria-pressed={config.reportTimeSlot === slot}
                  >
                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#7A9586] mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 shrink-0" />
                Scheduled at: <strong className="text-[#0B3821]">{TIME_SLOT_LABELS[config.reportTimeSlot]}</strong>
              </p>
            </div>

            {/* Send now */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSendNow}
                disabled={!config.reportEmail}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EAF6ED] hover:bg-[#D5EED8] text-[#0A6035] text-xs font-bold border border-[#CDE7D2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#0D8249]"
                aria-label="Send daily report now"
              >
                <Send className="w-3.5 h-3.5" />
                Send Report Now
              </button>
              {config.lastReportSent && (
                <span className="text-[11px] text-[#7A9586]">
                  Last sent: {config.lastReportSent}
                </span>
              )}
            </div>

            {reportSendStatus && <StatusBadge {...reportSendStatus} />}
          </div>
        )}

        {/* KV info notice */}
        <div className="flex items-start gap-2 bg-[#F8FAF8] rounded-xl p-3 border border-[#EEF4EF]">
          <Info className="w-3.5 h-3.5 text-[#5F7E6C] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#5F7E6C] leading-relaxed">
            Background reports require <strong>Vercel KV</strong> and <strong>RESEND_API_KEY</strong>
            {' '}environment variables. See the setup guide in <code className="bg-[#EEF4EF] px-1 rounded">README.md</code>.
          </p>
        </div>
      </div>

      {/* ── Save Button ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#0D8249] active:scale-[0.98]"
          aria-label="Save email settings"
        >
          <Save className="w-4 h-4" />
          Save Email Settings
        </button>
        {saveStatus && <StatusBadge {...saveStatus} />}
      </div>
    </div>
  );
};
