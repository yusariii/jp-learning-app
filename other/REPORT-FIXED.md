# BÁO CÁO KỲ – Dự án JP Learner App

- **Họ và tên SV**: …
- **MSSV**: …
- **Lớp**: …
- **Giảng viên hướng dẫn**: …
- **Thời gian thực hiện**: … (ví dụ: 10/2025 – 01/2026)
- **Ngày báo cáo**: 17/01/2026

---

## 1) Làm gì? (Mục đích, nội dung công việc)

### 1.1 Mục đích
Xây dựng ứng dụng học tiếng Nhật theo lộ trình JLPT, gồm 2 nhóm người dùng:
- **Người học (Client)**: đăng ký/đăng nhập, học theo bài, tra cứu từ điển (từ vựng/ngữ pháp), làm bài kiểm tra và theo dõi tiến độ.
- **Quản trị viên (Admin)**: quản lý nội dung học tập (từ vựng, ngữ pháp, bài học, nghe/nói/đọc, bài test) và quản lý phân quyền.

### 1.2 Nội dung công việc đã thực hiện
**A. Backend (Node.js/Express + MongoDB/Mongoose)**
- Tạo server Express, cấu hình middleware (CORS, Helmet, logger, JSON body) và kết nối MongoDB.
- Thiết kế REST API theo 3 nhóm prefix:
  - `/api/admin/content/*`: CRUD dữ liệu nội dung học (word/grammar/reading/speaking/listening/lesson/test).
  - `/api/admin/system/*`: quản trị hệ thống (admins, roles, role-permissions).
  - `/api/client/*`: chức năng cho người dùng (auth, lesson, user, test, dictionary, reading, speaking…).
- Xây dựng **xác thực JWT** (Admin/User), hỗ trợ **optional auth** cho các endpoint có thể dùng khi không đăng nhập (ví dụ: tra cứu từ điển).
- Xây dựng module **role-permission** dạng **ma trận quyền** (feature.action) để UI dễ cấu hình.
- Hỗ trợ phân trang & lọc/tìm kiếm (ví dụ: tìm từ vựng theo keyword, JLPT level).

**B. Frontend (Expo/React Native + expo-router)**
- Xây dựng cấu trúc màn hình theo file-based routing (expo-router).
- Xây dựng luồng **đăng ký/đăng nhập User** và **đăng nhập Admin**.
- Tạo lớp gọi API và tự động gắn Bearer token từ storage.
- Xây dựng hook quản lý phiên đăng nhập + refresh role/permissions cho Admin.
- Tạo màn hình **Admin Dashboard** (bảo vệ truy cập: cần đăng nhập + có role).

---

## 2) Làm như thế nào? (Quá trình thực hiện)

### 2.1 Tìm hiểu lý thuyết và nền tảng
- REST API với Express: routing, controller, middleware.
- MongoDB/Mongoose: schema/model, query/filter/search, lean(), populate.
- JWT: sign/verify token, Bearer token trên header `Authorization`.
- Expo/React Native: component, hooks, điều hướng với expo-router.
- RBAC cơ bản: role & permission (ma trận quyền theo feature/action).

### 2.2 Thiết kế kiến trúc & tổ chức code
**Backend**
- Entry server: `code/backend/src/app.js`.
- Route tổng hợp (mount router theo prefix): `code/backend/src/routes/index.route.js`.
- Tách router & controller theo 2 nhóm: `admin/*` và `client/*`.
- Middleware xác thực:
  - `verifyToken`: bắt buộc đăng nhập.
  - `optionalAuth`: có token thì nhận user, không có token vẫn chạy.

**Frontend**
- Root layout & theme provider: `code/frontend/app/_layout.tsx`.
- Màn hình theo module: `code/frontend/app/admin/*`, `code/frontend/app/client/*`.
- HTTP helper: `code/frontend/helpers/http.ts` (tự attach token).
- Auth hook: `code/frontend/hooks/use-auth.ts` (load session + refresh permissions).

### 2.3 Quy trình triển khai (các bước chính)
1. Khởi tạo backend: cấu hình Express + kết nối MongoDB + cấu trúc thư mục (routes/controllers/models).
2. Thiết kế API prefix theo nhóm nghiệp vụ (Admin Content, Admin System, Client).
3. Xây dựng Auth:
   - User: register/login, trả token + thông tin user.
   - Admin: login, trả token + thông tin admin + role.
4. Xây dựng nghiệp vụ Client:
   - Lesson: danh sách bài học, lấy chi tiết, lấy words/grammars/listenings theo lesson.
   - Dictionary: search từ vựng/ngữ pháp + xem chi tiết.
   - Test: list/detail/submit (tính điểm theo section).
   - User: profile, update profile, progress, cập nhật tiến độ theo section.
5. Xây dựng nghiệp vụ Admin:
   - CRUD nội dung học (từ vựng, ngữ pháp, bài học, …).
   - Role & permission: cấu hình quyền theo ma trận feature/action.
