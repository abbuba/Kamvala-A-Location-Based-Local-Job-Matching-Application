# Kamvala

Local job matching for nearby shops in **Hyderabad** — find work by radius, job type, language, and pay. Built as a mobile-first React app displayed inside a phone-frame UI.

## Features

- **Intro** — Two square cards: Find a Job or Enlist Shop
- **Explore** — Mapbox map with radius selector (1–10 km), job pins, filters, and bottom sheet list
- **Job detail** — Store photo, pay, languages, call shop, get directions
- **Enlist** — Shops post listings with optional store photo, map pin, work types, languages, and pay range
- **Mock API** — JSON Server with seeded Hyderabad listings

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7
- Mapbox GL JS + react-map-gl
- JSON Server (mock REST API)
- Vitest + React Testing Library

## Getting started

### Prerequisites

- Node.js 18+
- Free [Mapbox access token](https://account.mapbox.com/)

### Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set your Mapbox public token:

```
VITE_MAPBOX_TOKEN=pk.your_token_here
```

### Run (app + API)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Test

```bash
npm test
```

### Build

```bash
npm run build
```

## API endpoints

Proxied via Vite at `/api`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/listings` | All job listings |
| GET | `/listings/:id` | Single listing |
| POST | `/listings` | Create listing (shop enlist) |
| GET | `/jobTypes` | Work type options |
| GET | `/languages` | Language options |

Radius filtering is done client-side using Haversine distance.

## Project structure

```
src/
├── components/   # UI, map, jobs, shop form, layout
├── context/      # Location + filter state
├── hooks/        # Geolocation, nearby listings
├── pages/        # Intro, Explore, Job detail, Enlist
├── services/     # API client, geo, listings
└── types/        # TypeScript interfaces
```

## Mapbox note

Without `VITE_MAPBOX_TOKEN`, the map shows a setup prompt but the rest of the app works. Get a free token at [mapbox.com](https://account.mapbox.com/) — the Light style is used for a clean, iOS-like look.

## Deployment note

JSON Server is for local development. For a static deploy (Vercel/Netlify), either run the API separately or swap to bundled seed data for demo mode.
