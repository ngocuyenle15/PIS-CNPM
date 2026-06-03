# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS) - HỆ THỐNG QUẢN LÝ KHO THUỐC (PIS)

Tài liệu này xác định chi tiết các **Yêu cầu Chức năng (Functional Requirements - FR)** và **Yêu cầu Phi chức năng (Non-Functional Requirements - NFR)** của hệ thống **PIS (Pharmacy Inventory Management System)**. Tài liệu được biên soạn dựa trên phân tích mã nguồn thực tế và luồng nghiệp vụ của dự án, tuân thủ theo tiêu chuẩn SRS (IEEE 830).

---

## 1. GIỚI THIỆU CHUNG
* **Tên hệ thống**: PIS - Hệ thống Quản lý kho thuốc và Bán lẻ POS.
* **Mục tiêu**: Hỗ trợ nhà thuốc quản lý danh mục thuốc, đối tác (khách hàng, nhà cung cấp), nhân sự; thực hiện các nghiệp vụ xuất/nhập/kiểm kê kho chặt chẽ, tối ưu hóa quy trình bán lẻ POS tại quầy và ghi nhận vết thẻ kho tự động.
* **Tác nhân hệ thống (Roles)**:
  * **Admin (Quản trị viên)**: Quyền cao nhất, quản lý nhân viên, tài khoản, cấu hình hệ thống và phê duyệt giao dịch.
  * **Product_manager (Quản lý kho)**: Quản lý danh mục thuốc, thực hiện các giao dịch xuất kho, nhập kho, kiểm kê và xem báo cáo tồn kho.
  * **Sales (Nhân viên bán hàng)**: Thực hiện bán lẻ tại quầy (POS), tạo hóa đơn và quản lý thông tin khách hàng.

---

## 2. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS - FR)

Các yêu cầu chức năng được phân loại theo từng phân hệ nghiệp vụ, gán mã định danh duy nhất (FR-ID) để tiện đối chiếu và kiểm thử.

### Phân hệ 1: Xác thực & Tài khoản cá nhân (FR-AUTH)

| FR-ID | Tên Yêu Cầu | Mô Tả Yêu Cầu | Vai Trò (Roles) | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :--- |
| **FR-AUTH-01** | Đăng nhập hệ thống | Cho phép người dùng đăng nhập bằng `username` và `password`. Kiểm tra trạng thái hoạt động tài khoản (`isActive`). | Tất cả | Cao |
| **FR-AUTH-02** | Đổi mật khẩu lần đầu | Bắt buộc tài khoản có trạng thái `isFirstLogin = true` phải thực hiện đổi mật khẩu mới có thể truy cập hệ thống. | Tất cả | Cao |
| **FR-AUTH-03** | Đăng xuất | Cho phép người dùng đăng xuất, hủy bỏ hiệu lực của Access Token bằng danh sách đen (`InvalidatedToken`) và xóa Refresh Token. | Tất cả | Cao |
| **FR-AUTH-04** | Làm mới Token | Hệ thống tự động gọi API refresh để xoay vòng token khi Access Token hết hạn mà không ngắt quãng phiên làm việc. | Hệ thống | Cao |
| **FR-AUTH-05** | Quên mật khẩu | Cho phép người dùng yêu cầu cấp lại mật khẩu tạm thời bằng Username và Email. Mật khẩu 8 ký tự được gửi tự động qua email. | Khách | Trung bình |
| **FR-AUTH-06** | Đổi mật khẩu chủ động | Cho phép người dùng đăng nhập thay đổi mật khẩu của mình bất cứ lúc nào (yêu cầu mật khẩu cũ phải chính xác). | Tất cả | Cao |
| **FR-AUTH-07** | Lấy thông tin cá nhân | API trả về thông tin cá nhân, chức vụ, phòng ban của tài khoản đang đăng nhập để hiển thị lên Header. | Tất cả | Cao |

---

### Phân hệ 2: Quản lý Dữ liệu nền & Thuốc (FR-MED)

| FR-ID | Tên Yêu Cầu | Mô Tả Yêu Cầu | Vai Trò (Roles) | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :--- |
| **FR-MED-01** | Xem danh mục thuốc | Hiển thị danh sách danh mục (nhóm) thuốc, hỗ trợ phân trang và tìm kiếm theo tên/mã danh mục. | Tất cả | Cao |
| **FR-MED-02** | Quản lý danh mục | Cho phép Thêm, Cập nhật, Xóa thông tin danh mục thuốc. Ngăn cản xóa danh mục đang chứa sản phẩm thuốc. | Admin, Product_manager | Cao |
| **FR-MED-03** | Quản lý Nước sản xuất | Cho phép Xem, Thêm, Cập nhật, Xóa thông tin nước sản xuất (Origin). Kiểm tra ràng buộc liên kết trước khi xóa. | Admin, Product_manager | Cao |
| **FR-MED-04** | Quản lý Đơn vị tính | Cho phép Xem, Thêm, Cập nhật, Xóa đơn vị tính (Unit) (ví dụ: viên, vỉ, hộp). Ngăn cản xóa đơn vị đang được sử dụng. | Admin, Product_manager | Cao |
| **FR-MED-05** | Xem danh sách thuốc | Hiển thị danh sách thuốc trong hệ thống, lọc theo danh mục, xuất xứ hoặc tìm kiếm đa tiêu chí (tên thuốc, hoạt chất, hàm lượng). | Tất cả | Cao |
| **FR-MED-06** | Thêm thông tin thuốc | Cho phép thêm một loại thuốc mới với các thông tin: Mã thuốc, tên thuốc, hoạt chất, hàm lượng, giá bán lẻ, đơn vị tính cơ bản. | Admin, Product_manager | Cao |
| **FR-MED-07** | Cập nhật thông tin thuốc | Cho phép sửa đổi thông tin thuốc đã tồn tại (không cho sửa Mã thuốc). | Admin, Product_manager | Cao |
| **FR-MED-08** | Xóa thông tin thuốc | Cho phép xóa loại thuốc ra khỏi hệ thống nếu thuốc đó chưa từng phát sinh giao dịch nhập, xuất, bán hoặc tồn kho. | Admin, Product_manager | Cao |

---

### Phân hệ 3: Quản lý Đối tác & Nhân sự (FR-PARTNER)

| FR-ID | Tên Yêu Cầu | Mô Tả Yêu Cầu | Vai Trò (Roles) | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :--- |
| **FR-PARTNER-01** | Quản lý nhà cung cấp | Cho phép Xem, Thêm, Sửa, Xóa nhà cung cấp thuốc (mã NCC, tên NCC, SĐT, địa chỉ). | Admin, Product_manager | Cao |
| **FR-PARTNER-02** | Quản lý khách hàng | Cho phép nhân viên bán hàng Thêm, Sửa thông tin khách hàng thành viên khi làm hóa đơn tại quầy. Admin được quyền Xóa khách hàng. | Admin (Xem/Thêm/Sửa/Xóa), Sales (Xem/Thêm/Sửa) | Cao |
| **FR-PARTNER-03** | Quản lý nhân viên | Xem danh sách nhân viên, thêm mới thông tin nhân sự, cập nhật thông tin và xóa nhân viên (nếu chưa liên kết tài khoản). | Admin | Cao |
| **FR-PARTNER-04** | Quản lý tài khoản nhân viên | Tạo tài khoản đăng nhập cho nhân viên (tự động sinh mật khẩu, gửi email). Cho phép đổi vai trò hoặc khóa tài khoản (`isActive=false`). | Admin | Cao |
| **FR-PARTNER-05** | Reset password nhân viên | Cho phép quản trị viên đặt lại mật khẩu mới cho tài khoản nhân viên bị mất mật khẩu. | Admin | Cao |

---

### Phân hệ 4: Nghiệp vụ Kho thuốc (FR-WH)

| FR-ID | Tên Yêu Cầu | Mô Tả Yêu Cầu | Vai Trò (Roles) | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :--- |
| **FR-WH-01** | Lập phiếu nhập kho nháp | Lập phiếu nhập kho ở trạng thái `DRAFT`. Nhập các chi tiết thuốc (lô, hạn dùng, số lượng, đơn vị tính quy đổi, giá nhập) để lưu nháp hệ thống. | Admin, Product_manager | Cao |
| **FR-WH-02** | Xác nhận nhập kho | Thực hiện chốt phiếu nhập kho, cập nhật trạng thái phiếu thành `CONFIRMED`. Hệ thống tự động tính quy đổi đơn vị và cộng dồn số lượng vào tồn kho thực tế. | Admin, Product_manager | Cao |
| **FR-WH-03** | Hủy phiếu nhập kho nháp | Cho phép hủy các phiếu nhập kho đang ở trạng thái `DRAFT` sang `CANCELLED`. Không làm ảnh hưởng đến tồn kho. | Admin, Product_manager | Cao |
| **FR-WH-04** | Lập phiếu xuất kho nháp | Tạo phiếu xuất kho nháp (`DRAFT`) với lý do tương ứng (Xuất hủy hết hạn, xuất hỏng, xuất trả hàng). | Admin, Product_manager | Cao |
| **FR-WH-05** | Xác nhận xuất kho | Thực hiện kiểm tra tồn kho của từng lô thuốc. Nếu đủ, trừ tồn kho thực tế, ghi thẻ kho xuất và chuyển trạng thái phiếu xuất thành `CONFIRMED`. | Admin, Product_manager | Cao |
| **FR-WH-06** | Hủy phiếu xuất kho nháp | Cho phép hủy phiếu xuất kho đang ở trạng thái `DRAFT` sang `CANCELLED`. | Admin, Product_manager | Cao |
| **FR-WH-07** | Xem danh sách phiếu kho | Cho phép xem và tìm kiếm, lọc danh sách phiếu nhập kho, phiếu xuất kho theo khoảng thời gian, mã phiếu, nhân viên lập hoặc nhà cung cấp. | Tất cả | Cao |
| **FR-WH-08** | In phiếu nhập / xuất kho | Cho phép in ấn hóa đơn chứng từ phiếu nhập hoặc phiếu xuất kho ra khổ giấy chuẩn. | Tất cả | Trung bình |

