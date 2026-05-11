# CredFlow — Final Project Documentation
### Medical Credentialing Management System
**DevelopersHub Corporation Internship Task — Option 2**
**Submission Deadline: 28 April 2026**

---

## 1. Project Overview

CredFlow is a full-stack Medical Credentialing Management System that streamlines the process of verifying and approving healthcare provider credentials. It features a client portal for submitting and tracking credentialing requests, and an admin panel for managing the entire verification pipeline.

### Live URLs

| Service | URL |
|---|---|
| Frontend | https://medical-credential-frontend.vercel.app |
| Backend API | https://medical-credential-backend.onrender.com |
| GitHub (Frontend) | https://github.com/your-username/credflow-frontend |
| GitHub (Backend) | https://github.com/your-username/credflow-backend |

---

## 2. Tech Stack

### Frontend
- **Next.js 14** — App Router, SSR, file-based routing
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client with interceptors
- **js-cookie** — JWT cookie management
- **Lucide React** — icon library
- **shadcn/ui** — accessible UI components
- **Vercel** — deployment platform

### Backend
- **Node.js + Express** — REST API server
- **MongoDB + Mongoose** — NoSQL database with ODM
- **JWT + bcryptjs** — authentication and password hashing
- **Multer** — multipart file upload handling
- **Cloudinary** — cloud file storage and CDN
- **Render** — deployment platform

---

## 3. System Architecture

```
Browser
  │
  ▼
Next.js App (Vercel)
  ├── middleware.js         → Route protection by JWT role
  ├── (auth) pages          → Public: sign-in, sign-up
  ├── (client) dashboard    → Protected: client role only
  └── admin pages           → Protected: admin role only
  │
  │  axios (withCredentials + Authorization header)
  ▼
Express API (Render)
  ├── verifyToken middleware → Validates JWT
  ├── requireAdmin/Client   → Role-based access control
  ├── controllers           → Business logic
  └── Mongoose models       → MongoDB queries
  │
  ├── MongoDB Atlas          → Users, requests, logs, tickets
  └── Cloudinary             → Document/file storage
```

---

## 4. Database Schema

### Collections

**users** — Authentication data
```
id, name, email, password_hash, role (client|admin), createdAt
```

**clients** — Business profile for client users
```
id, user_id (→ users), company_name, phone, address, createdAt
```

**credentialing_requests** — Core entity
```
id, client_id (→ clients), provider_name, specialty,
status (pending|in_review|approved|rejected), notes,
submitted_at, updatedAt
```

**documents** — Uploaded files linked to requests
```
id, request_id (→ requests), file_name, file_url (Cloudinary),
file_type, public_id, uploaded_at
```

**status_logs** — Immutable audit trail
```
id, request_id (→ requests), changed_by (→ users),
old_status, new_status, note, changed_at
```

**support_tickets** — Client support requests
```
id, client_id (→ clients), subject, message,
is_resolved, resolution_note, resolved_at, createdAt
```

---

## 5. API Documentation

### Base URL
```
https://medical-credential-backend.onrender.com
```

### Authentication
All protected routes require a JWT token sent via:
- `Authorization: Bearer <token>` header (primary)
- `token` httpOnly cookie (secondary)

---

### Auth Endpoints

#### POST `/api/auth/register`
Create a new client account.

**Request body:**
```json
{
  "name": "Ahmed Khan",
  "email": "ahmed@mercy.com",
  "password": "SecurePass123",
  "company_name": "Mercy Hospital",
  "phone": "+92-300-1234567"
}
```
**Response:** `201 Created`
```json
{ "message": "Account created" }
```

---

#### POST `/api/auth/login`
Authenticate and receive JWT.

