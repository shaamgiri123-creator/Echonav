import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DailyDetectionSummary {
  date: string; // 'YYYY-MM-DD' in IST
  totalDetections: number;
  highCount: number;
  mediumCount: number;
  safeCount: number;
  avgDistance: number | null; // cm, null if no obstacle readings
  closestDistance: number | null; // cm
  sosCount: number;
  updatedAt: string; // ISO
}

interface EmailConfig {
  reportEmail: string;
  reportEnabled: boolean;
  reportTimeSlot: 'morning' | 'afternoon' | 'evening'; // morning=07:00 UTC, afternoon=12:00, evening=18:00
  lastReportSent: string | null; // ISO date 'YYYY-MM-DD'
  reportUserName: string;
}

// ── Setup ─────────────────────────────────────────────────────────────────────

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_FROM_EMAIL ??
  'EchoNav Reports <onboarding@resend.dev>';

// UTC hours for each slot
const TIME_SLOTS: Record<string, number> = {
  morning: 2,    // 2 AM UTC = 7:30 AM IST
  afternoon: 7,  // 7 AM UTC = 12:30 PM IST
  evening: 13,   // 1 PM UTC = 6:30 PM IST
};

// ── Email Template ─────────────────────────────────────────────────────────────

function buildReportEmail(config: EmailConfig, summary: DailyDetectionSummary | null): string {
  const dateLabel = summary?.date ?? getISTDateString();
  const displayDate = new Date(dateLabel + 'T00:00:00+05:30').toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const noData = !summary || summary.totalDetections === 0;

  function bar(count: number, total: number, color: string): string {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `<div style="background:#f0f4f0;border-radius:50px;height:8px;overflow:hidden;margin-top:4px;">
      <div style="width:${pct}%;background:${color};height:8px;border-radius:50px;transition:width 0.3s;"></div>
    </div>`;
  }

  function statCard(emoji: string, label: string, value: string, bg: string, color: string): string {
    return `<td style="padding:4px;">
      <div style="background:${bg};border-radius:14px;padding:14px 10px;text-align:center;">
        <div style="font-size:22px;">${emoji}</div>
        <div style="font-size:22px;font-weight:900;color:${color};margin-top:4px;">${value}</div>
        <div style="font-size:11px;font-weight:700;color:#5f7e6c;margin-top:2px;">${label}</div>
      </div>
    </td>`;
  }

  const statsSection = noData
    ? `<div style="background:#f8faf8;border:1.5px solid #d5e8d8;border-radius:14px;padding:24px;text-align:center;color:#5f7e6c;">
        <div style="font-size:32px;margin-bottom:12px;">📭</div>
        <div style="font-size:14px;font-weight:700;color:#0b3821;">No detection data for this date.</div>
        <div style="font-size:12px;margin-top:6px;line-height:1.6;">
          The EchoNav app was not opened or no detections were logged on ${displayDate}.
        </div>
      </div>`
    : `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          ${statCard('📡', 'Total Detections', String(summary!.totalDetections), '#f0f8ff', '#0b3821')}
          ${statCard('🔴', 'High Danger', String(summary!.highCount), '#fef2f2', '#dc2626')}
          ${statCard('🟡', 'Medium', String(summary!.mediumCount), '#fffbeb', '#d97706')}
          ${statCard('🟢', 'Safe', String(summary!.safeCount), '#f0fdf4', '#16a34a')}
        </tr>
      </table>
      ${summary!.highCount > 0 || summary!.mediumCount > 0 ? `
      <div style="background:#f8faf8;border:1.5px solid #d5e8d8;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
        <div style="font-size:12px;font-weight:800;color:#0b3821;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;">Detection Breakdown</div>
        <div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#374151;">
            <span>🔴 High Danger</span><span>${summary!.highCount}</span>
          </div>${bar(summary!.highCount, summary!.totalDetections, '#dc2626')}
        </div>
        <div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#374151;">
            <span>🟡 Medium Danger</span><span>${summary!.mediumCount}</span>
          </div>${bar(summary!.mediumCount, summary!.totalDetections, '#d97706')}
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#374151;">
            <span>🟢 Safe Path</span><span>${summary!.safeCount}</span>
          </div>${bar(summary!.safeCount, summary!.totalDetections, '#16a34a')}
        </div>
      </div>` : ''}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf8;border:1.5px solid #d5e8d8;border-radius:14px;overflow:hidden;">
        <tr><td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:800;color:#0b3821;text-transform:uppercase;letter-spacing:0.5px;">Distance Metrics</td></tr>
        ${summary!.avgDistance !== null ? `<tr><td style="padding:6px 16px;font-size:12px;font-weight:700;color:#5f7e6c;width:50%;">Average Distance</td><td style="font-size:13px;font-weight:800;color:#0b3821;">${summary!.avgDistance} cm</td></tr>` : ''}
        ${summary!.closestDistance !== null ? `<tr><td style="padding:6px 16px 12px;font-size:12px;font-weight:700;color:#5f7e6c;">Closest Obstacle</td><td style="font-size:13px;font-weight:800;color:#dc2626;">${summary!.closestDistance} cm ⚠️</td></tr>` : ''}
        ${summary!.sosCount > 0 ? `<tr style="background:#fef2f2;"><td style="padding:8px 16px;font-size:12px;font-weight:700;color:#991b1b;">SOS Triggers</td><td style="font-size:14px;font-weight:900;color:#dc2626;">${summary!.sosCount} 🚨</td></tr>` : ''}
      </table>
      `;

  const body = `
    <div style="margin-bottom:24px;">
      <div style="font-size:11px;font-weight:800;color:#16a34a;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Daily Navigation Report</div>
      <div style="font-size:22px;font-weight:900;color:#0b3821;line-height:1.2;">${displayDate}</div>
      <div style="font-size:13px;color:#5f7e6c;margin-top:4px;">Navigation summary for <strong>${config.reportUserName || 'EchoNav User'}</strong></div>
    </div>

    ${statsSection}

    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:14px 16px;margin-top:20px;font-size:12px;color:#14532d;line-height:1.6;">
      <strong>🔒 Privacy Notice:</strong> All detection data is processed locally on your device.
      This report was generated from data you chose to sync for email reporting.
      No video or audio data is ever stored or transmitted.
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>EchoNav Daily Report</title></head>
<body style="margin:0;padding:0;background:#f0f4f0;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#0b3821,#16a34a);padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><div style="font-size:22px;font-weight:900;color:#fff;">🧭 EchoNav</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:3px;font-weight:600;">Daily Navigation Report</div></td>
            <td align="right"><div style="font-size:11px;color:rgba(255,255,255,0.7);font-weight:600;">Auto-generated</div></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:32px;">
          ${body}
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;padding-top:20px;border-top:1px solid #e8f0ea;">
            <tr><td style="font-size:11px;color:#8aaa96;text-align:center;line-height:1.6;">
              You are receiving this because daily reports are enabled in EchoNav Settings.<br/>
              To unsubscribe, open EchoNav → Settings → Email Reports → Disable.<br/>
              <span style="color:#b0c8b8;">Sent via Resend · EchoNav v1.0</span>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getISTDateString(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET (cron) or POST (manual "Send Now")
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cron security: Vercel sets Authorization header for cron jobs
  const cronSecret = process.env.CRON_SECRET;
  if (req.method === 'GET' && cronSecret) {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // Check services are configured
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'RESEND_API_KEY not configured' });
  }

  const redis = getRedis();
  if (!redis) {
    return res.status(503).json({ error: 'KV_REST_API_URL / KV_REST_API_TOKEN not configured' });
  }

  // Load email config
  const config = await redis.get<EmailConfig>('echonav:email-config');
  if (!config || !config.reportEnabled || !config.reportEmail) {
    return res.status(200).json({ skipped: true, reason: 'Reports disabled or no email configured' });
  }

  // For cron (GET): check time slot
  if (req.method === 'GET') {
    const utcHour = new Date().getUTCHours();
    const expectedHour = TIME_SLOTS[config.reportTimeSlot] ?? 2;
    if (Math.abs(utcHour - expectedHour) > 1) {
      return res.status(200).json({ skipped: true, reason: `Not the right time slot (UTC ${utcHour} vs expected ${expectedHour})` });
    }

    // Dedup: don't send twice on same day
    const today = getISTDateString();
    if (config.lastReportSent === today) {
      return res.status(200).json({ skipped: true, reason: 'Already sent today' });
    }
  }

  // Load detection summary (yesterday for cron, today for manual)
  const targetDate = req.method === 'POST'
    ? (req.body?.date ?? getISTDateString())
    : getISTDateString();

  const summary = await redis.get<DailyDetectionSummary>(`echonav:detections:${targetDate}`);

  // Build & send email
  const html = buildReportEmail(config, summary);

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: [config.reportEmail],
      subject: `📊 EchoNav Daily Report – ${targetDate}`,
      html,
    });

    if (!result.error) {
      // Update lastReportSent
      await redis.set('echonav:email-config', {
        ...config,
        lastReportSent: targetDate,
      });
      return res.status(200).json({ sent: true, emailId: result.data?.id, date: targetDate });
    } else {
      return res.status(500).json({ error: result.error.message });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Email delivery failed', details: err.message });
  }
}
