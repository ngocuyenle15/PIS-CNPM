# 3. LẬP TRÌNH VÀ TRIỂN KHAI

Tài liệu này trình bày chi tiết về quá trình chọn lựa công nghệ, cơ sở dữ liệu, quản lý mã nguồn và cách thức hiện thực hóa mã nguồn (coding) cho các chức năng trong hệ thống **PIS (Pharmacy Inventory Management System)** dựa trên mã nguồn thực tế của dự án.

---

## 3.1. CHỌN NGÔN NGỮ LẬP TRÌNH PHÙ HỢP

Hệ thống được thiết kế theo kiến trúc tách biệt hoàn toàn giữa Frontend (giao diện người dùng) và Backend (xử lý logic nghiệp vụ và dữ liệu) thông qua các giao thức API RESTful. Do đó, các ngôn ngữ và công nghệ lập trình được chọn lựa như sau:

### 3.1.1. Backend: Java (Spring Boot)
* **Lý do lựa chọn**:
  * **Java 17**: Là phiên bản LTS (Long Term Support) có độ ổn định cao, tối ưu hóa hiệu năng biên dịch và giới thiệu nhiều cải tiến ngữ pháp hiện đại (như Record, Pattern Matching) giúp mã nguồn sạch và an toàn hơn.
  * **Spring Boot 3.5.14**: Hỗ trợ cơ chế Dependency Injection (DI) và Inversion of Control (IoC) mạnh mẽ, giúp dễ dàng module hóa các thành phần nghiệp vụ và thuận tiện cho việc viết unit test. Spring Boot cung cấp sẵn các starter giúp đẩy nhanh tốc độ cấu hình và tích hợp hệ thống.
* **Các thư viện cốt lõi sử dụng trong mã nguồn**:
  * `spring-boot-starter-web`: Định nghĩa các API RESTful endpoint, quản lý vòng đời yêu cầu HTTP.
  * `spring-boot-starter-data-jpa`: Tương tác với cơ sở dữ liệu thông qua Hibernate ORM, giúp loại bỏ việc viết các câu lệnh SQL thuần lặp đi lặp lại và dễ dàng quản lý thực thể (Entities).
  * `spring-boot-starter-security`: Cung cấp bộ lọc bảo mật, ngăn chặn truy cập trái phép và phân quyền truy cập API dựa trên vai trò.
  * `jjwt-api / jjwt-impl / jjwt-jackson (v0.11.5)`: Hỗ trợ sinh, giải mã và xác thực tính toàn vẹn của mã token JWT.
  * `spring-boot-starter-mail`: Cung cấp dịch vụ gửi email SMTP (Gmail) để gửi mật khẩu tạm thời khi tạo tài khoản hoặc quên mật khẩu.
  * `lombok`: Sử dụng các annotation như `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder` để tự động sinh mã boilerplate, giúp code ngắn gọn và dễ bảo trì.

### 3.1.2. Frontend: Javascript (ReactJS + Vite)
* **Lý do lựa chọn**:
  * **ReactJS 19.2.6**: Framework xây dựng giao diện người dùng dựa trên thành phần (component-based), giúp tái sử dụng mã nguồn tốt, quản lý trạng thái (state) linh hoạt và cập nhật giao diện cực nhanh nhờ cơ chế Virtual DOM.
  * **Vite 8.0.12**: Công cụ build frontend thế hệ mới, thay thế cho Webpack truyền thống. Vite khởi động máy chủ dev siêu nhanh nhờ cơ chế Hot Module Replacement (HMR) dựa trên Native ESM, giúp rút ngắn thời gian phát triển và tối ưu dung lượng đóng gói khi build.
* **Các thư viện cốt lõi sử dụng trong frontend**:
  * `react-router-dom (v7.16.0)`: Quản lý điều hướng trang client-side định tuyến (Client-side Routing) mà không cần reload lại trang web.
  * `axios (v1.16.1)`: Thư viện HTTP client dùng để gửi các yêu cầu API (GET, POST, PATCH, PUT, DELETE) từ React đến backend Spring Boot, hỗ trợ đính kèm JWT token vào request interceptor.
  * `recharts (v3.8.1)`: Thư viện vẽ biểu đồ tương tác, dùng để trực quan hóa dữ liệu nhập xuất, thống kê doanh thu và phân bố danh mục thuốc trên Dashboard.

---

## 3.2. CHỌN CƠ SỞ DỮ LIỆU PHÙ HỢP

