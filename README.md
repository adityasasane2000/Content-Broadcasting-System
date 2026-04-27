# 📡 Content Broadcasting System (Backend)

A backend system where teachers upload content, principals approve/reject it, and approved content is scheduled and broadcast dynamically.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Redis (for caching)
* JWT Authentication
* Multer (file uploads)

---

## 📁 Project Setup

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd project
npm install
```

---

### 2. Setup Environment Variables

Create a `.env` file in root:

```env
PORT=8000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
REDIS_URL=redis://localhost:6379
```

---

### 3. Setup Database

```bash
npx prisma generate
npx prisma migrate dev
```

(Optional: seed subjects manually or via script)

---

### 4. Start Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:8000
```

---

## 📦 API Overview

### 🔐 Auth

* POST `/auth/register`
* POST `/auth/login`

---

### 👨‍🏫 Teacher APIs

* POST `/content/upload` → Upload content
* GET `/content/my` → View own content
* POST `/content/schedule` → Schedule approved content

---

### 🏫 Principal APIs

* GET `/content` → View all content (filters + pagination)
* PATCH `/content/:contentId` → Approve / Reject content

---

### 📺 Public API

* GET `/content/live/:teacherId`

Returns currently active content for a teacher based on:

* approval status
* scheduling window
* rotation duration

---

## 🔄 Content Flow

1. Teacher uploads content → `PENDING`
2. Principal:

   * APPROVES → eligible
   * REJECTS → stores reason
3. Teacher schedules approved content
4. System rotates content dynamically
5. Public API returns active content

---

## 🧠 Key Features

* JWT Authentication & RBAC
* Content lifecycle management
* Teacher-controlled scheduling
* Time-based rotation system
* Pagination & filtering
* Rate limiting (security)
* Redis caching (performance)

---

## ⚠️ Notes

* Files stored locally in `/uploads`
* Redis is optional (system works without it)
* For production: use AWS S3 for file storage

---
