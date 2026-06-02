# 7. TỔNG KẾT

Tài liệu này tổng kết toàn bộ kết quả phát triển của dự án **PIS (Pharmacy Inventory Management System)**, đánh giá các ưu khuyết điểm của hệ thống hiện tại và đề xuất các hướng phát triển trong tương lai.

---

## 7.1. KẾT QUẢ ĐẠT ĐƯỢC

Sau quá trình nghiên cứu, thiết kế và phát triển, dự án PIS đã hoàn thành các mục tiêu quan trọng đề ra:

### 7.1.1. Về mặt chức năng hệ thống
* **Xây dựng thành công hệ thống quản lý kho thuốc khép kín**:
  * Hiện thực hóa đầy đủ quy trình quản lý thông tin thuốc, phân nhóm danh mục, đơn vị tính quy đổi và nhà cung cấp.
  * Nghiệp vụ nhập kho và xuất kho được thiết kế chặt chẽ qua hai bước: lập nháp (`DRAFT`) để rà soát thông tin và xác nhận chốt phiếu (`CONFIRMED`) để chính thức cập nhật tồn kho.
  * Nghiệp vụ kiểm kê kho thuốc hoàn thiện, hỗ trợ lưu số lượng đếm thực tế tạm thời và tự động tính chênh lệch thừa/thiếu, điều chỉnh đồng bộ tồn kho thực tế và sổ sách.
  * Quy trình bán lẻ tại quầy (POS) nhanh chóng, hỗ trợ tìm kiếm thuốc theo tên/lô còn hạn, tự động tính tiền thừa cho khách và in hóa đơn nhiệt mô phỏng.
* **Ghi nhận lịch sử biến động thẻ kho tự động**:
  * Mọi biến động tăng giảm tồn kho của các lô thuốc đều được tự động lưu vết chi tiết vào bảng `inventory_transaction` gắn kèm mã chứng từ gốc (phiếu nhập, phiếu xuất, hóa đơn bán lẻ, phiếu điều chỉnh kiểm kê).
* **Quản trị hệ thống và phân quyền**:
  * Quản lý nhân sự và cấp tài khoản tương ứng. Tự động sinh mật khẩu ngẫu nhiên an toàn và gửi trực tiếp qua email của nhân viên.
  * Phân quyền truy cập tài nguyên hệ thống (RBAC) nghiêm ngặt ở tầng backend dựa trên 3 vai trò: Admin, Product_manager (Quản lý kho), và Sales (Bán hàng).

### 7.1.2. Về mặt kỹ thuật và kiến trúc
* **Kiến trúc phân lớp chuẩn hóa (Layered Architecture)**:
  * Backend được phân tách rõ ràng giữa Controller, DTO, Service, Repository và Entity. Frontend tổ chức theo cấu trúc React Component hướng mô-đun, dễ bảo trì và mở rộng.
* **Bảo mật và an toàn dữ liệu**:
  * Bảo mật mật khẩu bằng thuật toán băm BCrypt.
  * Xác thực phi trạng thái (Stateless Authentication) bằng mã token JWT kết hợp cơ chế xoay vòng Refresh Token (Token Rotation) giúp tăng cường bảo mật và chống giả mạo phiên làm việc.
  * Sử dụng các giao dịch (Transactions) mức DB để duy trì tính nhất quán dữ liệu tồn kho.
* **Đóng gói và triển khai nhanh gọn**:
  * Ứng dụng toàn bộ dự án trên nền tảng **Docker**, đóng gói sẵn thành các container MySQL, Spring Boot Backend và Nginx Frontend, giúp triển khai toàn bộ hệ thống trên mọi máy chủ chỉ với một lệnh `docker compose up --build`.

---

## 7.2. ĐÁNH GIÁ ƯU ĐIỂM VÀ HẠN CHẾ

