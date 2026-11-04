import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_FROM_EMAIL ??
  'EchoNav Emergency <onboarding@resend.dev>';

// ── Shared HTML helpers ───────────────────────────────────────────────────────

function emailWrapper(title: string, accentColor: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f0f4f0;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:${accentColor};padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">🧭 EchoNav</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.80);margin-top:3px;font-weight:600;">Assistive Navigation System</div>
              </td>
              <td align="right">
                <div style="font-size:11px;color:rgba(255,255,255,0.75);font-weight:600;">Auto-generated notification</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          ${body}
          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;padding-top:20px;border-top:1px solid #e8f0ea;">
            <tr><td style="font-size:11px;color:#8aaa96;text-align:center;line-height:1.6;">
              This email was sent automatically by EchoNav Assistive Navigation System.<br/>
              <strong>Do not reply to this email.</strong> For support, open the EchoNav app.<br/>
              <span style="color:#b0c8b8;">Sent via Resend · Powered by EchoNav v1.0</span>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 12px;font-size:12px;font-weight:700;color:#5f7e6c;width:38%;vertical-align:top;">${label}</td>
    <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0b3821;vertical-align:top;">${value}</td>
  </tr>`;
}

function pill(text: string, bg: string, color: string): string {
  return `<span style="display:inline-block;padding:3px 10px;border-radius:50px;font-size:11px;font-weight:800;background:${bg};color:${color};letter-spacing:0.3px;">${text}</span>`;
}

// ── SOS Email generator ───────────────────────────────────────────────────────

function buildSOSEmail(params: {
  recipientName: string;
  userName: string;
  location: { latitude?: number; longitude?: number; mapsUrl?: string; accuracy?: number } | null;
  triggeredAt: string;
}): string {
  const { recipientName, userName, location, triggeredAt } = params;

  const timeFormatted = new Date(triggeredAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const locationHTML =
    location?.latitude != null && location?.longitude != null
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3f2;border:1.5px solid #fca5a5;border-radius:12px;margin-top:16px;overflow:hidden;">
        <tr><td style="padding:12px 16px;font-size:12px;font-weight:800;color:#991b1b;text-transform:uppercase;letter-spacing:0.5px;">📍 GPS Location</td></tr>
        ${infoRow('Latitude', location.latitude.toFixed(6) + '°')}
        ${infoRow('Longitude', location.longitude.toFixed(6) + '°')}
        ${location.accuracy ? infoRow('Accuracy', `±${location.accuracy} metres`) : ''}
        <tr><td colspan="2" style="padding:4px 12px 14px;">
          <a href="${location.mapsUrl || `https://maps.google.com/?q=${location.latitude},${location.longitude}`}" style="display:inline-block;padding:9px 20px;background:#dc2626;color:#ffffff;font-size:12px;font-weight:800;border-radius:10px;text-decoration:none;">
            🗺️ Open in Google Maps →
          </a>
        </td></tr>
      </table>`
    : `<div style="background:#fef9ec;border:1.5px solid #fcd34d;border-radius:12px;padding:12px 16px;margin-top:16px;font-size:12px;color:#92400e;font-weight:600;">
        ⚠️ Location unavailable – GPS permission was not granted.
      </div>`;

  const body = `
    <!-- Alert Banner -->
    <div style="background:#fef2f2;border:2px solid #fca5a5;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:28px;margin-bottom:8px;">🚨</div>
      <div style="font-size:20px;font-weight:900;color:#991b1b;line-height:1.2;">Emergency SOS Alert</div>
      <div style="font-size:14px;color:#b91c1c;margin-top:6px;font-weight:600;">
        <strong>${userName}</strong> has triggered an emergency SOS via EchoNav.<br/>
        Immediate assistance may be required.
      </div>
    </div>

    <!-- Greeting -->
    <p style="font-size:14px;color:#374151;margin:0 0 20px;">Dear <strong>${recipientName}</strong>,</p>
    <p style="font-size:14px;color:#374151;margin:0 0 20px;line-height:1.6;">
      This is an automated emergency alert. The EchoNav assistive navigation system worn by
      <strong>${userName}</strong> triggered an SOS signal at the time shown below.
      Please check on them immediately or contact emergency services if necessary.
    </p>

    <!-- Details table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf8;border:1.5px solid #d5e8d8;border-radius:12px;overflow:hidden;margin-bottom:4px;">
      <tr><td style="padding:12px 16px;font-size:12px;font-weight:800;color:#0b3821;text-transform:uppercase;letter-spacing:0.5px;">Alert Details</td></tr>
      ${infoRow('User', userName)}
      ${infoRow('Alert Type', '🚨 Emergency SOS')}
      ${infoRow('Date & Time', timeFormatted + ' (IST)')}
      ${infoRow('Alert Status', pill('ACTIVE – Needs attention', '#fef2f2', '#dc2626'))}
    </table>

    ${locationHTML}

    <!-- Action Notice -->
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px;margin-top:20px;">
      <div style="font-size:13px;font-weight:800;color:#14532d;margin-bottom:6px;">✅ What to do</div>
      <ul style="margin:0;padding-left:18px;font-size:13px;color:#166534;line-height:1.8;">
        <li>Immediately contact ${userName} by phone.</li>
        <li>If unreachable, go to their last known GPS location.</li>
        <li>Contact emergency services (112) if needed.</li>
      </ul>
    </div>
  `;

  return emailWrapper('Emergency SOS Alert – EchoNav', '#dc2626', body);
}

// ── Handler ───────────────────────────────────────────────────────────────────

interface SOSPayload {
  recipientEmails: Array<{ email: string; name: string }>;
  userName?: string;
  location: {
    latitude?: number;
    longitude?: number;
    mapsUrl?: string;
    accuracy?: number;
    timestamp: number;
  } | null;
  triggeredAt: string;
  idempotencyKey?: string; // prevent duplicate sends
}

// In-memory dedup set (resets per cold start, good enough for SOS)
const recentKeys = new Set<string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientEmails, userName = 'EchoNav User', location, triggeredAt, idempotencyKey } =
    req.body as SOSPayload;

  // Deduplication guard
  if (idempotencyKey) {
    if (recentKeys.has(idempotencyKey)) {
      return res.status(200).json({ deduplicated: true, message: 'Already sent' });
    }
    recentKeys.add(idempotencyKey);
    // Clear after 5 minutes
    setTimeout(() => recentKeys.delete(idempotencyKey), 5 * 60 * 1000);
  }

  if (!recipientEmails?.length) {
    return res.status(400).json({ error: 'recipientEmails is required and must not be empty' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validRecipients = recipientEmails.filter((r) => emailRegex.test(r.email));

  if (!validRecipients.length) {
    return res.status(400).json({ error: 'No valid email addresses provided' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'Email service not configured. Set RESEND_API_KEY.' });
  }

  const html = buildSOSEmail({
    recipientName: '', // set per recipient below
    userName,
    location: location ?? null,
    triggeredAt: triggeredAt ?? new Date().toISOString(),
  });

  const results = await Promise.allSettled(
    validRecipients.map((r) =>
      resend.emails.send({
        from: FROM,
        to: [r.email],
        subject: `🚨 EMERGENCY SOS – ${userName} needs immediate assistance`,
        html: buildSOSEmail({
          recipientName: r.name || r.email,
          userName,
          location: location ?? null,
          triggeredAt: triggeredAt ?? new Date().toISOString(),
        }),
      })
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => String(r.reason));

  // void html to satisfy TS (it's used in the map above per-recipient)
  void html;

  return res.status(200).json({ sent, failed, total: validRecipients.length, errors });
}
