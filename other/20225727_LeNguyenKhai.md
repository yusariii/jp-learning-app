---
puppeteer:
  format: A4
  margin:
    top: 2cm
    bottom: 2cm
    left: 2cm
    right: 2cm
  displayHeaderFooter: false
---

<base href="file:///f:/Learning/AndroidApp/jp-learner-app/code/">

<style>
html, body {
  font-family: "Segoe UI", Arial, "Times New Roman", sans-serif;
  font-size: 12pt;
  line-height: 1.45;
}

@media print {
  /* A4 (29.7cm) - margin 2cm top/bottom => vùng nội dung ~25.7cm.
     Giới hạn thấp hơn để chừa chỗ cho caption và heading, tránh bị cắt. */
  img {
    max-height: 19cm !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
  }

  /* Giữ nguyên block ảnh+caption; nếu không đủ chỗ thì đẩy sang trang mới */
  div[style*="page-break-inside"] {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    page-break-before: auto;
  }
}

code, pre {
  font-family: Consolas, "Courier New", monospace;
}

/* Ngăn ảnh bị cắt đôi */
img {
  page-break-inside: avoid !important;
  page-break-after: auto !important;
  page-break-before: auto !important;
  display: block !important;
  max-width: 90% !important;
  margin: 15px auto !important;
  break-inside: avoid !important;
}

/* Giữ ảnh + caption cùng nhau */
p {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Giữ heading + content phía sau */
h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid !important;
  page-break-inside: avoid !important;
  margin-top: 2em !important;
  break-after: avoid !important;
}

/* Giữ toàn bộ block ảnh + mô tả */
div {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  display: block !important;
}

/* Thêm khoảng trống trước ảnh để tránh cắt */
h4 + div, h5 + div {
  page-break-before: auto !important;
  margin-top: 30px !important;
  padding-top: 20px !important;
}
</style>

# BÁO CÁO ĐỒ ÁN – Dự án JP Learner App

- **Họ và tên SV**: Lê Nguyên Khải
- **MSSV**: 20225727
- **Lớp**: IT-E6 02
- **Giảng viên hướng dẫn**: Lê Bá Vui
- **Thời gian thực hiện**: Học kì 2025.1
- **Ngày báo cáo**: 17/01/2026

---

## 1. Làm gì?

### 1.1. Mục đích
Xây dựng ứng dụng học tiếng Nhật theo lộ trình JLPT (Japanese Language Proficiency Test) từ N5 đến N1, phục vụ hai nhóm đối tượng:

**Người học (Client):**
- Đăng ký tài khoản và đăng nhập vào hệ thống
- Học theo bài học có cấu trúc (từ vựng, ngữ pháp, nghe, đọc, nói)
- Tra cứu từ điển (từ vựng và ngữ pháp) theo JLPT level
- Làm bài kiểm tra và xem kết quả chi tiết
- Theo dõi tiến độ học tập cá nhân (XP, streak, số bài hoàn thành)

**Quản trị viên (Admin):**
- Đăng nhập vào hệ thống quản trị
- Quản lý toàn bộ nội dung học tập: từ vựng, ngữ pháp, bài học, bài đọc, bài nghe, bài nói, bài test
- Quản lý hệ thống: tài khoản admin, phân quyền theo role (ma trận quyền feature.action)

### 1.2. Nội dung công việc thực hiện

**Backend (Node.js + Express + MongoDB):**
- Xây dựng RESTful API với kiến trúc phân tầng rõ ràng (routes/controllers/models)
- Tổ chức API theo 3 nhóm prefix:
  - `/api/admin/content/*`: CRUD nội dung học tập (word, grammar, lesson, reading, listening, speaking, test)
  - `/api/admin/system/*`: quản trị hệ thống (admins, roles, role-permissions)
  - `/api/client/*`: chức năng người dùng (auth, lesson, dictionary, test, user profile/progress)
- Xây dựng hệ thống xác thực JWT (JSON Web Token) cho cả Admin và User
- Thiết kế middleware xác thực linh hoạt:
  - `verifyToken`: bắt buộc đăng nhập
  - `optionalAuth`: cho phép truy cập cả khi chưa đăng nhập (tra từ điển)
- Xây dựng module phân quyền dạng ma trận (role-permission matrix) theo cặp feature.action
- Hỗ trợ phân trang, lọc và tìm kiếm theo nhiều tiêu chí (keyword, JLPT level)

**Frontend (React Native + Expo Router):**
- Xây dựng ứng dụng đa nền tảng (iOS, Android, Web) với Expo
- Áp dụng file-based routing với expo-router cho cấu trúc dự án rõ ràng
- Xây dựng luồng đăng ký/đăng nhập cho User và luồng đăng nhập cho Admin
- Tạo lớp HTTP helper tự động gắn JWT token vào mọi request
- Xây dựng hook quản lý phiên đăng nhập và refresh quyền admin
- Thiết kế giao diện hiện đại với gradient, icons và animations
- Bảo vệ route admin (redirect về login nếu chưa xác thực)

