# JP Learner App

## Giới thiệu / Overview

**VI:** Ứng dụng học tiếng Nhật theo lộ trình JLPT, gồm 2 phần:
- **Client (Người học):** đăng ký/đăng nhập, học theo bài, tra từ điển, làm bài kiểm tra, theo dõi tiến độ.
- **Admin (Quản trị):** quản lý nội dung (từ vựng/ngữ pháp/bài học/nghe/nói/đọc/test) và phân quyền (role/permissions).

**EN:** A JLPT-learning app with 2 modules:
- **Client:** register/login, learn by lessons, dictionary, tests, progress tracking.
- **Admin:** manage learning content and role/permission (RBAC).

---

## Cấu trúc thư mục / Repository Structure

- `code/backend` — Node.js/Express + MongoDB (REST API)
- `code/frontend` — Expo (React Native) + expo-router (mobile + web)
- `other/` — report/assets (documentation)

---

## Công nghệ / Tech Stack

**Backend**
- Node.js, Express
- MongoDB + Mongoose
- JWT auth

**Frontend**
- Expo + React Native + TypeScript
- expo-router (file-based routing)

---

## API Prefix (Backend)

Backend mounts routes by prefixes (see `code/backend/src/routes/index.route.js`):

- Admin content: `/api/admin/content/*`
  - Example: `/api/admin/content/word`, `/api/admin/content/lesson`
- Admin system: `/api/admin/system/*`
  - Example: `/api/admin/system/admins`, `/api/admin/system/roles`
- Admin auth: `/api/admin/auth/*`
  - Example: `POST /api/admin/auth/login`
- Client APIs: `/api/client/*`
  - Example: `POST /api/client/auth/login`, `/api/client/lesson`, `/api/client/dictionary`

---

## Chạy local / Run Locally

### 1) Backend

**VI:**
1. Vào thư mục backend:
   - `cd code/backend`
2. Cài dependencies:
   - `npm install`
3. Tạo file `.env` (ví dụ):
   - `PORT=3000`
   - `MONGO_URL=mongodb+srv://...`
   - `JWT_SECRET=your_secret`
4. Chạy:
   - Dev: `npm run dev`
   - Prod: `npm start`

**EN:**
1. `cd code/backend`
2. `npm install`
3. Create `.env` with `PORT`, `MONGO_URL`, `JWT_SECRET`
4. Run: `npm run dev` or `npm start`

### 2) Frontend

**VI:**
1. Vào thư mục frontend:
   - `cd code/frontend`
2. Cài dependencies:
   - `npm install`
3. Tạo `.env` cho Expo web/mobile (ví dụ, trỏ về backend local hoặc Render):
   - `EXPO_PUBLIC_API_USER_AUTH_URL=https://<backend>/api/client/auth`
   - `EXPO_PUBLIC_API_ADMIN_AUTH_URL=https://<backend>/api/admin/auth`
   - `EXPO_PUBLIC_API_ADMIN_CONTENT_URL=https://<backend>/api/admin/content`
   - `EXPO_PUBLIC_API_ADMIN_SYSTEM_URL=https://<backend>/api/admin/system`
   - `EXPO_PUBLIC_API_CLIENT_LESSON_URL=https://<backend>/api/client/lesson`
   - `EXPO_PUBLIC_API_CLIENT_USER_URL=https://<backend>/api/client/user`
   - `EXPO_PUBLIC_API_CLIENT_TEST_URL=https://<backend>/api/client/test`
4. Chạy:
   - `npm start`

**EN:**
1. `cd code/frontend`
2. `npm install`
3. Configure `EXPO_PUBLIC_API_*` env vars
4. Run: `npm start`

---

## Deploy

### Backend on Render

**VI (tóm tắt):**
- Create **Web Service** from GitHub repo
- **Root Directory:** `code/backend`
- **Build Command:** `npm ci` (or `npm install`)
- **Start Command:** `npm start`
- Add env vars: `MONGO_URL`, `JWT_SECRET` (Render provides `PORT` automatically)

**EN (short):**
- New Render Web Service
- Root: `code/backend`
- Build: `npm ci`
- Start: `npm start`
- Env: `MONGO_URL`, `JWT_SECRET`

### Frontend on Vercel (Web)

**VI:** Deploy web build (static) trên Vercel:
- **Root Directory:** `code/frontend`
- Build command: `npm run build` (uses `expo export -p web`)
- Output dir: `dist`
- Set **Environment Variables** `EXPO_PUBLIC_API_*` trỏ về Render URL
- Redeploy sau khi đổi env (Expo export bake env vào build)

**EN:**
- Root: `code/frontend`
- Build: `npm run build`
- Output: `dist`
- Set `EXPO_PUBLIC_API_*` to your Render backend URL
- Redeploy after changing env vars

---

## Troubleshooting / Lỗi thường gặp

- **404/NOT_FOUND / 405 on Vercel when login/register**
  - **Cause:** frontend calls API relative to Vercel domain (missing/wrong `EXPO_PUBLIC_API_*`).
  - **Fix:** set env vars on Vercel to full Render URLs, then redeploy.

- **API returns 404 on Render**
  - Check correct prefixes:
    - `.../api/admin/system/admins` (not `/api/admin/admins`)
    - `.../api/admin/content/word` (not `/api/admin/words`)

---

## Notes

- `code/frontend/api-client/` contains API client modules. It is named `api-client` to avoid Vercel treating `api/` as Serverless Functions.
