# BloodConnect — Location-Based Blood Donor Matching Platform

A MERN stack mini project connecting blood donors with requesters through location and blood-type based search.

## Features
1. User Registration (Donor/Requester) — name, email, password, blood type, location access
2. Location & Blood Type Search
3. Distance-Based Ranking of Available Donors
4. Contact Request System
5. Request History
6. Eligibility Reminder (90-day rule)
7. Blood Compatibility Info Page
8. Blood Banks / Hospital Directory
9. Health Eligibility Check
10. Blood Donation Camp Listing
11. Map Pin View
12. "Why Donate Blood" Awareness Page

## Design
The frontend uses a warm, rounded "community" theme — cream/blush background, coral-red accent, a top navbar (not a sidebar), pill-shaped buttons, and soft-shadow rounded cards. All styling lives in `frontend/src/index.css` as CSS custom properties, so the palette/typography can be swapped by editing the `:root` block at the top of that file.

## Project Structure
```
bloodconnect/
├── backend/     → Node.js + Express + MongoDB API
└── frontend/    → React app
```

## Setup

### 1. Backend
This backend uses modern ES module syntax (`import`/`export`), matching Node 24+.
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string + a JWT secret
npm run dev
```
Backend runs on `http://localhost:5000`

If your network blocks MongoDB's SRV DNS lookups (common on some college/hostel WiFi — shows as `querySrv ECONNREFUSED`), `server.js` already forces public DNS resolvers (`1.1.1.1`, `8.8.8.8`) via Node's `dns` module. If it still fails, use the non-SRV connection string from Atlas (Connect → Drivers → toggle off "SRV Connection String").

### 2. Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### 3. MongoDB Atlas
1. Create a free (M0) cluster at https://www.mongodb.com/atlas
2. Create a database user and whitelist `0.0.0.0/0` under Network Access
3. Copy your connection string into `backend/.env` as `MONGO_URI`

### 4. Seed Blood Banks / Camps (optional)
Use Postman to POST some sample data:
```
POST http://localhost:5000/api/bloodbanks
{ "name": "City Blood Bank", "address": "MG Road", "phone": "0251-1234567", "city": "Ambarnath" }

POST http://localhost:5000/api/camps
{ "name": "College Blood Drive", "date": "2026-10-15", "location": "Main Auditorium", "organizer": "NSS Cell" }
```

## Testing APIs (Postman)
1. `POST /api/auth/register` — create a donor account
2. `POST /api/auth/login` — get a JWT token
3. `GET /api/donors/search?bloodType=O+&lat=..&lng=..` — nearby donors, nearest first
4. `POST /api/requests` (with Bearer token) — send a contact request
5. `PATCH /api/requests/:id` — accept/decline/complete
6. `GET /api/requests/history` — view sent & received requests

## Deployment (all free tier)
| Part | Platform |
|---|---|
| Database | MongoDB Atlas |
| Backend | Render.com |
| Frontend | Vercel |

Before deploying the frontend, update `baseURL` in `frontend/src/utils/api.js` to your deployed backend URL.

## Tech Stack
- Frontend: React, React Router, Axios, Leaflet.js
- Backend: Node.js, Express.js
- Database: MongoDB Atlas + Mongoose (2dsphere geospatial index)
- Auth: JWT + bcrypt