---

## 2. Làm như thế nào?

### 2.1. Tìm hiểu lý thuyết và nền tảng

**Công nghệ Backend:**
- **Node.js & Express**: Framework xây dựng server, routing, middleware
- **MongoDB & Mongoose**: Database NoSQL, schema/model, query/aggregation, populate
- **JWT (JSON Web Token)**: Cơ chế xác thực stateless, sign/verify token
- **RESTful API**: Thiết kế API theo chuẩn REST (GET/POST/PUT/DELETE)
- **CORS & Security**: Cấu hình CORS, Helmet để bảo mật ứng dụng

**Công nghệ Frontend:**
- **React Native**: Framework xây dựng mobile app đa nền tảng
- **Expo**: Toolchain giúp phát triển React Native nhanh chóng
- **Expo Router**: File-based routing cho React Native
- **TypeScript**: Type safety cho JavaScript
- **Expo SecureStore**: Lưu trữ token bảo mật trên device
- **LinearGradient**: Tạo hiệu ứng gradient cho UI

**Kiến thức bổ trợ:**
- **RBAC (Role-Based Access Control)**: Phân quyền theo role và permission
- **Async/Await**: Xử lý bất đồng bộ trong JavaScript
- **Hooks**: useState, useEffect, custom hooks trong React
- **Storage**: localStorage (web), SecureStore (mobile)

### 2.2. Thiết kế kiến trúc và tổ chức code

**Backend:**
```
code/backend/src/
├── app.js                    # Entry point, config middleware
├── routes/
│   ├── index.route.js        # Mount all routes
│   ├── admin/
│   │   ├── auth.route.js
│   │   ├── word.route.js
│   │   ├── grammar.route.js
│   │   ├── lesson.route.js
│   │   ├── role.route.js
│   │   └── ...
│   └── client/
│       ├── auth.route.js
│       ├── lesson.route.js
│       ├── dictionary.route.js
│       ├── test.route.js
│       └── user.route.js
├── controllers/
│   ├── admin/               # Business logic cho admin
│   └── client/              # Business logic cho client
├── models/                  # Mongoose schemas
└── middlewares/
    └── auth.middleware.js   # verifyToken, optionalAuth
```

**Frontend:**
```
code/frontend/
├── app/                     # File-based routing
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home page
│   ├── admin/
│   │   ├── _layout.tsx
│   │   ├── auth/login/
│   │   ├── content/         # CRUD modules
│   │   └── system/          # Roles/permissions
│   └── client/
│       ├── auth/            # Login/Register
│       ├── tabs/            # Main app (lesson, dictionary, profile)
│       └── learning/        # Lesson detail pages
├── api/                     # API calls
│   ├── admin/
│   └── client/
├── components/              # Reusable components
├── helpers/
│   ├── http.ts              # HTTP helper with token
│   └── storage.ts           # Save/get token/user
└── hooks/
    └── use-auth.ts          # Auth hook
```

### 2.3. Quy trình thực hiện

**Bước 1: Khởi tạo Backend**
- Cài đặt Node.js, MongoDB
- Tạo project Express, cấu hình middleware (CORS, Helmet, body-parser)
- Kết nối MongoDB với Mongoose
- Tạo cấu trúc thư mục routes/controllers/models

**Bước 2: Xây dựng Models**
- Thiết kế schema cho: User, Admin, Role, Word, Grammar, Lesson, Test
- Định nghĩa relationships (ref, populate)
- Tạo indexes cho search và query performance

**Bước 3: Xây dựng Authentication**
- Tạo API register/login cho User (email + password)
- Tạo API login cho Admin (email + password + role)
- Generate JWT token với thông tin user/admin
- Middleware verifyToken để bảo vệ protected routes
- Middleware optionalAuth cho routes không bắt buộc đăng nhập

**Bước 4: Xây dựng API Client**
- **Lesson API**: List lessons, get detail, get words/grammars/listenings by lessonId
- **Dictionary API**: Search words/grammars, get detail by id
- **Test API**: List tests, get detail, submit answers (calculate score)
- **User API**: Get/update profile, get progress, update lesson progress

**Bước 5: Xây dựng API Admin**
- **Content CRUD**: Word, Grammar, Reading, Listening, Speaking, Lesson, Test
- **System**: Manage admins, roles, role-permissions (ma trận quyền)
- Validation cho input data
- Handle errors và return proper status codes

**Bước 6: Xây dựng Frontend - Auth Flow**
- Tạo màn hình login/register cho Client với UI gradient hiện đại
- Tạo màn hình login cho Admin với theme riêng biệt (purple)
- Lưu token vào SecureStore (mobile) hoặc localStorage (web)
- Lưu thông tin user/admin vào storage
- Auto-attach token vào header `Authorization: Bearer <token>`

