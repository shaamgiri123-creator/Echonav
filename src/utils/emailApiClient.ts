/**
 * emailApiClient.ts
 *
 * Typed frontend client for EchoNav email API routes.
 * All calls fail gracefully — the app continues working even without KV/Resend.
 */

export interface SOSEmailRecipient {
  email: string;
  name: string;
}

export interface SOSEmailPayload {
  recipientEmails: SOSEmailRecipient[];
  userName?: string;
  location: {
    latitude?: number;
    longitude?: number;
    mapsUrl?: string;
    accuracy?: number;
    timestamp: number;
  } | null;
  triggeredAt: string;
  idempotencyKey: string;
}

export interface SOSEmailResult {
  sent: number;
  failed: number;
  total: number;
  errors?: string[];
  deduplicated?: boolean;
}

export interface EmailConfig {
  sosEmails: SOSEmailRecipient[];
  reportEmail: string;
  reportEnabled: boolean;
  reportTimeSlot: 'morning' | 'afternoon' | 'evening';
  lastReportSent: string | null;
  reportUserName: string;
  _kvAvailable?: boolean;
}

export interface DailyDetectionSummary {
  date: string;
  totalDetections: number;
  highCount: number;
  mediumCount: number;
  safeCount: number;
  avgDistance: number | null;
  closestDistance: number | null;
  sosCount: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const API_BASE = '/api';

/** Returns 'YYYY-MM-DD' in IST */
export function getISTDateString(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error ?? `HTTP ${r.status}`);
  }
  return r.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`);
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error ?? `HTTP ${r.status}`);
  }
  return r.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Sends SOS emergency emails. Returns result with sent/failed counts.
 * Never throws — returns an error object instead.
 */
export async function sendSOSEmail(payload: SOSEmailPayload): Promise<SOSEmailResult & { _error?: string }> {
  try {
    return await post<SOSEmailResult>('/send-sos-email', payload);
  } catch (err: any) {
    return { sent: 0, failed: payload.recipientEmails.length, total: payload.recipientEmails.length, _error: err.message };
  }
}

/**
 * Fetches saved email config from KV.
 * Falls back to localStorage copy if KV is unavailable.
 */
export async function fetchEmailConfig(): Promise<EmailConfig> {
  try {
    return await get<EmailConfig>('/email-config');
  } catch {
    // Fall back to localStorage
    try {
      const saved = localStorage.getItem('echonav_email_config');
      if (saved) return JSON.parse(saved) as EmailConfig;
    } catch { /* ignore */ }
    return {
      sosEmails: [],
      reportEmail: '',
      reportEnabled: false,
      reportTimeSlot: 'morning',
      lastReportSent: null,
      reportUserName: 'EchoNav User',
      _kvAvailable: false,
    };
  }
}

/**
 * Saves email config to KV (and localStorage as fallback cache).
 */
export async function saveEmailConfig(config: EmailConfig): Promise<{ saved: boolean; _kvAvailable: boolean }> {
  // Always save to localStorage as a local cache
  try {
    localStorage.setItem('echonav_email_config', JSON.stringify(config));
  } catch { /* ignore */ }

  try {
    const result = await post<{ saved: boolean; _kvAvailable: boolean }>('/email-config', config);
    return result;
  } catch {
    return { saved: false, _kvAvailable: false };
  }
}

/**
 * Syncs today's detection summary to KV so the cron job can read it.
 * Silent — never throws.
 */
export async function syncDailyDetections(summary: DailyDetectionSummary): Promise<void> {
  try {
    await post('/sync-detections', summary);
  } catch { /* silent */ }
}

/**
 * Triggers the daily report manually ("Send Now").
 */
export async function sendDailyReportNow(date?: string): Promise<{ sent: boolean; emailId?: string; error?: string }> {
  try {
    const result = await post<{ sent: boolean; emailId?: string; skipped?: boolean; reason?: string }>('/send-daily-report', { date: date ?? getISTDateString() });
    if (result.skipped) return { sent: false, error: result.reason };
    return { sent: result.sent, emailId: result.emailId };
  } catch (err: any) {
    return { sent: false, error: err.message };
  }
}

/**
 * Builds a detection summary object from the detection history array.
 * Used before calling syncDailyDetections.
 */
export function buildDailySummary(
  history: Array<{
    level: string;
    distance?: number;
    status: string;
    timestamp: number;
  }>,
  targetDate?: string
): DailyDetectionSummary {
  const date = targetDate ?? getISTDateString();
  // Filter to today's readings only
  const startOfDayIST = new Date(date + 'T00:00:00+05:30').getTime();
  const endOfDayIST = startOfDayIST + 24 * 60 * 60 * 1000;
  const todayReadings = history.filter(
    (h) => h.timestamp >= startOfDayIST && h.timestamp < endOfDayIST
  );

  const high = todayReadings.filter((h) => h.level === 'High').length;
  const medium = todayReadings.filter((h) => h.level === 'Medium').length;
  const safe = todayReadings.filter((h) => h.level === 'Safe').length;
  const sos = todayReadings.filter((h) => h.status === 'SOS Emergency').length;
  const distances = todayReadings
    .filter((h) => typeof h.distance === 'number')
    .map((h) => h.distance as number);

  const avgDistance =
    distances.length > 0
      ? Math.round(distances.reduce((a, b) => a + b, 0) / distances.length)
      : null;

  const closestDistance =
    distances.length > 0 ? Math.min(...distances) : null;

  return {
    date,
    totalDetections: todayReadings.length,
    highCount: high,
    mediumCount: medium,
    safeCount: safe,
    avgDistance,
    closestDistance,
    sosCount: sos,
  };
}