---

### Phân hệ 5: Nghiệp vụ Kiểm kê kho (FR-AUDIT)

| FR-ID | Tên Yêu Cầu | Mô Tả Yêu Cầu | Vai Trò (Roles) | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :--- |
| **FR-AUDIT-01** | Tạo phiếu kiểm kê nháp | Tự động chụp tồn kho hệ thống của tất cả các lô thuốc tại thời điểm tạo, thiết lập phiếu kiểm kê nháp `DRAFT`. | Admin, Product_manager | Cao |
| **FR-AUDIT-02** | Bắt đầu kiểm kho | Chuyển trạng thái phiếu kiểm kê sang `IN_PROGRESS` để nhân viên thực hiện đếm số thực tế. | Admin, Product_manager | Cao |
| **FR-AUDIT-03** | Lưu số đếm thực tế | Cho phép cập nhật số lượng đếm thực tế và ghi chú chênh lệch tạm thời, bấm Lưu nháp để bảo lưu số đếm. | Admin, Product_manager | Cao |
| **FR-AUDIT-04** | Xác nhận đối soát kiểm kê | Đối chiếu số đếm thực tế và số sổ sách. Cập nhật tồn kho hệ thống về đúng số lượng đếm thực tế. Ghi nhận giao dịch điều chỉnh chênh lệch (`AUDIT_ADJUST`) và chuyển phiếu sang `CONFIRMED`. | Admin, Product_manager | Cao |
| **FR-AUDIT-05** | Hủy phiếu kiểm kê | Cho phép hủy phiếu kiểm kê đang ở trạng thái `DRAFT` hoặc `IN_PROGRESS`. | Admin, Product_manager | Cao |

---

### Phân hệ 6: POS & Nghiệp vụ Bán hàng (FR-POS)

| FR-ID | Tên Yêu Cầu | Mô Tả Yêu Cầu | Vai Trò (Roles) | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :--- |
| **FR-POS-01** | Tìm kiếm thuốc bán lẻ | Cho phép gõ tìm kiếm nhanh hoặc quét mã vạch để lấy danh sách lô thuốc còn hạn sử dụng và còn hàng tồn kho. | Admin, Sales | Cao |
| **FR-POS-02** | Quản lý giỏ hàng bán lẻ | Cho phép thêm thuốc, chọn đơn vị tính bán lẻ (hộp/vỉ/viên), thay đổi số lượng mua, tự động kiểm tra số lượng và tính thành tiền. | Admin, Sales | Cao |
| **FR-POS-03** | Áp dụng Khách hàng | Cho phép tìm kiếm khách hàng theo Số điện thoại và gắn vào hóa đơn để tích điểm/theo dõi lịch sử. | Admin, Sales | Cao |
| **FR-POS-04** | Tính toán tiền thừa | Tự động tính toán số tiền cần trả lại khách dựa trên Tổng tiền hóa đơn và số tiền mặt khách đưa. | Admin, Sales | Cao |
| **FR-POS-05** | Thanh toán và trừ kho | Khi bấm thanh toán, hệ thống kiểm tra tồn kho lô, trừ tồn kho lô thực tế, lưu hóa đơn ở trạng thái `Paid` và ghi nhận lịch sử thẻ kho `SALE`. | Admin, Sales | Cao |
| **FR-POS-06** | In hóa đơn nhiệt | Tự động hiển thị và kích hoạt cửa sổ in hóa đơn nhiệt (Thermal Receipt) khổ K80 hoặc K57 cho khách hàng ngay sau khi thanh toán. | Admin, Sales | Cao |
| **FR-POS-07** | Xem danh sách hóa đơn | Xem danh sách hóa đơn bán lẻ đã lập, tìm kiếm theo tên khách hàng, mã hóa đơn hoặc tên thuốc đã mua. Cho phép in lại hóa đơn. | Tất cả | Cao |

---

### Phân hệ 7: Tồn kho & Báo cáo thẻ kho (FR-INV)

| FR-ID | Tên Yêu Cầu | Mô Tả Yêu Cầu | Vai Trò (Roles) | Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :--- |
| **FR-INV-01** | Xem tồn kho theo lô | Xem danh sách chi tiết số lượng tồn kho của từng lô thuốc (Mã lô, Giá nhập, Hạn sử dụng, Số lượng). | Tất cả | Cao |
| **FR-INV-02** | Lọc tồn kho nâng cao | Hỗ trợ lọc nhanh: Lọc thuốc sắp hết hạn, đã hết hạn, tồn kho dưới ngưỡng tối thiểu (`LOW_STOCK`). Lọc nâng cao theo Danh mục và Nước sản xuất. | Tất cả | Cao |
| **FR-INV-03** | Xem lịch sử thẻ kho | Cho phép chọn một loại thuốc và hiển thị tất cả các giao dịch phát sinh liên quan (Nhập/Xuất/Bán/Đối soát) theo thứ tự thời gian. | Tất cả | Cao |
| **FR-INV-04** | Thống kê Dashboard | Hiển thị biểu đồ xu hướng giao dịch nhập xuất 7 ngày gần nhất, tỷ lệ thuốc theo danh mục, cảnh báo khẩn cấp (thuốc hết hạn, cạn kho). | Tất cả | Cao |

---

### 3.1. Hiệu năng & Khả năng tải (Performance - NFR-PERF)
* **NFR-PERF-01 (Thời gian phản hồi)**: Các yêu cầu API đọc dữ liệu thông thường (danh sách thuốc, khách hàng, hóa đơn) phải phản hồi trong thời gian dưới **500ms** trong điều kiện mạng bình thường.
* **NFR-PERF-02 (Thời gian xử lý giao dịch kho)**: API xác nhận nhập kho, xuất kho hoặc thanh toán hóa đơn POS (đòi hỏi xử lý trừ kho và ghi log giao dịch đồng thời) phải hoàn tất và phản hồi dưới **1000ms**.
* **NFR-PERF-03 (Khả năng phân trang)**: Tất cả các API hiển thị danh sách lớn (thuốc, hóa đơn, phiếu nhập/xuất) bắt buộc phải thực hiện phân trang (Pagination) ở tầng cơ sở dữ liệu để tránh quá tải bộ nhớ RAM và băng thông truyền tải.
* **NFR-PERF-04 (Tải trang Client)**: Ứng dụng frontend (Vite React) phải được tối ưu hóa Bundle, thời gian tải trang đầu tiên (First Contentful Paint) dưới **2 giây**.

### 3.2. An toàn & Bảo mật (Security - NFR-SEC)
* **NFR-SEC-01 (Mã hóa mật khẩu)**: Mật khẩu của tất cả nhân viên phải được mã hóa bằng thuật toán băm một chiều **BCrypt** mạnh mẽ trước khi lưu vào cơ sở dữ liệu. Không lưu mật khẩu dạng văn bản thuần (plain text).
* **NFR-SEC-02 (Xác thực JWT)**: Sử dụng Token dạng **JWT (JSON Web Token)** để xác thực tất cả các API nghiệp vụ. Token có thời hạn ngắn (ví dụ: 15 phút) kết hợp với Refresh Token được lưu an toàn tại Client.
* **NFR-SEC-03 (Phân quyền RBAC tại Backend)**: Thực hiện kiểm soát truy cập dựa trên vai trò (Role-based Access Control) tại tầng Security Config của Spring Boot. Chặn truy cập trái phép từ mức API:
  * Quyền quản lý nhân sự và tài khoản (`/api/employees/**`, `/api/accounts/**`) chỉ dành cho quyền **Admin**.
  * Quyền tạo/sửa phiếu kho, thuốc, nhà cung cấp chỉ dành cho **Admin** và **Product_manager**.
  * Quyền lập hóa đơn bán lẻ chỉ dành cho **Admin** và **Sales**.
* **NFR-SEC-04 (Vô hiệu hóa Token khi đăng xuất)**: Khi người dùng chọn Đăng xuất, hệ thống phải đưa Access Token hiện tại vào bảng blacklist (`InvalidatedToken`) để vô hiệu hóa ngay lập tức.
* **NFR-SEC-05 (Ngăn chặn SQL Injection & XSS)**: Sử dụng Spring Data JPA (Hibernate) với các truy vấn tham số hóa (Parameterized Queries) để loại bỏ nguy cơ SQL Injection. Thực hiện lọc dữ liệu đầu vào chống Cross-Site Scripting (XSS).

### 3.3. Độ tin cậy & Toàn vẹn dữ liệu (Reliability - NFR-REL)
* **NFR-REL-01 (Toàn vẹn giao dịch - ACID)**: Các nghiệp vụ xuất kho, nhập kho, kiểm kê và lập hóa đơn POS phải chạy trong khối giao dịch Spring `@Transactional`. Đảm bảo nếu một bước bị lỗi (ví dụ: không đủ tồn kho lô), toàn bộ giao dịch phải được rollback (quay lui) về trạng thái ban đầu, tránh việc dữ liệu bị sai lệch.
* **NFR-REL-02 (Ràng buộc khóa ngoại)**: Thiết lập các ràng buộc toàn vẹn cơ sở dữ liệu (Foreign Key constraints) giữa Thuốc - Đơn vị tính, Thuốc - Danh mục, Hóa đơn - Lô tồn kho để tránh dữ liệu mồ côi (orphan data).
* **NFR-REL-03 (Tính bền vững)**: Cơ sở dữ liệu MySQL phải được chạy ở phân vùng dữ liệu bền vững (Docker volume persistence) để tránh mất mát dữ liệu khi container bị tắt hoặc khởi động lại.

### 3.4. Tính khả dụng (Usability - NFR-USA)
* **NFR-USA-01 (Giao diện đáp ứng)**: Giao diện web được tối ưu hiển thị tốt nhất trên màn hình máy tính (Desktop/Laptop) của nhân viên nhà thuốc (độ phân giải tối thiểu 1366x768).
* **NFR-USA-02 (Tối ưu giao diện POS bán hàng)**: Màn hình POS phải được thiết kế tập trung, hỗ trợ tìm kiếm thuốc nhanh bằng phím bấm, hiển thị rõ ràng số tiền khách đưa và tiền thừa để nhân viên thao tác nhanh chóng không cần dùng nhiều chuột.
* **NFR-USA-03 (Tính thẩm mỹ cao)**: Giao diện sử dụng hệ màu hiện đại, độ tương phản tốt, các thành phần cảnh báo hết hạn hoặc tồn kho thấp phải hiển thị màu đỏ/vàng rõ ràng để thu hút sự chú ý của thủ kho.

