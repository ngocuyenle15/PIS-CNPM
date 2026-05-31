# PIS - Hệ thống quản lý kho thuốc (CNPM)

## Kiến trúc

| Service       | Công nghệ              | Port  |
| ------------- | ----------------------- | ----- |
| **MySQL**     | MySQL 8.0               | 3306  |
| **Backend**   | Spring Boot (Java 17)   | 8080  |
| **Frontend**  | Vite + React + Nginx    | 80    |

---

## Yêu cầu

- [Docker](https://docs.docker.com/get-docker/) >= 20.10
- [Docker Compose](https://docs.docker.com/compose/install/) >= 2.0

---

## Hướng dẫn chạy với Docker Compose

### 1. Clone project

```bash
git clone <repository-url>
cd PIS_CNPM
```

### 2. Khởi chạy toàn bộ hệ thống

```bash
docker compose up --build
```

> Lần đầu chạy sẽ mất vài phút để build image cho backend và frontend.

### 3. Chạy ở chế độ nền (detached)

```bash
docker compose up --build -d
```

### 4. Truy cập ứng dụng

| Dịch vụ      | URL                                |
| ------------ | ---------------------------------- |
| Frontend     | http://localhost                    |
| Backend API  | http://localhost:8080/api           |
| MySQL        | `localhost:3306` (user: `root`, password: `123456`) |

---
## Biến môi trường

### Backend

| Biến                | Mô tả                        | Giá trị mặc định                         |
| ------------------- | ----------------------------- | ----------------------------------------- |
| `SERVER_PORT`       | Port chạy Spring Boot         | `8080`                                    |
| `MySQL_JDBC_URL`    | JDBC connection string        | `jdbc:mysql://mysql:3306/pis`             |
| `MySQL_USER`        | MySQL username                | `root`                                    |
| `MySQL_PASSWORD`    | MySQL password                | `123456`                                  |
| `EMAIL_USERNAME`    | Email gửi thông báo           | **Bắt buộc**                          |
| `EMAIL_PASSWORD`    | App password của email        | **Bắt buộc**                          |

> **Quan trọng:** Phải cấu hình `EMAIL_USERNAME` và `EMAIL_PASSWORD` trong `docker-compose.yml` trước khi chạy. Backend sẽ không gửi được email nếu thiếu.

### Frontend (build-time)

| Biến                 | Mô tả              | Giá trị mặc định                |
| -------------------- | ------------------- | -------------------------------- |
| `VITE_API_BASE_URL`  | URL gọi API backend | `http://localhost:8080/api`      |

> **Lưu ý:** Biến frontend là **build-time ARG**, phải truyền lúc build image. Thay đổi giá trị cần build lại frontend.