6. Tích hợp frontend:
   - Tạo màn hình đăng nhập/đăng ký.
   - Gọi API, lưu token/user vào storage.
   - Bảo vệ route Admin (redirect về login khi chưa có session/role).

### 2.4 Vấn đề gặp phải & cách giải quyết
- **Vấn đề 1: Đồng bộ phân quyền**: khi role/permission thay đổi ở DB, cần cập nhật ở app.
  - Cách làm: `use-auth.ts` refresh admin doc + fetch lại permissions.
- **Vấn đề 2: Lỗi mạng/parse lỗi API**: response không luôn là JSON.
  - Cách làm: HTTP helper parse JSON/text để hiển thị message thân thiện.
- **Vấn đề 3: Tổ chức API**: dễ bị rối nếu không tách module.
  - Cách làm: tách theo prefix + router/controller rõ ràng.

---

## 3) Kết quả ra sao? (Kết quả đạt được + hình ảnh)

### 3.1 Kết quả đạt được
- Hoàn thiện backend theo mô hình REST API, chia nhóm Admin/Client rõ ràng.
- Hoàn thiện xác thực JWT, có cơ chế optional auth.
- Các chức năng client có thể sử dụng: đăng nhập/đăng ký, xem bài học, tra cứu từ điển, làm bài test, cập nhật tiến độ.
- Các chức năng admin có thể sử dụng: quản lý nội dung học và phân quyền role-permissions.
- Frontend đã có các màn hình chính và hệ thống gọi API + lưu session.

### 3.2 Minh hoạ (chèn ảnh)

#### A) Luồng người dùng (Client)

**Ảnh 01 – Màn hình User Login**

Giao diện đăng nhập với gradient hiện đại, form nhập email/password và nút "Đăng nhập".

![](report-assets/screenshots/01-user-login.jfif)

**Ảnh 02 – Màn hình User Register**

Form đăng ký tài khoản người dùng với các trường: tên, email, password, xác nhận password, và chọn JLPT level.

![](report-assets/screenshots/03-user-register.jfif)

**Ảnh 03 – Trang chủ sau khi đăng nhập**

Hiển thị thống kê tiến độ học tập (XP, streak, số bài hoàn thành), mục tiêu hôm nay, và các nút bắt đầu nhanh.

![](report-assets/screenshots/05-user-home.jfif)

#### B) Bài học (Lesson)

**Ảnh 04 – Danh sách bài học theo lộ trình**

Hiển thị các bài học theo hình thức bản đồ (lesson map) với trạng thái và số sao đạt được.

![](report-assets/screenshots/06-lesson-list.jfif)

**Ảnh 05 – Chi tiết bài học**

Màn hình chi tiết bài học với các section: từ vựng, ngữ pháp, nghe, đọc và nói.

![](report-assets/screenshots/08-lesson-detail.jfif)

**Ảnh 06 – Học từ vựng theo bài**

Giao diện học từ vựng với hiển thị từ tiếng Nhật, nghĩa, ví dụ và nút flip để xem chi tiết.

![](report-assets/screenshots/09-lesson-words.jfif)

**Ảnh 07 – Luyện ngữ pháp theo bài**

Danh sách các điểm ngữ pháp trong bài học với hiển thị cấu trúc, ý nghĩa và ví dụ.

![](report-assets/screenshots/10-lesson-grammars.jfif)

**Ảnh 08 – Luyện nghe theo bài**

Giao diện luyện nghe với audio player và các câu hỏi trắc nghiệm.

![](report-assets/screenshots/11-lesson-listenings.jfif)

#### C) Từ điển (Dictionary)

**Ảnh 09 – Màn hình từ điển**

Màn hình tra cứu với khung tìm kiếm và tab chuyển đổi giữa từ vựng và ngữ pháp.

![](report-assets/screenshots/12-dictionary-home.jfif)

**Ảnh 10 – Kết quả tìm kiếm từ vựng**

Danh sách từ vựng tìm được với hiển thị từ Nhật, phiên âm, nghĩa và JLPT level.

![](report-assets/screenshots/13-dictionary-words-search.jfif)

**Ảnh 11 – Chi tiết một từ vựng**

Thông tin chi tiết về từ vựng: kanji, hiragana, romaji, nghĩa, ví dụ và cách dùng.

![](report-assets/screenshots/14-dictionary-word-detail.jfif)

**Ảnh 12 – Kết quả tìm kiếm ngữ pháp**

Danh sách các mẫu ngữ pháp với cấu trúc, nghĩa và level.

![](report-assets/screenshots/15-dictionary-grammars-search.jfif)

**Ảnh 13 – Chi tiết một mẫu ngữ pháp**

Thông tin chi tiết về điểm ngữ pháp: cấu trúc, giải thích, cách dùng và ví dụ minh họa.

![](report-assets/screenshots/16-dictionary-grammar-detail.jfif)

#### D) Kiểm tra (Test/Quiz)

**Ảnh 14 – Danh sách bài test**

Danh sách các bài kiểm tra theo JLPT level với thông tin thời gian và điểm đạt.

![](report-assets/screenshots/17-test-list.jfif)

