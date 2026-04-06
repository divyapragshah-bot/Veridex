# 🛡️ VERIDEX v3 — "Verify Before You Click"
> Full-stack Cybersecurity Platform | JWT Auth | In-Memory Backend | Admin Dashboard

---

## 🚀 Quick Start

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev          # → http://localhost:5000

# Terminal 2 — Frontend  
cd frontend
npm install
npm run dev          # → http://localhost:3000
```

### 🔑 Demo Credentials
| Email | Password | Role |
|---|---|---|
| admin@veridex.com | admin123 | **Admin** (full Admin Panel access) |
| demo@veridex.com  | demo1234 | User (Dashboard access) |
| Click **"Continue as Guest"** | — | Guest (no history saved) |

---

## 🗂️ Project Structure

```
veridex/
├── backend/
│   └── src/
│       ├── data/
│       │   └── store.js              ← In-memory users[] + analyses[] arrays
│       ├── controllers/
│       │   ├── authController.js     ← signup, login, getMe
│       │   ├── analysisController.js ← scanUrl, scanEmail, getHistory, delete
│       │   └── adminController.js    ← getAllUsers, getAllAnalyses, stats, delete
│       ├── middleware/
│       │   ├── auth.js               ← protect (JWT) + adminOnly middleware
│       │   └── validate.js           ← express-validator error handler
│       ├── routes/
│       │   ├── auth.js               ← /api/auth/*
│       │   ├── analysis.js           ← /api/analysis/* (JWT protected)
│       │   └── admin.js              ← /api/admin/* (admin only)
│       └── utils/
│           ├── token.js              ← JWT sign/verify
│           └── detection/
│               ├── urlDetector.js    ← 13 modular URL checks
│               └── emailDetector.js  ← 10 modular email checks
│
└── frontend/
    └── src/
        ├── context/AuthContext.jsx   ← JWT auth state + API calls
        ├── components/
        │   ├── ProtectedRoute.jsx    ← requireAdmin prop support
        │   ├── Navbar.jsx            ← auth-aware + admin link
        │   └── Footer.jsx            ← all-pages footer
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx         ← JWT login + remember me
        │   │   └── Signup.jsx        ← validation + password strength
        │   ├── dashboard/
        │   │   ├── DashboardLayout.jsx
        │   │   ├── DashboardHome.jsx  ← live history from API
        │   │   ├── Reports.jsx        ← filterable history + PDF + delete
        │   │   ├── Profile.jsx
        │   │   ├── SettingsPage.jsx
        │   │   └── ActivityLog.jsx
        │   └── admin/
        │       ├── AdminLayout.jsx    ← admin sidebar shell
        │       ├── AdminOverview.jsx  ← stats, charts, system status
        │       ├── AdminUsers.jsx     ← all users + delete
        │       ├── AdminAnalyses.jsx  ← all scans + filter + delete
        │       └── AdminFlagged.jsx   ← fraud-level activities
        └── utils/
            └── api.js                ← authApi, analysisApi, adminApi
```

---

## 🔐 API Reference

### Auth (no token required)
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | /api/auth/signup | `{name, email, password}` | Register new user |
| POST | /api/auth/login  | `{email, password, remember}` | Login, get JWT |
| GET  | /api/auth/me     | — (Bearer token) | Get current user |

### Analysis (JWT required)
| Method | Endpoint | Body / Params | Description |
|---|---|---|---|
| POST | /api/analysis/url   | `{url}` | Scan a URL, saves to history |
| POST | /api/analysis/email | `{content}` | Analyze email, saves to history |
| GET  | /api/analysis/history | `?type&result&search&page&limit` | Get my history |
| DELETE | /api/analysis/:id | — | Delete my record |

### Admin (JWT + admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET  | /api/admin/stats | Overall platform statistics |
| GET  | /api/admin/users | All registered users |
| DELETE | /api/admin/users/:id | Delete user + their data |
| GET  | /api/admin/analyses | All analyses across all users |
| DELETE | /api/admin/analyses/:id | Delete any analysis record |

---

## 🔐 Auth Flow

```
POST /api/auth/signup → { token, user }
POST /api/auth/login  → { token, user }
     ↓
Frontend stores token in sessionStorage (or localStorage if "Remember Me")
     ↓
All /api/analysis/* and /api/admin/* calls send: Authorization: Bearer <token>
     ↓
protect middleware verifies JWT → attaches req.user
adminOnly middleware also checks req.user.role === 'admin'
```

---

## 🧠 Detection Architecture

### URL Detector (13 checks)
Each check is a named function: `(parsed, original) => { triggered, weight, reason }`

| Check | Weight |
|---|---|
| HTTP (not HTTPS) | 20 |
| Raw IP address | 40 |
| @ symbol in URL | 30 |
| Suspicious TLD (.tk, .ml, etc.) | 25 |
| Brand mimicry (paypal, amazon…) | 12–35 |
| URL length > 100 chars | 15 |
| 3+ subdomains | 15 |
| 3+ hyphens in domain | 10 |
| Suspicious path keywords | 8 each |
| URL shortener | 20 |
| Punycode/IDN homograph | 35 |
| Dangerous file extension | 40 |
| Oversized domain segment | 12 |

### Email Detector (10 checks)
| Check | Weight |
|---|---|
| Urgency language (2+ triggers) | 25 |
| Threat language | 30 |
| Lure/prize language | 28 |
| Credential harvesting phrases | 32 |
| Financial scam indicators | 35 |
| Brand impersonation via free email | 15–35 |
| Suspicious embedded links | 15 each |
| Excessive capitalization | 10 |
| Excessive exclamation marks | 8 |
| Generic greeting | 12 |

**Result thresholds:**
- URL: `< 30` = safe, `30–64` = suspicious, `≥ 65` = fraud
- Email: `< 25` = safe, `25–59` = suspicious, `≥ 60` = fraud

---

## 🗄️ Data Storage (In-Memory)

All data stored in `backend/src/data/store.js` as plain JS arrays.

- **Resets on server restart** (by design — no DB required)
- Demo accounts are **seeded on startup** (admin + demo user)
- Each analysis record: `{ id, userId, type, content, result, reasons, timestamp, flagged }`
- To upgrade to MongoDB: replace `store.getUsers()` etc. with Mongoose model calls

---

## 🎨 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| PDF | jsPDF |
| Backend | Node.js + Express |
| Auth | bcryptjs + jsonwebtoken |
| Validation | express-validator |
| Rate Limiting | express-rate-limit |

---

*Veridex v3 — "Verify Before You Click." Production-structured, no-database prototype.*