### 3.2.1. Cơ sở dữ liệu chính: MySQL 8.0
Nghiệp vụ quản lý kho dược phẩm yêu cầu tính nhất quán dữ liệu ở mức tối đa (dữ liệu nhập xuất, trừ tồn kho, tính doanh thu phải chính xác tuyệt đối). Do đó, một cơ sở dữ liệu quan hệ (RDBMS) hỗ trợ chuẩn giao dịch ACID là bắt buộc.
* **Lý do lựa chọn MySQL 8.0**:
  * Là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở phổ biến nhất, có hiệu năng đọc ghi cao, chi phí vận hành thấp và cộng đồng hỗ trợ lớn.
  * Hỗ trợ cơ chế khóa (locking) ở mức dòng (row-level locking), giúp đảm bảo an toàn dữ liệu khi có nhiều quầy POS cùng bán lẻ và trừ kho trên một lô thuốc tại cùng một thời điểm.
  * Tích hợp mượt mà với Hibernate ORM thông qua dialect `org.hibernate.dialect.MySQLDialect`.

### 3.2.2. Cơ chế kết nối và cấu hình Database (JPA/Hibernate)
* **Connection Pooling**: Hệ thống sử dụng thư viện **HikariCP** (mặc định của Spring Boot) để quản lý hồ chứa kết nối (Connection Pool). Cấu hình chi tiết trong [application.yaml](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/resources/application.yaml):
  * `maximum-pool-size: 10` (giới hạn tối đa 10 kết nối hoạt động đồng thời).
  * `connection-timeout: 30000` (thời gian chờ kết nối tối đa là 30 giây).
  * `idle-timeout: 600000` (giải phóng kết nối nhàn rỗi sau 10 phút).
* **Đồng bộ hóa Schema**: Trong môi trường phát triển, hệ thống cấu hình `ddl-auto: create-drop` kết hợp lớp `DataInitializer.java` để tự động xóa, tạo mới cấu trúc bảng từ các Class Entity và nạp dữ liệu mẫu ban đầu mỗi khi ứng dụng khởi chạy.
* **Lược đồ quan hệ (Schema)**: Gồm 22 thực thể liên kết chặt chẽ với nhau như: [Account.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/Account.java), [Employee.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/Employee.java), [Customer.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/Customer.java), [Supplier.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/Supplier.java), [Medicine.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/Medicine.java), [Inventory.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/Inventory.java), [GoodsReceipt.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/GoodsReceipt.java), [GoodsIssue.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/GoodsIssue.java), [StockAudit.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/StockAudit.java), [Invoice.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/Invoice.java), và [InventoryTransaction.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/InventoryTransaction.java).

---

## 3.3. QUẢN LÝ MÃ NGUỒN BẰNG GIT

Dự án áp dụng mô hình phân nhánh mã nguồn chuẩn bằng **Git** để phục vụ việc làm việc nhóm và theo dõi lịch sử thay đổi:
* **Các nhánh chính (Branches)**:
  * `main`: Lưu trữ phiên bản mã nguồn ổn định nhất, sẵn sàng đóng gói và chạy thực tế (Production).
  * `dev`: Nhánh tích hợp các tính năng mới sau khi đã được kiểm thử độc lập, dùng cho môi trường thử nghiệm (Staging).
  * `refactor/backend`: Nhánh chuyên biệt dùng để tái cấu trúc mã nguồn backend (xử lý logic nghiệp vụ và bảo mật).
  * Các nhánh tính năng (Feature branches) như `agents/codebase-overview-analysis` được tách ra từ `dev` để phát triển các tính năng độc lập, sau đó tạo Pull Request (PR) để Code Review trước khi gộp trở lại.
* **Quy chuẩn thông điệp commit (Git Commit Conventions)**:
  * Sử dụng các tiền tố chuẩn hóa để phân loại thay đổi:
    * `feat:` thêm một chức năng mới (ví dụ: `feat: implement invoice print flow`).
    * `fix:` sửa một lỗi lập trình (ví dụ: `fix: handle stock discrepancy math in audit`).
    * `refactor:` cấu trúc lại mã nguồn mà không thay đổi tính năng (ví dụ: `refactor: clean security configuration`).
    * `docs:` bổ sung/sửa đổi tài liệu hướng dẫn.

---

## 3.4. THỰC HIỆN CODING THEO CHỨC NĂNG

Dưới đây là mô tả chi tiết cách hiện thực hóa mã nguồn (coding) cho các chức năng nghiệp vụ then chốt dựa trên mã nguồn thực tế của dự án:

### 3.4.1. Chức năng Xác thực & Phân quyền (Authentication & Authorization)
* **Bảo mật Endpoint**: Cấu hình tại lớp [SecurityConfig.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/config/SecurityConfig.java). Cài đặt phân quyền chi tiết dựa trên vai trò (Role-based Access Control):
  ```java
  .requestMatchers("/api/employees/**", "/api/accounts/**").hasRole("Admin")
  .requestMatchers(HttpMethod.POST, "/api/medicines/**", "/api/goods-receipts/**").hasAnyRole("Admin", "Product_manager")
  .requestMatchers(HttpMethod.POST, "/api/invoices/**").hasAnyRole("Admin", "Sales")
  ```
