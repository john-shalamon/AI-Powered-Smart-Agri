# AI-Powered Smart Agriculture Platform (AgriConnect)

An AI-powered farmer-to-market platform connecting farmers, buyers, and transporters.

## Default User Credentials

All pre-seeded accounts use the password: **`password123`**

| Role         | Name              | Email                      | Password      |
|--------------|-------------------|----------------------------|---------------|
| 🌾 Farmer    | Ravi Kumar        | ravi@farmer.com            | password123   |
| 🌾 Farmer    | Suresh Patel      | suresh@farmer.com          | password123   |
| 🛒 Buyer     | Amit Singh        | amit@buyer.com             | password123   |
| 🛒 Buyer     | Priya Sharma      | priya@buyer.com            | password123   |
| 🚛 Transporter | Rajesh Transport | rajesh@transport.com       | password123   |
| 🚛 Transporter | Vikram Logistics | vikram@transport.com       | password123   |
| 👨‍💼 Admin    | Admin User        | admin@agriai.com           | password123   |

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev   # starts on port 4001
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # starts on port 3000
```

## Features

- **Farmer Dashboard**: List crops, view market insights, manage orders, AI disease detection
- **Buyer Dashboard**: Browse crop listings, place orders, track deliveries
- **Transporter Dashboard**: Accept transport jobs, update delivery status, view earnings
- **Admin Dashboard**: Manage all users, view analytics, create new users with credentials

## Admin: Creating New Users

1. Log in as admin (`admin@agriai.com` / `password123`)
2. Navigate to **Users** → click **Add New User**
3. Fill in name, email, password, role, and optional phone
4. After creation, a dialog shows the credentials — copy and share with the new user

## Architecture

- **Backend**: Node.js + Express + Socket.IO (in-memory store for MVP)
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Real-time**: Socket.IO for live notifications and order updates
- **Auth**: JWT-based authentication (7-day tokens)
