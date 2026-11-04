# EchoNav – Assistive Navigation System

EchoNav is an assistive navigation web application designed to support visually impaired individuals by providing obstacle detection information, warning alerts, and detection history.

## Features

- Obstacle detection simulation with adjustable distance.
- Visual radar and distance indicators.
- High, Medium, and Safe warning levels.
- Voice-based obstacle alerts.
- Detection history and analytics.
- Customizable sensitivity and vibration settings.
- Responsive interface for desktop and mobile devices.

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Browser LocalStorage
- Resend (Email Delivery API)
- Upstash Redis / Vercel KV (Background report state)

## Email Integration & Deployment Environment Variables

Configure these variables in your Vercel Project Settings:
- `RESEND_API_KEY`: API key from Resend
- `RESEND_FROM_EMAIL`: Sender address (e.g. `onboarding@resend.dev`)
- `KV_REST_API_URL`: Vercel KV / Upstash Redis REST URL
- `KV_REST_API_TOKEN`: Vercel KV / Upstash Redis REST Token
- `CRON_SECRET`: Optional secret for securing Vercel cron endpoints

## Project Screens

1. Home
2. Detection History
3. Settings
4. About

## Simulation Notice

This version demonstrates the software interface using simulated sensor readings. Actual ESP32 hardware integration is a future development stage.

## Run Locally

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Project Goal

To develop an affordable and user-friendly assistive navigation solution that helps visually impaired individuals identify nearby obstacles and navigate more independently.