* **JWT Filter**: Lớp [JwtAuthenticationFilter.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/config/JwtAuthenticationFilter.java) đánh chặn mọi yêu cầu HTTP để kiểm tra header `Authorization: Bearer <token>`, giải mã JWT bằng `JwtTokenProvider` và thiết lập quyền truy cập cho Thread xử lý hiện tại thông qua `SecurityContextHolder`.
* **Logic nghiệp vụ xác thực**: Triển khai trong lớp [AuthService.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/service/AuthService.java):
  * **Đăng nhập**: Kiểm tra tài khoản tồn tại, trạng thái hoạt động (`isActive`), đối chiếu mật khẩu băm bằng `passwordEncoder.matches()`. Nếu là lần đăng nhập đầu tiên (`isFirstLogin == true`), hệ thống ném ngoại lệ yêu cầu đổi mật khẩu. Nếu hợp lệ, trả về cặp Access Token và Refresh Token.
  * **Đăng xuất**: Lấy Access Token từ header, lưu ID token vào bảng `invalidated_token` để vô hiệu hóa token đó (Blacklist) đồng thời xóa Refresh Token trong DB.
  * **Quên mật khẩu**: Xác thực Username và Email của nhân viên. Sinh mật khẩu ngẫu nhiên 8 ký tự bằng `SecureRandom`, mã hóa lưu vào DB, đặt `isFirstLogin = true` và gọi `mailService.sendMail()` gửi thông tin mật khẩu tạm cho nhân viên.

### 3.4.2. Chức năng Quản lý Phiếu Nhập Kho (Goods Receipt)
* **Định nghĩa API**: Xử lý tại [GoodsReceiptController.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/controller/GoodsReceiptController.java).
* **Quy trình xử lý nghiệp vụ**: Triển khai trong [GoodsReceiptService.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/service/GoodsReceiptService.java):
  * **Lập phiếu nháp (`createReceiptDraft`)**: Lưu các thông tin chung và chi tiết mặt hàng nhập vào bảng `goods_receipt` và `goods_receipt_detail` với trạng thái ban đầu là `DRAFT`. Tại bước này, hệ thống tự động kiểm tra sự tồn tại của đơn vị tính giao dịch, truy xuất `conversionRate` tương ứng của thuốc để tính toán lượng quy đổi, nhưng **chưa cập nhật tồn kho thực tế**.
  * **Xác nhận nhập kho (`confirmReceipt`)**: Được bọc trong annotation `@Transactional`.
    1. Hệ thống kiểm tra trạng thái phiếu phải là `DRAFT`.
    2. Duyệt qua từng chi tiết thuốc nhập, tính số lượng quy đổi sang đơn vị cơ bản: `baseQuantity = Quantity * conversionRate`.
    3. Tìm lô tồn kho trong bảng `inventory` theo mã khóa `medicineID-batchId`. Nếu chưa tồn tại, tạo mới bản ghi lô với trạng thái `ACTIVE`, HSD và giá nhập. Nếu đã tồn tại, cộng dồn số lượng tồn kho `stockQuantity = stockQuantity + baseQuantity` và cập nhật giá nhập mới nhất.
    4. Ghi nhận nhật ký thẻ kho bằng cách tạo mới bản ghi [InventoryTransaction](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/InventoryTransaction.java) loại `IMPORT` chứa số lượng thay đổi dương và số tồn cuối của lô.
    5. Cập nhật trạng thái phiếu nhập kho thành `CONFIRMED`.

### 3.4.3. Chức năng Quản lý Phiếu Xuất Kho (Goods Issue)
* **Định nghĩa API**: Xử lý tại [GoodsIssueController.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/controller/GoodsIssueController.java).
* **Quy trình xử lý nghiệp vụ**: Triển khai trong [GoodsIssueService.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/service/GoodsIssueService.java):
  * **Xác nhận xuất kho (`confirmIssue`)**: Xử lý dưới dạng `@Transactional`.
    1. Kiểm tra trạng thái phiếu xuất phải là `DRAFT`.
    2. Duyệt qua từng mặt hàng cần xuất. Truy vấn lô tồn kho tương ứng trong bảng `inventory`.
    3. Kiểm tra điều kiện tồn kho: Số lượng tồn kho thực tế phải lớn hơn hoặc bằng số lượng yêu cầu xuất sau quy đổi. Nếu không đáp ứng, lập tức ném lỗi `IllegalArgumentException` để Rollback toàn bộ giao dịch trừ kho đã chạy trước đó.
    4. Nếu đủ tồn kho, thực hiện trừ tồn kho: `stockQuantity = stockQuantity - baseQuantity`. Nếu số lượng tồn kho giảm về 0, cập nhật trạng thái lô thành `SOLD_OUT` hoặc `DISPOSED`.
    5. Lưu thông tin lô tồn kho mới và ghi log biến động kho [InventoryTransaction](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/InventoryTransaction.java) loại `EXPORT` (hoặc `SALE` tùy lý do xuất) với số lượng thay đổi là giá trị âm.
    6. Cập nhật trạng thái phiếu xuất kho thành `CONFIRMED`.