**Ảnh 15 – Màn hình làm bài test**

Giao diện làm bài test với câu hỏi và các đáp án trắc nghiệm, thanh tiến độ phía trên.

![](report-assets/screenshots/18-test-doing.jfif)

**Ảnh 16 – Kết quả bài test**

Hiển thị điểm số, tỷ lệ phần trăm, trạng thái đạt/không đạt và điểm theo từng section.

![](report-assets/screenshots/19-test-result.jfif)

#### E) Hồ sơ người dùng

**Ảnh 17 – Trang hồ sơ người dùng**

Thông tin cá nhân, thống kê học tập và nút chỉnh sửa thông tin/đăng xuất.

![](report-assets/screenshots/20-user-profile.jfif)

---

#### F) Luồng quản trị (Admin)

**Ảnh 18 – Màn hình Admin Login**

Giao diện đăng nhập admin với theme màu tím đặc trưng, biểu tượng khiên và chữ "ADMIN ACCESS".

![](report-assets/screenshots/21-admin-login.jfif)

**Ảnh 19 – Admin Dashboard**

Trang tổng quan quản trị với menu sidebar và các thống kê hệ thống.

![](report-assets/screenshots/22-admin-dashboard.jfif)

#### G) Quản lý nội dung (Admin Content CRUD)

**Ảnh 20 – Danh sách từ vựng (Admin)**

Bảng danh sách từ vựng với các cột: từ Nhật, nghĩa, level và các nút thao tác sửa/xóa.

![](report-assets/screenshots/23-admin-word-list.jfif)

**Ảnh 21 – Tạo mới từ vựng (Admin)**

Form tạo từ vựng mới với các trường nhập liệu: kanji, hiragana, romaji, nghĩa, ví dụ, JLPT level.

![](report-assets/screenshots/24-admin-word-create.jfif)

**Ảnh 22 – Sửa từ vựng (Admin)**

Form chỉnh sửa từ vựng với dữ liệu đã có sẵn để cập nhật.

![](report-assets/screenshots/25-admin-word-edit.jfif)

#### H) Quản trị hệ thống (Roles/Permissions/Admins)

**Ảnh 23 – Màn hình phân quyền (Role-Permissions Matrix)**

Giao diện ma trận phân quyền theo feature và action (Read/Create/Update/Delete) cho từng role.

![](report-assets/screenshots/26-admin-role-permission.jfif)

**Ảnh 24 – Danh sách quản trị viên**

Bảng danh sách admin với thông tin tên, email, role và các nút thao tác quản lý.

![](report-assets/screenshots/27-admin-list-admin.jfif)

---

## 4) Phạm vi API đã có (tóm tắt)

### 4.1 Admin
- Auth: `POST /api/admin/auth/login`
- Content CRUD (ví dụ):
  - Word: `GET/POST /api/admin/content/word`, `GET/PUT/DELETE /api/admin/content/word/:id`
  - Grammar/Reading/Speaking/Listening/Lesson/Test: tương tự theo prefix `/api/admin/content/*`
- System:
  - Admins: `/api/admin/system/admins`
  - Roles: `/api/admin/system/roles`
  - Role permissions: `/api/admin/system/roles/:roleId/permissions`

### 4.2 Client
- Auth: `POST /api/client/auth/register`, `POST /api/client/auth/login`
- Lesson: `GET /api/client/lesson`, `GET /api/client/lesson/:id`, `GET /api/client/lesson/:id/words|grammars|listenings`
- Dictionary: `GET /api/client/dictionary/words/search`, `GET /api/client/dictionary/grammar/search`, `GET /api/client/dictionary/words/:id`, `GET /api/client/dictionary/grammar/:id`
- Test: `GET /api/client/test`, `GET /api/client/test/:id`, `POST /api/client/test/:id/submit`
- User: `GET/PUT /api/client/user/profile`, `GET /api/client/user/progress`, `POST /api/client/user/progress/:lessonId/section` ...

---

## 5) Hướng phát triển
- Hoàn thiện thống kê tiến độ thực (hiện một số endpoint trả cấu trúc + TODO/mock theo user).
- Bổ sung kiểm soát truy cập admin ở route-level (verifyToken + kiểm tra permission) nếu triển khai RBAC đầy đủ.
- Viết tài liệu môi trường `.env` (backend + frontend) và chuẩn hoá base URL API.
- Bổ sung test (Postman collection hoặc unit/integration) và logging/monitoring.

---

## 6) Hướng dẫn chạy dự án (để demo)

### Backend
1. Vào thư mục `code/backend`
2. Cài dependencies: `npm install`
3. Tạo `.env` (ví dụ):
   - `MONGO_URL=...`
   - `PORT=3000`
   - `JWT_SECRET=...`
4. Chạy dev: `npm run dev`

### Frontend
1. Vào thư mục `code/frontend`
2. Cài dependencies: `npm install`
3. Chạy app: `npx expo start`
4. Cấu hình các biến `EXPO_PUBLIC_API_*` (nếu cần) để trỏ về backend.