### 3.5. Tính tương thích & Khả năng di chuyển (Compatibility - NFR-COMP)
* **NFR-COMP-01 (Trình duyệt hỗ trợ)**: Ứng dụng Frontend phải tương thích tốt với các trình duyệt phổ biến hiện nay: Google Chrome, Microsoft Edge, Mozilla Firefox và Apple Safari phiên bản mới nhất.
* **NFR-COMP-02 (Đóng gói Docker)**: Toàn bộ hệ thống (MySQL, Backend, Frontend) phải được đóng gói bằng Docker và khởi chạy dễ dàng thông qua file `docker-compose.yml`.

### 3.6. Khả năng bảo trì & Phát triển (Maintainability - NFR-MNT)
* **NFR-MNT-01 (Kiến trúc phân lớp)**: Backend phải tuân thủ kiến trúc phân lớp chuẩn: Controller -> Service -> Repository -> Entity/DTO. Giúp dễ dàng bảo trì và viết Unit Test cho từng tầng.
* **NFR-MNT-02 (Ghi nhật ký hệ thống)**: Tích hợp thư viện Logback/Slf4j ghi nhận các sự kiện quan trọng (đăng nhập thất bại, xác nhận giao dịch kho thành công, ngoại lệ hệ thống) để phục vụ công tác giám sát và sửa lỗi.


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
- [UC01: Đăng nhập hệ thống (System Login)](#uc01-dang-nhap-he-thong-system-login)
- [UC02: Đăng xuất hệ thống (System Logout)](#uc02-dang-xuat-he-thong-system-logout)
- [UC03: Làm mới Token tự động (Token Refresh)](#uc03-lam-moi-token-tu-dong-token-refresh)
- [UC04: Xem thông tin tài khoản cá nhân (Get Me)](#uc04-xem-thong-tin-tai-khoan-ca-nhan-get-me)
- [UC05: Đổi mật khẩu tài khoản (Change Password)](#uc05-doi-mat-khau-tai-khoan-change-password)
- [UC06: Cấp lại mật khẩu tạm khi quên mật khẩu (Forgot Password)](#uc06-cap-lai-mat-khau-tam-khi-quen-mat-khau-forgot-password)

### PHÂN HỆ 2: QUẢN LÝ DANH MỤC VÀ DỮ LIỆU THUỐC
- [UC07: Xem danh sách danh mục thuốc (View Catalogs)](#uc07-xem-danh-sach-danh-muc-thuoc-view-catalogs)
- [UC08: Thêm danh mục thuốc mới (Create Catalog)](#uc08-them-danh-muc-thuoc-moi-create-catalog)
- [UC09: Cập nhật danh mục thuốc (Update Catalog)](#uc09-cap-nhat-danh-muc-thuoc-update-catalog)
- [UC10: Xóa danh mục thuốc (Delete Catalog)](#uc10-xoa-danh-muc-thuoc-delete-catalog)
- [UC11: Quản lý nước sản xuất (Origin CRUD)](#uc11-quan-ly-nuoc-san-xuat-origin-crud)
- [UC12: Quản lý đơn vị tính (Unit CRUD)](#uc12-quan-ly-don-vi-tinh-unit-crud)
- [UC13: Xem danh sách và tìm kiếm thuốc (Search Medicines)](#uc13-xem-danh-sach-va-tim-kiem-thuoc-search-medicines)
- [UC14: Thêm thông tin thuốc mới (Create Medicine)](#uc14-them-thong-tin-thuoc-moi-create-medicine)
- [UC15: Cập nhật thông tin thuốc (Update Medicine)](#uc15-cap-nhat-thong-tin-thuoc-update-medicine)
- [UC16: Xóa thông tin thuốc (Delete Medicine)](#uc16-xoa-thong-tin-thuoc-delete-medicine)

### PHÂN HỆ 3: QUẢN LÝ ĐỐI TÁC VÀ NHÂN SỰ
- [UC17: Quản lý nhà cung cấp (Supplier CRUD)](#uc17-quan-ly-nha-cung-cap-supplier-crud)
- [UC18: Quản lý thông tin khách hàng (Customer CRUD)](#uc18-quan-ly-thong-tin-khach-hang-customer-crud)
- [UC19: Quản lý thông tin nhân viên (Employee CRUD)](#uc19-quan-ly-thong-tin-nhan-vien-employee-crud)
- [UC20: Quản lý tài khoản người dùng (Account CRUD)](#uc20-quan-ly-tai-khoan-nguoi-dung-account-crud)
- [UC21: Đặt lại mật khẩu nhân viên (Admin Reset Password)](#uc21-dat-lai-mat-khau-nhan-vien-admin-reset-password)

### PHÂN HỆ 4: NGHIỆP VỤ KHO THUỐC
- [UC22: Lập phiếu nhập kho nháp (Create Goods Receipt Draft)](#uc22-lap-phieu-nhap-kho-nhap-create-goods-receipt-draft)
- [UC23: Xác nhận phiếu nhập kho (Confirm Goods Receipt)](#uc23-xac-nhan-phieu-nhap-kho-confirm-goods-receipt)
- [UC24: Hủy phiếu nhập kho nháp (Cancel Goods Receipt)](#uc24-huy-phieu-nhap-kho-nhap-cancel-goods-receipt)
- [UC25: Lập phiếu xuất kho nháp (Create Goods Issue Draft)](#uc25-lap-phieu-xuat-kho-nhap-create-goods-issue-draft)
- [UC26: Xác nhận phiếu xuất kho (Confirm Goods Issue)](#uc26-xac-nhan-phieu-xuat-kho-confirm-goods-issue)
- [UC27: Hủy phiếu xuất kho nháp (Cancel Goods Issue)](#uc27-huy-phieu-xuat-kho-nhap-cancel-goods-issue)
- [UC28: Lập phiếu kiểm kê kho nháp (Create Stock Audit Draft)](#uc28-lap-phieu-kiem-ke-kho-nhap-create-stock-audit-draft)
- [UC29: Nhập số đếm thực tế kiểm kho (Save Audit Quantities)](#uc29-nhap-so-dem-thuc-te-kiem-kho-save-audit-quantities)
- [UC30: Xác nhận đối soát hoàn thành kiểm kê (Confirm Stock Audit)](#uc30-xac-nhan-doi-soat-hoan-thanh-kiem-ke-confirm-stock-audit)

### PHÂN HỆ 5: BÁN HÀNG VÀ BÁO CÁO TỒN KHO
- [UC31: Lập hóa đơn bán lẻ thuốc tại quầy - POS (Create Invoice)](#uc31-lap-hoa-don-ban-le-thuoc-tai-quay---pos-create-invoice)
- [UC32: Xem lịch sử thẻ kho của thuốc (View Stock Card)](#uc32-xem-lich-su-the-kho-cua-thuoc-view-stock-card)

---

## PHẦN CHI TIẾT ĐẶC TẢ TỪNG USE CASE

---

### UC01: Đăng nhập hệ thống (System Login)

| Mã Use case | UC01 | Tên Use case | Đăng nhập hệ thống |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager | | |
| **Tiền điều kiện** | Người dùng đã có tài khoản được kích hoạt trên hệ thống (`isActive = true`). | | |
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
| **Hậu điều kiện** | Người dùng đăng nhập thành công vào hệ thống và được cấp quyền truy cập các chức năng tương ứng với vai trò. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `username` | String (5 - 50 ký tự) | Bắt buộc nhập, phải chứa ký tự chữ hoặc số hợp lệ. Trạng thái `isActive` liên kết trong DB phải là `true`. |
| `password` | String (8 - 100 ký tự) | Bắt buộc nhập. Hệ thống sử dụng `BCrypt.matches` để đối chiếu với mật khẩu đã mã hóa trong DB. |

---

### UC02: Đăng xuất hệ thống (System Logout)

| Mã Use case | UC02 | Tên Use case | Đăng xuất hệ thống |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập thành công và có Access Token hợp lệ. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấn vào biểu tượng tài khoản và chọn nút **Đăng xuất**. |
| | 2 | Hệ thống | Gửi yêu cầu đăng xuất chứa Access Token lên API `/api/auth/logout/`. |
| | 3 | Hệ thống | Backend xác thực Access Token, đưa Access Token vào danh sách đen (`invalidated_token`) và xóa Refresh Token của người dùng trong DB. |
| | 4 | Hệ thống | Xóa bỏ Access Token và Refresh Token đang lưu tại LocalStorage ở trình duyệt. |
| | 5 | Hệ thống | Chuyển hướng người dùng về giao diện trang đăng nhập và hiển thị thông báo `"Đăng xuất thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 2a | Hệ thống | **Token không hợp lệ hoặc đã hết hạn**: Hệ thống vẫn thực hiện xóa LocalStorage trên Client và đưa người dùng về trang đăng nhập để đảm bảo an toàn. |
| **Hậu điều kiện** | Phiên làm việc của người dùng bị hủy bỏ hoàn toàn, không thể dùng Access Token cũ để gọi API. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `Authorization` | Header (Bearer Token) | Access Token hợp lệ được đính kèm trên Header. Token này sau đó sẽ được lưu vào bảng `invalidated_token` (blacklist) trong DB để vô hiệu hóa hoàn toàn cho đến khi hết thời hạn sinh (TTL). |

---

### UC03: Làm mới Token tự động (Token Refresh)

| Mã Use case | UC03 | Tên Use case | Làm mới Token tự động (Token Rotation) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Hệ thống (gọi tự động) | | |
| **Tiền điều kiện** | Access Token hết hạn nhưng Refresh Token vẫn còn hạn và lưu tại LocalStorage. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Hệ thống | Nhận mã lỗi 401 (Unauthorized) từ Backend khi gọi một API bất kỳ. |
| | 2 | Hệ thống | Client tự động gửi yêu cầu API đến `/api/auth/refresh/` kèm theo Refresh Token cũ. |
| | 3 | Hệ thống | Backend xác minh tính hợp lệ và thời hạn của Refresh Token cũ. |
| | 4 | Hệ thống | Backend tạo một Access Token mới và xoay vòng Refresh Token mới. |
| | 5 | Hệ thống | Client cập nhật token mới vào LocalStorage và thực hiện lại yêu cầu API ban đầu bị lỗi 401. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 3a | Hệ thống | **Refresh Token hết hạn/không hợp lệ**: Backend phản hồi lỗi. Client lập tức xóa LocalStorage và chuyển hướng người dùng về trang Đăng nhập buộc đăng nhập lại. |
| **Hậu điều kiện** | Phiên đăng nhập được gia hạn thành công mà không gây gián đoạn trải nghiệm của người dùng. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `refreshToken` | String (JWT / UUID) | Refresh Token cũ được gửi lên body của POST request. Hệ thống truy vấn DB kiểm tra sự tồn tại và thời hạn hiệu lực, tiến hành xóa token cũ và phát hành token xoay vòng mới. |

---

### UC04: Xem thông tin tài khoản cá nhân (Get Me)

| Mã Use case | UC04 | Tên Use case | Xem thông tin tài khoản cá nhân |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập thành công vào hệ thống. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Hệ thống | Khi người dùng tải trang chủ, Frontend tự động gửi yêu cầu GET tới `/api/auth/me/`. |
| | 2 | Hệ thống | Backend lấy Username từ Security Context và truy vấn thông tin tài khoản cùng thông tin nhân viên (`employee`) liên kết. |
| | 3 | Hệ thống | Trả về thông tin chi tiết: Username, Vai trò, Họ tên nhân viên, Email, Số điện thoại và Ngày vào làm. |
| | 4 | Hệ thống | Hiển thị tên nhân viên và vai trò trên góc phải thanh Header của giao diện. |
| **Hậu điều kiện** | Người dùng thấy được đúng thông tin cá nhân của mình trên giao diện. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `username` | String (SecurityContext) | Được trích xuất trực tiếp từ Access Token trong luồng xử lý `SecurityContextHolder`. Không chấp nhận Client truyền tham số username trực tiếp để tránh giả mạo tài khoản. |

---

### UC05: Đổi mật khẩu tài khoản (Change Password)

| Mã Use case | UC05 | Tên Use case | Đổi mật khẩu tài khoản |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Sales, Product_manager | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập thành công vào hệ thống. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấp chọn mục **Đổi mật khẩu** từ menu tài khoản cá nhân. |
| | 2 | Hệ thống | Hiển thị Form Đổi mật khẩu gồm: Mật khẩu cũ, Mật khẩu mới và Xác nhận mật khẩu mới. |
| | 3 | Người dùng | Nhập đầy đủ thông tin vào Form đổi mật khẩu và nhấn nút **Đổi mật khẩu**. |
| | 4 | Hệ thống | Kiểm tra tính chính xác của mật khẩu cũ và xác thực tính trùng khớp của hai trường mật khẩu mới. |
| | 5 | Hệ thống | Mã hóa mật khẩu mới bằng BCrypt, cập nhật vào bảng `account`, đồng thời đặt thuộc tính `isFirstLogin` thành `false`. |
| | 6 | Hệ thống | Hiển thị thông báo `"Đổi mật khẩu thành công"`, đóng Form. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Mật khẩu mới không trùng khớp**: Hệ thống báo lỗi `"Mật khẩu mới và mật khẩu xác nhận không khớp"` và yêu cầu nhập lại. |
| | 4b | Hệ thống | **Mật khẩu cũ không chính xác**: Hệ thống báo lỗi `"Mật khẩu cũ không chính xác"` ở chân trường nhập liệu. |
| **Hậu điều kiện** | Mật khẩu tài khoản được cập nhật mới. Nếu là tài khoản mới đăng nhập lần đầu, tài khoản sẽ được phép truy cập đầy đủ tính năng ở các phiên sau. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `oldPassword` | String (8 - 100 ký tự) | Bắt buộc nhập. Phải khớp với mật khẩu hiện tại trong DB. |
| `newPassword` | String (8 - 100 ký tự) | Bắt buộc nhập. Phải có độ dài tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số để tăng tính bảo mật. Không được trùng mật khẩu cũ. |
| `confirmNewPassword`| String (8 - 100 ký tự) | Bắt buộc nhập. Phải trùng khớp hoàn toàn với `newPassword`. |

---

### UC06: Cấp lại mật khẩu tạm khi quên mật khẩu (Forgot Password)

| Mã Use case | UC06 | Tên Use case | Quên mật khẩu và Cấp mật khẩu tạm thời |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Nhân viên quên mật khẩu (Khách truy cập) | | |
| **Tiền điều kiện** | Nhân viên đã có tài khoản và email đã được khai báo chính xác trên hệ thống. | | |
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
| **Hậu điều kiện** | Mật khẩu tài khoản được cập nhật thành mật khẩu tạm. Trạng thái tài khoản chuyển sang yêu cầu đổi mật khẩu ở lần đăng nhập tiếp theo. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `username` | String (5 - 50 ký tự) | Bắt buộc nhập. Phải tồn tại trong hệ thống. |
| `email` | String (Max 100 ký tự) | Bắt buộc nhập. Phải tuân thủ định dạng email chuẩn và trùng khớp với địa chỉ email của nhân viên (`Employee.email`) đang được liên kết với tài khoản này. |

---

### UC07: Xem danh sách danh mục thuốc (View Catalogs)

| Mã Use case | UC07 | Tên Use case | Xem danh sách danh mục thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Danh mục thuốc** trong phần Cài đặt thuốc ở thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET tới `/api/catalogs` để lấy danh sách danh mục. |
| | 3 | Hệ thống | Tải dữ liệu từ bảng `catalog` trong cơ sở dữ liệu. |
| | 4 | Hệ thống | Hiển thị danh sách danh mục thuốc lên bảng dữ liệu (gồm Mã danh mục, Tên danh mục và các hành động sửa/xóa). |
| **Hậu điều kiện** | Danh sách danh mục thuốc được hiển thị đầy đủ và chính xác trên giao diện. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `page` | Integer | Mặc định = 0. Phải lớn hơn hoặc bằng 0. |
| `size` | Integer | Mặc định = 10. Phải lớn hơn 0. |
| `search` | String | Lọc tương đối (`LIKE`) theo Tên hoặc Mã danh mục. Có thể để trống. |

---

### UC08: Thêm danh mục thuốc mới (Create Catalog)

| Mã Use case | UC08 | Tên Use case | Thêm danh mục thuốc mới |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang Danh mục thuốc, nhấn nút **Thêm danh mục**. |
| | 2 | Hệ thống | Hiển thị Form Thêm danh mục yêu cầu nhập Mã danh mục và Tên danh mục. |
| | 3 | Người dùng | Nhập đầy đủ thông tin và nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ: các trường nhập liệu không được trống và Mã danh mục chưa tồn tại. |
| | 5 | Hệ thống | Lưu danh mục thuốc mới vào bảng `catalog` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Tạo danh mục thuốc thành công"`, đóng Form nhập và tải lại danh sách danh mục. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã danh mục**: Hệ thống hiển thị thông báo lỗi `"Mã danh mục đã tồn tại"` và giữ nguyên form nhập. |
| **Hậu điều kiện** | Danh mục thuốc mới được lưu thành công vào cơ sở dữ liệu. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `catalogCode` | String (3 - 20 ký tự) | Bắt buộc nhập, phải viết liền không dấu, không chứa ký tự đặc biệt, và là duy nhất (Unique) trong DB. |
| `catalogName` | String (Max 100 ký tự) | Bắt buộc nhập, không được chứa toàn khoảng trắng. |

---

### UC09: Cập nhật danh mục thuốc (Update Catalog)

| Mã Use case | UC09 | Tên Use case | Cập nhật danh mục thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng danh mục cần sửa, nhấn vào nút **Chỉnh sửa** (biểu tượng bút chì). |
| | 2 | Hệ thống | Hiển thị Form Chỉnh sửa chứa thông tin hiện tại của danh mục đó (không cho sửa Mã danh mục). |
| | 3 | Người dùng | Thay đổi Tên danh mục thuốc và nhấn nút **Cập nhật**. |
| | 4 | Hệ thống | Kiểm tra dữ liệu nhập không được để trống. |
| | 5 | Hệ thống | Lưu thay đổi vào bảng `catalog` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Cập nhật danh mục thuốc thành công"`, đóng Form và tải lại danh sách. |
| **Hậu điều kiện** | Thông tin danh mục thuốc được cập nhật thay đổi thành công vào cơ sở dữ liệu. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `id` | Integer / UUID | Khóa chính của danh mục cần cập nhật. Phải tồn tại trong DB. |
| `catalogName` | String (Max 100 ký tự) | Bắt buộc nhập, không được để trống. |

---

### UC10: Xóa danh mục thuốc (Delete Catalog)

| Mã Use case | UC10 | Tên Use case | Xóa danh mục thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng danh mục cần xóa, nhấn vào nút **Xóa** (biểu tượng thùng rác). |
| | 2 | Hệ thống | Hiển thị hộp thoại cảnh báo: `"Bạn có chắc chắn muốn xóa danh mục này?"`. |
| | 3 | Người dùng | Nhấn nút **Xác nhận xóa**. |
| | 4 | Hệ thống | Kiểm tra xem danh mục này có đang liên kết với loại thuốc nào không. |
| | 5 | Hệ thống | Thực hiện xóa bản ghi danh mục khỏi bảng `catalog` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Xóa danh mục thuốc thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Danh mục đang được sử dụng**: Hệ thống phát hiện có thuốc đang thuộc danh mục này. Hiển thị thông báo lỗi `"Không thể xóa danh mục vì đang có thuốc liên kết"` và hủy tác vụ xóa. |
| **Hậu điều kiện** | Bản ghi danh mục thuốc được xóa khỏi cơ sở dữ liệu thành công. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `id` | Integer / UUID | Khóa chính của danh mục cần xóa. |
| Ràng buộc ràng buộc ngoại | DB Constraints | Ngăn cản xóa (chặn ở tầng Service và Database) nếu có bất kỳ bản ghi thuốc nào (`medicine.catalog_id`) trỏ về khóa này. Trả về mã lỗi 400 Bad Request nếu vi phạm. |

---

### UC11: Quản lý nước sản xuất (Origin CRUD)

| Mã Use case | UC11 | Tên Use case | Quản lý Nước sản xuất (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Nước sản xuất** trên thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/origins` hiển thị danh sách các nước sản xuất. |
| | 3 | Người dùng | Nhấn nút **Thêm nước sản xuất**, nhập Mã nước sản xuất (ví dụ: VN, USA, GER) và Tên nước sản xuất. Nhấn nút **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu đầu vào và lưu bản ghi vào bảng `origin` trong cơ sở dữ liệu. |
| | 5 | Hệ thống | Hiển thị thông báo `"Tạo nước sản xuất thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã nước sản xuất**: Hệ thống báo lỗi `"Mã nước sản xuất đã tồn tại"` và giữ nguyên form. |
| | 4b | Hệ thống | **Xóa nước sản xuất đang liên kết thuốc**: Khi người dùng nhấn xóa một nước sản xuất đang liên kết với thuốc, hệ thống chặn lại và báo lỗi `"Không thể xóa nước sản xuất vì đang có thuốc liên kết"`. |
| **Hậu điều kiện** | Dữ liệu nước sản xuất được lưu trữ, cập nhật hoặc xóa thành công trong DB. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `originCode` | String (2 - 10 ký tự) | Bắt buộc nhập, duy nhất, viết hoa không dấu. |
| `originName` | String (Max 100 ký tự) | Bắt buộc nhập. |

---

### UC12: Quản lý đơn vị tính (Unit CRUD)

| Mã Use case | UC12 | Tên Use case | Quản lý Đơn vị tính (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Đơn vị tính** trên thanh menu điều hướng. |
| | 2 | Hệ thống | Gọi API GET `/api/units` hiển thị danh sách đơn vị tính hiện có. |
| | 3 | Người dùng | Nhấn nút **Thêm đơn vị tính**, nhập Tên đơn vị tính (ví dụ: viên, vỉ, hộp). Nhấn **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu đầu vào và lưu bản ghi vào bảng `unit` trong cơ sở dữ liệu. |
| | 5 | Hệ thống | Hiển thị thông báo `"Tạo đơn vị tính thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng tên đơn vị tính**: Hệ thống báo lỗi `"Tên đơn vị tính đã tồn tại"` và giữ nguyên form. |
| | 4b | Hệ thống | **Xóa đơn vị tính đang liên kết thuốc**: Khi người dùng nhấn xóa đơn vị tính đang làm đơn vị tính cơ bản hoặc đơn vị quy đổi của bất kỳ thuốc nào, hệ thống chặn lại và báo lỗi `"Không thể xóa đơn vị tính vì đang có thuốc liên kết"`. |
| **Hậu điều kiện** | Dữ liệu đơn vị tính được cập nhật thành công trong DB. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `unitName` | String (Max 50 ký tự) | Bắt buộc nhập, duy nhất. |

---

### UC13: Xem danh sách và tìm kiếm thuốc (Search Medicines)

| Mã Use case | UC13 | Tên Use case | Xem danh sách và tìm kiếm thông tin thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin, Product_manager, Sales | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập vào hệ thống. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn module **Quản lý thuốc / Danh sách thuốc** từ menu chính. |
| | 2 | Hệ thống | Gọi API GET `/api/medicines` với các tham số mặc định (phân trang và lọc). |
| | 3 | Hệ thống | Tải dữ liệu thuốc từ bảng `medicine`, kết hợp thông tin danh mục, đơn vị tính và nước sản xuất. |
| | 4 | Hệ thống | Hiển thị danh sách thuốc lên bảng thông tin (gồm Mã thuốc, Tên thuốc, hoạt chất, giá bán lẻ, danh mục, đơn vị cơ bản). |
| | 5 | Người dùng | Nhập từ khóa tìm kiếm (theo tên hoặc hoạt chất) hoặc chọn bộ lọc danh mục/xuất xứ. |
| | 6 | Hệ thống | Gửi lại yêu cầu API kèm theo từ khóa tìm kiếm và bộ lọc đã chọn, hiển thị kết quả tương ứng đã được phân trang. |
| **Hậu điều kiện** | Danh sách thuốc được hiển thị đúng theo tiêu chí tìm kiếm và bộ lọc của người dùng. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `page` | Integer | Chỉ số trang, bắt đầu từ 0. |
| `size` | Integer | Số lượng bản ghi mỗi trang (ví dụ: 10, 20). |
| `search` | String | Từ khóa tìm kiếm thuốc. Có thể để trống. Lọc tương đối (`LIKE`). |
| `catalogId` | Integer / UUID | Lọc thuốc theo danh mục cụ thể. Có thể để trống. |

---

### UC14: Thêm thông tin thuốc mới (Create Medicine)

| Mã Use case | UC14 | Tên Use case | Thêm thông tin thuốc mới |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang Danh sách thuốc, nhấn nút **Thêm thuốc mới**. |
| | 2 | Hệ thống | Hiển thị Form Thêm thuốc mới yêu cầu nhập đầy đủ thông tin thuốc. |
| | 3 | Người dùng | Nhập thông tin: Mã thuốc, Tên thuốc, Hoạt chất, Hàm lượng, Giá bán lẻ, chọn Danh mục, Nước sản xuất và Đơn vị tính cơ bản. Nhấn **Lưu**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lý của dữ liệu (không để trống các trường bắt buộc, Mã thuốc là duy nhất). |
| | 5 | Hệ thống | Lưu bản ghi thuốc mới vào bảng `medicine` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Thêm thông tin thuốc thành công"`, đóng Form và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã thuốc**: Hệ thống báo lỗi `"Mã thuốc đã tồn tại trong hệ thống"`. |
| **Hậu điều kiện** | Bản ghi thuốc mới được lưu thành công vào cơ sở dữ liệu. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `medicineCode` | String (3 - 30 ký tự) | Bắt buộc nhập, viết liền không dấu, duy nhất. |
| `medicineName` | String (Max 150 ký tự) | Bắt buộc nhập. |
| `retailPrice` | Double / Decimal | Bắt buộc nhập, phải lớn hơn 0. |
| `catalogId` | Integer / UUID | Bắt buộc chọn. Phải liên kết hợp lệ đến bảng `catalog`. |
| `unitId` | Integer / UUID | Bắt buộc chọn. Phải liên kết hợp lệ đến bảng `unit` (đơn vị tính cơ bản). |

---

### UC15: Cập nhật thông tin thuốc (Update Medicine)

| Mã Use case | UC15 | Tên Use case | Cập nhật thông tin thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng thông tin thuốc cần sửa, nhấn nút **Chỉnh sửa** (biểu tượng bút chì). |
| | 2 | Hệ thống | Hiển thị Form Chỉnh sửa với thông tin hiện có của thuốc đó (không cho phép sửa Mã thuốc). |
| | 3 | Người dùng | Sửa đổi các thông tin cần thiết (tên thuốc, hoạt chất, giá bán...) và nhấn nút **Cập nhật**. |
| | 4 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu sửa đổi. |
| | 5 | Hệ thống | Cập nhật thông tin mới vào bảng `medicine` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Cập nhật thông tin thuốc thành công"`, đóng Form chỉnh sửa và tải lại danh sách. |
| **Hậu điều kiện** | Dữ liệu thuốc được cập nhật thay đổi thành công vào cơ sở dữ liệu. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `id` | Integer / UUID | Khóa chính của thuốc cần cập nhật, phải tồn tại trong DB. |
| `retailPrice` | Double / Decimal | Phải lớn hơn 0. |

---

### UC16: Xóa thông tin thuốc (Delete Medicine)

| Mã Use case | UC16 | Tên Use case | Xóa thông tin thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại dòng thông tin thuốc cần xóa, nhấn nút **Xóa** (biểu tượng thùng rác). |
| | 2 | Hệ thống | Hiển thị hộp thoại cảnh báo: `"Bạn có chắc chắn muốn xóa thuốc này?"`. |
| | 3 | Người dùng | Nhấn nút **Xác nhận xóa**. |
| | 4 | Hệ thống | Kiểm tra ràng buộc: xem thuốc này đã từng có lô hàng nhập kho hoặc phát sinh hóa đơn bán lẻ nào trong database chưa. |
| | 5 | Hệ thống | Thực hiện xóa bản ghi thuốc khỏi bảng `medicine` trong cơ sở dữ liệu. |
| | 6 | Hệ thống | Hiển thị thông báo `"Xóa thông tin thuốc thành công"` và tải lại danh sách. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Thuốc đã phát sinh dữ liệu kho/giao dịch**: Hệ thống phát hiện thuốc có tồn tại lô hàng trong bảng `inventory` hoặc nằm trong chi tiết hóa đơn/phiếu nhập/xuất. Hệ thống báo lỗi `"Không thể xóa thuốc vì đã phát sinh giao dịch kho"` và hủy tác vụ xóa. |
| **Hậu điều kiện** | Bản ghi thông tin thuốc được xóa thành công khỏi database. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `id` | Integer / UUID | Khóa chính của thuốc cần xóa. |
| Ràng buộc toàn vẹn | DB Constraints | Kiểm tra sự tồn tại liên kết khóa ngoại ở các bảng `inventory`, `goods_receipt_detail`, `goods_issue_detail`, `invoice_detail`. Nếu tồn tại bản ghi liên kết, ném lỗi 400 Bad Request ngăn chặn hành động. |

---

### UC17: Quản lý nhà cung cấp (Supplier CRUD)

| Mã Use case | UC17 | Tên Use case | Quản lý thông tin nhà cung cấp (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin hoặc Product_manager. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Nhà cung cấp** trên thanh menu điều hướng chính. |
| | 2 | Hệ thống | Gọi API GET `/api/suppliers` hiển thị danh sách các nhà cung cấp. |
| | 3 | Người dùng | Nhập thông tin NCC mới: Mã NCC, Tên NCC, Số điện thoại, Địa chỉ và bấm **Lưu**. |
| | 4 | Hệ thống | Hệ thống kiểm tra dữ liệu đầu vào và lưu bản ghi vào bảng `supplier`. |
| | 5 | Hệ thống | Hiển thị thông báo thành công và tải lại danh sách. Người dùng cũng có thể cập nhật hoặc xóa NCC (nếu chưa có giao dịch nhập kho liên quan). |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng mã hoặc SĐT NCC**: Hệ thống báo lỗi `"Mã nhà cung cấp hoặc Số điện thoại đã tồn tại"`. |
| | 4b | Hệ thống | **Xóa nhà cung cấp đã có giao dịch**: Khi người dùng xóa nhà cung cấp đã được liên kết với phiếu nhập kho (`goods_receipt`), hệ thống chặn lại và báo lỗi `"Không thể xóa nhà cung cấp vì đã có phiếu nhập kho liên quan"`. |
| **Hậu điều kiện** | Bản ghi nhà cung cấp được cập nhật hoặc xóa thành công trong DB. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `supplierCode` | String (3 - 20 ký tự) | Bắt buộc nhập, duy nhất, viết liền không dấu. |
| `supplierName` | String (Max 150 ký tự) | Bắt buộc nhập. |
| `phone` | String (10 ký tự) | Định dạng số điện thoại hợp lệ, duy nhất. |

---

### UC18: Quản lý thông tin khách hàng (Customer CRUD)

| Mã Use case | UC18 | Tên Use case | Quản lý thông tin khách hàng (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Sales, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Khách hàng** trên thanh menu điều hướng chính. |
| | 2 | Hệ thống | Gọi API GET `/api/customers` hiển thị danh sách khách hàng thành viên. |
| | 3 | Người dùng | Nhấn nút **Thêm khách hàng**, nhập Họ tên, Số điện thoại, Email. Nhấn **Lưu**. |
| | 4 | Hệ thống | Hệ thống kiểm tra dữ liệu đầu vào và tạo mới khách hàng với điểm tích lũy ban đầu `accumulatedPoints = 0` trong bảng `customer`. |
| | 5 | Hệ thống | Hiển thị thông báo thành công và tải lại danh sách. Người dùng có thể sửa đổi thông tin khách hàng. Admin được quyền xóa khách hàng. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng Số điện thoại**: Hệ thống hiển thị cảnh báo lỗi `"Số điện thoại khách hàng đã tồn tại trong hệ thống"`. |
| **Hậu điều kiện** | Thông tin khách hàng được lưu trữ và cập nhật thành công trong DB. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `phone` | String (10 ký tự) | Bắt buộc nhập, duy nhất, đúng định dạng số điện thoại Việt Nam. |
| `customerName` | String (Max 100 ký tự) | Bắt buộc nhập. |

---

### UC19: Quản lý thông tin nhân viên (Employee CRUD)

| Mã Use case | UC19 | Tên Use case | Quản lý thông tin nhân viên (Thêm/Sửa/Xóa/Xem) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn module **Quản trị / Quản lý nhân viên** trên thanh menu. |
| | 2 | Hệ thống | Gọi API GET `/api/employees` hiển thị toàn bộ danh sách nhân viên. |
| | 3 | Người dùng | Nhấn **Thêm nhân viên**, điền Họ tên, Số điện thoại, Email, Chức vụ và nhấn **Lưu**. |
| | 4 | Hệ thống | Hệ thống kiểm tra định dạng và tính duy nhất của SĐT/Email, lưu vào bảng `employee`. |
| | 5 | Hệ thống | Hiển thị thông báo thành công và tải lại danh sách. Admin có thể thực hiện Sửa đổi thông tin nhân sự. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng số điện thoại hoặc email**: Hệ thống báo lỗi `"Số điện thoại hoặc Email đã tồn tại"`. |
| | 4b | Hệ thống | **Xóa nhân viên có tài khoản liên kết**: Khi Admin nhấn xóa một nhân viên đang được tạo tài khoản đăng nhập (`account`), hệ thống chặn lại và báo lỗi `"Không thể xóa nhân viên vì đang có tài khoản người dùng hoạt động"`. |
| **Hậu điều kiện** | Bản ghi nhân viên được cập nhật hoặc xóa thành công trong DB. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `phone` | String (10 ký tự) | Bắt buộc nhập, duy nhất, định dạng SĐT hợp lệ. |
| `email` | String (Max 100 ký tự) | Bắt buộc nhập, duy nhất, đúng định dạng email. |

---

### UC20: Quản lý tài khoản người dùng (Account CRUD)

| Mã Use case | UC20 | Tên Use case | Quản lý tài khoản người dùng (Thêm/Khóa/Xem/Đổi Quyền) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn module **Quản trị / Quản lý tài khoản** trên thanh menu. |
| | 2 | Hệ thống | Gọi API GET `/api/accounts` hiển thị danh sách tài khoản kèm tên nhân viên liên kết. |
| | 3 | Người dùng | Nhấn **Tạo tài khoản**, nhập Tên đăng nhập (username), chọn Nhân viên chưa có tài khoản, chọn Vai trò (role) và bấm **Lưu**. |
| | 4 | Hệ thống | Kiểm tra username duy nhất, nhân viên chưa có tài khoản. Sinh mật khẩu tạm ngẫu nhiên 10 ký tự, mã hóa BCrypt và lưu vào bảng `account` với `isFirstLogin = true`. |
| | 5 | Hệ thống | Gọi dịch vụ gửi email mật khẩu tạm thời cho nhân viên. |
| | 6 | Hệ thống | Hiển thị thông báo thành công và hiển thị mật khẩu tạm thời chưa mã hóa trên màn hình cho Admin. Tải lại danh sách tài khoản. Admin cũng có thể Khóa tài khoản (`isActive = false`) hoặc Thay đổi vai trò tài khoản. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Trùng username**: Hệ thống báo lỗi `"Tên đăng nhập đã tồn tại trong hệ thống"`. |
| **Hậu điều kiện** | Bản ghi tài khoản mới được tạo thành công, tài khoản bị khóa hoặc vai trò được cập nhật trong DB. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `username` | String (5 - 50 ký tự) | Bắt buộc nhập, duy nhất, viết liền không dấu. |
| `employeeId` | Integer / UUID | Bắt buộc chọn. Nhân viên được chọn phải chưa liên kết với tài khoản nào khác trong DB. |

---

### UC21: Đặt lại mật khẩu nhân viên (Admin Reset Password)

| Mã Use case | UC21 | Tên Use case | Admin đặt lại mật khẩu cho tài khoản nhân viên |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống với vai trò Admin. Tài khoản nhân viên cần reset mật khẩu tồn tại trên hệ thống. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang Quản lý tài khoản, bấm nút **Reset Password** tại dòng tài khoản tương ứng. |
| | 2 | Hệ thống | Hiển thị hộp thoại nhập mật khẩu mới. |
| | 3 | Người dùng | Nhập Mật khẩu mới và bấm **Xác nhận**. |
| | 4 | Hệ thống | Backend thực hiện mã hóa mật khẩu mới bằng BCrypt và cập nhật trực tiếp vào bảng `account`. Đặt trạng thái đăng nhập lần đầu `isFirstLogin = true` để bắt buộc nhân viên đổi mật khẩu ở phiên kế tiếp. |
| | 5 | Hệ thống | Hiển thị thông báo `"Đặt lại mật khẩu thành công"`. |
| **Hậu điều kiện** | Mật khẩu tài khoản nhân viên được cập nhật thành mật khẩu mới do Admin đặt. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `newPassword` | String (8 - 100 ký tự) | Mật khẩu mới do Admin thiết lập. Phải có độ dài tối thiểu 8 ký tự. |

---

### UC22: Lập phiếu nhập kho nháp (Create Goods Receipt Draft)

| Mã Use case | UC22 | Tên Use case | Lập phiếu nhập kho ở trạng thái Nháp (DRAFT) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. Các danh mục thuốc, nhà cung cấp liên quan đã tồn tại trong DB. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấn chọn chức năng **Nhập kho / Tạo phiếu nhập mới** trên menu. |
| | 2 | Hệ thống | Hiển thị Form lập phiếu nhập kho. |
| | 3 | Người dùng | Chọn Nhà cung cấp, nhập Ghi chú. |
| | 4 | Người dùng | Tìm kiếm và chọn thuốc cần nhập. Nhập thông tin chi tiết: Số lô, Hạn sử dụng, Số lượng nhập, Đơn vị tính nhập (hộp/vỉ/viên) và Giá nhập của thuốc đó. Nhấn **Thêm vào danh sách**. |
| | 5 | Hệ thống | Tính toán số lượng quy đổi và hiển thị chi tiết dòng thuốc nhập lên bảng kê. |
| | 6 | Người dùng | Nhấn nút **Lưu nháp**. |
| | 7 | Hệ thống | Lưu phiếu nhập vào DB với trạng thái `DRAFT` và mã phiếu tự sinh dạng `GRN-[8 ký tự ngẫu nhiên]`. Hiển thị thông báo `"Lưu nháp phiếu nhập kho thành công"`. |
| **Hậu điều kiện** | Phiếu nhập kho được lưu thành công ở trạng thái DRAFT. Số lượng tồn kho thực tế của các lô thuốc chưa bị thay đổi. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `supplierId` | Integer / UUID | Khóa ngoại trỏ đến nhà cung cấp. Bắt buộc chọn. |
| `details` | Array | Danh sách chi tiết các thuốc nhập. Không được để trống. |
| `batchCode` | String (3 - 30 ký tự) | Bắt buộc nhập cho từng lô hàng thuốc. |
| `expireDate` | Date | Hạn sử dụng của lô. Định dạng YYYY-MM-DD. Phải lớn hơn ngày hiện tại ít nhất 1 tháng. |
| `quantity` | Double / Decimal | Số lượng nhập. Phải lớn hơn 0. |
| `importPrice` | Double / Decimal | Giá nhập thuốc của lô. Phải lớn hơn 0. |

---

### UC23: Xác nhận phiếu nhập kho (Confirm Goods Receipt)

| Mã Use case | UC23 | Tên Use case | Xác nhận phiếu nhập kho |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Phiếu nhập kho đang tồn tại ở trạng thái nháp `DRAFT`. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn phiếu nhập kho nháp cần phê duyệt trong danh sách phiếu kho. |
| | 2 | Hệ thống | Hiển thị giao diện chi tiết phiếu nhập kho nháp. |
| | 3 | Người dùng | Kiểm tra lại thông tin chi tiết và nhấn nút **Xác nhận nhập kho**. |
| | 4 | Hệ thống | Gọi API PATCH `/api/goods-receipts/{id}/confirm`. |
| | 5 | Hệ thống | Kiểm tra trạng thái phiếu phải là `DRAFT`. |
| | 6 | Hệ thống | Duyệt qua từng chi tiết thuốc nhập, tính toán số lượng thực nhập sau khi nhân tỷ lệ quy đổi của đơn vị nhập. |
| | 7 | Hệ thống | Tìm kiếm lô thuốc trong bảng `inventory` theo Mã thuốc, Số lô và Hạn sử dụng. Nếu chưa tồn tại, tạo mới lô thuốc với số lượng tồn ban đầu bằng số thực nhập. Nếu đã tồn tại, cộng dồn số thực nhập vào số lượng tồn kho hiện có. Cập nhật lại giá nhập mới nhất. |
| | 8 | Hệ thống | Ghi nhận biến động kho vào bảng `inventory_transaction` với loại giao dịch `IMPORT` (ghi nhận lượng tăng dương). |
| | 9 | Hệ thống | Chuyển trạng thái phiếu nhập kho thành `CONFIRMED` và ghi nhận thời gian nhập kho thực tế. |
| | 10 | Hệ thống | Hiển thị thông báo `"Xác nhận nhập kho và cập nhật tồn kho thành công"`. Tự động gọi popup HTML và kích hoạt lệnh in phiếu nhập kho. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 5a | Hệ thống | **Phiếu không ở trạng thái DRAFT**: Hệ thống báo lỗi `"Chỉ có thể xác nhận phiếu nhập ở trạng thái NHÁP (DRAFT). Trạng thái hiện tại: [Trạng thái]"` và chặn hành động. |
| **Hậu điều kiện** | Phiếu nhập chuyển sang CONFIRMED, số lượng tồn kho thực tế của các lô thuốc được tăng lên, lịch sử thẻ kho được ghi nhận. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `receiptId` | Integer / UUID | Bắt buộc nhập. ID của phiếu nhập kho cần xác nhận. Trạng thái trong DB phải là `DRAFT`. Xử lý dưới `@Transactional` đảm bảo tính toàn vẹn và rollback khi có lỗi xảy ra. |
| `stock_quantity` | Double / Decimal | Số lượng tồn kho thực tế được cộng dồn sau khi nhân với tỷ lệ quy đổi của đơn vị tương ứng. |

---

### UC24: Hủy phiếu nhập kho nháp (Cancel Goods Receipt)

| Mã Use case | UC24 | Tên Use case | Hủy phiếu nhập kho nháp |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Phiếu nhập kho đang tồn tại ở trạng thái nháp `DRAFT`. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang chi tiết phiếu nhập kho nháp, nhấn nút **Hủy phiếu**. |
| | 2 | Hệ thống | Hiển thị hộp thoại cảnh báo: `"Bạn có chắc chắn muốn hủy phiếu nhập kho này?"`. |
| | 3 | Người dùng | Nhấn nút **Xác nhận hủy**. |
| | 4 | Hệ thống | Kiểm tra trạng thái phiếu phải là `DRAFT`. |
| | 5 | Hệ thống | Cập nhật trạng thái phiếu nhập kho thành `CANCELLED` trong cơ sở dữ liệu. Giữ nguyên số lượng tồn kho. |
| | 6 | Hệ thống | Hiển thị thông báo `"Hủy phiếu nhập kho thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 4a | Hệ thống | **Phiếu đã xác nhận/đã hủy trước đó**: Hệ thống báo lỗi `"Chỉ có thể hủy phiếu nhập ở trạng thái NHÁP (DRAFT)"` và hủy tác vụ. |
| **Hậu điều kiện** | Phiếu nhập kho chuyển sang trạng thái CANCELLED, dữ liệu kho không bị ảnh hưởng. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `receiptId` | Integer / UUID | Bắt buộc nhập, ID của phiếu nhập kho cần hủy. Trạng thái trong DB phải là `DRAFT`. |

---

### UC25: Lập phiếu xuất kho nháp (Create Goods Issue Draft)

| Mã Use case | UC25 | Tên Use case | Lập phiếu xuất kho ở trạng thái Nháp (DRAFT) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. Các lô thuốc cần xuất đang có trong kho. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Nhấn vào chức năng **Tạo phiếu xuất mới** trong module Xuất kho. |
| | 2 | Hệ thống | Hiển thị Form lập phiếu xuất kho. |
| | 3 | Người dùng | Chọn Lý do xuất (hết hạn, hỏng hóc, trả hàng...), điền Ghi chú. |
| | 4 | Người dùng | Tìm kiếm và chọn các lô thuốc cần xuất, nhập Số lượng xuất và Đơn vị xuất. Nhấn **Thêm**. |
| | 5 | Hệ thống | Quy đổi số lượng xuất về đơn vị tính cơ bản và hiển thị chi tiết lên bảng kê. |
| | 6 | Người dùng | Nhấn nút **Lưu nháp**. |
| | 7 | Hệ thống | Lưu phiếu xuất vào cơ sở dữ liệu với trạng thái `DRAFT`. Tự động sinh mã phiếu dạng `GIN-[8 ký tự ngẫu nhiên]`. Hiển thị thông báo `"Tạo nháp phiếu xuất kho thành công"`. |
| **Hậu điều kiện** | Phiếu xuất kho được lưu ở trạng thái DRAFT. Số lượng tồn kho thực tế chưa bị trừ. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `reason` | Enum / String | Lý do xuất. Bắt buộc nhập (ví dụ: `EXPIRED`, `DAMAGED`, `RETURN`). |
| `details` | Array | Danh sách chi tiết các lô thuốc xuất. Không được để trống. |
| `inventoryId` | Integer / UUID | Bắt buộc nhập. ID của lô thuốc được chọn xuất kho. |
| `quantity` | Double / Decimal | Số lượng xuất. Phải lớn hơn 0 và nhỏ hơn hoặc bằng tồn kho thực tế của lô đó trong DB. |

---

### UC26: Xác nhận phiếu xuất kho (Confirm Goods Issue)

| Mã Use case | UC26 | Tên Use case | Xác nhận xuất kho thuốc |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Phiếu xuất kho đang ở trạng thái nháp `DRAFT`. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Mở chi tiết phiếu xuất kho nháp và nhấn nút **Xác nhận xuất kho**. |
| | 2 | Hệ thống | Kiểm tra trạng thái hiện tại của phiếu xuất phải là `DRAFT`. |
| | 3 | Hệ thống | Duyệt qua từng dòng thuốc xuất, tính toán số lượng xuất quy đổi và kiểm tra số lượng tồn kho thực tế của lô trong bảng `inventory`. |
| | 4 | Hệ thống | Trừ số lượng tồn kho thực tế của các lô thuốc tương ứng trong bảng `inventory`. Cập nhật trạng thái lô thành `SOLD_OUT` hoặc `DISPOSED` nếu tồn kho về 0. |
| | 5 | Hệ thống | Ghi nhận nhật ký biến động kho vào bảng `inventory_transaction` với loại giao dịch `EXPORT` (ghi lượng xuất âm). |
| | 6 | Hệ thống | Chuyển trạng thái phiếu xuất thành `CONFIRMED` và lưu thời gian xuất thực tế. |
| | 7 | Hệ thống | Hiển thị thông báo `"Xác nhận xuất kho và cập nhật tồn kho thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 3a | Hệ thống | **Không đủ tồn kho để xuất**: Hệ thống phát hiện số lượng tồn kho thực tế của một lô nhỏ hơn số lượng yêu cầu xuất. Báo lỗi `"Không đủ tồn kho để xuất! Thuốc: [Tên], Lô: [Mã lô]..."`, thực hiện hủy bỏ toàn bộ giao dịch trừ kho (rollback) và giữ nguyên trạng thái DRAFT của phiếu xuất. |
| **Hậu điều kiện** | Phiếu xuất chuyển sang CONFIRMED, số lượng tồn kho thực tế bị trừ đi, lịch sử thẻ kho được ghi nhận. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `issueId` | Integer / UUID | Bắt buộc nhập. ID của phiếu xuất kho cần xác nhận. Trạng thái phiếu trong DB phải là `DRAFT`. |
| `inventoryId` | Integer / UUID | Khóa ngoại xác định lô thuốc được xuất kho. Hệ thống thực hiện `SELECT FOR UPDATE` trên các lô này để đảm bảo trừ kho chính xác, chống bán quá mức (over-selling). |

---

### UC27: Hủy phiếu xuất kho nháp (Cancel Goods Issue)

| Mã Use case | UC27 | Tên Use case | Hủy phiếu xuất kho nháp |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Phiếu xuất kho đang ở trạng thái nháp `DRAFT`. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang chi tiết phiếu xuất nháp, nhấn nút **Hủy phiếu**. |
| | 2 | Hệ thống | Hiển thị hộp thoại xác nhận hủy phiếu xuất kho. |
| | 3 | Người dùng | Nhấn nút **Xác nhận hủy**. |
| | 4 | Hệ thống | Kiểm tra trạng thái phiếu phải là `DRAFT`. |
| | 5 | Hệ thống | Chuyển trạng thái phiếu xuất thành `CANCELLED` trong cơ sở dữ liệu. Giữ nguyên số tồn kho. |
| | 6 | Hệ thống | Hiển thị thông báo `"Hủy phiếu xuất kho thành công"`. |
| **Hậu điều kiện** | Phiếu xuất kho được hủy bỏ thành công, trạng thái chuyển thành CANCELLED. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `issueId` | Integer / UUID | Bắt buộc nhập, ID của phiếu xuất kho cần hủy. Trạng thái trong DB phải là `DRAFT`. |

---

### UC28: Lập phiếu kiểm kê kho nháp (Create Stock Audit Draft)

| Mã Use case | UC28 | Tên Use case | Lập phiếu kiểm kê kho ở trạng thái Nháp (DRAFT) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Kiểm kê kho** và nhấn nút **Tạo phiếu kiểm kê mới**. |
| | 2 | Hệ thống | Tải toàn bộ danh sách các lô thuốc đang có tồn kho khác không từ bảng `inventory`. |
| | 3 | Hệ thống | Tạo phiếu kiểm kê ở trạng thái `DRAFT` với mã tự sinh `AUD-[8 ký tự ngẫu nhiên]`. |
| | 4 | Hệ thống | Sao chụp số lượng tồn kho sổ sách của tất cả các lô thuốc này vào cột `systemQuantity` và mặc định `actualQuantity` bằng `systemQuantity`. |
| | 5 | Hệ thống | Hiển thị thông báo tạo nháp thành công và hiển thị giao diện chi tiết phiếu kiểm kê. |
| **Hậu điều kiện** | Phiếu kiểm kê nháp được tạo thành công, ghi nhận dữ liệu sổ sách hệ thống tại thời điểm lập phiếu. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `auditCode` | String (12 ký tự) | Tự động sinh dạng `AUD-[8 ký tự ngẫu nhiên]`, duy nhất. |
| `systemQuantity` | Double / Decimal | Số lượng tồn kho sổ sách tại thời điểm lập phiếu nháp, sao chép trực tiếp từ bảng `inventory`. |

---

### UC29: Nhập số đếm thực tế kiểm kho (Save Audit Quantities)

| Mã Use case | UC29 | Tên Use case | Nhập số lượng đếm thực tế kiểm kho và lưu nháp |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Phiếu kiểm kê đang ở trạng thái `DRAFT` hoặc `IN_PROGRESS`. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại trang chi tiết phiếu kiểm kê, nhấn **Bắt đầu thực hiện kiểm kho**. |
| | 2 | Hệ thống | Chuyển trạng thái phiếu từ `DRAFT` sang `IN_PROGRESS` (nếu đang là DRAFT). |
| | 3 | Người dùng | Kiểm đếm kho thực tế và điền số lượng đếm được vào ô **Số lượng thực tế** của từng lô thuốc tương ứng. Nhập thêm ghi chú giải trình (nếu cần). |
| | 4 | Hệ thống | Tự động tính chênh lệch `actualQuantity - systemQuantity` hiển thị trực quan lên giao diện. |
| | 5 | Người dùng | Nhấn nút **Lưu tạm**. |
| | 6 | Hệ thống | Lưu lại số lượng thực tế đếm tạm thời và các ghi chú vào bảng `stock_audit_detail`. Hiển thị thông báo `"Lưu số thực tế đếm tạm thời thành công"`. |
| **Hậu điều kiện** | Số lượng thực tế kiểm đếm được ghi nhận tạm thời vào phiếu kiểm kê. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `auditId` | Integer / UUID | ID của phiếu kiểm kê kho đang đếm. |
| `actualQuantity` | Double / Decimal | Số lượng thực tế kiểm đếm được, phải lớn hơn hoặc bằng 0. |

---

### UC30: Xác nhận đối soát hoàn thành kiểm kê (Confirm Stock Audit)

| Mã Use case | UC30 | Tên Use case | Xác nhận đối soát hoàn thành kiểm kê và điều chỉnh kho |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Phiếu kiểm kê đang ở trạng thái `IN_PROGRESS` hoặc `DRAFT`. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Tại giao diện phiếu kiểm kê, nhấn nút **Xác nhận đối soát hoàn thành kiểm kê**. |
| | 2 | Hệ thống | Kiểm tra xem người dùng đã nhập đầy đủ số lượng thực tế cho tất cả các lô thuốc chưa. |
| | 3 | Hệ thống | Cập nhật số lượng tồn kho của tất cả các lô thuốc trong bảng `inventory` về khớp với số thực tế đếm được (`actualQuantity`). |
| | 4 | Hệ thống | Với các lô có chênh lệch (`discrepancy != 0`), hệ thống tạo một bản ghi điều chỉnh kiểm kho trong bảng `inventory_transaction` với loại giao dịch `AUDIT_ADJUST` và ghi nhận lượng chênh lệch (âm hoặc dương). |
| | 5 | Hệ thống | Cập nhật trạng thái phiếu kiểm kê thành `CONFIRMED`, ghi nhận thông tin nhân viên phê duyệt. |
| | 6 | Hệ thống | Hiển thị thông báo `"Xác nhận đối soát hoàn thành kiểm kê và cập nhật tồn kho thành công"`. |
| **Luồng sự kiện thay thế** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 2a | Hệ thống | **Chưa nhập đủ số lượng thực tế**: Hệ thống phát hiện có dòng chi tiết chưa có số đếm. Báo lỗi `"Vui lòng nhập đầy đủ Số lượng thực tế cho tất cả các lô thuốc trước khi hoàn thành đối soát!"` và chặn xác nhận. |
| **Hậu điều kiện** | Tồn kho hệ thống được đồng bộ khớp với thực tế kiểm đếm, ghi nhận lịch sử điều chỉnh kiểm kê, phiếu kiểm kê chuyển thành CONFIRMED. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `auditId` | Integer / UUID | ID của phiếu kiểm kê kho. |
| `discrepancy` | Double / Decimal | Chênh lệch `actualQuantity - systemQuantity`, dùng để ghi vào thẻ kho điều chỉnh `AUDIT_ADJUST`. |

---

### UC31: Lập hóa đơn bán lẻ thuốc tại quầy - POS (Create Invoice)

| Mã Use case | UC31 | Tên Use case | Lập hóa đơn bán lẻ thuốc tại quầy (POS) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Sales, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập vào hệ thống. Các lô thuốc trong kho còn số lượng tồn kho và còn hạn sử dụng. | | |
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
| **Hậu điều kiện** | Hóa đơn bán lẻ được tạo thành công với trạng thái Paid. Tồn kho của các lô thuốc bán ra bị trừ đi. Nhật ký biến động kho được ghi nhận. Hóa đơn nhiệt được in. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `customerId` | Integer / UUID | Khóa ngoại liên kết khách hàng mua. Có thể null (nếu khách lẻ không thành viên). |
| `pointsUsed` | Integer | Số điểm tích lũy thành viên mà khách hàng muốn dùng trừ tiền. Phải nhỏ hơn hoặc bằng số điểm hiện có của khách hàng (`Customer.accumulatedPoints`). |
| `receivedCash` | Double / Decimal | Số tiền khách đưa. Bắt buộc lớn hơn hoặc bằng tổng tiền hóa đơn sau chiết khấu. |
| `inventoryId` | Integer / UUID | Khóa ngoại xác định lô thuốc được chọn bán lẻ. Hệ thống thực hiện `SELECT FOR UPDATE` trên các lô này để đảm bảo trừ kho chính xác, chống bán quá mức (over-selling). |
| `quantity` | Double / Decimal | Số lượng bán ra của thuốc. Phải lớn hơn 0. |

---

### UC32: Xem lịch sử thẻ kho của thuốc (View Stock Card)

| Mã Use case | UC32 | Tên Use case | Xem lịch sử thẻ kho của thuốc (Inventory Transactions) |
| :--- | :--- | :--- | :--- |
| **Tác nhân** | Product_manager, Admin | | |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống. | | |
| **Luồng sự kiện chính (Thành công)** | **STT** | **Thực hiện bởi** | **Hành động** |
| | 1 | Người dùng | Chọn mục **Thẻ kho / Lịch sử thẻ kho** trong module Quản lý kho. |
| | 2 | Hệ thống | Hiển thị giao diện chọn thuốc và bảng dữ liệu lịch sử thẻ kho. |
| | 3 | Người dùng | Tìm kiếm và chọn một thuốc cụ thể từ danh sách chọn nhanh. |
| | 4 | Hệ thống | Gọi API GET `/api/inventory/transactions` truyền tham số `medicineId` vừa chọn. |
| | 5 | Hệ thống | Lấy toàn bộ danh sách giao dịch biến động liên quan đến các lô của thuốc đó từ bảng `inventory_transaction` sắp xếp theo thời gian tăng dần. |
| | 6 | Hệ thống | Hiển thị chi tiết biến động dạng thẻ kho bao gồm: Thời gian giao dịch, Mã chứng từ tham chiếu (Mã phiếu nhập, phiếu xuất, hóa đơn...), Loại biến động (Nhập kho/Xuất kho/Bán lẻ/Đối soát kiểm kê), Số lượng thay đổi (+/-) và Số dư cuối kỳ sau giao dịch. |
| **Hậu điều kiện** | Lịch sử thẻ kho của thuốc được hiển thị chính xác và chi tiết, giúp theo dõi đường đi của thuốc. | | |

**Bảng ràng buộc dữ liệu:**
| Trường dữ liệu | Kiểu dữ liệu & Độ dài | Ràng buộc & Quy tắc kiểm tra |
| :--- | :--- | :--- |
| `medicineId` | Integer / UUID | Bắt buộc nhập. Phải trỏ đến bản ghi thuốc hợp lệ trong DB. |
| `startDate` | Date | Lọc mốc thời gian bắt đầu. Định dạng: YYYY-MM-DD. Có thể để trống. |
| `endDate` | Date | Lọc mốc thời gian kết thúc. Định dạng: YYYY-MM-DD. Có thể để trống. |
