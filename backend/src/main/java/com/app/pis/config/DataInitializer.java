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

// @Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

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
        log.info("Bắt đầu khởi tạo dữ liệu mẫu hệ thống...");

        // 1. Seed Roles
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (!roleRepository.existsByRoleName(roleName)) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
                log.info("Đã khởi tạo Role: {}", roleName);
            }
        }

        // 2. Seed Employees and Accounts - 25 items per entity
        List<Employee> employees = new ArrayList<>();
        Role adminRole = roleRepository.findByRoleName(Role.RoleName.Admin)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role Admin trong Database"));
        Role salesRole = roleRepository.findByRoleName(Role.RoleName.Sales)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role Sales trong Database"));
        Role managerRole = roleRepository.findByRoleName(Role.RoleName.Product_manager)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role Product_manager trong Database"));

        for (int i = 1; i <= 25; i++) {
            String empId = "EMP" + String.format("%03d", i);
            Employee emp;
            if (!employeeRepository.existsById(empId)) {
                emp = new Employee();
                emp.setEmployeeID(empId);
                if (i == 1) {
                    emp.setFullName("System Administrator");
                    emp.setPhoneNumber("0123456789");
                    emp.setEmail("admin@example.com");
                    emp.setGender(Employee.Gender.Male);
                    emp.setYearOfBirth(1990);
                } else if (i == 2) {
                    emp.setFullName("Nguyễn Thị Bán Hàng");
                    emp.setPhoneNumber("0987654321");
                    emp.setEmail("sales@example.com");
                    emp.setGender(Employee.Gender.Female);
                    emp.setYearOfBirth(1995);
                } else if (i == 3) {
                    emp.setFullName("Trần Văn Thủ Kho");
                    emp.setPhoneNumber("0911223344");
                    emp.setEmail("manager@example.com");
                    emp.setGender(Employee.Gender.Male);
                    emp.setYearOfBirth(1988);
                } else {
                    emp.setFullName("Nhân viên " + i);
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

        // 4. Seed Catalog (Danh mục nhóm thuốc) - 26 bản ghi
        List<String> catalogNames = List.of(
            "Thuốc kháng sinh", "Thuốc giảm đau", "Thuốc kháng viêm", "Thuốc nhỏ mắt", "Vitamin & Khoáng chất",
            "Thuốc tiêu hóa", "Thuốc tim mạch", "Thuốc tiểu đường", "Thuốc dị ứng", "Thuốc ho & cảm cúm",
            "Dược mỹ phẩm", "Thuốc bôi da", "Thuốc trị nấm", "Thực phẩm chức năng", "Thiết bị y tế",
            "Thuốc nhỏ mũi", "Thuốc thần kinh", "Thuốc bổ não", "Thuốc xương khớp", "Sữa công thức",
            "Thuốc hạ sốt", "Dầu gió & cao xoa", "Thuốc bổ gan", "Thuốc hô hấp", "Dược liệu & Thảo dược", "Thiết bị bảo hộ"
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

        // 5. Seed Unit (Đơn vị tính) - 26 bản ghi
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

        // 6. Seed Origin (Nước sản xuất) - 26 bản ghi
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

        // 7. Seed Supplier (Nhà cung cấp) - 27 bản ghi
        List<String> supplierNames = List.of(
            "TỒN KHO KHỞI TẠO",
            "Dược Phẩm Trung Ương 1", "Dược Hậu Giang (DHG)", "Traphaco", "Imexpharm", "Pharmedic",
            "OPC Pharmaceutical", "Domesco", "Dược Hà Tây", "Dược Phẩm OPC", "Dược Sanofi",
            "Dược Bến Tre", "Dược Lâm Đồng", "Dược Cửu Long", "Dược Phẩm Boston", "Dược Phẩm Nam Hà",
            "Dược Phẩm Khánh Hòa", "Dược Phẩm Hà Bắc", "Dược Phẩm Vĩnh Phúc", "Dược Phẩm Trà Vinh", "Dược Phẩm Tiền Giang",
            "Dược Phẩm Yên Bái", "Dược Phẩm Ninh Bình", "Dược Phẩm Bình Định", "Dược Phẩm Cần Thơ", "Dược Phẩm Danapha", "Dược Phẩm Mekophar"
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

        // 8. Seed Customer (Khách hàng) - 26 bản ghi
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

        // 9. Seed Medicine - 30 bản ghi
        List<Medicine> medicines = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            String id = "MED" + String.format("%03d", i + 1);
            if (!medicineRepository.existsById(id)) {
                Medicine m = new Medicine();
                m.setMedicineID(id);
                m.setMedicineName("Thuốc " + (char)('A' + (i % 26)) + (i >= 26 ? String.valueOf(i / 26) : ""));
                m.setImage("https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80");
                m.setIngredients("Thành phần hoạt chất chính của " + m.getMedicineName() + " và tá dược vừa đủ");
                
                m.setCatalog(catalogs.get(i % catalogs.size()));
                m.setOrigin(origins.get(i % origins.size()));

                String baseUnitId = "UNIT001"; // Viên
                double basePrice = 500.0 + (i % 10) * 500.0;
                
                // Let's vary the base unit randomly among basic units
                int unitIdx = i % 5;
                if (unitIdx == 1) {
                    baseUnitId = "UNIT006"; // Gói
                    basePrice = 2000.0 + (i % 5) * 500.0;
                } else if (unitIdx == 2) {
                    baseUnitId = "UNIT003"; // Chai
                    basePrice = 15000.0 + (i % 5) * 2000.0;
                } else if (unitIdx == 3) {
                    baseUnitId = "UNIT005"; // Tuýp
                    basePrice = 10000.0 + (i % 5) * 1500.0;
                } else if (unitIdx == 4) {
                    baseUnitId = "UNIT007"; // Ống
                    basePrice = 4000.0 + (i % 5) * 1000.0;
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

        // 10. Seed MedicineUnit (Quy đổi đơn vị phụ cho TẤT CẢ 30 thuốc)
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

        // 11. Seed Inventory (Lô kho) - 30 bản ghi
        List<Inventory> inventories = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            String invId = "INV" + String.format("%03d", i + 1);
            if (!inventoryRepository.existsById(invId)) {
                Inventory inv = new Inventory();
                inv.setId(invId);
                inv.setBatchId("BATCH" + String.format("%03d", i + 1));
                inv.setMedicine(medicines.get(i % medicines.size()));
                BigDecimal medPrice = inv.getMedicine().getUnitPrice();
                inv.setImportPrice(medPrice.multiply(BigDecimal.valueOf(0.8)));
                inv.setStockQuantity(100 + i * 50);
                if (i % 10 == 2) { inv.setExpiryDate(LocalDate.now().minusMonths(1)); inv.setManufacturedDate(LocalDate.now().minusMonths(13)); }
                else if (i % 10 == 5) { inv.setExpiryDate(LocalDate.now().plusDays(15)); inv.setManufacturedDate(LocalDate.now().minusDays(350)); }
                else { inv.setExpiryDate(LocalDate.now().plusYears(1 + i % 2)); inv.setManufacturedDate(LocalDate.now().minusMonths(6)); }
                if (i % 10 == 4) { inv.setStatus(Inventory.InventoryStatus.SOLD_OUT); inv.setStockQuantity(0); }
                else if (i % 10 == 8) { inv.setStatus(Inventory.InventoryStatus.DISPOSED); }
                else { inv.setStatus(Inventory.InventoryStatus.ACTIVE); }
                inventories.add(inventoryRepository.save(inv));
            } else {
                inventories.add(inventoryRepository.findById(invId).orElse(null));
            }
        }
        log.info("Đã seed xong {} Inventory (Lô kho).", inventories.size());

        // 12. Seed GoodsReceipt (Phiếu nhập kho) - 25 bản ghi
        for (int i = 1; i <= 25; i++) {
            String receiptId = "GR" + String.format("%03d", i);
            if (!goodsReceiptRepository.existsById(receiptId)) {
                GoodsReceipt gr = new GoodsReceipt();
                gr.setReceiptId(receiptId);
                gr.setReceiptTime(LocalDateTime.now().minusDays(30 - i));
                gr.setEmployee(employees.get(i % employees.size()));
                gr.setSupplier(suppliers.get(i % suppliers.size()));
                gr.setStatus(i % 5 == 0 ? GoodsReceipt.ReceiptStatus.DRAFT : GoodsReceipt.ReceiptStatus.CONFIRMED);
                gr.setNote("Nhập hàng đợt " + i);
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

        // 13. Seed GoodsIssue (Phiếu xuất kho) - 25 bản ghi
        for (int i = 1; i <= 25; i++) {
            String issueId = "GI" + String.format("%03d", i);
            if (!goodsIssueRepository.existsById(issueId)) {
                GoodsIssue gi = new GoodsIssue();
                gi.setIssueId(issueId);
                gi.setIssueTime(LocalDateTime.now().minusDays(30 - i).plusHours(2));
                gi.setEmployee(employees.get((i + 1) % employees.size()));
                gi.setIssueType(i % 4 == 0 ? GoodsIssue.IssueType.EXPIRED : GoodsIssue.IssueType.SALE);
                gi.setStatus(i % 5 == 0 ? GoodsIssue.IssueStatus.DRAFT : GoodsIssue.IssueStatus.CONFIRMED);
                gi.setNote("Xuất kho đợt " + i);
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

        // 14. Seed Invoice & InvoiceDetail (Hóa đơn bán hàng) - 25 bản ghi
        if (invoiceRepository.count() == 0) {
            for (int i = 1; i <= 25; i++) {
                Invoice inv = new Invoice();
                inv.setInvoiceTime(LocalDateTime.now().minusDays(30 - i).plusHours(4));
                inv.setCustomer(customers.get(i % customers.size()));
                inv.setAddress(i + " Đường Trần Phú, Hà Nội");
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

        // 15. Seed StockAudit (Phiếu kiểm kê kho) - 25 bản ghi
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
                sa.setNote("Kiểm kê định kỳ đợt " + i);
                StockAuditDetail sad = new StockAuditDetail();
                sad.setAudit(sa);
                sad.setInventory(inventories.get(i % inventories.size()));
                sad.setSystemQuantity(100 + i);
                sad.setActualQuantity(100 + i - (i % 3));
                sad.setDiscrepancy(-(i % 3));
                sad.setNote("Kiểm kê khớp");
                sa.getDetails().add(sad);
                stockAuditRepository.save(sa);
            }
        }
        log.info("Đã seed xong 25 StockAudit.");

        // 16. Seed InventoryTransaction (Lịch sử giao dịch kho) - 30 bản ghi
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

        log.info("Hoàn tất khởi tạo dữ liệu mẫu!");
    }
}