### 3.4.4. Chức năng Kiểm kê Kho (Stock Audit)
* **Định nghĩa API**: Xử lý tại [StockAuditController.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/controller/StockAuditController.java).
* **Quy trình xử lý nghiệp vụ**: Triển khai trong [StockAuditService.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/service/StockAuditService.java):
  * **Lập phiếu kiểm kê nháp (`createAuditDraft`)**: Hệ thống truy vấn toàn bộ các lô hàng hiện có tồn kho trong bảng `inventory`. Chụp lại số lượng tồn kho tại thời điểm đó gán vào cột tồn hệ thống (`systemQuantity`), đồng thời mặc định số đếm thực tế bằng số sổ sách và chênh lệch bằng 0. Tạo phiếu kiểm kê ở trạng thái `DRAFT`.
  * **Lưu số lượng đếm thực tế (`saveAuditDraftQuantity`)**: Cho phép nhân viên cập nhật số lượng thực tế kiểm đếm (`actualQuantity`) và ghi chú giải trình lên giao diện. Hệ thống tự động tính toán chênh lệch chênh lệch: `discrepancy = actualQuantity - systemQuantity` và lưu lại tạm thời. Trạng thái phiếu được cập nhật thành `IN_PROGRESS`.
  * **Xác nhận đối soát hoàn thành kiểm kê (`confirmAudit`)**:
    1. Kiểm tra xem toàn bộ các lô hàng trong phiếu đã được điền số lượng đếm thực tế chưa (không để trống).
    2. Duyệt qua từng lô hàng, cập nhật số lượng tồn kho của lô trong bảng `inventory` về khớp đúng bằng số đếm thực tế `actualQuantity`.
    3. Nếu lô hàng có chênh lệch (`discrepancy != 0`), hệ thống tự động tạo một bản ghi biến động kho [InventoryTransaction](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/entity/InventoryTransaction.java) loại `AUDIT_ADJUST` lưu lại lượng chênh lệch thừa (giá trị dương) hoặc thiếu (giá trị âm) và kết dư mới của lô.
    4. Cập nhật trạng thái phiếu kiểm kê thành `CONFIRMED` và ghi nhận nhân viên phê duyệt đối soát.

### 3.4.5. Chức năng Lập Hóa Đơn Bán Lẻ POS
* **Định nghĩa API**: Xử lý tại [InvoiceController.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/controller/InvoiceController.java).
* **Quy trình xử lý nghiệp vụ**: Triển khai trong [InvoiceService.java](file:///c:/Users/Uyen/Desktop/PIS_CNPM/backend/src/main/java/com/app/pis/service/InvoiceService.java):
  * **Lập hóa đơn và trừ tồn kho (`createInvoice`)**: Xử lý đồng thời dưới dạng `@Transactional`.
    1. Kiểm tra sự tồn tại của Khách hàng thành viên nếu có thông tin truyền lên.
    2. Thiết lập thông tin hóa đơn (phương thức thanh toán: Cash/Card, trạng thái Paid, địa chỉ).
    3. Duyệt qua danh sách thuốc trong giỏ hàng. Truy vấn từng lô thuốc tương ứng theo `inventoryId`.
    4. Thực hiện kiểm tra tồn kho lô: Nếu tồn kho thực tế nhỏ hơn số lượng bán ra đã quy đổi, ném lỗi `IllegalArgumentException` và hủy bỏ toàn bộ giao dịch bán hàng (Rollback).
    5. Nếu đáp ứng, thực hiện trừ tồn kho lô trực tiếp trong bảng `inventory`. Nếu tồn kho của lô giảm về 0, cập nhật trạng thái lô thành `SOLD_OUT`.
    6. Lưu chi tiết hóa đơn vào bảng `invoice_detail` (gồm đơn giá bán, số lượng, thành tiền).
    7. Ghi nhật ký thẻ kho loại `SALE` (số lượng thay đổi âm) liên kết với mã số tham chiếu hóa đơn vừa được sinh.
    8. Trả về thông tin hóa đơn hoàn chỉnh. Frontend nhận dữ liệu sẽ kích hoạt cửa sổ in hóa đơn nhiệt để hoàn tất giao dịch.