**Request body:**
```json
{ "email": "ahmed@mercy.com", "password": "SecurePass123" }
```
**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Ahmed Khan", "email": "...", "role": "client" }
}
```

---

#### GET `/api/auth/me`
Get current logged-in user. **Auth required.**

**Response:** `200 OK`
```json
{ "id": "...", "name": "Ahmed Khan", "email": "...", "role": "client" }
```

---

### Client Endpoints (JWT + client role)

#### POST `/api/requests`
Submit a new credentialing request.

**Request body:**
```json
{
  "provider_name": "Dr. Bilal Raza",
  "specialty": "Cardiology",
  "notes": "Urgent — joining next month"
}
```
**Response:** `201 Created` — Request object

---

#### GET `/api/requests/my`
Get all requests for the logged-in client.

**Query params:** `?status=pending&page=1&limit=10`

**Response:**
```json
{ "requests": [...], "total": 4, "page": 1 }
```

---

#### GET `/api/requests/my/stats`
Get stat counts for the client dashboard.

**Response:**
```json
{
  "total": 4, "pending": 1, "in_review": 1,
  "approved": 1, "rejected": 1, "weekly_change": 8
}
```

---

#### GET `/api/requests/:id`
Get a single request with documents and status timeline.

**Response:**
```json
{
  "id": "...",
  "provider_name": "Dr. Bilal Raza",
  "status": "in_review",
  "documents": [{ "file_name": "npi.pdf", "file_url": "https://res.cloudinary.com/..." }],
  "status_logs": [
    { "old_status": null, "new_status": "pending", "changed_at": "..." },
    { "old_status": "pending", "new_status": "in_review", "note": "...", "changed_at": "..." }
  ]
}
```

---

#### POST `/api/requests/:id/documents`
Upload a document to a request. **Multipart/form-data.**

**Form field:** `document` (PDF, JPG, PNG, WEBP — max 10MB)

**Response:** `201 Created` — Document object with `file_url`

---

#### POST `/api/support`
Submit a support ticket.

**Request body:**
```json
{ "subject": "Cannot upload document", "message": "Getting a 413 error..." }
```

---

### Admin Endpoints (JWT + admin role)

#### GET `/api/admin/dashboard/stats`
Platform-wide statistics.

**Response:**
```json
{
  "total": 48, "pending": 12, "in_review": 9,
  "approved": 21, "rejected": 6,
  "open_tickets": 4, "weekly_change": 8,
  "approval_rate": 75.0, "critical_count": 2
}
```

---

#### GET `/api/admin/requests`
All credentialing requests with filters.

**Query params:** `?status=pending&client_id=...&page=1&limit=20`

---

#### PATCH `/api/admin/requests/:id/status`
Update request status with audit log entry.

**Request body:**
```json
{ "status": "approved", "note": "All documents verified. NPI confirmed." }
```

**Valid transitions:**
- `pending` → `in_review`
- `in_review` → `approved` or `rejected`

**Response:** `200 OK` — Updated request + log entry

---

#### GET `/api/admin/clients`
All registered clients with search.

**Query params:** `?search=mercy&page=1&limit=20`

---

#### PATCH `/api/admin/support/:id/resolve`
Mark a support ticket as resolved.

**Request body:**
```json
{ "resolution_note": "Issue has been fixed." }
```

---

## 6. Features Implemented

### User Side
- [x] Landing page with hero, features, 3-step process, CTA, footer
- [x] Client registration and login with JWT
- [x] Dashboard with stat cards (total, pending, approved, rejected)
- [x] Submit credentialing request — 4-step form (provider info, notes, file upload, review)
- [x] Track request status with visual timeline
- [x] Upload documents (PDF, images) to Cloudinary
- [x] View and download uploaded documents
- [x] Submit and view support tickets with resolution notes
- [x] Secure logout

### Admin Side
- [x] Admin login (separate role, seeded manually)
- [x] Dashboard with platform stats (weekly change, approval rate, critical tickets)
- [x] View all credentialing requests with status filter
- [x] Update request status with mandatory state machine validation
- [x] Write admin notes on status changes
- [x] View complete audit log per request
- [x] Client list with search and request count
- [x] Client detail page with tabbed requests + support tickets view
- [x] Support ticket management with resolve + resolution note

---

## 7. Security Implementation

### Authentication
- Passwords hashed with bcrypt (12 rounds)
- JWT signed with HS256 algorithm
- Token stored in httpOnly cookie (backend) + js-cookie (frontend middleware)
- Token expiry: 7 days
- Every `/api/auth/me` response has `Cache-Control: no-store`

### Authorization
- `verifyToken` middleware validates JWT on every protected route
- `requireAdmin` middleware enforces role === "admin"
- `requireClient` middleware enforces role === "client"
- `ownsRequest` middleware confirms request belongs to the requesting client
- Client identity always taken from `req.user` (token) — never from request body

### State Machine
- Status transitions validated server-side before DB write
- Invalid transitions return `400 Bad Request`
- Both request update and status log written in MongoDB session (atomic)

### File Uploads
- Multer `memoryStorage` — files never written to disk
- File type whitelist: PDF, JPEG, PNG, WEBP
- File size limit: 10MB enforced by Multer
- Files streamed directly from buffer to Cloudinary
- Only `secure_url` stored in database

### CORS
- Origin restricted to exact frontend URL
- `credentials: true` for cookie support
- Preflight OPTIONS handled globally

---

## 8. Deployment Guide

### Backend (Render)

1. Push backend to GitHub
2. New Web Service on Render → connect GitHub repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables:

```
MONGODB_URI           = mongodb+srv://...
JWT_SECRET            = ...
NODE_ENV              = production
CLOUDINARY_CLOUD_NAME = ...
CLOUDINARY_API_KEY    = ...
CLOUDINARY_API_SECRET = ...
```

6. Deploy and copy the Render URL

### Frontend (Vercel)

1. Push frontend to GitHub
2. Import project in Vercel
3. Add environment variable:

```
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

4. Deploy

### Seed Demo Data

After backend is live:

```bash
# Set your production MONGODB_URI in .env
node seed.js
```

---

## 9. Evaluation Criteria Checklist

| Criterion | Status |
|---|---|
| System Architecture and Design | ✅ 3-tier: Next.js + Express + MongoDB |
| Functionality and Feature Implementation | ✅ All required modules implemented |
| API Design and Integration | ✅ RESTful with proper HTTP status codes |
| UI/UX and Responsiveness | ✅ Professional design with teal healthcare theme |
| Code Quality and Structure | ✅ MVC pattern, middleware chain, clean separation |
| Deployment and Completeness | ✅ Live on Vercel + Render |
| Authentication | ✅ JWT + bcrypt + role-based access |
| Role-based dashboards | ✅ Client and Admin completely separate |
| File upload handling | ✅ Multer + Cloudinary |
| Database relationships | ✅ 6 collections with proper references |
| Secure data handling | ✅ CORS, httpOnly cookies, input validation |
| Status tracking system | ✅ State machine + immutable audit log |

---

## 10. Known Limitations

- **Render free tier** spins down after 15 minutes of inactivity. First request may be slow.
- **No real-time notifications** — status updates require page refresh.
- **No email notifications** — future enhancement with Nodemailer/SendGrid.
- **No pagination UI** — backend supports pagination via query params but UI shows all records.

---

## 11. Future Enhancements

- Real-time status notifications via WebSockets
- Email notifications on status change
- PDF report generation for approved providers
- Role-based analytics dashboard with charts
- Provider search and filter on client dashboard
- Admin bulk status update
- Two-factor authentication
- Docker containerization + CI/CD pipeline

---

## 12. Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | adminpassword |
| Client 1 | client@example.com | clientpassword |


---

*Prepared by: Sajid ALi*
*Internship: DevelopersHub Corporation*
*Submission Date: 28 April 2026*