**Bước 7: Xây dựng Frontend - Client Features**
- **Home page**: Hiển thị progress, daily goal, quick actions
- **Lesson list**: Lesson map với trạng thái (locked/active/completed) và stars
- **Lesson detail**: Các section (vocab, grammar, listening, reading, speaking)
- **Dictionary**: Search và xem chi tiết từ vựng/ngữ pháp
- **Test**: Làm bài test, submit và xem kết quả chi tiết
- **Profile**: Xem và edit thông tin cá nhân

**Bước 8: Xây dựng Frontend - Admin Features**
- **Dashboard**: Tổng quan hệ thống với sidebar navigation
- **Content Management**: CRUD cho tất cả loại content (word, grammar, lesson, test...)
- **System Management**: Quản lý admin, roles, và ma trận phân quyền
- Form validation và error handling

**Bước 9: Testing & Debugging**
- Test API endpoints bằng Postman/Thunder Client
- Test các flow người dùng trên mobile và web
- Fix bugs và optimize performance
- Handle edge cases

### 2.4. Giải quyết các vấn đề gặp phải

**Vấn đề 1: Token không được gửi lên server**
- **Nguyên nhân**: Middleware authentication không được thêm vào route
- **Giải pháp**: Thêm `optionalAuth` middleware vào route `/test/:id/submit`

**Vấn đề 2: Số bài đã hoàn thành hiển thị sai (0/7)**
- **Nguyên nhân**: Backend API `getUserProgress` trả về `totalLessonsCompleted: 0` không đúng
- **Giải pháp**: Frontend tự tính số bài completed từ `lessons.filter(l => l.userProgress?.status === 'completed')`

**Vấn đề 3: Scroll không hoạt động trên web**
- **Nguyên nhân**: `paddingTop: insets.top` ở View bên ngoài làm giới hạn chiều cao, `flexGrow: 1` trong contentContainerStyle gây conflict
- **Giải pháp**: 
  - Chuyển `paddingTop` vào `contentContainerStyle` của ScrollView
  - Xóa `flexGrow: 1` khỏi container style

**Vấn đề 4: Đồng bộ phân quyền admin**
- **Nguyên nhân**: Khi role/permission thay đổi trong DB, app không cập nhật
- **Giải pháp**: Hook `use-auth.ts` refresh admin document và fetch lại permissions

**Vấn đề 5: Parse lỗi API không đồng nhất**
- **Nguyên nhân**: Response từ server đôi khi là JSON, đôi khi là text
- **Giải pháp**: HTTP helper try-catch parse JSON, fallback sang text để lấy error message

---

## 3. Kết quả ra sao?

### 3.1. Kết quả đạt được

**Backend:**
- Hoàn thiện REST API với 50+ endpoints
- Xác thực JWT hoạt động ổn định cho cả Admin và User
- Middleware authentication linh hoạt (verifyToken, optionalAuth)
- CRUD đầy đủ cho tất cả nội dung học tập
- Hệ thống phân quyền role-permission dạng ma trận
- Hỗ trợ search, filter, pagination
- Submit test và tính điểm tự động theo section

**Frontend:**
- Ứng dụng đa nền tảng (iOS, Android, Web)
- UI/UX hiện đại với gradient và animations
- Luồng đăng ký/đăng nhập hoàn chỉnh
- Tích hợp đầy đủ các API backend
- Bảo vệ routes (redirect khi chưa authenticate)
- Quản lý session và token tự động
- Hiển thị tiến độ học tập real-time
- Admin dashboard với CRUD đầy đủ
- Phân quyền admin theo ma trận

**Chức năng hoàn thiện:**
- Đăng ký/đăng nhập người dùng
- Học theo bài (từ vựng, ngữ pháp, nghe, đọc, nói)
- Tra cứu từ điển
- Làm bài kiểm tra và xem kết quả
- Theo dõi tiến độ học tập
- Quản trị nội dung (Admin CRUD)
- Phân quyền admin

### 3.2. Hình ảnh minh họa

#### A) Giao diện người dùng (Client)

**Đăng nhập & Đăng ký**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Màn hình đăng nhập](report-assets/screenshots/01-user-login.jpg)

*Giao diện đăng nhập với gradient hiện đại, form nhập email/password*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Màn hình đăng ký](report-assets/screenshots/03-user-register.jpg)

*Form đăng ký với các trường: tên, email, password, JLPT level*

</div>

**Trang chủ**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Trang chủ](report-assets/screenshots/05-user-home.jpg)

*Hiển thị thống kê: XP, streak, số bài hoàn thành, mục tiêu hôm nay, quick actions*

</div>

