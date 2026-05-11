# CredFlow — Backend API

Medical Credentialing Management System — REST API built with Node.js, Express, MongoDB, and Cloudinary.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| File Storage | Multer + Cloudinary |
| Deployment | Render |

---

## Project Structure

```
server/
├── src/
│   ├── controllers/
│   │   ├── auth.js          # register, login, logout, getMe
│   │   ├── requests.js      # client-facing request controllers
│   │   └── admin.js         # admin controllers
│   ├── middleware/
│   │   ├── auth.js          # verifyToken, requireAdmin, requireClient, ownsRequest
│   │   └── upload.js        # Multer memoryStorage config
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── CredentialingRequest.js
│   │   ├── Document.js
│   │   ├── StatusLog.js
│   │   └── SupportTicket.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── requests.js
│   │   └── admin.js
│   ├── lib/
│   │   └── cloudinary.js    # Cloudinary upload/delete helpers
│   └── app.js               # Express app setup + CORS
├── seed.js                  # Demo data seed script
├── server.js                # Entry point — mongoose.connect + listen
├── .env                     # Environment variables (never commit)
├── .gitignore
└── package.json
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/credflow-backend.git
cd credflow-backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/credentialing_db
JWT_SECRET=your_super_secret_key_minimum_32_characters
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed demo data

```bash
node seed.js
```

This creates:
- 1 admin account
- 3 client accounts
- 8 credentialing requests (mixed statuses)
- 3 support tickets
- Sample documents

### 4. Run development server

```bash
npm run dev
```

Server starts at `http://localhost:5000`

---

## API Endpoints

### Auth — Public

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create client account |
| POST | `/api/auth/login` | Login, receive JWT cookie |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user |

### Client — JWT Required

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/requests` | Submit credentialing request |
| GET | `/api/requests/my` | Get own requests |
| GET | `/api/requests/my/stats` | Get own stat counts |
| GET | `/api/requests/:id` | Single request + timeline + docs |
| POST | `/api/requests/:id/documents` | Upload document |
| DELETE | `/api/requests/:id/documents/:docId` | Delete document |
| POST | `/api/support` | Submit support ticket |
| GET | `/api/support/my` | Get own support tickets |

### Admin — JWT + Admin Role Required

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard/stats` | Platform stats |
| GET | `/api/admin/requests` | All requests with filters |
| GET | `/api/admin/requests/:id` | Request detail |
| PATCH | `/api/admin/requests/:id/status` | Update status + log |
| GET | `/api/admin/clients` | All clients |
| GET | `/api/admin/clients/:id` | Client detail + requests |
| GET | `/api/admin/support` | All support tickets |
| PATCH | `/api/admin/support/:id/resolve` | Resolve ticket |

---

## Status State Machine

```
pending → in_review → approved
                   → rejected
```

Only these transitions are valid. Any other transition returns `400 Bad Request`.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | adminpassword |
| Client | client@example.com | clientpassword |
| Client | sara@novacare.io | password123 |
| Client | bilal@citymed.pk | password123 |

---

## Deployment (Render)

1. Push to GitHub
2. Create a new **Web Service** on Render
3. Set **Root Directory** to your server folder (if monorepo)
4. Set **Start Command** to `node server.js`
5. Add all environment variables in Render → Environment tab
6. Deploy

> **Free tier note:** Render spins down after 15 minutes of inactivity. First request may take 30–60 seconds.

---

## Scripts

```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start production server
node seed.js    # Seed demo data
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret (32+ chars) |
| `NODE_ENV` | Yes | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Yes | From Cloudinary dashboard |
