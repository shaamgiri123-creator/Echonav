/**
 * GET  /api/email-config  → returns stored EmailConfig
 * POST /api/email-config  → saves EmailConfig to Upstash KV
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

interface EmailConfig {
  sosEmails: Array<{ email: string; name: string }>;
  reportEmail: string;
  reportEnabled: boolean;
  reportTimeSlot: 'morning' | 'afternoon' | 'evening';
  lastReportSent: string | null;
  reportUserName: string;
}

const DEFAULT_CONFIG: EmailConfig = {
  sosEmails: [],
  reportEmail: '',
  reportEnabled: false,
  reportTimeSlot: 'morning',
  lastReportSent: null,
  reportUserName: 'EchoNav User',
};

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const redis = getRedis();

  // If KV not configured, fall back to localStorage-only mode
  if (!redis) {
    if (req.method === 'GET') {
      return res.status(200).json({ ...DEFAULT_CONFIG, _kvAvailable: false });
    }
    return res.status(200).json({ saved: false, _kvAvailable: false, message: 'KV not configured – config stored locally only' });
  }

  if (req.method === 'GET') {
    const config = await redis.get<EmailConfig>('echonav:email-config');
    return res.status(200).json({ ...(config ?? DEFAULT_CONFIG), _kvAvailable: true });
  }

  if (req.method === 'POST') {
    const incoming = req.body as Partial<EmailConfig>;

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanSosEmails = (incoming.sosEmails ?? []).filter((e) => emailRegex.test(e.email));
    const reportEmailValid =
      !incoming.reportEmail || emailRegex.test(incoming.reportEmail);

    if (!reportEmailValid) {
      return res.status(400).json({ error: 'Invalid report email address' });
    }

    const existing = (await redis.get<EmailConfig>('echonav:email-config')) ?? DEFAULT_CONFIG;

    const updated: EmailConfig = {
      ...existing,
      ...incoming,
      sosEmails: cleanSosEmails,
      reportEmail: incoming.reportEmail ?? existing.reportEmail,
    };

    await redis.set('echonav:email-config', updated);
    return res.status(200).json({ saved: true, _kvAvailable: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