**Bài học**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Danh sách bài học](report-assets/screenshots/06-lesson-list.jpg)

*Lesson map với trạng thái (locked/active/completed) và số sao*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Chi tiết bài học](report-assets/screenshots/08-lesson-detail.jpg)

*Các section: từ vựng, ngữ pháp, nghe, đọc, nói*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Học từ vựng](report-assets/screenshots/09-lesson-words.jpg)

*Giao diện học từ vựng với flip card*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Luyện ngữ pháp](report-assets/screenshots/10-lesson-grammars.jpg)

*Danh sách các điểm ngữ pháp với cấu trúc và ví dụ*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Luyện nghe](report-assets/screenshots/11-lesson-listenings.jpg)

*Giao diện luyện nghe với audio player và câu hỏi trắc nghiệm*

</div>

**Từ điển**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Màn hình từ điển](report-assets/screenshots/12-dictionary-home.jpg)

*Màn hình tra cứu với search bar và tabs*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Tìm kiếm từ vựng](report-assets/screenshots/13-dictionary-words-search.jpg)

*Kết quả tìm kiếm từ vựng với kanji, hiragana, nghĩa*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Chi tiết từ vựng](report-assets/screenshots/14-dictionary-word-detail.jpg)

*Thông tin chi tiết: nghĩa, ví dụ, cách dùng, JLPT level*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Tìm kiếm ngữ pháp](report-assets/screenshots/15-dictionary-grammars-search.jpg)

*Kết quả tìm kiếm ngữ pháp với cấu trúc và nghĩa*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Chi tiết ngữ pháp](report-assets/screenshots/16-dictionary-grammar-detail.jpg)

*Thông tin chi tiết: cấu trúc, giải thích, ví dụ minh họa*

</div>

**Kiểm tra**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Danh sách bài test](report-assets/screenshots/17-test-list.jpg)

*Các bài test theo JLPT level với thời gian và điểm đạt*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Làm bài test](report-assets/screenshots/18-test-doing.jpg)

*Giao diện làm bài với câu hỏi trắc nghiệm và thanh tiến độ*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Kết quả test](report-assets/screenshots/19-test-result.jpg)

*Hiển thị điểm số, %, pass/fail, điểm theo section*

</div>

**Hồ sơ**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Trang hồ sơ](report-assets/screenshots/20-user-profile.jpg)

*Thông tin cá nhân, thống kê học tập, nút edit và logout*

</div>

---

#### B) Giao diện quản trị (Admin)

**Đăng nhập Admin**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Admin login](report-assets/screenshots/21-admin-login.jpg)

*Giao diện đăng nhập admin với theme màu tím, biểu tượng khiên*

</div>

**Dashboard**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Admin dashboard](report-assets/screenshots/22-admin-dashboard.jpg)

*Trang tổng quan với sidebar navigation và thống kê*

</div>

**Quản lý nội dung**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Danh sách từ vựng](report-assets/screenshots/23-admin-word-list.jpg)

*Bảng danh sách từ vựng với các nút sửa/xóa*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Tạo từ vựng mới](report-assets/screenshots/24-admin-word-create.jpg)

*Form tạo từ vựng: kanji, hiragana, romaji, nghĩa, ví dụ, level*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Sửa từ vựng](report-assets/screenshots/25-admin-word-edit.jpg)

*Form chỉnh sửa từ vựng với dữ liệu có sẵn*

</div>

**Phân quyền**

<div style="page-break-inside: avoid; margin: 20px 0;">

![Ma trận phân quyền](report-assets/screenshots/26-admin-role-permission.jpg)

*Ma trận quyền theo feature.action (Read/Create/Update/Delete)*

</div>

<div style="page-break-inside: avoid; margin: 20px 0;">

![Danh sách admin](report-assets/screenshots/27-admin-list-admin.jpg)

*Bảng danh sách admin với tên, email, role và nút quản lý*

</div>

---

### 3.3. Đánh giá

**Điểm mạnh:**
- Kiến trúc backend rõ ràng, dễ mở rộng
- Frontend responsive trên cả mobile và web
- Xác thực JWT an toàn và linh hoạt
- UI/UX hiện đại, thân thiện người dùng
- Phân quyền admin linh hoạt với ma trận quyền
- Code được tổ chức theo module, dễ maintain

**Hạn chế và hướng phát triển:**
- Một số API trả về dữ liệu chưa chính xác (totalLessonsCompleted)
- Chưa có unit test cho backend
- Chưa tối ưu performance cho danh sách lớn
- Chưa có caching cho API calls
- Có thể bổ sung thêm animation và micro-interactions

---

**Kết luận:** Dự án đã hoàn thành các chức năng chính theo yêu cầu, tạo ra một ứng dụng học tiếng Nhật hoàn chỉnh với đầy đủ tính năng cho cả người học và quản trị viên.



