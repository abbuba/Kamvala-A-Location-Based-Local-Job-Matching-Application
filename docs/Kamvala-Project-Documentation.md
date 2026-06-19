# Kamvala: Local Job Discovery & Shop Enlistment Platform

**FWD Course Project — Technical Documentation**

---

**Project name:** Kamvala  
**Domain:** Local job matching for shops in Hyderabad, India  
**Platform:** Mobile-first web application (phone-frame UI)  
**Date:** June 2026  

---

## 1. Introduction

**Kamvala** is a location-based job discovery application that connects job seekers with nearby shops hiring local help. Unlike large professional networks, Kamvala focuses on everyday work — cashiers, cooks, delivery riders, cleaners — found within walking or short commute distance.

The app is built as a **React single-page application** displayed inside an **iPhone-style phone mockup**, giving a realistic mobile product feel in the browser. It uses a **mock REST API** (JSON Server) for listings and **Mapbox** for interactive maps.

### Suggested document title

For your report or submission, use:

> **"Kamvala: A Location-Based Local Job Matching Application"**

Alternative titles:

- *Kamvala — Local Job Discovery & Shop Enlistment System (FWD Project)*
- *Design and Implementation of Kamvala: Radius-Based Job Search for Hyderabad*

---

## 2. Problem Statement

Many small shops in Indian cities hire through word-of-mouth or handwritten notices. Job seekers often do not know which shops nearby are hiring, what languages are needed, or what pay is offered. Kamvala solves this by:

1. Letting **job seekers** browse openings on a map within a chosen radius (1–10 km).
2. Letting **shop owners** enlist their shop and post a job listing with location, pay, work type, and languages.
3. Keeping everything **local** — no résumé upload, no corporate hiring pipeline.

---

## 3. Main Features

### 3.1 Intro Screen (`/`)

- Landing page with the Kamvala brand.
- Two side-by-side cards:
  - **Find a Job** → navigates to Explore.
  - **Enlist Shop** → navigates to Enlist form.

### 3.2 Explore (`/explore`)

- **Mapbox map** centred on the user (or Hyderabad demo area if location is denied).
- **Radius selector** — 1 km, 2 km, 5 km, or 10 km.
- **Job pins** on the map; tap to open job detail.
- **Filter bar** — job type, language, minimum pay.
- **Bottom sheet** — scrollable list of nearby jobs (scrollbars hidden inside phone for clean UI).

### 3.3 Job Detail (`/explore/:id`)

- Full listing: shop name, title, pay range, work types, languages, address, description.
- Optional **store photo**.
- **Call Shop** and **Get Directions** (Google Maps link).

### 3.4 Enlist (`/enlist`)

- iOS-style grouped form for shop owners.
- Fields: shop name, job title, work types, languages, pay min/max, period, address, description, phone.
- Optional **store image** upload (max 500 KB, stored as base64).
- **Map pin picker** — tap or drag to set exact shop location.
- On submit: listing saved to API, map centre updated, user taken to Explore to see the new listing.

---

## 4. Technology Stack

| Layer | Technology |
|-------|------------|
| UI framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4, custom iOS-like components |
| Routing | React Router v7 (lazy-loaded pages) |
| Maps | Mapbox GL JS + react-map-gl v8 |
| API (dev) | JSON Server on port 3001 |
| API proxy | Vite dev proxy `/api` → `localhost:3001` |
| Testing | Vitest + React Testing Library |
| Geo math | Haversine formula (client-side radius filter) |

---

## 5. Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PhoneFrame (shell)                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │ LocationProvider │ FilterProvider │ ListingsProvider│ │
│  │              React Router (AppShell)               │ │
│  │   Intro │ Explore │ Job Detail │ Enlist           │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
   Mapbox (tiles)              JSON Server / seed data
