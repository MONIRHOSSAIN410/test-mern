# DashFlow – Inventory & Sales Dashboard (MERN Stack)

**DashFlow** is a responsive web application for managing inventory items,
designed to showcase full-stack MERN skills.

---

## 🚀 Tech Stack

### 🔹 Frontend
- React 19 + Vite
- Redux Toolkit
- Tailwind CSS v4
- React Router DOM v7
- React Toastify
- Framer Motion
- Axios

### 🔹 Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs (Password Hashing)

---

## 🔐 Features

| Feature | Status |
| --- | --- |
| User registration & login (JWT) | ✅ Working |
| Protected routes | ✅ Working |
| Item management (add / edit / delete / search) | ✅ Working |
| Dashboard with inventory stats | ✅ Working |
| Paragraph search with live highlighting | ✅ Working |
| Contact form (client + server validation) | ✅ Working |
| Toast notifications & responsive design | ✅ Working |
| Sales management | 🚧 Not implemented (no backend model yet) |

---

## 📁 Project Structure

```
DashFlow/
├── backend/         # Node.js + Express + MongoDB API
│   ├── config/      # DB connection
│   ├── controllers/ # Route handlers
│   ├── middleware/  # auth + central error handling
│   ├── models/      # Mongoose schemas
│   └── routes/      # auth, items, contact, paragraph
├── frontend/        # React + Tailwind + Redux UI
│   └── src/
│       ├── api/         # shared axios client
│       ├── app/         # redux store
│       ├── components/  # Navbar, Sidebar, Loader, PrivateRoute
│       ├── features/    # auth slice + service
│       ├── layouts/     # DashboardLayout
│       ├── pages/       # Home, Login, Register, Dashboard, Items,
│       │                #   Sales, Searchtxt, ContactUs
│       └── utils/       # auth helpers
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (copy `.env.example`):

```
PORT=5008
MONGO_URI=memory          # or a real mongodb:// connection string
JWT_SECRET=a_long_random_secret
CLIENT_URL=http://localhost:5173
```

`MONGO_URI=memory` spins up an in-memory MongoDB so you can run the app
without installing MongoDB. The first run downloads a MongoDB binary, so it
needs internet access; for offline use, point `MONGO_URI` at a real server.

```bash
npm run dev      # http://localhost:5008
```

### 2. Frontend

```bash
cd ../frontend
npm install
npm run dev      # http://localhost:5173
```

Optional `frontend/.env`:

```
VITE_API_URL=http://localhost:5008
```

---

## 🔌 API Reference

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | – | Server status |
| POST | `/api/auth/register` | – | Create account, returns JWT |
| POST | `/api/auth/login` | – | Log in, returns JWT |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/items` | ✅ | List own items (`?search=` supported) |
| POST | `/api/items` | ✅ | Create item |
| PUT | `/api/items/:id` | ✅ | Update own item |
| DELETE | `/api/items/:id` | ✅ | Delete own item |
| GET | `/api/paragraph` | – | Paragraph for the search page |
| POST | `/api/contact` | – | Validate & accept a contact message |

Every error response is JSON: `{ "success": false, "message": "..." }`.

---

## ⭐️ Show Your Support

If you like this project, don't forget to ⭐ the repo and share it!
