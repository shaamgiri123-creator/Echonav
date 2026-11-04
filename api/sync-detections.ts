/**
 * POST /api/sync-detections
 *
 * Saves today's detection summary to Upstash KV so the daily-report
 * cron job can read it even when the browser is closed.
 *
 * The frontend calls this after every updateDistance() that logs to history.
 * Data is keyed by IST date: echonav:detections:YYYY-MM-DD
 * TTL: 48 hours (auto-cleanup)
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

interface DetectionSyncPayload {
  date: string; // 'YYYY-MM-DD' in IST (required)
  totalDetections: number;
  highCount: number;
  mediumCount: number;
  safeCount: number;
  avgDistance: number | null;
  closestDistance: number | null;
  sosCount: number;
}

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

function getISTDateString(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const redis = getRedis();
  if (!redis) {
    // Silently succeed – frontend continues without KV
    return res.status(200).json({ synced: false, reason: 'KV not configured' });
  }

  const payload = req.body as DetectionSyncPayload;
  const date = payload.date ?? getISTDateString();

  const summary = {
    date,
    totalDetections: payload.totalDetections ?? 0,
    highCount: payload.highCount ?? 0,
    mediumCount: payload.mediumCount ?? 0,
    safeCount: payload.safeCount ?? 0,
    avgDistance: payload.avgDistance ?? null,
    closestDistance: payload.closestDistance ?? null,
    sosCount: payload.sosCount ?? 0,
    updatedAt: new Date().toISOString(),
  };

  // Store with 48-hour TTL (auto-expires old data)
  await redis.set(`echonav:detections:${date}`, summary, { ex: 48 * 60 * 60 });

  return res.status(200).json({ synced: true, date });
}
