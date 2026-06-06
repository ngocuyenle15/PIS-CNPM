package com.app.pis.config;

import com.app.pis.entity.Account;
import com.app.pis.entity.Employee;
import com.app.pis.entity.Role;
import com.app.pis.entity.Catalog;
import com.app.pis.entity.Unit;
import com.app.pis.entity.Origin;
import com.app.pis.entity.Supplier;
import com.app.pis.entity.Customer;
import com.app.pis.entity.Medicine;
import com.app.pis.entity.MedicineUnit;
import com.app.pis.entity.Inventory;
import com.app.pis.entity.GoodsReceipt;
import com.app.pis.entity.GoodsReceiptDetail;
import com.app.pis.entity.GoodsIssue;
import com.app.pis.entity.GoodsIssueDetail;
import com.app.pis.entity.Invoice;
import com.app.pis.entity.InvoiceDetail;
import com.app.pis.entity.StockAudit;
import com.app.pis.entity.StockAuditDetail;
import com.app.pis.entity.InventoryTransaction;

import com.app.pis.repository.AccountRepository;
import com.app.pis.repository.EmployeeRepository;
import com.app.pis.repository.RoleRepository;
import com.app.pis.repository.CatalogRepository;
import com.app.pis.repository.UnitRepository;
import com.app.pis.repository.OriginRepository;
import com.app.pis.repository.SupplierRepository;
import com.app.pis.repository.CustomerRepository;
import com.app.pis.repository.MedicineRepository;
import com.app.pis.repository.MedicineUnitRepository;
import com.app.pis.repository.InventoryRepository;
import com.app.pis.repository.GoodsReceiptRepository;
import com.app.pis.repository.GoodsReceiptDetailRepository;
import com.app.pis.repository.GoodsIssueRepository;
import com.app.pis.repository.GoodsIssueDetailRepository;
import com.app.pis.repository.InvoiceRepository;
import com.app.pis.repository.InvoiceDetailRepository;
import com.app.pis.repository.StockAuditRepository;
import com.app.pis.repository.StockAuditDetailRepository;
import com.app.pis.repository.InventoryTransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer2 implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final EmployeeRepository employeeRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final CatalogRepository catalogRepository;
    private final UnitRepository unitRepository;
    private final OriginRepository originRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineUnitRepository medicineUnitRepository;
    private final InventoryRepository inventoryRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final GoodsReceiptDetailRepository goodsReceiptDetailRepository;
    private final GoodsIssueRepository goodsIssueRepository;
    private final GoodsIssueDetailRepository goodsIssueDetailRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final StockAuditRepository stockAuditRepository;
    private final StockAuditDetailRepository stockAuditDetailRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Bắt đầu khởi tạo dữ liệu mẫu chuẩn thực tế (DataInitializer2)...");

        // 1. Seed Roles
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (!roleRepository.existsByRoleName(roleName)) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
                log.info("Đã khởi tạo Role: {}", roleName);
            }
        }

        // 2. Seed Employees and Accounts - 25 items per entity (>= 20 rows)
        List<Employee> employees = new ArrayList<>();
        Role adminRole = roleRepository.findByRoleName(Role.RoleName.Admin)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role Admin trong Database"));
        Role salesRole = roleRepository.findByRoleName(Role.RoleName.Sales)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role Sales trong Database"));
        Role managerRole = roleRepository.findByRoleName(Role.RoleName.Product_manager)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role Product_manager trong Database"));

        List<String> employeeNames = List.of(
            "Lê Ngọc Uyển   ", "Trần Quang Khoan", "Phan Thiện Vỹ", "Phạm Hoàng Nam", "Lê Minh Tuấn",
            "Đặng Thu Thảo", "Vũ Huy Khánh", "Bùi Hồng Nhung", "Đỗ Quốc Việt", "Ngô Phương Anh",
            "Hồ Hoàng Hải", "Phan Gia Bảo", "Lý Thanh Bình", "Trịnh Xuân Giang", "Mai Tuyết Trinh",
            "Lâm Thế Kiệt", "Vương Quốc Huy", "Trần Mai Phương", "Lê Cẩm Tú", "Hoàng Kim Liên",
            "Đinh Trọng Nghĩa", "Phùng Mỹ Linh", "Nguyễn Đắc Tài", "Vũ Quang Vinh", "Dương Thu Trang"
        );

        for (int i = 1; i <= 5; i++) {
            String empId = "EMP" + String.format("%03d", i);
            Employee emp;
            if (!employeeRepository.existsById(empId)) {
                emp = new Employee();
                emp.setEmployeeID(empId);
                emp.setFullName(employeeNames.get(i - 1));
                if (i == 1) {
                    emp.setPhoneNumber("0123456789");
                    emp.setEmail("admin@example.com");
                    emp.setGender(Employee.Gender.Male);
                    emp.setYearOfBirth(1990);
                } else if (i == 2) {
                    emp.setPhoneNumber("0987654321");
                    emp.setEmail("sales@example.com");
                    emp.setGender(Employee.Gender.Female);
                    emp.setYearOfBirth(1995);
                } else if (i == 3) {
                    emp.setPhoneNumber("0911223344");
                    emp.setEmail("manager@example.com");
                    emp.setGender(Employee.Gender.Male);
                    emp.setYearOfBirth(1988);
                } else {
                    emp.setPhoneNumber("0900000" + String.format("%03d", i));
                    emp.setEmail("employee" + i + "@example.com");
                    emp.setGender(i % 2 == 0 ? Employee.Gender.Male : Employee.Gender.Female);
                    emp.setYearOfBirth(1990 + (i % 8));
                }
                emp.setHireDate(LocalDate.of(2026, 1, 1).plusDays(i));
                emp.setIsActive(true);
                emp = employeeRepository.save(emp);
                log.info("Đã khởi tạo Employee: {}", empId);
            } else {
                emp = employeeRepository.findById(empId).orElse(null);
            }
            employees.add(emp);

            // Create Account for each Employee
            String username;
            Role role;
            String plainPassword;
            if (i == 1) {
                username = "admin";
                role = adminRole;
                plainPassword = "admin123";
            } else if (i == 2) {
                username = "sales";
                role = salesRole;
                plainPassword = "sales123";
            } else if (i == 3) {
                username = "manager";
                role = managerRole;
                plainPassword = "manager123";
            } else {
                username = "user" + i;
                role = (i % 2 == 0) ? salesRole : managerRole;
                plainPassword = "password" + i;
            }

            if (!accountRepository.existsByUsername(username)) {
                Account acc = new Account();
                acc.setUsername(username);
                acc.setPassword(passwordEncoder.encode(plainPassword));
                acc.setEmployee(emp);
                acc.setRole(role);
                acc.setIsStaff(true);
                acc.setIsActive(true);
                acc.setIsFirstLogin(false);
                accountRepository.save(acc);
                log.info("Đã khởi tạo Account: {}", username);
            }
        }

        Employee adminEmployee = employees.get(0);

        // 4. Seed Catalog (Danh mục nhóm thuốc) - 26 bản ghi (>= 20 rows)
        List<String> catalogNames = List.of(
            "Thuốc kháng sinh", "Thuốc giảm đau & hạ sốt", "Thuốc kháng viêm", "Thuốc nhỏ mắt & tai", "Vitamin & Khoáng chất",
            "Thuốc tiêu hóa & dạ dày", "Thuốc tim mạch & huyết áp", "Thuốc trị tiểu đường", "Thuốc kháng Histamine dị ứng", "Thuốc ho & cảm cúm",
            "Dược mỹ phẩm chăm sóc da", "Thuốc bôi ngoài da", "Thuốc trị nấm", "Thực phẩm chức năng", "Thiết bị y tế gia đình",
            "Thuốc nhỏ & xịt mũi", "Thuốc an thần & thần kinh", "Thuốc bổ não & tuần hoàn", "Thuốc xương khớp & gout", "Sữa & Dinh dưỡng",
            "Dầu gió & cao xoa", "Thuốc bổ gan & giải độc", "Thuốc đường hô hấp", "Dược liệu & Thảo dược", "Thiết bị bảo hộ y tế",
            "Dịch truyền & bù điện giải"
        );
        List<Catalog> catalogs = new ArrayList<>();
        for (int i = 0; i < catalogNames.size(); i++) {
            String id = "CAT" + String.format("%03d", i + 1);
            if (!catalogRepository.existsById(id)) {
                Catalog c = new Catalog(id, catalogNames.get(i));
                catalogs.add(catalogRepository.save(c));
            } else {
                catalogs.add(catalogRepository.findById(id).orElse(null));
            }
        }
        log.info("Đã seed xong {} Catalog.", catalogs.size());

        // 5. Seed Unit (Đơn vị tính) - 26 bản ghi (>= 20 rows)
        List<String> unitNames = List.of(
            "Viên", "Hộp", "Chai", "Vỉ", "Tuýp", "Gói", "Ống", "Lọ", "Cốc", "Thìa",
            "Bình", "Cái", "Chiếc", "Cuộn", "Miếng", "Tờ", "Ống tiêm", "Amput", "Viên sủi", "Túi",
            "Bánh", "Liều", "Cuộn băng", "Ống hít", "Cặp", "Hũ"
        );
        List<Unit> units = new ArrayList<>();
        for (int i = 0; i < unitNames.size(); i++) {
            String id = "UNIT" + String.format("%03d", i + 1);
            if (!unitRepository.existsById(id)) {
                Unit u = new Unit(id, unitNames.get(i));
                units.add(unitRepository.save(u));
            } else {
                units.add(unitRepository.findById(id).orElse(null));
            }
        }
        log.info("Đã seed xong {} Unit.", units.size());

        // 6. Seed Origin (Nước sản xuất) - 26 bản ghi (>= 20 rows)
        List<String> originNames = List.of(
            "Việt Nam", "Mỹ", "Pháp", "Đức", "Ấn Độ", "Anh", "Ý", "Nhật Bản", "Hàn Quốc", "Thụy Sĩ",
            "Úc", "Canada", "Singapore", "Thái Lan", "Malaysia", "Trung Quốc", "Tây Ban Nha", "Bỉ", "Hà Lan", "Thụy Điển",
            "Đan Mạch", "Đài Loan", "Hồng Kông", "Nga", "New Zealand", "Áo"
        );
        List<Origin> origins = new ArrayList<>();
        for (int i = 0; i < originNames.size(); i++) {
            String id = "ORG" + String.format("%03d", i + 1);
            if (!originRepository.existsById(id)) {
                Origin o = new Origin(id, originNames.get(i));
                origins.add(originRepository.save(o));
            } else {
                origins.add(originRepository.findById(id).orElse(null));
            }
        }
        log.info("Đã seed xong {} Origin.", origins.size());

        // 7. Seed Supplier (Nhà cung cấp) - 27 bản ghi (>= 20 rows)
        List<String> supplierNames = List.of(
            "TỒN KHO KHỞI TẠO",
            "Công ty Cổ phần Dược phẩm Trung ương 1 (CPC1)", "Công ty Cổ phần Dược Hậu Giang (DHG)",
            "Công ty Cổ phần Traphaco", "Công ty Cổ phần Dược phẩm Imexpharm", "Công ty Cổ phần Dược phẩm Domesco",
            "Công ty Cổ phần Dược Phẩm OPC", "Công ty Cổ phần Dược Hà Tây", "Công ty Cổ phần Pharmedic",
            "Công ty TNHH Sanofi-Aventis Việt Nam", "Công ty Cổ phần Dược Lâm Đồng (Ladophar)",
            "Công ty Cổ phần Dược Cửu Long (Pharimexco)", "Công ty Cổ phần Dược phẩm Boston Việt Nam",
            "Công ty Cổ phần Dược phẩm Nam Hà", "Công ty Cổ phần Dược phẩm Khánh Hòa",
            "Công ty Cổ phần Dược phẩm Savi (Savipharm)", "Công ty Cổ phần Dược Vĩnh Phúc (Vinphaco)",
            "Công ty Cổ phần Dược Medipharco", "Công ty Cổ phần Dược phẩm Danapha", "Công ty Cổ phần Hóa - Dược phẩm Mekophar",
            "Công ty Cổ phần Dược vật tư y tế Bình Định (Bidiphar)", "Công ty Cổ phần Dược Phẩm Yên Bái",
            "Công ty Cổ phần Dược phẩm Gia Lai", "Công ty Cổ phần Dược phẩm Tipharco",
            "Công ty Cổ phần Dược phẩm Quảng Bình", "Công ty TNHH AstraZeneca Việt Nam", "Công ty TNHH Pfizer Việt Nam"
        );
        List<Supplier> suppliers = new ArrayList<>();
        for (int i = 0; i < supplierNames.size(); i++) {
            String id = "SUP" + String.format("%03d", i + 1);
            if (!supplierRepository.existsById(id)) {
                Supplier s = new Supplier(id, supplierNames.get(i), "0900123" + String.format("%03d", i + 1), "Địa chỉ tại " + supplierNames.get(i));
                suppliers.add(supplierRepository.save(s));
            } else {
                suppliers.add(supplierRepository.findById(id).orElse(null));
            }
        }
        log.info("Đã seed xong {} Supplier.", suppliers.size());

        // 8. Seed Customer (Khách hàng) - 26 bản ghi (>= 20 rows)
        List<String> customerNames = List.of(
            "Nguyễn Văn Anh", "Trần Thị Bình", "Lê Hoàng Chi", "Phạm Minh Đức", "Hoàng Thị Hương",
            "Vũ Văn Gia", "Ngô Thị Kim", "Đỗ Minh Long", "Bùi Thị Mai", "Phan Văn Nam",
            "Hồ Thị Oanh", "Dương Minh Quân", "Lý Thị Sơn", "Đặng Văn Trường", "Đinh Thị Uyên",
            "Lâm Văn Việt", "Mai Thị Xuân", "Tạ Văn Yên", "Phùng Thị An", "Trịnh Văn Bảo",
            "Bùi Hoàng Long", "Trần Đức Lương", "Phạm Hải Yến", "Nguyễn Khắc Việt", "Vũ Hoàng My", "Đặng Thùy Trang"
        );
        List<Customer> customers = new ArrayList<>();
        for (int i = 0; i < customerNames.size(); i++) {
            String id = "CUST" + String.format("%03d", i + 1);
            if (!customerRepository.existsById(id)) {
                Customer c = new Customer();
                c.setCustomerID(id);
                c.setFullName(customerNames.get(i));
                c.setPhoneNumber("0912345" + String.format("%03d", i + 1));
                c.setGender(i % 2 == 0 ? Customer.Gender.Male : Customer.Gender.Female);
                c.setJoinDate(LocalDate.now());
                customers.add(customerRepository.save(c));
            } else {
                customers.add(customerRepository.findById(id).orElse(null));
            }
        }
        log.info("Đã seed xong {} Customer.", customers.size());

        // 9. Seed Medicine - 75 bản ghi (yêu cầu > 70 thuốc)
        List<String> medicineNames = List.of(
            "Paracetamol 500mg", "Ibuprofen 400mg", "Meloxicam 7.5mg", "Diclofenac 50mg", "Celecoxib 200mg",
            "Aspirin 81mg", "Amoxicillin 500mg", "Augmentin 1g", "Klamentin 625mg", "Cephalexin 500mg",
            "Cefuroxime Axetil 500mg", "Zinnat 250mg", "Cefixime 200mg", "Azithromycin 500mg", "Zithromax 250mg",
            "Clarithromycin 500mg", "Klacid MR 500mg", "Levofloxacin 500mg", "Tavanic 500mg", "Ciprofloxacin 500mg",
            "Metronidazole 250mg", "Acetylcysteine 200mg", "Acemuc 200mg", "Ambroxol 30mg", "Bisolvon 8mg",
            "Dextromethorphan 15mg", "Ventolin Nebules 2.5mg", "Seretide Evohaler 25/250mcg", "Singulair 4mg", "Loratadine 10mg",
            "Clarityne 10mg", "Cetirizine 10mg", "Zyrtec 10mg", "Fexofenadine 180mg", "Telfast 60mg",
            "Aerius 5mg", "Chlorpheniramine 4mg", "Omeprazole 20mg", "Nexium mups 40mg", "Pantoprazole 40mg",
            "Pariet 20mg", "Ranitidine 150mg", "Famotidine 20mg", "Phosphalugel", "Gaviscon Dual Action",
            "Motilium 10mg", "Primperan 10mg", "Zofran 8mg", "Imodium 2mg", "Smecta 3g",
            "Oresol 27.9g", "Duphalac 667mg/ml", "Dulcolax 5mg", "Glucophage 850mg", "Diamicron MR 60mg",
            "Amaryl 2mg", "Amlor 5mg", "Adalat LA 30mg", "Cozaar 50mg", "Diovan 80mg",
            "Micardis 40mg", "Captopril 25mg", "Betaloc ZOK 50mg", "Concor 5mg", "Lipitor 20mg",
            "Crestor 10mg", "Zocor 20mg", "Lipanthyl NT 145mg", "Seduxen 5mg", "Tanakan 40mg",
            "Nootropil 800mg", "Merislon 6mg", "Sibelium 5mg", "Glucosamine Chondroitin", "Calcium D3 Sandoz"
        );

        List<String> ingredientsList = List.of(
            "Paracetamol 500mg", "Ibuprofen 400mg", "Meloxicam 7.5mg", "Diclofenac 50mg", "Celecoxib 200mg",
            "Aspirin 81mg", "Amoxicillin 500mg", "Amoxicillin 875mg + Clavulanic Acid 125mg", "Amoxicillin 500mg + Clavulanic Acid 125mg", "Cephalexin 500mg",
            "Cefuroxime Axetil 500mg", "Cefuroxime 250mg", "Cefixime 200mg", "Azithromycin 500mg", "Azithromycin 250mg",
            "Clarithromycin 500mg", "Clarithromycin 500mg", "Levofloxacin 500mg", "Levofloxacin 500mg", "Ciprofloxacin 500mg",
            "Metronidazole 250mg", "Acetylcysteine 200mg", "Acetylcysteine 200mg", "Ambroxol hydrochloride 30mg", "Bromhexine hydrochloride 8mg",
            "Dextromethorphan HBr 15mg", "Salbutamol 2.5mg", "Salmeterol 25mcg + Fluticasone Propionate 250mcg", "Montelukast natri 4mg", "Loratadine 10mg",
            "Loratadine 10mg", "Cetirizine dihydrochloride 10mg", "Cetirizine dihydrochloride 10mg", "Fexofenadine hydrochloride 180mg", "Fexofenadine hydrochloride 60mg",
            "Desloratadine 5mg", "Chlorpheniramine maleate 4mg", "Omeprazole 20mg", "Esomeprazole magnesium trihydrate 40mg", "Pantoprazole 40mg",
            "Rabeprazole natri 20mg", "Ranitidine 150mg", "Famotidine 20mg", "Colloid Alumini phosphat 20%", "Natri alginate + Calci carbonat",
            "Domperidone 10mg", "Metoclopramide hydrochloride 10mg", "Ondansetron 8mg", "Loperamide hydrochloride 2mg", "Dioctahedral smectite 3g",
            "Natri clorid, Natri citrat, Kali clorid, Glucose khan", "Lactulose 10g/15ml", "Bisacodyl 5mg", "Metformin hydrochloride 850mg", "Gliclazide 60mg",
            "Glimepiride 2mg", "Amlodipine besylate 5mg", "Nifedipine 30mg", "Losartan kali 50mg", "Valsartan 80mg",
            "Telmisartan 40mg", "Captopril 25mg", "Metoprolol succinate 50mg", "Bisoprolol fumarate 5mg", "Atorvastatin calcium trihydrate 20mg",
            "Rosuvastatin calcium 10mg", "Simvastatin 20mg", "Fenofibrate 145mg", "Diazepam 5mg", "Ginkgo biloba extract 40mg",
            "Piracetam 800mg", "Betahistine mesilate 6mg", "Flunarizine hydrochloride 5mg", "Glucosamine sulfate 1500mg", "Calcium lactate gluconate + Calcium carbonate + Vitamin D3"
        );

        List<Medicine> medicines = new ArrayList<>();
        for (int i = 0; i < medicineNames.size(); i++) {
            String id = "MED" + String.format("%03d", i + 1);
            if (!medicineRepository.existsById(id)) {
                Medicine m = new Medicine();
                m.setMedicineID(id);
                m.setMedicineName(medicineNames.get(i));
                m.setImage("https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80");
                m.setIngredients(ingredientsList.get(i) + " và tá dược vừa đủ");
                m.setCatalog(catalogs.get(i % catalogs.size()));
                m.setOrigin(origins.get(i % origins.size()));

                // Determine realistic base unit and unit price (price of base unit)
                String medName = medicineNames.get(i).toLowerCase();
                String baseUnitId = "UNIT001"; // Default: Viên
                double basePrice = 500.0 + (i % 10) * 500.0; // Default price: 500 to 5000 VND
                
                if (medName.contains("phosphalugel") || medName.contains("gaviscon") || medName.contains("smecta") 
                        || medName.contains("oresol") || medName.contains("duphalac") || medName.contains("acetylcysteine") 
                        || medName.contains("acemuc")) {
                    baseUnitId = "UNIT006"; // Gói
                    basePrice = 2000.0 + (i % 5) * 1000.0; // 2000 to 6000 VND
                } else if (medName.contains("ventolin") || (medName.contains("zofran") && i % 2 == 0)) {
                    baseUnitId = "UNIT007"; // Ống
                    basePrice = 5000.0 + (i % 5) * 1500.0; // 5000 to 11000 VND
                } else if (medName.contains("seretide")) {
                    baseUnitId = "UNIT011"; // Bình
                    basePrice = 120000.0 + (i % 3) * 20000.0; // 120000 to 160000 VND (inhaler bottle is expensive but base unit)
                } else if (medName.contains("sandoz")) {
                    baseUnitId = "UNIT019"; // Viên sủi
                    basePrice = 3000.0 + (i % 3) * 1000.0; // 3000 to 5000 VND
                } else if (medName.contains("daktarin") || medName.contains("kamistad") || medName.contains("gel") || medName.contains("cream")) {
                    baseUnitId = "UNIT005"; // Tuýp
                    basePrice = 20000.0 + (i % 5) * 5000.0; // 20000 to 40000 VND
                } else if (medName.contains("drops") || medName.contains("syrup") || medName.contains("solution")) {
                    baseUnitId = "UNIT003"; // Chai
                    basePrice = 15000.0 + (i % 5) * 5000.0; // 15000 to 35000 VND
                } else if (medName.contains("nexium") || medName.contains("lipitor") || medName.contains("crestor") || medName.contains("singulair") || medName.contains("tavanic") || medName.contains("zinnat")) {
                    baseUnitId = "UNIT001"; // Viên (nhưng là biệt dược đắt tiền)
                    basePrice = 10000.0 + (i % 5) * 2000.0; // 10000 to 18000 VND per tablet
                }

                final String targetUnitId = baseUnitId;
                Unit baseUnit = units.stream()
                        .filter(u -> u.getUnitID().equals(targetUnitId))
                        .findFirst()
                        .orElse(units.get(0));

                m.setBaseUnit(baseUnit);
                m.setUnitPrice(BigDecimal.valueOf(basePrice));
                medicines.add(medicineRepository.save(m));
            } else {
                medicines.add(medicineRepository.findById(id).orElse(null));
            }
        }
        log.info("Đã seed xong {} Medicine.", medicines.size());

        // 10. Seed MedicineUnit (Quy đổi đơn vị phụ cho TẤT CẢ thuốc) - 75+ bản ghi (>= 20 rows)
        Unit unitVien    = unitRepository.findById("UNIT001").orElse(null);
        Unit unitHop     = unitRepository.findById("UNIT002").orElse(null);
        Unit unitChai    = unitRepository.findById("UNIT003").orElse(null);
        Unit unitVi      = unitRepository.findById("UNIT004").orElse(null);
        Unit unitTuyp    = unitRepository.findById("UNIT005").orElse(null);
        Unit unitGoi     = unitRepository.findById("UNIT006").orElse(null);
        Unit unitLo      = unitRepository.findById("UNIT008").orElse(null);

        int seededConversions = 0;
        for (Medicine m : medicines) {
            if (m == null || m.getBaseUnit() == null) continue;
            List<MedicineUnit> existingConversions = medicineUnitRepository.findByMedicine(m);
            String baseUnitId = m.getBaseUnit().getUnitID();
            List<Unit[]> conversions = new ArrayList<>();
            List<Integer> rates = new ArrayList<>();

            if ("UNIT001".equals(baseUnitId) && unitVi != null && unitHop != null) {
                conversions.add(new Unit[]{ unitVi }); rates.add(10);
                conversions.add(new Unit[]{ unitHop }); rates.add(100);
            } else if ("UNIT002".equals(baseUnitId) && unitVien != null && unitGoi != null) {
                conversions.add(new Unit[]{ unitVien }); rates.add(30);
                conversions.add(new Unit[]{ unitGoi }); rates.add(5);
            } else if ("UNIT003".equals(baseUnitId) && unitLo != null) {
                conversions.add(new Unit[]{ unitLo }); rates.add(2);
            } else if ("UNIT004".equals(baseUnitId) && unitVien != null && unitHop != null) {
                conversions.add(new Unit[]{ unitVien }); rates.add(10);
                conversions.add(new Unit[]{ unitHop }); rates.add(12);
            } else if ("UNIT005".equals(baseUnitId) && unitHop != null) {
                conversions.add(new Unit[]{ unitHop }); rates.add(5);
            } else if ("UNIT006".equals(baseUnitId) && unitHop != null) {
                conversions.add(new Unit[]{ unitHop }); rates.add(20);
            } else if ("UNIT007".equals(baseUnitId) && unitHop != null) {
                conversions.add(new Unit[]{ unitHop }); rates.add(10);
            } else if ("UNIT008".equals(baseUnitId) && unitHop != null) {
                conversions.add(new Unit[]{ unitHop }); rates.add(6);
            } else if (unitHop != null && !baseUnitId.equals("UNIT002")) {
                conversions.add(new Unit[]{ unitHop }); rates.add(10);
            }

            for (int j = 0; j < conversions.size(); j++) {
                Unit altUnit = conversions.get(j)[0];
                int rate = rates.get(j);
                if (altUnit.getUnitID().equals(baseUnitId)) continue;
                if (existingConversions.stream().noneMatch(mu -> altUnit.getUnitID().equals(mu.getUnit().getUnitID()))) {
                    MedicineUnit mu = new MedicineUnit();
                    mu.setMedicine(m);
                    mu.setUnit(altUnit);
                    mu.setConversionRate(rate);
                    medicineUnitRepository.save(mu);
                    seededConversions++;
                }
            }
        }
        log.info("Đã seed xong {} MedicineUnit conversion rates.", seededConversions);

        // 11. Seed Inventory (Lô kho) - 75 bản ghi (đảm bảo tồn tại INV001 cho Test) (>= 20 rows)
        List<Inventory> inventories = new ArrayList<>();
        for (int i = 0; i < 75; i++) {
            String invId = "INV" + String.format("%03d", i + 1);
            if (!inventoryRepository.existsById(invId)) {
                Inventory inv = new Inventory();
                inv.setId(invId);
                inv.setBatchId("BATCH" + String.format("%03d", i + 1));
                inv.setMedicine(medicines.get(i % medicines.size()));
                BigDecimal medPrice = inv.getMedicine().getUnitPrice();
                inv.setImportPrice(medPrice.multiply(BigDecimal.valueOf(0.8)));
                inv.setStockQuantity(100 + i * 5);
                if (i % 10 == 2) { 
                    inv.setExpiryDate(LocalDate.now().minusMonths(1)); 
                    inv.setManufacturedDate(LocalDate.now().minusMonths(13)); 
                } else if (i % 10 == 5) { 
                    inv.setExpiryDate(LocalDate.now().plusDays(15)); 
                    inv.setManufacturedDate(LocalDate.now().minusDays(350)); 
                } else { 
                    inv.setExpiryDate(LocalDate.now().plusYears(1 + i % 2)); 
                    inv.setManufacturedDate(LocalDate.now().minusMonths(6)); 
                }
                if (i % 10 == 4) { 
                    inv.setStatus(Inventory.InventoryStatus.SOLD_OUT); 
                    inv.setStockQuantity(0); 
                } else if (i % 10 == 8) { 
                    inv.setStatus(Inventory.InventoryStatus.DISPOSED); 
                } else { 
                    inv.setStatus(Inventory.InventoryStatus.ACTIVE); 
                }
                
                // Đảm bảo INV001 là Active và còn hàng cho Integration Test chạy tốt
                if (i == 0) {
                    inv.setStatus(Inventory.InventoryStatus.ACTIVE);
                    inv.setStockQuantity(150);
                }
                
                inventories.add(inventoryRepository.save(inv));
            } else {
                inventories.add(inventoryRepository.findById(invId).orElse(null));
            }
        }
        log.info("Đã seed xong {} Inventory (Lô kho).", inventories.size());

        // 12. Seed GoodsReceipt (Phiếu nhập kho) - 25 bản ghi (>= 20 rows)
        for (int i = 1; i <= 25; i++) {
            String receiptId = "GR" + String.format("%03d", i);
            if (!goodsReceiptRepository.existsById(receiptId)) {
                GoodsReceipt gr = new GoodsReceipt();
                gr.setReceiptId(receiptId);
                gr.setReceiptTime(LocalDateTime.now().minusDays(30 - i));
                gr.setEmployee(employees.get(i % employees.size()));
                gr.setSupplier(suppliers.get(i % suppliers.size()));
                gr.setStatus(i % 5 == 0 ? GoodsReceipt.ReceiptStatus.DRAFT : GoodsReceipt.ReceiptStatus.CONFIRMED);
                gr.setNote("Nhập hàng đợt thực tế " + i);
                
                GoodsReceiptDetail grd = new GoodsReceiptDetail();
                grd.setReceipt(gr);
                Medicine m = medicines.get(i % medicines.size());
                grd.setMedicine(m);
                grd.setBatchId("BATCH" + String.format("%03d", i));
                grd.setQuantity(50 + i * 10);
                grd.setExpiryDate(LocalDate.now().plusYears(1 + i % 2));
                grd.setManufacturedDate(LocalDate.now().minusMonths(6));
                grd.setTransactionUnit(m.getBaseUnit());
                grd.setConversionRate(1);
                grd.setImportPrice(m.getUnitPrice().multiply(BigDecimal.valueOf(0.8)));
                gr.getDetails().add(grd);
                
                goodsReceiptRepository.save(gr);
            }
        }
        log.info("Đã seed xong 25 GoodsReceipt.");

        // 13. Seed GoodsIssue (Phiếu xuất kho) - 25 bản ghi (>= 20 rows)
        for (int i = 1; i <= 25; i++) {
            String issueId = "GI" + String.format("%03d", i);
            if (!goodsIssueRepository.existsById(issueId)) {
                GoodsIssue gi = new GoodsIssue();
                gi.setIssueId(issueId);
                gi.setIssueTime(LocalDateTime.now().minusDays(30 - i).plusHours(2));
                gi.setEmployee(employees.get((i + 1) % employees.size()));
                gi.setIssueType(i % 4 == 0 ? GoodsIssue.IssueType.EXPIRED : GoodsIssue.IssueType.SALE);
                gi.setStatus(i % 5 == 0 ? GoodsIssue.IssueStatus.DRAFT : GoodsIssue.IssueStatus.CONFIRMED);
                gi.setNote("Xuất kho đợt thực tế " + i);
                
                GoodsIssueDetail gid = new GoodsIssueDetail();
                gid.setIssue(gi);
                Inventory inv = inventories.get(i % inventories.size());
                gid.setInventory(inv);
                gid.setQuantity(2 + i % 5);
                gid.setTransactionUnit(inv.getMedicine().getBaseUnit());
                gid.setConversionRate(1);
                gi.getDetails().add(gid);
                
                goodsIssueRepository.save(gi);
            }
        }
        log.info("Đã seed xong 25 GoodsIssue.");

        // 14. Seed Invoice & InvoiceDetail (Hóa đơn bán hàng) - 25 bản ghi (>= 20 rows)
        if (invoiceRepository.count() == 0) {
            for (int i = 1; i <= 25; i++) {
                Invoice inv = new Invoice();
                inv.setInvoiceTime(LocalDateTime.now().minusDays(30 - i).plusHours(4));
                inv.setCustomer(customers.get(i % customers.size()));
                inv.setAddress(i + " Đường Trần Hưng Đạo, Quận 1, TP. HCM");
                inv.setPaymentMethod(i % 2 == 0 ? Invoice.PaymentMethod.Cash : Invoice.PaymentMethod.Card);
                inv.setStatus(i % 6 == 0 ? Invoice.InvoiceStatus.Pending : Invoice.InvoiceStatus.Paid);
                
                InvoiceDetail invd = new InvoiceDetail();
                invd.setInvoice(inv);
                invd.setInventory(inventories.get(i % inventories.size()));
                invd.setQuantity(1 + i % 10);
                invd.setUnitPrice(invd.getInventory().getMedicine().getUnitPrice());
                invd.setNote("Khách mua đợt " + i);
                inv.getInvoiceDetails().add(invd);
                
                invoiceRepository.save(inv);
            }
            log.info("Đã seed xong 25 Invoice (Hóa đơn bán lẻ).");
        }

        // 15. Seed StockAudit (Phiếu kiểm kê kho) - 25 bản ghi (>= 20 rows)
        for (int i = 1; i <= 25; i++) {
            String auditId = "SA" + String.format("%03d", i);
            if (!stockAuditRepository.existsById(auditId)) {
                StockAudit sa = new StockAudit();
                sa.setAuditId(auditId);
                sa.setAuditTime(LocalDateTime.now().minusDays(30 - i).plusHours(6));
                sa.setCreatedBy(employees.get(i % employees.size()));
                if (i % 5 != 0) {
                    sa.setApprovedBy(adminEmployee);
                    sa.setStatus(StockAudit.AuditStatus.CONFIRMED);
                } else {
                    sa.setStatus(StockAudit.AuditStatus.DRAFT);
                }
                sa.setNote("Kiểm kê định kỳ thực tế đợt " + i);
                
                StockAuditDetail sad = new StockAuditDetail();
                sad.setAudit(sa);
                sad.setInventory(inventories.get(i % inventories.size()));
                sad.setSystemQuantity(100 + i);
                sad.setActualQuantity(100 + i - (i % 3));
                sad.setDiscrepancy(-(i % 3));
                sad.setNote("Kiểm kê thực tế");
                sa.getDetails().add(sad);
                
                stockAuditRepository.save(sa);
            }
        }
        log.info("Đã seed xong 25 StockAudit.");

        // 16. Seed InventoryTransaction (Lịch sử giao dịch kho) - 30 bản ghi (>= 20 rows)
        if (inventoryTransactionRepository.count() == 0) {
            for (int i = 1; i <= 30; i++) {
                InventoryTransaction t = new InventoryTransaction();
                t.setTransactionTime(LocalDateTime.now().minusDays(30 - i).plusHours(8));
                
                InventoryTransaction.TransactionType type;
                String ref;
                int qtyChange;
                if (i % 4 == 0) {
                    type = InventoryTransaction.TransactionType.IMPORT;
                    ref = "GR" + String.format("%03d", (i % 25) + 1);
                    qtyChange = 100;
                } else if (i % 4 == 1) {
                    type = InventoryTransaction.TransactionType.SALE;
                    ref = "INV_SALE_" + i;
                    qtyChange = -5;
                } else if (i % 4 == 2) {
                    type = InventoryTransaction.TransactionType.EXPORT;
                    ref = "GI" + String.format("%03d", (i % 25) + 1);
                    qtyChange = -10;
                } else {
                    type = InventoryTransaction.TransactionType.AUDIT_ADJUST;
                    ref = "SA" + String.format("%03d", (i % 25) + 1);
                    qtyChange = -2;
                }
                
                t.setType(type);
                t.setReferenceId(ref);
                t.setInventory(inventories.get(i % inventories.size()));
                t.setQuantityChanged(qtyChange);
                t.setEndingBalance(100 + qtyChange);
                inventoryTransactionRepository.save(t);
            }
            log.info("Đã seed xong 30 InventoryTransaction.");
        }

        log.info("Hoàn tất khởi tạo dữ liệu mẫu chuẩn thực tế (DataInitializer2)!");
    }
}
