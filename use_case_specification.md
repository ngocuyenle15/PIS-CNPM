# ĐẶC TẢ CHI TIẾT TOÀN BỘ 32 USE CASE - HỆ THỐNG QUẢN LÝ KHO THUỐC (PIS)

Tài liệu này cung cấp đặc tả chi tiết của toàn bộ **32 Use Case (UC)** trong hệ thống **PIS (Pharmacy Inventory Management System)**. Các đặc tả này được đối chiếu trực tiếp với mã nguồn thực tế của dự án ở cả phía Backend (Java Spring Boot) và Frontend (Vite + React).

Cấu trúc mỗi Use Case tuân thủ chính xác theo mẫu biểu bảng yêu cầu:
- **Mã Use case / Tên Use case**
- **Tác nhân** (Actors)
- **Tiền điều kiện** (Preconditions)
- **Luồng sự kiện chính (Thành công)**: Từng bước tương tác giữa Người dùng và Hệ thống.
- **Luồng sự kiện thay thế**: Các nhánh lỗi, rẽ nhánh nghiệp vụ, kiểm tra ràng buộc.
- **Hậu điều kiện** (Postconditions)

---

## DANH MỤC TOÀN BỘ 32 USE CASE

### PHÂN HỆ 1: XÁC THỰC VÀ TÀI KHOẢN CÁ NHÂN
- [UC01: Đăng nhập hệ thống (System Login)](#uc01-dang-nhap-he-thong)
- [UC02: Đăng xuất hệ thống (System Logout)](#uc02-dang-xuat-he-thong)
- [UC03: Làm mới Token tự động (Token Refresh)](#uc03-lam-moi-token-tu-dong)
- [UC04: Xem thông tin tài khoản cá nhân (Get Me)](#uc04-xem-thong-tin-tai-khoan-ca-nhan)
- [UC05: Đổi mật khẩu tài khoản (Change Password)](#uc05-doi-mat-khau-tai-khoan)
- [UC06: Cấp lại mật khẩu tạm khi quên mật khẩu (Forgot Password)](#uc06-cap-lai-mat-khau-tam-khi-quen-mat-khau)

### PHÂN HỆ 2: QUẢN LÝ DANH MỤC VÀ DỮ LIỆU THUỐC
- [UC07: Xem danh sách danh mục thuốc (View Catalogs)](#uc07-xem-danh-sach-danh-muc-thuoc)
- [UC08: Thêm danh mục thuốc mới (Create Catalog)](#uc08-them-danh-muc-thuoc-moi)
- [UC09: Cập nhật danh mục thuốc (Update Catalog)](#uc09-cap-nhat-danh-muc-thuoc)
- [UC10: Xóa danh mục thuốc (Delete Catalog)](#uc10-xoa-danh-muc-thuoc)
- [UC11: Quản lý nước sản xuất - Origin CRUD](#uc11-quan-ly-nuoc-san-xuat---origin-crud)
- [UC12: Quản lý đơn vị tính - Unit CRUD](#uc12-quan-ly-don-vi-tinh---unit-crud)
- [UC13: Xem danh sách và tìm kiếm thuốc (Search Medicines)](#uc13-xem-danh-sach-va-tim-kiem-thuoc)
- [UC14: Thêm thông tin thuốc mới (Create Medicine)](#uc14-them-thong-tin-thuoc-moi)
- [UC15: Cập nhật thông tin thuốc (Update Medicine)](#uc15-cap-nhat-thong-tin-thuoc)
- [UC16: Xóa thông tin thuốc (Delete Medicine)](#uc16-xoa-thong-tin-thuoc)

### PHÂN HỆ 3: QUẢN LÝ ĐỐI TÁC VÀ NHÂN SỰ
- [UC17: Quản lý nhà cung cấp - Supplier CRUD](#uc17-quan-ly-nha-cung-cap---supplier-crud)
- [UC18: Quản lý thông tin khách hàng - Customer CRUD](#uc18-quan-ly-thong-tin-khach-hang---customer-crud)
- [UC19: Quản lý thông tin nhân viên - Employee CRUD](#uc19-quan-ly-thong-tin-nhan-vien---employee-crud)
- [UC20: Quản lý tài khoản người dùng - Account CRUD](#uc20-quan-ly-tai-khoan-nguoi-dung---account-crud)
- [UC21: Đặt lại mật khẩu nhân viên - Admin Reset Password](#uc21-dat-lai-mat-khau-nhan-vien)

### PHÂN HỆ 4: NGHIỆP VỤ KHO THUỐC
- [UC22: Lập phiếu nhập kho nháp (Create Goods Receipt Draft)](#uc22-lap-phieu-nhap-kho-nhap)
- [UC23: Xác nhận phiếu nhập kho (Confirm Goods Receipt)](#uc23-xac-nhan-phieu-nhap-kho)
- [UC24: Hủy phiếu nhập kho nháp (Cancel Goods Receipt)](#uc24-huy-phieu-nhap-kho-nhap)
- [UC25: Lập phiếu xuất kho nháp (Create Goods Issue Draft)](#uc25-lap-phieu-xuat-kho-nhap)
- [UC26: Xác nhận phiếu xuất kho (Confirm Goods Issue)](#uc26-xac-nhan-phieu-xuat-kho)
- [UC27: Hủy phiếu xuất kho nháp (Cancel Goods Issue)](#uc27-huy-phieu-xuat-kho-nhap)
- [UC28: Lập phiếu kiểm kê kho nháp (Create Stock Audit Draft)](#uc28-lap-phieu-kiem-ke-kho-nhap)
- [UC29: Nhập số đếm thực tế kiểm kho (Save Audit Quantities)](#uc29-nhap-so-dem-thuc-te-kiem-kho)
- [UC30: Xác nhận đối soát hoàn thành kiểm kê (Confirm Stock Audit)](#uc30-xac-nhan-doi-soat-hoan-thanh-kiem-ke)

### PHÂN HỆ 5: BÁN HÀNG VÀ BÁO CÁO TỒN KHO
- [UC31: Lập hóa đơn bán lẻ thuốc tại quầy - POS (Create Invoice)](#uc31-lap-hoa-don-ban-le-thuoc-tai-quay---pos)
- [UC32: Xem lịch sử thẻ kho của thuốc (View Stock Card)](#uc32-xem-lich-su-the-kho-cua-thuoc)

---

## PHẦN CHI TIẾT ĐẶC TẢ TỪNG USE CASE

---

### UC01: ĐĂNG NHẬP HỆ THỐNG

| Mã Use case | UC01 | Tên Use case | Đăng nhập hệ thống |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager |
| **Tiền điều kiện** | Người dùng đã có tài khoản được kích hoạt trên hệ thống (`isActive = true`). |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Truy cập vào trang đăng nhập của hệ thống PIS. |
| | 2 | Hệ thống | Hiển thị giao diện đăng nhập yêu cầu nhập Tên đăng nhập và Mật khẩu. |
| | 3 | Người dùng | Nhập Tên đăng nhập (username), Mật khẩu (password) và nhấn nút **Đăng nhập**. |
| | 4 | Hệ thống | Kiểm tra sự tồn tại của tài khoản và xác thực mật khẩu dưới cơ sở dữ liệu. |
| | 5 | Hệ thống | Xác nhận thông tin chính xác, kiểm tra trạng thái hoạt động (`isActive = true`) và trạng thái đăng nhập lần đầu (`isFirstLogin = false`). |
| | 6 | Hệ thống | Tạo JWT Access Token & Refresh Token, lưu thông tin phiên đăng nhập. |
| | 7 | Hệ thống | Chuyển hướng người dùng vào giao diện Trang chủ (Dashboard) và hiển thị các chức năng tương ứng với vai trò của tài khoản. Hiển thị thông báo "Đăng nhập thành công". |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Tên đăng nhập hoặc mật khẩu không chính xác**: Hệ thống hiển thị thông báo lỗi `"Tên đăng nhập hoặc mật khẩu không chính xác"` và giữ người dùng ở trang đăng nhập để nhập lại. |
| | 5a | Hệ thống | **Tài khoản bị vô hiệu hóa**: Hệ thống phát hiện tài khoản có trường `isActive` có giá trị là `false`. Hiển thị thông báo lỗi `"Tài khoản của bạn đã bị vô hiệu hóa"`. |
| | 5b | Hệ thống | **Yêu cầu đổi mật khẩu lần đầu**: Hệ thống phát hiện tài khoản có thuộc tính `isFirstLogin` là `true`. Hệ thống ném lỗi `"Yêu cầu đổi mật khẩu trong lần đăng nhập đầu tiên"`, chặn truy cập Dashboard và tự động chuyển hướng người dùng sang trang Đổi mật khẩu (`/change-password`). |
| **Hậu điều kiện** | Người dùng đăng nhập thành công vào hệ thống và được cấp quyền truy cập các chức năng tương ứng với vai trò. |

---

### UC02: ĐĂNG XUẤT HỆ THỐNG

| Mã Use case | UC02 | Tên Use case | Đăng xuất hệ thống |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager |
| **Tiền điều kiện** | Người dùng đã đăng nhập thành công và có Access Token hợp lệ. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấn vào biểu tượng tài khoản và chọn nút **Đăng xuất**. |
| | 2 | Hệ thống | Gửi yêu cầu đăng xuất chứa Access Token lên API `/api/auth/logout/`. |
| | 3 | Hệ thống | Backend xác thực Access Token, đưa Access Token vào danh sách đen (`invalidated_token`) và xóa Refresh Token của người dùng trong DB. |
| | 4 | Hệ thống | Xóa bỏ Access Token và Refresh Token đang lưu tại LocalStorage ở trình duyệt. |
| | 5 | Hệ thống | Chuyển hướng người dùng về giao diện trang đăng nhập và hiển thị thông báo `"Đăng xuất thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 2a | Hệ thống | **Token không hợp lệ hoặc đã hết hạn**: Hệ thống vẫn thực hiện xóa LocalStorage trên Client và đưa người dùng về trang đăng nhập để đảm bảo an toàn. |
| **Hậu điều kiện** | Phiên làm việc của người dùng bị hủy bỏ hoàn toàn, không thể dùng Access Token cũ để gọi API. |

---

### UC03: LÀM MỚI TOKEN TỰ ĐỘNG

| Mã Use case | UC03 | Tên Use case | Làm mới Token tự động (Token Rotation) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Hệ thống (gọi tự động) |
| **Tiền điều kiện** | Access Token hết hạn nhưng Refresh Token vẫn còn hạn và lưu tại LocalStorage. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Hệ thống | Nhận mã lỗi 401 (Unauthorized) từ Backend khi gọi một API bất kỳ. |
| | 2 | Hệ thống | Client tự động gửi yêu cầu API đến `/api/auth/refresh/` kèm theo Refresh Token cũ. |
| | 3 | Hệ thống | Backend xác minh tính hợp lệ và thời hạn của Refresh Token cũ. |
| | 4 | Hệ thống | Backend tạo một Access Token mới và xoay vòng Refresh Token mới. |
| | 5 | Hệ thống | Client cập nhật token mới vào LocalStorage và thực hiện lại yêu cầu API ban đầu bị lỗi 401. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 3a | Hệ thống | **Refresh Token hết hạn/không hợp lệ**: Backend phản hồi lỗi. Client lập tức xóa LocalStorage và chuyển hướng người dùng về trang Đăng nhập buộc đăng nhập lại. |
| **Hậu điều kiện** | Phiên đăng nhập được gia hạn thành công mà không gây gián đoạn trải nghiệm của người dùng. |

---

### UC04: XEM THÔNG TIN TÀI KHOẢN CÁ NHÂN

| Mã Use case | UC04 | Tên Use case | Xem thông tin tài khoản cá nhân |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager |
| **Tiền điều kiện** | Người dùng đã đăng nhập thành công vào hệ thống. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Hệ thống | Khi người dùng tải trang chủ, Frontend tự động gửi yêu cầu GET tới `/api/auth/me/`. |
| | 2 | Hệ thống | Backend lấy Username từ Security Context và truy vấn thông tin tài khoản cùng thông tin nhân viên (`employee`) liên kết. |
| | 3 | Hệ thống | Trả về thông tin chi tiết: Username, Vai trò, Họ tên nhân viên, Email, Số điện thoại và Ngày vào làm. |
| | 4 | Hệ thống | Hiển thị tên nhân viên và vai trò trên góc phải thanh Header của giao diện. |
| **Hậu điều kiện** | Người dùng thấy được đúng thông tin cá nhân của mình trên giao diện. |

---

### UC05: ĐỔI MẬT KHẨU TÀI KHOẢN

| Mã Use case | UC05 | Tên Use case | Đổi mật khẩu tài khoản |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager |
| **Tiền điều kiện** | Người dùng đã đăng nhập thành công vào hệ thống. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấp chọn mục **Đổi mật khẩu** từ menu tài khoản cá nhân. |
| | 2 | Hệ thống | Hiển thị Form Đổi mật khẩu gồm: Mật khẩu cũ, Mật khẩu mới và Xác nhận mật khẩu mới. |
| | 3 | Người dùng | Nhập đầy đủ thông tin vào Form đổi mật khẩu và nhấn nút **Đổi mật khẩu**. |
| | 4 | Hệ thống | Kiểm tra tính chính xác của mật khẩu cũ và xác thực tính trùng khớp của hai trường mật khẩu mới. |
| | 5 | Hệ thống | Mã hóa mật khẩu mới bằng BCrypt, cập nhật vào bảng `account`, đồng thời đặt thuộc tính `isFirstLogin` thành `false`. |
| | 6 | Hệ thống | Hiển thị thông báo `"Đổi mật khẩu thành công"` và đóng Form. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Mật khẩu mới không trùng khớp**: Hệ thống báo lỗi `"Mật khẩu mới và mật khẩu xác nhận không khớp"` và yêu cầu nhập lại. |
| | 4b | Hệ thống | **Mật khẩu cũ không chính xác**: Hệ thống báo lỗi `"Mật khẩu cũ không chính xác"` ở chân trường nhập liệu. |
| **Hậu điều kiện** | Mật khẩu tài khoản được cập nhật mới. Nếu là tài khoản mới đăng nhập lần đầu, tài khoản sẽ được phép truy cập đầy đủ tính năng ở các phiên sau. |

---

### UC06: CẤP LẠI MẬT KHẨU TẠM KHI QUÊN MẬT KHẨU

| Mã Use case | UC06 | Tên Use case | Quên mật khẩu và Cấp mật khẩu tạm thời |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Nhân viên quên mật khẩu (Khách truy cập) |
| **Tiền điều kiện** | Nhân viên đã có tài khoản và email đã được khai báo chính xác trên hệ thống. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấn vào nút **Quên mật khẩu?** tại màn hình đăng nhập. |
| | 2 | Hệ thống | Hiển thị form yêu cầu nhập Tên đăng nhập và Email đăng ký. |
| | 3 | Người dùng | Nhập chính xác Tên đăng nhập (username) và địa chỉ Email đã đăng ký, nhấn nút **Gửi mật khẩu tạm**. |
| | 4 | Hệ thống | Đối chiếu thông tin nhập vào với dữ liệu tài khoản và email nhân viên trong cơ sở dữ liệu. |
| | 5 | Hệ thống | Sinh mật khẩu tạm thời ngẫu nhiên gồm 8 ký tự. |
| | 6 | Hệ thống | Mã hóa mật khẩu tạm thời và cập nhật vào bảng `account`. Thiết lập thuộc tính `isFirstLogin = true`. |
| | 7 | Hệ thống | Gửi email chứa thông tin tài khoản và mật khẩu tạm thời mới đến địa chỉ email của nhân viên. |
| | 8 | Hệ thống | Hiển thị thông báo `"Mật khẩu tạm thời đã được gửi thành công"`. Quay lại màn hình đăng nhập. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Thông tin không chính xác**: Hệ thống đối chiếu thấy tên đăng nhập không tồn tại hoặc email nhập vào không khớp. Hệ thống báo lỗi `"Tên đăng nhập hoặc email không chính xác"`. |
| **Hậu điều kiện** | Mật khẩu tài khoản được cập nhật thành mật khẩu tạm. Trạng thái tài khoản chuyển sang yêu cầu đổi mật khẩu ở lần đăng nhập tiếp theo. |

---

### UC07: XEM DANH SÁCH DANH MỤC THUỐC

| Mã Use case | UC07 | Tên Use case | Xem danh sách danh mục thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Danh mục thuốc** trong phần Cài đặt thuốc ở thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET tới `/api/catalogs` để lấy danh sách danh mục. |
| | 3 | Hệ thống | Tải dữ liệu từ bảng `catalog` trong cơ sở dữ liệu. |
| | 4 | Hệ thống | Hiển thị danh sách danh mục thuốc lên bảng dữ liệu (gồm Mã danh mục, Tên danh mục và các hành động sửa/xóa). |
| **Hậu điều kiện** | Danh sách danh mục thuốc được hiển thị đầy đủ và chính xác trên giao diện. |

---

### UC08: THÊM DANH MỤC THUỐC MỚI

| Mã Use case | UC08 | Tên Use case | Thêm danh mục thuốc mới |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang Danh mục thuốc, nhấn nút **Thêm danh mục**. |
| | 2 | Hệ thống | Hiển thị Form Thêm danh mục yêu cầu nhập Mã danh mục và Tên danh mục. |
| | 3 | Người dùng | Nhập đầy đủ thông tin và nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ: các trường nhập liệu không được trống và Mã danh mục chưa tồn tại. |
| | 5 | Hệ thống | Lưu danh mục thuốc mới vào bảng `catalog` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Tạo danh mục thuốc thành công"`, đóng Form nhập và tải lại danh sách danh mục. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã danh mục**: Hệ thống hiển thị thông báo lỗi `"Mã danh mục đã tồn tại"` và giữ nguyên form nhập. |
| **Hậu điều kiện** | Danh mục thuốc mới được lưu thành công vào cơ sở dữ liệu. |

---

### UC09: CẬP NHẬT DANH MỤC THUỐC

| Mã Use case | UC09 | Tên Use case | Cập nhật danh mục thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng danh mục cần sửa, nhấn vào nút **Chỉnh sửa** (biểu tượng bút chì). |
| | 2 | Hệ thống | Hiển thị Form Chỉnh sửa chứa thông tin hiện tại của danh mục đó (không cho sửa Mã danh mục). |
| | 3 | Người dùng | Thay đổi Tên danh mục thuốc và nhấn nút **Cập nhật**. |
| | 4 | Hệ thống | Kiểm tra dữ liệu nhập không được để trống. |
| | 5 | Hệ thống | Lưu thay đổi vào bảng `catalog` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Cập nhật danh mục thuốc thành công"`, đóng Form và tải lại danh sách. |
| **Hậu điều kiện** | Thông tin danh mục thuốc được cập nhật thay đổi thành công vào cơ sở dữ liệu. |

---

### UC10: XÓA DANH MỤC THUỐC

| Mã Use case | UC10 | Tên Use case | Xóa danh mục thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng danh mục cần xóa, nhấn vào nút **Xóa** (biểu tượng thùng rác). |
| | 2 | Hệ thống | Hiển thị hộp thoại cảnh báo: `"Bạn có chắc chắn muốn xóa danh mục này?"`. |
| | 3 | Người dùng | Nhấn nút **Xác nhận xóa**. |
| | 4 | Hệ thống | Kiểm tra xem danh mục này có đang liên kết với loại thuốc nào không. |
| | 5 | Hệ thống | Thực hiện xóa bản ghi danh mục khỏi bảng `catalog` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Xóa danh mục thuốc thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Danh mục đang được sử dụng**: Hệ thống phát hiện có thuốc đang thuộc danh mục này. Hiển thị thông báo lỗi `"Không thể xóa danh mục vì đang có thuốc liên kết"` và hủy tác vụ xóa. |
| **Hậu điều kiện** | Bản ghi danh mục thuốc được xóa khỏi cơ sở dữ liệu thành công. |

---

### UC11: QUẢN LÝ NƯỚC SẢN XUẤT - ORIGIN CRUD

| Mã Use case | UC11 | Tên Use case | Quản lý Nước sản xuất (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Nước sản xuất** trên thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/origins` hiển thị danh sách các nước sản xuất. |
| | 3 | Người dùng | Nhấn nút **Thêm nước sản xuất**, nhập Mã nước sản xuất (ví dụ: VN, USA, GER) và Tên nước sản xuất. Nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu đầu vào và lưu bản ghi vào bảng `origin` trong cơ sở dữ liệu. |
| | 5 | Hệ thống | Hiển thị thông báo `"Tạo nước sản xuất thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã nước sản xuất**: Hệ thống báo lỗi `"Mã nước sản xuất đã tồn tại"` và giữ nguyên form. |
| | 4b | Hệ thống | **Xóa nước sản xuất đang liên kết thuốc**: Khi người dùng nhấn xóa một nước sản xuất đang liên kết với thuốc, hệ thống chặn lại và báo lỗi `"Không thể xóa nước sản xuất vì đang có thuốc liên kết"`. |
| **Hậu điều kiện** | Dữ liệu nước sản xuất được lưu trữ, chỉnh sửa hoặc xóa thành công trong DB. |

---

### UC12: QUẢN LÝ ĐƠN VỊ TÍNH - UNIT CRUD

| Mã Use case | UC12 | Tên Use case | Quản lý Đơn vị tính (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Đơn vị tính** trên thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/units` hiển thị danh sách các đơn vị tính. |
| | 3 | Người dùng | Nhấn nút **Thêm đơn vị tính**, nhập Mã đơn vị tính và Tên đơn vị tính (ví dụ: Viên, Vỉ, Hộp). Nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu đầu vào và lưu bản ghi vào bảng `unit` trong cơ sở dữ liệu. |
| | 5 | Hệ thống | Hiển thị thông báo `"Tạo đơn vị tính thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã đơn vị tính**: Hệ thống báo lỗi `"Mã đơn vị tính đã tồn tại"` và giữ nguyên form. |
| | 4b | Hệ thống | **Xóa đơn vị tính đang được sử dụng**: Khi người dùng nhấn xóa đơn vị tính đang được sử dụng làm đơn vị cơ bản hoặc đơn vị quy đổi của thuốc, hệ thống chặn lại và báo lỗi `"Không thể xóa đơn vị tính vì đang được sử dụng"`. |
| **Hậu điều kiện** | Đơn vị tính được quản lý thành công trong cơ sở dữ liệu. |

---

### UC13: XEM DANH SÁCH VÀ TÌM KIẾM THUỐC

| Mã Use case | UC13 | Tên Use case | Xem danh sách và tìm kiếm thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin, Sales |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống thành công. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Danh sách thuốc** trên thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/medicines` với tham số phân trang (`page`, `size`). |
| | 3 | Hệ thống | Hiển thị danh sách thuốc dạng bảng kèm bộ lọc tìm kiếm. |
| | 4 | Người dùng | Nhập từ khóa tìm kiếm (tên thuốc, hoạt chất...) vào ô tìm kiếm và chọn trường tìm kiếm tương ứng. Nhấn nút Tìm kiếm. |
| | 5 | Hệ thống | Tìm lọc các bản ghi khớp trong cơ sở dữ liệu và hiển thị danh sách kết quả đã phân trang. |
| **Hậu điều kiện** | Danh sách thuốc khớp với điều kiện tìm kiếm được hiển thị chính xác lên giao diện. |

---

### UC14: THÊM THÔNG TIN THUỐC MỚI

| Mã Use case | UC14 | Tên Use case | Thêm thông tin thuốc mới |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang Danh sách thuốc, nhấn nút **Thêm thuốc mới**. |
| | 2 | Hệ thống | Hiển thị Form Thêm thuốc mới yêu cầu nhập đầy đủ thông tin thuốc. |
| | 3 | Người dùng | Nhập đầy đủ thông tin (Mã thuốc, Tên thuốc, Hoạt chất, Giá bán lẻ, Danh mục, Đơn vị cơ bản...) và nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ dữ liệu nhập (Mã thuốc chưa tồn tại, giá trị số không được âm). |
| | 5 | Hệ thống | Lưu bản ghi vào bảng `medicine` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Tạo thông tin thuốc thành công"`, đóng Form và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Mã thuốc trùng lặp**: Hệ thống báo lỗi `"Mã thuốc đã tồn tại"`, giữ lại form để chỉnh sửa. |
| **Hậu điều kiện** | Thuốc mới được thêm thành công vào cơ sở dữ liệu. |

---

### UC15: CẬP NHẬT THÔNG TIN THUỐC

| Mã Use case | UC15 | Tên Use case | Cập nhật thông tin thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng thuốc cần chỉnh sửa, nhấn nút **Chỉnh sửa** (biểu tượng bút chì). |
| | 2 | Hệ thống | Hiển thị Form Chỉnh sửa với thông tin hiện có của thuốc đó (không cho phép sửa Mã thuốc). |
| | 3 | Người dùng | Thay đổi thông tin cần chỉnh sửa (ví dụ: Giá bán lẻ, quy cách đóng gói, hoạt chất) và nhấn nút **Cập nhật**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ dữ liệu nhập vào. |
| | 5 | Hệ thống | Cập nhật các trường thông tin thay đổi vào bảng `medicine` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Cập nhật thông tin thuốc thành công"`, đóng Form và tải lại danh sách. |
| **Hậu điều kiện** | Thông tin thuốc được thay đổi và cập nhật thành công vào cơ sở dữ liệu. |

---

### UC16: XÓA THÔNG TIN THUỐC

| Mã Use case | UC16 | Tên Use case | Xóa thông tin thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng thuốc cần xóa, nhấn nút **Xóa** (biểu tượng thùng rác). |
| | 2 | Hệ thống | Hiển thị hộp thoại cảnh báo yêu cầu xác nhận xóa thuốc. |
| | 3 | Người dùng | Nhấn nút **Xác nhận xóa**. |
| | 4 | Hệ thống | Kiểm tra xem loại thuốc này đã phát sinh giao dịch kho hay tồn kho trong bảng `inventory` chưa. |
| | 5 | Hệ thống | Xóa bản ghi thuốc khỏi bảng `medicine` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Xóa thông tin thuốc thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Thuốc đã phát sinh tồn kho/giao dịch**: Hệ thống phát hiện loại thuốc này đã có lô nhập hoặc giao dịch tồn kho liên quan. Đưa ra cảnh báo `"Không thể xóa thông tin thuốc vì đang có dữ liệu tồn kho liên kết"` và giữ nguyên bản ghi thuốc. |
| **Hậu điều kiện** | Bản ghi thông tin thuốc được xóa thành công khỏi cơ sở dữ liệu. |

---

### UC17: QUẢN LÝ NHÀ CUNG CẤP - SUPPLIER CRUD

| Mã Use case | UC17 | Tên Use case | Quản lý Nhà cung cấp (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Nhà cung cấp** ở thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/suppliers` hiển thị danh sách các nhà cung cấp. |
| | 3 | Người dùng | Chọn **Thêm nhà cung cấp**, điền Mã nhà cung cấp, Tên nhà cung cấp, Số điện thoại và Địa chỉ. Nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu đầu vào và lưu bản ghi vào bảng `supplier` trong cơ sở dữ liệu. |
| | 5 | Hệ thống | Hiển thị thông báo `"Tạo nhà cung cấp thành công"` và tải lại danh sách nhà cung cấp. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã nhà cung cấp**: Hệ thống báo lỗi `"Mã nhà cung cấp đã tồn tại"` và giữ nguyên form. |
| | 4b | Hệ thống | **Xóa nhà cung cấp đã có phiếu nhập**: Hệ thống kiểm tra thấy nhà cung cấp đã được sử dụng trong phiếu nhập kho. Báo lỗi `"Không thể xóa nhà cung cấp vì đang có phiếu nhập liên kết"` và giữ lại dữ liệu. |
| **Hậu điều kiện** | Thông tin nhà cung cấp được quản lý thành công trong cơ sở dữ liệu. |

---

### UC18: QUẢN LÝ THÔNG TIN KHÁCH HÀNG - CUSTOMER CRUD

| Mã Use case | UC18 | Tên Use case | Quản lý Khách hàng (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Sales, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống thành công. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Khách hàng** trên thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/customers` hiển thị danh sách khách hàng thành viên. |
| | 3 | Người dùng | Chọn **Thêm khách hàng**, điền Mã khách hàng, Tên khách hàng, Số điện thoại, Giới tính. Nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu đầu vào và lưu bản ghi vào bảng `customer` trong cơ sở dữ liệu. |
| | 5 | Hệ thống | Hiển thị thông báo `"Tạo khách hàng thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã khách hàng/SĐT**: Hệ thống báo lỗi `"Mã khách hàng đã tồn tại"` hoặc lỗi trùng lặp số điện thoại. |
| **Hậu điều kiện** | Thông tin khách hàng thành viên được cập nhật và quản lý thành công trong cơ sở dữ liệu. |

---

### UC19: QUẢN LÝ THÔNG TIN NHÂN VIÊN - EMPLOYEE CRUD

| Mã Use case | UC19 | Tên Use case | Quản lý Nhân viên (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập với vai trò Admin. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Nhân viên** trên thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/employees` hiển thị danh sách nhân sự của nhà thuốc. |
| | 3 | Người dùng | Chọn **Thêm nhân viên**, nhập Mã nhân viên, Họ tên, Số điện thoại, Email, Giới tính, Năm sinh, Ngày vào làm. Nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu (email đúng cấu trúc, sđt không trùng, nhân viên chưa tồn tại). |
| | 5 | Hệ thống | Lưu bản ghi nhân viên vào bảng `employee` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Tạo nhân viên thành công"` và cập nhật lại giao diện. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã nhân viên hoặc Email**: Hệ thống hiển thị thông báo lỗi tương ứng và giữ lại form nhập liệu. |
| | 4b | Hệ thống | **Xóa nhân viên có tài khoản liên kết**: Khi xóa nhân viên đang có tài khoản đăng nhập hoặc đã ký tên duyệt phiếu nhập/xuất/kiểm kê, hệ thống chặn lại và báo lỗi `"Không thể xóa nhân viên vì đang có liên kết dữ liệu"`. |
| **Hậu điều kiện** | Thông tin nhân viên được lưu trữ và cập nhật thành công trong cơ sở dữ liệu. |

---

### UC20: QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG - ACCOUNT CRUD

| Mã Use case | UC20 | Tên Use case | Quản lý Tài khoản người dùng (Tạo/Xem/Cập nhật/Xóa) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập với vai trò Admin. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Tài khoản nhân viên** trong phần quản trị hệ thống. |
| | 2 | Hệ thống | Gọi API GET `/api/accounts` hiển thị danh sách tài khoản. |
| | 3 | Người dùng | Chọn **Tạo tài khoản mới**, nhập tên đăng nhập, chọn nhân viên liên kết, phân vai trò (Admin/Sales/Product_manager) và nhấn **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ (username chưa dùng, nhân viên chưa có tài khoản). |
| | 5 | Hệ thống | Tự động sinh mật khẩu ngẫu nhiên an toàn 10 ký tự, mã hóa mật khẩu bằng BCrypt và lưu tài khoản mới vào bảng `account` ở trạng thái `isFirstLogin = true`. |
| | 6 | Hệ thống | Gửi email chứa thông tin tài khoản đến địa chỉ email của nhân viên. |
| | 7 | Hệ thống | Hiển thị thông báo tạo thành công kèm chuỗi mật khẩu tự sinh lên màn hình để Admin lưu trữ. Tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Tên đăng nhập đã dùng**: Hệ thống hiển thị lỗi `"Tên đăng nhập '[Tên]' đã được sử dụng"`. |
| | 4b | Hệ thống | **Nhân viên đã có tài khoản**: Hệ thống hiển thị lỗi `"Nhân viên '[Tên]' đã được liên kết với một tài khoản khác"`. |
| **Hậu điều kiện** | Tài khoản đăng nhập của nhân viên được quản lý thành công trong cơ sở dữ liệu. |

---

### UC21: ĐẶT LẠI MẬT KHẨU NHÂN VIÊN

| Mã Use case | UC21 | Tên Use case | Đặt lại mật khẩu tài khoản nhân viên |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập với vai trò Admin. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại danh sách Tài khoản, chọn tài khoản cần đặt lại mật khẩu và nhấn nút **Đặt lại mật khẩu**. |
| | 2 | Hệ thống | Hiển thị Form Đặt lại mật khẩu chứa tên tài khoản và ô nhập mật khẩu mới. |
| | 3 | Người dùng | Nhập mật khẩu mới cho tài khoản và nhấn nút **Lưu**. |
| | 4 | Hệ thống | Mã hóa mật khẩu mới bằng BCrypt, cập nhật vào cơ sở dữ liệu của tài khoản đó. |
| | 5 | Hệ thống | Hiển thị thông báo `"Đặt lại mật khẩu thành công cho tài khoản: [username]"` và đóng form. |
| **Hậu điều kiện** | Mật khẩu của tài khoản nhân viên được thay đổi thành công. |

---

### UC22: LẬP PHIẾU NHẬP KHO NHÁP

| Mã Use case | UC22 | Tên Use case | Lập phiếu nhập kho ở trạng thái Nháp (DRAFT) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập với vai trò Admin hoặc Product_manager. Nhà cung cấp và thuốc đã được định nghĩa. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấn vào chức năng **Tạo phiếu nhập mới** trong module Nhập kho. |
| | 2 | Hệ thống | Hiển thị Form lập phiếu nhập kho. |
| | 3 | Người dùng | Chọn Nhà cung cấp, điền Ghi chú và tìm kiếm, nhập các chi tiết thuốc nhập (Mã lô, Số lượng, Đơn vị nhập, Đơn giá nhập, NSX, HSD). Nhấn **Thêm**. |
| | 4 | Hệ thống | Tự động tính toán số lượng quy đổi và hiển thị chi tiết lên bảng kê. |
| | 5 | Người dùng | Nhấn nút **Lưu nháp**. |
| | 6 | Hệ thống | Lưu phiếu nhập kho vào cơ sở dữ liệu với trạng thái `DRAFT` (chưa cộng tồn kho thực tế). Tự động sinh mã phiếu dạng `GRN-[8 ký tự ngẫu nhiên]` nếu người dùng không tự nhập mã phiếu. |
| | 7 | Hệ thống | Hiển thị thông báo `"Tạo nháp phiếu nhập kho thành công"` và hiển thị phiếu trên danh sách. |
| **Hậu điều kiện** | Phiếu nhập kho được lưu vào DB ở trạng thái DRAFT. Tồn kho thực tế chưa thay đổi. |

---

### UC23: XÁC NHẬN PHIẾU NHẬP KHO

| Mã Use case | UC23 | Tên Use case | Xác nhận phiếu nhập kho thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Phiếu nhập kho đang tồn tại ở trạng thái `DRAFT` (Nháp). |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Mở chi tiết phiếu nhập kho nháp cần xác nhận và nhấn nút **Xác nhận nhập kho**. |
| | 2 | Hệ thống | Kiểm tra trạng thái hiện tại của phiếu nhập phải là `DRAFT`. |
| | 3 | Hệ thống | Duyệt qua từng chi tiết thuốc nhập, tính toán số lượng quy đổi sang đơn vị cơ bản (`Quantity * ConversionRate`). |
| | 4 | Hệ thống | Cập nhật số lượng tồn kho vào bảng `inventory` (nếu lô chưa có thì tạo mới lô, nếu có rồi thì cộng dồn số lượng). Cập nhật giá nhập mới nhất cho lô thuốc. |
| | 5 | Hệ thống | Ghi nhận nhật ký biến động kho vào bảng `inventory_transaction` với loại giao dịch `IMPORT`. |
| | 6 | Hệ thống | Chuyển trạng thái phiếu nhập kho thành `CONFIRMED` và ghi nhận thời gian nhập kho thực tế. |
| | 7 | Hệ thống | Hiển thị thông báo `"Xác nhận nhập kho và cập nhật tồn kho thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 2a | Hệ thống | **Phiếu không ở trạng thái DRAFT**: Hệ thống báo lỗi `"Chỉ có thể xác nhận phiếu nhập ở trạng thái NHÁP (DRAFT). Trạng thái hiện tại: [Trạng thái]"` và chặn hành động. |
| **Hậu điều kiện** | Phiếu nhập chuyển sang CONFIRMED, số lượng tồn kho thực tế của các lô thuốc được tăng lên, lịch sử thẻ kho được ghi nhận. |

---

### UC24: HỦY PHIẾU NHẬP KHO NHÁP

| Mã Use case | UC24 | Tên Use case | Hủy phiếu nhập kho nháp |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Phiếu nhập kho đang tồn tại ở trạng thái nháp `DRAFT`. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang chi tiết phiếu nhập kho nháp, nhấn nút **Hủy phiếu**. |
| | 2 | Hệ thống | Hiển thị hộp thoại cảnh báo: `"Bạn có chắc chắn muốn hủy phiếu nhập kho này?"`. |
| | 3 | Người dùng | Nhấn nút **Xác nhận hủy**. |
| | 4 | Hệ thống | Kiểm tra trạng thái phiếu phải là `DRAFT`. |
| | 5 | Hệ thống | Cập nhật trạng thái phiếu nhập kho thành `CANCELLED` trong cơ sở dữ liệu. Giữ nguyên số lượng tồn kho. |
| | 6 | Hệ thống | Hiển thị thông báo `"Hủy phiếu nhập kho thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Phiếu đã xác nhận/đã hủy trước đó**: Hệ thống báo lỗi `"Chỉ có thể hủy phiếu nhập ở trạng thái NHÁP (DRAFT)"` và hủy tác vụ. |
| **Hậu điều kiện** | Phiếu nhập kho chuyển sang trạng thái CANCELLED, dữ liệu kho không bị ảnh hưởng. |

---

### UC25: LẬP PHIẾU XUẤT KHO NHÁP

| Mã Use case | UC25 | Tên Use case | Lập phiếu xuất kho ở trạng thái Nháp (DRAFT) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. Các lô thuốc cần xuất đang có trong kho. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấn vào chức năng **Tạo phiếu xuất mới** trong module Xuất kho. |
| | 2 | Hệ thống | Hiển thị Form lập phiếu xuất kho. |
| | 3 | Người dùng | Chọn Lý do xuất (hết hạn, hỏng hóc, trả hàng...), điền Ghi chú. |
| | 4 | Người dùng | Tìm kiếm và chọn các lô thuốc cần xuất, nhập Số lượng xuất và Đơn vị xuất. Nhấn **Thêm**. |
| | 5 | Hệ thống | Quy đổi số lượng xuất về đơn vị tính cơ bản và hiển thị chi tiết lên bảng kê. |
| | 6 | Người dùng | Nhấn nút **Lưu nháp**. |
| | 7 | Hệ thống | Lưu phiếu xuất vào cơ sở dữ liệu với trạng thái `DRAFT`. Tự động sinh mã phiếu dạng `GIN-[8 ký tự ngẫu nhiên]`. Hiển thị thông báo `"Tạo nháp phiếu xuất kho thành công"`. |
| **Hậu điều kiện** | Phiếu xuất kho được lưu ở trạng thái DRAFT. Số lượng tồn kho thực tế chưa bị trừ. |

---

### UC26: XÁC NHẬN PHIẾU XUẤT KHO

| Mã Use case | UC26 | Tên Use case | Xác nhận xuất kho thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Phiếu xuất kho đang ở trạng thái nháp `DRAFT`. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Mở chi tiết phiếu xuất kho nháp và nhấn nút **Xác nhận xuất kho**. |
| | 2 | Hệ thống | Kiểm tra trạng thái hiện tại của phiếu xuất phải là `DRAFT`. |
| | 3 | Hệ thống | Duyệt qua từng dòng thuốc xuất, tính toán số lượng xuất quy đổi và kiểm tra số lượng tồn kho thực tế của lô trong bảng `inventory`. |
| | 4 | Hệ thống | Trừ số lượng tồn kho thực tế của các lô thuốc tương ứng trong bảng `inventory`. Cập nhật trạng thái lô thành `SOLD_OUT` hoặc `DISPOSED` nếu tồn kho về 0. |
| | 5 | Hệ thống | Ghi nhận nhật ký biến động kho vào bảng `inventory_transaction` với loại giao dịch `EXPORT` (ghi lượng xuất âm). |
| | 6 | Hệ thống | Chuyển trạng thái phiếu xuất thành `CONFIRMED` và lưu thời gian xuất thực tế. |
| | 7 | Hệ thống | Hiển thị thông báo `"Xác nhận xuất kho và cập nhật tồn kho thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 3a | Hệ thống | **Không đủ tồn kho để xuất**: Hệ thống phát hiện số lượng tồn kho thực tế của một lô nhỏ hơn số lượng yêu cầu xuất. Báo lỗi `"Không đủ tồn kho để xuất! Thuốc: [Tên], Lô: [Mã lô]..."`, thực hiện hủy bỏ toàn bộ giao dịch trừ kho và giữ nguyên trạng thái DRAFT của phiếu xuất. |
| **Hậu điều kiện** | Phiếu xuất chuyển sang CONFIRMED, số lượng tồn kho thực tế bị trừ đi, lịch sử thẻ kho được ghi nhận. |

---

### UC27: HỦY PHIẾU XUẤT KHO NHÁP

| Mã Use case | UC27 | Tên Use case | Hủy phiếu xuất kho nháp |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Phiếu xuất kho đang ở trạng thái nháp `DRAFT`. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang chi tiết phiếu xuất nháp, nhấn nút **Hủy phiếu**. |
| | 2 | Hệ thống | Hiển thị hộp thoại xác nhận hủy phiếu xuất kho. |
| | 3 | Người dùng | Nhấn nút **Xác nhận hủy**. |
| | 4 | Hệ thống | Kiểm tra trạng thái phiếu phải là `DRAFT`. |
| | 5 | Hệ thống | Chuyển trạng thái phiếu xuất thành `CANCELLED` trong cơ sở dữ liệu. Giữ nguyên số tồn kho. |
| | 6 | Hệ thống | Hiển thị thông báo `"Hủy phiếu xuất kho thành công"`. |
| **Hậu điều kiện** | Phiếu xuất kho được hủy bỏ thành công, trạng thái chuyển thành CANCELLED. |

---

### UC28: LẬP PHIẾU KIỂM KÊ KHO NHÁP

| Mã Use case | UC28 | Tên Use case | Lập phiếu kiểm kê kho ở trạng thái Nháp (DRAFT) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Kiểm kê kho** và nhấn nút **Tạo phiếu kiểm kê mới**. |
| | 2 | Hệ thống | Tải toàn bộ danh sách các lô thuốc đang có tồn kho khác không từ bảng `inventory`. |
| | 3 | Hệ thống | Tạo phiếu kiểm kê ở trạng thái `DRAFT` với mã tự sinh `AUD-[8 ký tự ngẫu nhiên]`. |
| | 4 | Hệ thống | Sao chụp số lượng tồn kho sổ sách của tất cả các lô thuốc này vào cột `systemQuantity` và mặc định `actualQuantity` bằng `systemQuantity`. |
| | 5 | Hệ thống | Hiển thị thông báo tạo nháp thành công và hiển thị giao diện chi tiết phiếu kiểm kê. |
| **Hậu điều kiện** | Phiếu kiểm kê nháp được tạo thành công, ghi nhận dữ liệu sổ sách hệ thống tại thời điểm lập phiếu. |

---

### UC29: NHẬP SỐ ĐẾM THỰC TẾ KIỂM KHO

| Mã Use case | UC29 | Tên Use case | Nhập số lượng đếm thực tế kiểm kho và lưu nháp |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Phiếu kiểm kê đang ở trạng thái `DRAFT` hoặc `IN_PROGRESS`. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang chi tiết phiếu kiểm kê, nhấn **Bắt đầu thực hiện kiểm kho**. |
| | 2 | Hệ thống | Chuyển trạng thái phiếu từ `DRAFT` sang `IN_PROGRESS` (nếu đang là DRAFT). |
| | 3 | Người dùng | Kiểm đếm kho thực tế và điền số lượng đếm được vào ô **Số lượng thực tế** của từng lô thuốc tương ứng. Nhập thêm ghi chú giải trình (nếu cần). |
| | 4 | Hệ thống | Tự động tính chênh lệch `actualQuantity - systemQuantity` hiển thị trực quan lên giao diện. |
| | 5 | Người dùng | Nhấn nút **Lưu tạm**. |
| | 6 | Hệ thống | Lưu lại số lượng thực tế đếm tạm thời và các ghi chú vào bảng `stock_audit_detail`. Hiển thị thông báo `"Lưu số thực tế đếm tạm thời thành công"`. |
| **Hậu điều kiện** | Số lượng thực tế kiểm đếm được ghi nhận tạm thời vào phiếu kiểm kê. |

---

### UC30: XÁC NHẬN ĐỐI SOÁT HOÀN THÀNH KIỂM KÊ

| Mã Use case | UC30 | Tên Use case | Xác nhận đối soát hoàn thành kiểm kê và điều chỉnh kho |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Phiếu kiểm kê đang ở trạng thái `IN_PROGRESS` hoặc `DRAFT`. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại giao diện phiếu kiểm kê, nhấn nút **Xác nhận đối soát hoàn thành kiểm kê**. |
| | 2 | Hệ thống | Kiểm tra xem người dùng đã nhập đầy đủ số lượng thực tế cho tất cả các lô thuốc chưa. |
| | 3 | Hệ thống | Cập nhật số lượng tồn kho của tất cả các lô thuốc trong bảng `inventory` về khớp với số thực tế đếm được (`actualQuantity`). |
| | 4 | Hệ thống | Với các lô có chênh lệch (`discrepancy != 0`), hệ thống tạo một bản ghi điều chỉnh kiểm kho trong bảng `inventory_transaction` với loại giao dịch `AUDIT_ADJUST` và ghi nhận lượng chênh lệch (âm hoặc dương). |
| | 5 | Hệ thống | Cập nhật trạng thái phiếu kiểm kê thành `CONFIRMED`, ghi nhận thông tin nhân viên phê duyệt. |
| | 6 | Hệ thống | Hiển thị thông báo `"Xác nhận đối soát hoàn thành kiểm kê và cập nhật tồn kho thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 2a | Hệ thống | **Chưa nhập đủ số lượng thực tế**: Hệ thống phát hiện có dòng chi tiết chưa có số đếm. Báo lỗi `"Vui lòng nhập đầy đủ Số lượng thực tế cho tất cả các lô thuốc trước khi hoàn thành đối soát!"` và chặn xác nhận. |
| **Hậu điều kiện** | Tồn kho hệ thống được đồng bộ khớp với thực tế kiểm đếm, ghi nhận lịch sử điều chỉnh kiểm kê, phiếu kiểm kê chuyển thành CONFIRMED. |

---

### UC31: LẬP HÓA ĐƠN BÁN LẺ THUỐC TẠI QUẦY - POS

| Mã Use case | UC31 | Tên Use case | Lập hóa đơn bán lẻ thuốc tại quầy (POS) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Sales, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập vào hệ thống. Các lô thuốc trong kho còn số lượng tồn kho và còn hạn sử dụng. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Bán lẻ (POS)** trên thanh menu chính. |
| | 2 | Hệ thống | Hiển thị giao diện POS gồm thanh tìm kiếm thuốc nhanh, giỏ hàng và phần thanh toán. |
| | 3 | Người dùng | Nhập từ khóa tìm kiếm thuốc và chọn lô thuốc còn hạn sử dụng để thêm vào giỏ hàng. Nhập Số lượng bán và chọn đơn vị tính bán (viên/vỉ/hộp). |
| | 4 | Hệ thống | Kiểm tra tồn kho của lô, nhân số lượng với đơn giá bán lẻ quy đổi tương ứng. Thêm dòng thuốc vào giỏ hàng và cập nhật Tổng tiền hóa đơn. |
| | 5 | Người dùng | Nhập SĐT khách hàng thành viên (nếu có), chọn Phương thức thanh toán (Tiền mặt / Thẻ) và nhập Số tiền khách đưa (nếu là Tiền mặt). |
| | 6 | Hệ thống | Tính tiền thừa trả lại khách (`Tiền thừa = Tiền khách đưa - Tổng tiền hóa đơn`). |
| | 7 | Người dùng | Nhấn nút **Thanh toán & Xuất hóa đơn**. |
| | 8 | Hệ thống | Kiểm tra lại tồn kho thực tế của các lô thuốc trong giỏ hàng. Trừ trực tiếp số lượng bán (quy đổi) trong bảng `inventory`. Cập nhật trạng thái lô thành `SOLD_OUT` nếu hết hàng. |
| | 9 | Hệ thống | Tạo hóa đơn mới trạng thái `Paid` trong bảng `invoice` và `invoice_detail`. Ghi nhận giao dịch bán lẻ trong bảng `inventory_transaction` với loại giao dịch `SALE` (ghi lượng xuất bán âm). |
| | 10 | Hệ thống | Hiển thị thông báo `"Tạo hóa đơn và trừ tồn kho lô thành công"`. Hiển thị giao diện hóa đơn nhiệt mô phỏng và kích hoạt lệnh in hóa đơn bán hàng cho khách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 8a | Hệ thống | **Không đủ tồn kho lô**: Hệ thống kiểm tra phát hiện số lượng tồn kho của một lô tại thời điểm thanh toán nhỏ hơn số lượng yêu cầu mua. Hệ thống dừng giao dịch, báo lỗi `"Không đủ tồn kho! Hoạt chất: [Tên], Lô: [Mã lô]..."` để nhân viên điều chỉnh giỏ hàng. |
| **Hậu điều kiện** | Hóa đơn bán lẻ được tạo thành công với trạng thái Paid. Tồn kho của các lô thuốc bán ra bị trừ đi. Nhật ký biến động kho được ghi nhận. Hóa đơn nhiệt được in. |

---

### UC32: XEM LỊCH SỬ THẺ KHO CỦA THUỐC

| Mã Use case | UC32 | Tên Use case | Xem lịch sử thẻ kho của thuốc (Inventory Transactions) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Thẻ kho / Lịch sử thẻ kho** trong module Quản lý kho. |
| | 2 | Hệ thống | Hiển thị giao diện chọn thuốc và bảng dữ liệu lịch sử thẻ kho. |
| | 3 | Người dùng | Tìm kiếm và chọn một thuốc cụ thể từ danh sách chọn nhanh. |
| | 4 | Hệ thống | Gọi API GET `/api/inventory/transactions` truyền tham số `medicineId` vừa chọn. |
| | 5 | Hệ thống | Lấy toàn bộ danh sách giao dịch biến động liên quan đến các lô của thuốc đó từ bảng `inventory_transaction` sắp xếp theo thời gian tăng dần. |
| | 6 | Hệ thống | Hiển thị chi tiết biến động dạng thẻ kho bao gồm: Thời gian giao dịch, Mã chứng từ tham chiếu (Mã phiếu nhập, phiếu xuất, hóa đơn...), Loại biến động (Nhập kho/Xuất kho/Bán lẻ/Đối soát kiểm kê), Số lượng thay đổi (+/-) và Số dư cuối kỳ sau giao dịch. |
| **Hậu điều kiện** | Lịch sử thẻ kho của thuốc được hiển thị chính xác và chi tiết, giúp theo dõi đường đi của thuốc. |