### 7.2.1. Ưu điểm
1. **Đảm bảo tính nhất quán dữ liệu tuyệt đối (ACID)**: Nhờ áp dụng annotation `@Transactional` trong Spring Boot, các hành động trừ kho, ghi thẻ kho và bán hàng được thực hiện trọn vẹn trong một phiên giao dịch. Nếu phát sinh lỗi (như không đủ tồn kho lô thuốc tại thời điểm chốt bán), toàn bộ tiến trình sẽ được hủy bỏ và rollback để tránh sai lệch số liệu.
2. **Quy đổi đơn vị tính tự động thông minh**: Hệ thống tự động xử lý chuyển đổi giữa đơn vị nhập/xuất/bán (hộp, vỉ, gói) sang đơn vị tính cơ bản (viên, ống, chai) dựa trên cấu hình quy đổi của thuốc đó, giảm thiểu sai sót tính toán thủ công cho nhân viên.
3. **Dashboard trực quan và cảnh báo khẩn cấp kịp thời**: Dashboard hiển thị nhanh số lượng hàng tồn kho dưới mức tối thiểu (`LOW_STOCK`), hàng sắp hết hạn (`NEAR_EXPIRY`) và hàng đã hết hạn (`EXPIRED`) giúp thủ kho đưa ra các quyết định luân chuyển hoặc lập kế hoạch nhập kho nhanh chóng.
4. **Trải nghiệm POS tối ưu**: Giao diện bán hàng POS phản hồi nhanh, hỗ trợ tìm kiếm thuốc theo lô kèm hạn dùng cụ thể, hiển thị trực quan số tiền thừa thối khách hàng và hỗ trợ xuất in hóa đơn nhiệt chuyên nghiệp.

### 7.2.2. Hạn chế
1. **Cơ chế quản lý Migration cơ sở dữ liệu còn sơ khai**: Dự án hiện sử dụng thuộc tính `ddl-auto: create-drop` kết hợp lớp khởi tạo mock data (`DataInitializer`), thích hợp cho việc phát triển/kiểm thử nhưng chưa đáp ứng được nhu cầu nâng cấp cấu trúc DB gia tăng (Incremental DB Migrations) trong môi trường sản xuất thực tế.
2. **Phân quyền người dùng ở mức cơ bản**: Phân quyền mới dừng lại ở mức gán vai trò tổng quát (Role-based) cho các endpoint lớn, chưa hỗ trợ phân quyền chi tiết theo nhóm chức năng hoặc phân quyền động tại giao diện (ví dụ: ẩn/hiện nút bấm tùy theo quyền cụ thể).
3. **Cơ chế in ấn và xuất báo cáo còn phụ thuộc**: Việc in phiếu kho và hóa đơn POS vẫn sử dụng lệnh in HTML mặc định của trình duyệt (`window.print`), chưa hỗ trợ xuất trực tiếp các định dạng báo cáo văn bản có cấu trúc cao như PDF hoặc bảng tính Excel.

---

## 7.3. ĐỀ XUẤT HƯỚNG PHÁT TRIỂN TRONG TƯƠNG LAI

Để nâng cao năng lực vận hành và đưa hệ thống PIS ứng dụng rộng rãi vào thực tiễn các chuỗi nhà thuốc lớn, các hướng phát triển tiếp theo được đề xuất bao gồm:

1. **Áp dụng công cụ quản lý cơ sở dữ liệu chuyên nghiệp**:
   * Tích hợp **Flyway** hoặc **Liquibase** để quản lý các phiên bản cấu trúc cơ sở dữ liệu (Database Schema Migrations), đảm bảo dữ liệu lịch sử không bị mất mát khi cập nhật phiên bản mới của phần mềm.
2. **Nâng cấp cơ chế phân quyền động (Permission-based Access Control)**:
   * Chuyển đổi mô hình phân quyền từ dạng vai trò tổng quát (Roles) sang dạng quyền hạn chi tiết (Permissions), cho phép người quản trị tự cấu hình động các quyền cụ thể cho từng nhóm nhân sự trên giao diện.
3. **Tích hợp module Báo cáo chuyên sâu & Xuất dữ liệu**:
   * Sử dụng thư viện **Apache POI** để hỗ trợ xuất các loại báo cáo tồn kho, báo cáo thẻ kho, báo cáo doanh thu bán lẻ ra định dạng file Excel.
   * Tích hợp **JasperReports** hoặc **Thymeleaf PDF generator** để tạo và xuất các mẫu hóa đơn, phiếu nhập/xuất kho ra định dạng PDF chuẩn hóa, phục vụ lưu trữ văn bản.
4. **Tích hợp thanh toán số động tại quầy POS**:
   * Liên kết với các cổng thanh toán (như VNPay, Momo) để tự động sinh mã QR Code động hiển thị số tiền hóa đơn tại quầy POS, giúp khách hàng thanh toán chuyển khoản nhanh chóng và chính xác, giảm thiểu thao tác nhập tay của nhân viên.
5. **Ứng dụng AI/Machine Learning trong dự báo nhu cầu**:
   * Phát triển thêm module phân tích thông minh, áp dụng thuật toán dự báo chuỗi thời gian (Time-series Forecasting) trên lịch sử bán hàng POS nhằm dự đoán xu hướng sử dụng thuốc theo mùa và tự động đề xuất số lượng nhập kho tối ưu cho từng loại thuốc.
