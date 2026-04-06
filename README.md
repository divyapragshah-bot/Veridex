# 🛡️ VERIDEX v3 — *Verify Before You Click*

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge&logo=jsonwebtokens"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge"/>
</p>

<p align="center">
  <b>Cybersecurity platform to detect fraudulent URLs & phishing emails in real-time.</b><br/>
  Built with scalable architecture, secure authentication, and intelligent detection engine.
</p>

---

## 🚀 Live Demo

🔗 **Frontend:** https://your-frontend-link.com
🔗 **Backend API:** https://your-backend-link.com

---

## ✨ Key Highlights

* 🔍 **Advanced URL & Email Fraud Detection**
* 🔐 **Secure JWT Authentication System**
* 👤 **Role-Based Access (User / Admin)**
* 📊 **Interactive Dashboard & Reports**
* ⚡ **Blazing Fast In-Memory Backend**
* 📄 **PDF Report Generation**
* 🛠️ **Admin Control Panel**
* 📱 **Fully Responsive UI**

---

## 📸 Screenshots

> *(Add your screenshots here for GitHub attraction)*

```
/screenshots/dashboard.png
/screenshots/admin.png
/screenshots/report.png
```

---

## ⚡ Quick Start

### Clone Repository

```bash
git clone https://github.com/<your-username>/veridex-v3.git
cd veridex-v3
```

---

### Run Backend

```bash
cd backend
npm install
npm run dev
```

---

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials

| Role     | Email                                         | Password |
| -------- | --------------------------------------------- | -------- |
| 👑 Admin | [admin@veridex.com](mailto:admin@veridex.com) | admin123 |
| 👤 User  | [demo@veridex.com](mailto:demo@veridex.com)   | demo1234 |
| 👀 Guest | No login required                             | —        |

---

## 🧠 System Architecture

```
Client (React)
     ↓
API Layer (Express)
     ↓
Controllers
     ↓
Detection Engine
     ↓
In-Memory Storage
```

---

## 🔎 Detection Engine

### URL Detection (13 Heuristics)

* Suspicious domains & TLDs
* Phishing keywords
* URL shortening services
* Punycode attacks
* IP-based URLs
* HTTPS validation

### Email Detection (10 Heuristics)

* Urgency & threat language
* Fake brand impersonation
* Credential harvesting attempts
* Suspicious links
* Scam indicators

---

## 📊 Risk Classification

| Type  | Safe | Suspicious | Fraud |
| ----- | ---- | ---------- | ----- |
| URL   | < 30 | 30–64      | ≥ 65  |
| Email | < 25 | 25–59      | ≥ 60  |

---

## 🔐 Authentication Flow

```text
Login → JWT Token → Stored in Browser
        ↓
Protected API Calls (Bearer Token)
        ↓
Middleware Verification
        ↓
Access Granted / Denied
```

---

## 🛠️ Tech Stack

### Frontend

* React 18 (Vite)
* Tailwind CSS
* Framer Motion
* React Router v6

### Backend

* Node.js
* Express.js
* JWT Auth
* bcryptjs
* express-validator

---

## 📡 API Overview

### Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`
* GET `/api/auth/me`

### Analysis

* POST `/api/analysis/url`
* POST `/api/analysis/email`
* GET `/api/analysis/history`

### Admin

* GET `/api/admin/stats`
* GET `/api/admin/users`
* GET `/api/admin/analyses`

---

## 🚀 Deployment

| Platform | Status           |
| -------- | ---------------- |
| Frontend | Vercel / Netlify |
| Backend  | Render / Railway |

---

## 📈 Future Scope

* 🤖 AI/ML-based detection model
* 🌍 Public API release
* 📱 Mobile application
* 🔔 Real-time alerts
* ☁️ Cloud database integration

---

## 🤝 Contributing

```bash
git checkout -b feature/new-feature
git commit -m "Added new feature"
git push origin feature/new-feature
```

---

## 📄 License

MIT License © 2026

---

## 👨‍💻 Author

**Nishank Sanghvi**

---

## ⭐ Show Your Support

If you like this project:

⭐ Star the repo
🍴 Fork it
📢 Share it

---

<p align="center">
  🛡️ <b>Veridex v3 — Because one click can cost everything.</b>
</p>