```

### 5.1 Context (global state)

- **LocationContext** — map centre from GPS or manual override; fallback to Hyderabad.
- **FilterContext** — radius (km), job type, language, min pay filters.
- **ListingsContext** — refresh trigger + locally cached listings after enlist.

### 5.2 Services

- **apiClient** — `fetch` wrapper for `/api/*` endpoints.
- **listingsService** — fetch/create listings, merge local + API data, apply filters.
- **geo** — Haversine distance and radius filtering.

### 5.3 Hooks

- **useGeolocation** — browser GPS with timeout and fallback.
- **useNearbyListings** — loads listings when centre, radius, filters, or refresh changes.

---

## 6. Routing

| Path | Page | Tab bar |
|------|------|---------|
| `/` | Intro | Hidden |
| `/explore` | Explore (map + list) | Explore \| Enlist |
| `/explore/:id` | Job detail | Hidden (back button) |
| `/enlist` | Shop enlist form | Explore \| Enlist |

Routes are defined in `src/router.tsx` with **lazy loading** so each page loads only when visited.

---

## 7. API & Data Flow

### 7.1 Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/listings` | All job listings |
| GET | `/listings/:id` | One listing |
| POST | `/listings` | Create new listing (enlist) |
| GET | `/jobTypes` | Cashier, Cook, Delivery, Cleaning |
| GET | `/languages` | English, Hindi, Urdu, Telugu |

### 7.2 Seed data

`db.json` contains **10 sample Hyderabad listings** (Charminar, Hitech City, Secunderabad, etc.) plus job types and languages.

If the API is unreachable, the app **falls back to seed data** so Explore still works in demo mode.

### 7.3 Enlist → Explore flow

1. User fills **Enlist** form and sets map pin.
2. `POST /listings` saves to `db.json` (or local fallback id if API down).
3. Listing added to **ListingsContext** immediately.
4. Map **centre** moves to the shop pin; **filters cleared**.
5. App **navigates to Explore**; `useNearbyListings` refetches and merges API + local listings.
6. **Haversine filter** keeps only jobs within the selected radius.

---

## 8. Geolocation & Radius Search

- Default centre: **Hyderabad** (17.385°N, 78.4867°E).
- If the user allows location, the map uses their GPS coordinates.
- **Radius options:** 1, 2, 5, 10 km.
- Distance is computed with the **Haversine formula** on the client (not on the server).
- A blue circle on the map visualises the search radius.

---

## 9. Mapbox Integration

- Token stored in `.env` as `VITE_MAPBOX_TOKEN`.
- Uses Mapbox **CSP build** + web worker for Vite compatibility.
- Style: `mapbox://styles/mapbox/streets-v12`.
- **JobMap** — explore view with radius circle, user dot, job markers.
- **MapPinPicker** — enlist form; click or drag pin to set coordinates.
- Without a token, a friendly fallback message is shown; the rest of the app still works.

---

## 10. UI / UX Design

The interface follows **Apple iOS** patterns:

- Large navigation titles, grouped inset lists, segmented controls.
- Frosted tab bar with custom SVG icons.
- Phone frame: Dynamic Island, status bar, home indicator.
- Width ~430px; scrollbars hidden inside the phone mockup.
- Kamvala brand colours: system blue `#007AFF`, gray backgrounds `#F2F2F7`.

---

## 11. Project Folder Structure

```
FWD/
├── db.json                 # Mock database (listings, jobTypes, languages)
├── .env.example            # Mapbox token template
├── src/
│   ├── App.tsx             # Providers + router
│   ├── router.tsx          # Route definitions
│   ├── pages/              # Intro, Explore, JobDetail, Enlist
│   ├── components/
│   │   ├── layout/         # PhoneFrame, AppShell
│   │   ├── map/            # JobMap, RadiusControl, mapConfig
│   │   ├── jobs/           # JobCard, FilterBar, JobListSheet
│   │   ├── shop/           # EnlistForm, MapPinPicker
│   │   └── ui/             # Button, FormSection, StoreImage
│   ├── context/            # Location, Filter, Listings
│   ├── hooks/              # useGeolocation, useNearbyListings
│   ├── services/           # apiClient, listingsService, geo
│   ├── data/seed.ts        # Fallback seed from db.json
│   └── types/listing.ts    # TypeScript interfaces
└── docs/                   # This documentation
```

---

## 12. How to Run

```bash
npm install
cp .env.example .env
# Add your Mapbox token to .env

npm run dev    # Vite :5173 + JSON Server :3001
npm test       # Run unit tests
npm run build  # Production build
```

Open **http://localhost:5173** in the browser.

---

## 13. Testing

Tests cover:

- Haversine distance and radius filtering (`geo.test.ts`)
- Nearby listings with filters (`listingsService.test.ts`)
- Enlist form validation and submit → navigate to Explore (`EnlistForm.test.tsx`)
- Explore page header and radius control (`ExplorePage.test.tsx`)

Run: `npm test`

---

## 14. Course Learning Outcomes (FWD)

| Outcome | How Kamvala demonstrates it |
|---------|------------------------------|
| **Frontend development** | React components, hooks, context, responsive phone UI |
| **Routing & navigation** | React Router with lazy routes and tab shell |
| **API integration** | REST client, POST/GET, proxy, error fallback |
| **Geospatial logic** | GPS, Haversine radius, map markers and pin picker |
| **State management** | Multiple React contexts for location, filters, listings |
| **Testing & quality** | Vitest unit/integration tests for core logic |
| **Maps & external services** | Mapbox GL integration with environment config |

---

## 15. Summary

Kamvala is a complete **mobile-style job marketplace prototype** for Hyderabad. Job seekers explore nearby openings on a map; shop owners enlist with a simple form. The stack — React, TypeScript, Vite, Mapbox, and JSON Server — keeps the project modern, testable, and easy to demo locally. The architecture separates **UI**, **state**, **services**, and **data**, making it straightforward to extend (real backend, auth, push notifications) in future work.

---

*Document generated for the Kamvala FWD project.*
