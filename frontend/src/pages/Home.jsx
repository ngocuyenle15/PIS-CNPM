import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SearchableSelect from '../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const printContent = (title, htmlContent) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('Vui lòng cho phép mở popup để in phiếu!');
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Inter', sans-serif, Arial;
            padding: 20px;
            color: #333;
          }
          h2 {
            text-transform: uppercase;
            text-align: center;
            margin-bottom: 20px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            font-size: 14px;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 10px;
            text-align: left;
            font-size: 13px;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 600;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

const mockCustomers = [
  {
    customerID: 'KH-ANH-091',
    fullName: 'Nguyễn Văn Anh',
    phoneNumber: '0912345678',
    gender: 'Male',
    joinDate: '2026-05-01'
  },
  {
    customerID: 'KH-BINH-098',
    fullName: 'Trần Thị Bình',
    phoneNumber: '0987654321',
    gender: 'Female',
    joinDate: '2026-05-15'
  },
  {
    customerID: 'KH-CHI-090',
    fullName: 'Lê Hoàng Chi',
    phoneNumber: '0909998887',
    gender: 'Female',
    joinDate: '2026-05-20'
  }
];

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Role';

  // 1. STATE QUẢN LÝ SIDEBAR ĐA CẤP
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'overview';
  });

  const [expandedMenus, setExpandedMenus] = useState(() => {
    try {
      const saved = localStorage.getItem('expandedMenus');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Lỗi phân tích cú pháp expandedMenus:', e);
    }

    const initialTab = localStorage.getItem('activeTab') || 'overview';
    const isKho = ['warehouse_inventory', 'warehouse_receipt', 'warehouse_issue', 'warehouse_audit', 'warehouse_history', 'warehouse_supplier'].includes(initialTab);
    const isBanHang = ['sales_pos', 'sales_invoices', 'sales_customers'].includes(initialTab);
    const isHeThong = ['sys_employees', 'sys_accounts'].includes(initialTab);

    return {
      thuoc: !isKho && !isBanHang && !isHeThong,
      kho: isKho,
      banHang: isBanHang,
      heThong: isHeThong
    };
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('expandedMenus', JSON.stringify(expandedMenus));
  }, [expandedMenus]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => {
      const nextState = {
        thuoc: false,
        kho: false,
        banHang: false,
        heThong: false
      };
      nextState[menuKey] = !prev[menuKey];
      return nextState;
    });
  };

  // 2. STATE TÌM KIẾM CHO CÁC PHÂN HỆ
  const [searchMedicine, setSearchMedicine] = useState('');
  const [searchCatalog, setSearchCatalog] = useState('');
  const [searchUnit, setSearchUnit] = useState('');
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchField, setSearchField] = useState('medicineName');

  // States
  const [catalogsList, setCatalogsList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [originsList, setOriginsList] = useState([]);

  const [paginatedCatalogs, setPaginatedCatalogs] = useState([]);
  const [paginatedUnits, setPaginatedUnits] = useState([]);
  const [paginatedOrigins, setPaginatedOrigins] = useState([]);

  const [medicinesList, setMedicinesList] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // States phân trang danh sách thuốc
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // States phân trang danh mục
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1);
  const [catalogTotalPages, setCatalogTotalPages] = useState(1);
  const [catalogTotalItems, setCatalogTotalItems] = useState(0);

  // States phân trang đơn vị tính
  const [unitCurrentPage, setUnitCurrentPage] = useState(1);
  const [unitTotalPages, setUnitTotalPages] = useState(1);
  const [unitTotalItems, setUnitTotalItems] = useState(0);

  // States phân trang nước sản xuất
  const [originCurrentPage, setOriginCurrentPage] = useState(1);
  const [originTotalPages, setOriginTotalPages] = useState(1);
  const [originTotalItems, setOriginTotalItems] = useState(0);

  // States for Supplier Management
  const [suppliersList, setSuppliersList] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState('');
  const [tempSearchSupplier, setTempSearchSupplier] = useState('');
  const [supplierFormMode, setSupplierFormMode] = useState('add'); // 'add' or 'edit'
  const [supplierForm, setSupplierForm] = useState({ supplierID: '', supplierName: '', phoneNumber: '', address: '' });
  const [supplierCurrentPage, setSupplierCurrentPage] = useState(1);

  // States for Employee Management
  const [employeesList, setEmployeesList] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [employeeFormMode, setEmployeeFormMode] = useState(null); // null, 'add' or 'edit'
  const [employeeForm, setEmployeeForm] = useState({
    employeeID: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    gender: 'Male',
    yearOfBirth: new Date().getFullYear() - 25,
    hireDate: new Date().toISOString().split('T')[0],
    username: '',
    roleName: 'Sales',
    isStaff: true,
    isActive: true
  });
  const [employeeCurrentPage, setEmployeeCurrentPage] = useState(1);

  // States for Account Management
  const [accountsList, setAccountsList] = useState([]);
  const [searchAccount, setSearchAccount] = useState('');
  const [accountFormMode, setAccountFormMode] = useState('edit'); // 'edit'
  const [accountForm, setAccountForm] = useState({
    accountID: '',
    username: '',
    roleName: 'Sales',
    employeeID: '',
    isStaff: true,
    isActive: true,
    password: ''
  });
  const [accountCurrentPage, setAccountCurrentPage] = useState(1);

  // ==========================================
  // STATES CHO PHÂN HỆ QUẢN LÝ KHO & POS BÁN LẺ
  // ==========================================
  const [inventoriesList, setInventoriesList] = useState([]);
  const [searchInventory, setSearchInventory] = useState('');
  const [filterInventoryType, setFilterInventoryType] = useState('ALL'); // 'ALL', 'LOW_STOCK', 'NEAR_EXPIRY', 'EXPIRED'
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterCatalog, setFilterCatalog] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterMinStock, setFilterMinStock] = useState('');
  const [filterMaxStock, setFilterMaxStock] = useState('');
  const [filterStartExpiry, setFilterStartExpiry] = useState('');
  const [filterEndExpiry, setFilterEndExpiry] = useState('');

  // Active Committed States for Inventory
  const [activeSearchInventory, setActiveSearchInventory] = useState('');
  const [activeFilterCatalog, setActiveFilterCatalog] = useState('');
  const [activeFilterOrigin, setActiveFilterOrigin] = useState('');
  const [activeFilterMinStock, setActiveFilterMinStock] = useState('');
  const [activeFilterMaxStock, setActiveFilterMaxStock] = useState('');
  const [activeFilterStartExpiry, setActiveFilterStartExpiry] = useState('');
  const [activeFilterEndExpiry, setActiveFilterEndExpiry] = useState('');
  const [inventoryCurrentPage, setInventoryCurrentPage] = useState(1);
  const [inventoryTotalPages, setInventoryTotalPages] = useState(1);
  const [inventoryTotalItems, setInventoryTotalItems] = useState(0);

  const [receiptsList, setReceiptsList] = useState([]);
  const [receiptCurrentPage, setReceiptCurrentPage] = useState(1);
  const [receiptTotalPages, setReceiptTotalPages] = useState(1);
  const [receiptTotalItems, setReceiptTotalItems] = useState(0);
  const [receiptForm, setReceiptForm] = useState({ supplierId: '', note: '', details: [] });
  const [receiptFormMode, setReceiptFormMode] = useState(null); // null, 'add', 'view'
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchReceipt, setSearchReceipt] = useState(''); // Legacy - kept for safety
  const [receiptSearchType, setReceiptSearchType] = useState('receiptId');
  const [receiptSearchVal, setReceiptSearchVal] = useState('');
  const [filterReceiptStart, setFilterReceiptStart] = useState('');
  const [filterReceiptEnd, setFilterReceiptEnd] = useState('');
  const [filterReceiptStatus, setFilterReceiptStatus] = useState('DRAFT');

  const [issuesList, setIssuesList] = useState([]);
  const [issueCurrentPage, setIssueCurrentPage] = useState(1);
  const [issueTotalPages, setIssueTotalPages] = useState(1);
  const [issueTotalItems, setIssueTotalItems] = useState(0);
  const [issueForm, setIssueForm] = useState({ issueType: 'EXPIRED', note: '', details: [] });
  const [issueFormMode, setIssueFormMode] = useState(null); // null, 'add', 'view'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchIssue, setSearchIssue] = useState(''); // Legacy
  const [issueSearchType, setIssueSearchType] = useState('issueId');
  const [issueSearchVal, setIssueSearchVal] = useState('');
  const [filterIssueStart, setFilterIssueStart] = useState('');
  const [filterIssueEnd, setFilterIssueEnd] = useState('');
  const [filterIssueStatus, setFilterIssueStatus] = useState('DRAFT');

  const [auditsList, setAuditsList] = useState([]);
  const [auditCurrentPage, setAuditCurrentPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditTotalItems, setAuditTotalItems] = useState(0);
  const [auditForm, setAuditForm] = useState({ note: '', details: [] });
  const [auditFormMode, setAuditFormMode] = useState(null); // null, 'add', 'view', 'edit'
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [searchAudit, setSearchAudit] = useState(''); // Legacy
  const [auditSearchType, setAuditSearchType] = useState('auditId');
  const [auditSearchVal, setAuditSearchVal] = useState('');
  const [filterAuditStart, setFilterAuditStart] = useState('');
  const [filterAuditEnd, setFilterAuditEnd] = useState('');
  const [filterAuditStatus, setFilterAuditStatus] = useState('IN_PROGRESS');

  const [historyTransactions, setHistoryTransactions] = useState([]);
  const [selectedMedicineForHistory, setSelectedMedicineForHistory] = useState('');
  const [activeHistoryTab, setActiveHistoryTab] = useState('DOCUMENTS'); // 'DOCUMENTS', 'STOCK_CARD'
  const [stockCardCurrentPage, setStockCardCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null); // { type: 'receipt' | 'issue', id: string }

  // Stock Card Search States
  const [stockCardSearchType, setStockCardSearchType] = useState('time');
  const [stockCardSearchVal, setStockCardSearchVal] = useState('');
  const [filterStockCardStart, setFilterStockCardStart] = useState('');
  const [filterStockCardEnd, setFilterStockCardEnd] = useState('');

  // Active Committed States for Stock Card
  const [activeStockCardSearchType, setActiveStockCardSearchType] = useState('time');
  const [activeStockCardSearchVal, setActiveStockCardSearchVal] = useState('');
  const [activeFilterStockCardStart, setActiveFilterStockCardStart] = useState('');
  const [activeFilterStockCardEnd, setActiveFilterStockCardEnd] = useState('');

  // POS States
  const [posCart, setPosCart] = useState([]);
  const [posSearchKeyword, setPosSearchKeyword] = useState('');
  const [posFilteredInventory, setPosFilteredInventory] = useState([]);
  const [posSelectedCustomer, setPosSelectedCustomer] = useState(null);
  const [posPaymentMethod, setPosPaymentMethod] = useState('Cash');
  const [posAddress, setPosAddress] = useState('');
  const [showPosCheckoutModal, setShowPosCheckoutModal] = useState(false);
  const [posCashGiven, setPosCashGiven] = useState('');


  // Invoices States
  const [invoicesList, setInvoicesList] = useState([]);
  const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1);
  const [invoiceTotalPages, setInvoiceTotalPages] = useState(1);
  const [invoiceTotalItems, setInvoiceTotalItems] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceSearchVal, setInvoiceSearchVal] = useState('');
  const [activeInvoiceSearchVal, setActiveInvoiceSearchVal] = useState('');

  // Simulated Thermal Receipt States
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [invoiceReceiptData, setInvoiceReceiptData] = useState(null);

  // Dashboard States
  const [dashboardStats, setDashboardStats] = useState({
    totalMedicines: 0,
    nearExpiryCount: 0,
    expiredCount: 0,
    lowStockCount: 0
  });
  const [recentOperations, setRecentOperations] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [dashboardTrendData, setDashboardTrendData] = useState([]);
  const [dashboardCategoryData, setDashboardCategoryData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Decoupled full dropdown lists
  const [allMedicines, setAllMedicines] = useState([]);
  const [allInventories, setAllInventories] = useState([]);

  // ==========================================
  // API INTEGRATION FETCH FUNCTIONS
  // ==========================================
  const fetchInventory = async (
    page = 1,
    search = null,
    type = null,
    catalog = null,
    origin = null,
    minStock = null,
    maxStock = null,
    startExpiry = null,
    endExpiry = null
  ) => {
    try {
      const actualSearch = search !== null ? search : (activeTab === 'warehouse_inventory' ? activeSearchInventory : '');
      const actualType = type !== null ? type : (activeTab === 'warehouse_inventory' ? filterInventoryType : 'ALL');
      const actualCatalog = catalog !== null ? catalog : (activeTab === 'warehouse_inventory' ? activeFilterCatalog : '');
      const actualOrigin = origin !== null ? origin : (activeTab === 'warehouse_inventory' ? activeFilterOrigin : '');
      const actualMinStock = minStock !== null ? minStock : (activeTab === 'warehouse_inventory' ? activeFilterMinStock : '');
      const actualMaxStock = maxStock !== null ? maxStock : (activeTab === 'warehouse_inventory' ? activeFilterMaxStock : '');
      const actualStartExpiry = startExpiry !== null ? startExpiry : (activeTab === 'warehouse_inventory' ? activeFilterStartExpiry : '');
      const actualEndExpiry = endExpiry !== null ? endExpiry : (activeTab === 'warehouse_inventory' ? activeFilterEndExpiry : '');

      const res = await api.get('/inventory', {
        params: {
          page: page - 1,
          size: 10,
          search: actualSearch || undefined,
          type: actualType !== 'ALL' ? actualType : undefined,
          catalogId: actualCatalog || undefined,
          originId: actualOrigin || undefined,
          minStock: actualMinStock !== '' ? Number(actualMinStock) : undefined,
          maxStock: actualMaxStock !== '' ? Number(actualMaxStock) : undefined,
          startExpiry: actualStartExpiry || undefined,
          endExpiry: actualEndExpiry || undefined
        }
      });
      const paged = res.data?.data || {};
      setInventoriesList(paged.items || []);
      setInventoryTotalPages(paged.totalPages || 1);
      setInventoryTotalItems(paged.totalItems || 0);
      setInventoryCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải tồn kho:', error);
    }
  };

  const fetchReceipts = async (
    page = 1,
    searchType = null,
    searchVal = null,
    startDate = null,
    endDate = null,
    status = null
  ) => {
    try {
      const actualSearchType = searchType !== null ? searchType : (activeTab === 'warehouse_receipt' ? receiptSearchType : '');
      const actualSearchVal = searchVal !== null ? searchVal : (activeTab === 'warehouse_receipt' ? receiptSearchVal : '');
      const actualStartDate = startDate !== null ? startDate : (activeTab === 'warehouse_receipt' ? filterReceiptStart : '');
      const actualEndDate = endDate !== null ? endDate : (activeTab === 'warehouse_receipt' ? filterReceiptEnd : '');
      const actualStatus = status !== null ? status : (activeTab === 'warehouse_receipt' ? filterReceiptStatus : 'DRAFT');

      const res = await api.get('/goods-receipts', {
        params: {
          page: page - 1,
          size: 10,
          searchType: actualSearchType || undefined,
          searchVal: actualSearchVal || undefined,
          startDate: actualStartDate || undefined,
          endDate: actualEndDate || undefined,
          status: actualStatus !== 'ALL' ? actualStatus : undefined
        }
      });
      const paged = res.data?.data || {};
      setReceiptsList(paged.items || []);
      setReceiptTotalPages(paged.totalPages || 1);
      setReceiptTotalItems(paged.totalItems || 0);
      setReceiptCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải phiếu nhập:', error);
    }
  };

  const fetchIssues = async (
    page = 1,
    searchType = null,
    searchVal = null,
    startDate = null,
    endDate = null,
    status = null
  ) => {
    try {
      const actualSearchType = searchType !== null ? searchType : (activeTab === 'warehouse_issue' ? issueSearchType : '');
      const actualSearchVal = searchVal !== null ? searchVal : (activeTab === 'warehouse_issue' ? issueSearchVal : '');
      const actualStartDate = startDate !== null ? startDate : (activeTab === 'warehouse_issue' ? filterIssueStart : '');
      const actualEndDate = endDate !== null ? endDate : (activeTab === 'warehouse_issue' ? filterIssueEnd : '');
      const actualStatus = status !== null ? status : (activeTab === 'warehouse_issue' ? filterIssueStatus : 'DRAFT');

      const res = await api.get('/goods-issues', {
        params: {
          page: page - 1,
          size: 10,
          searchType: actualSearchType || undefined,
          searchVal: actualSearchVal || undefined,
          startDate: actualStartDate || undefined,
          endDate: actualEndDate || undefined,
          status: actualStatus !== 'ALL' ? actualStatus : undefined
        }
      });
      const paged = res.data?.data || {};
      setIssuesList(paged.items || []);
      setIssueTotalPages(paged.totalPages || 1);
      setIssueTotalItems(paged.totalItems || 0);
      setIssueCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải phiếu xuất:', error);
    }
  };

  const handlePrintReceipt = () => {
    if (!selectedReceipt) return;
    const detailsRows = selectedReceipt.details?.map((d, i) => `
      <tr>
        <td style="text-align: center;">#${i + 1}</td>
        <td style="font-weight: bold;">${d.medicineName}</td>
        <td>${d.batchId || '---'}</td>
        <td>${d.manufacturedDate || '---'}</td>
        <td>${d.expiryDate || '---'}</td>
        <td>${d.quantity}</td>
        <td>x${d.conversionRate}</td>
        <td style="text-align: right;">${d.importPrice ? d.importPrice.toLocaleString() + 'đ' : '---'}</td>
      </tr>
    `).join('') || '';

    const htmlContent = `
      <h2>Phiếu Nhập Kho</h2>
      <div class="info-grid">
        <div class="info-item"><strong>Mã phiếu:</strong> ${selectedReceipt.receiptId}</div>
        <div class="info-item"><strong>Nhà cung cấp:</strong> ${selectedReceipt.supplierName}</div>
        <div class="info-item"><strong>Người lập:</strong> ${selectedReceipt.employeeName}</div>
        <div class="info-item"><strong>Thời gian:</strong> ${selectedReceipt.receiptTime ? new Date(selectedReceipt.receiptTime).toLocaleString('vi-VN') : '---'}</div>
        <div class="info-item"><strong>Trạng thái:</strong> ${selectedReceipt.status}</div>
        <div class="info-item" style="grid-column: span 2;"><strong>Ghi chú:</strong> ${selectedReceipt.note || '(Không có)'}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 50px;">STT</th>
            <th>Tên thuốc</th>
            <th>Mã lô</th>
            <th>NSX</th>
            <th>HSD</th>
            <th>SL</th>
            <th>Quy đổi</th>
            <th style="text-align: right;">Đơn giá nhập</th>
          </tr>
        </thead>
        <tbody>
          ${detailsRows}
        </tbody>
      </table>
    `;

    printContent(`Phiếu Nhập - ${selectedReceipt.receiptId}`, htmlContent);
  };

  const handlePrintIssue = () => {
    if (!selectedIssue) return;
    const detailsRows = selectedIssue.details?.map((d, i) => `
      <tr>
        <td style="text-align: center;">#${i + 1}</td>
        <td style="font-weight: bold;">${d.medicineName}</td>
        <td>${d.batchId || '---'}</td>
        <td>${d.quantity}</td>
        <td>x${d.conversionRate}</td>
      </tr>
    `).join('') || '';

    const htmlContent = `
      <h2>Phiếu Xuất Kho</h2>
      <div class="info-grid">
        <div class="info-item"><strong>Mã phiếu:</strong> ${selectedIssue.issueId}</div>
        <div class="info-item"><strong>Lý do xuất:</strong> ${selectedIssue.issueType}</div>
        <div class="info-item"><strong>Người lập:</strong> ${selectedIssue.employeeName}</div>
        <div class="info-item"><strong>Thời gian:</strong> ${selectedIssue.issueTime ? new Date(selectedIssue.issueTime).toLocaleString('vi-VN') : '---'}</div>
        <div class="info-item"><strong>Trạng thái:</strong> ${selectedIssue.status}</div>
        <div class="info-item" style="grid-column: span 2;"><strong>Ghi chú:</strong> ${selectedIssue.note || '(Không có)'}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 50px;">STT</th>
            <th>Tên thuốc</th>
            <th>Mã lô</th>
            <th>Số lượng xuất</th>
            <th>Quy đổi</th>
          </tr>
        </thead>
        <tbody>
          ${detailsRows}
        </tbody>
      </table>
    `;

    printContent(`Phiếu Xuất - ${selectedIssue.issueId}`, htmlContent);
  };

  const handlePrintAudit = (auditItem) => {
    const auditToPrint = auditItem || selectedAudit;
    if (!auditToPrint) return;
    const detailsRows = auditToPrint.details?.map((d, i) => `
      <tr>
        <td style="text-align: center;">#${i + 1}</td>
        <td style="font-weight: bold;">${d.medicineName}</td>
        <td>${d.batchId || '---'}</td>
        <td style="text-align: center;">${d.systemQuantity}</td>
        <td style="text-align: center;">${d.unitName || '---'}</td>
        <td style="text-align: center;">${d.actualQuantity !== null && d.actualQuantity !== undefined ? d.actualQuantity : '___'}</td>
        <td style="text-align: right;">${d.discrepancy !== null && d.discrepancy !== undefined ? (d.discrepancy > 0 ? `+${d.discrepancy}` : d.discrepancy) : '___'}</td>
      </tr>
    `).join('') || '';

    const htmlContent = `
      <h2>Phiếu Kiểm Kê Kho</h2>
      <div class="info-grid">
        <div class="info-item"><strong>Mã phiếu kiểm:</strong> ${auditToPrint.auditId}</div>
        <div class="info-item"><strong>Người lập:</strong> ${auditToPrint.createdByName}</div>
        <div class="info-item"><strong>Thời gian:</strong> ${auditToPrint.auditTime ? new Date(auditToPrint.auditTime).toLocaleString('vi-VN') : '---'}</div>
        <div class="info-item"><strong>Trạng thái:</strong> ${auditToPrint.status === 'CONFIRMED' ? 'Đã hoàn thành' : (auditToPrint.status === 'CANCELLED' ? 'Đã hủy' : 'Đang kiểm kê')}</div>
        <div class="info-item" style="grid-column: span 2;"><strong>Ghi chú:</strong> ${auditToPrint.note || '(Không có)'}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 50px;">STT</th>
            <th>Tên thuốc</th>
            <th>Mã lô</th>
            <th style="text-align: center;">Sổ sách</th>
            <th style="text-align: center;">Đơn vị</th>
            <th style="text-align: center;">Thực đếm</th>
            <th style="text-align: right;">Chênh lệch</th>
          </tr>
        </thead>
        <tbody>
          ${detailsRows}
        </tbody>
      </table>
    `;

    printContent(`Phiếu Kiểm Kê - ${auditToPrint.auditId}`, htmlContent);
  };

  const fetchAudits = async (
    page = 1,
    searchType = null,
    searchVal = null,
    startDate = null,
    endDate = null,
    status = null
  ) => {
    try {
      const actualSearchType = searchType !== null ? searchType : (activeTab === 'warehouse_audit' ? auditSearchType : '');
      const actualSearchVal = searchVal !== null ? searchVal : (activeTab === 'warehouse_audit' ? auditSearchVal : '');
      const actualStartDate = startDate !== null ? startDate : (activeTab === 'warehouse_audit' ? filterAuditStart : '');
      const actualEndDate = endDate !== null ? endDate : (activeTab === 'warehouse_audit' ? filterAuditEnd : '');
      const actualStatus = status !== null ? status : (activeTab === 'warehouse_audit' ? filterAuditStatus : 'IN_PROGRESS');

      const res = await api.get('/stock-audits', {
        params: {
          page: page - 1,
          size: 10,
          searchType: actualSearchType || undefined,
          searchVal: actualSearchVal || undefined,
          startDate: actualStartDate || undefined,
          endDate: actualEndDate || undefined,
          status: actualStatus !== 'ALL' ? actualStatus : undefined
        }
      });
      const paged = res.data?.data || {};
      setAuditsList(paged.items || []);
      setAuditTotalPages(paged.totalPages || 1);
      setAuditTotalItems(paged.totalItems || 0);
      setAuditCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải phiếu kiểm kê:', error);
    }
  };

  const fetchInvoices = async (page = 1, search = null) => {
    try {
      const actualSearch = search !== null ? search : (activeTab === 'sales_invoices' ? activeInvoiceSearchVal : '');
      const res = await api.get('/invoices', {
        params: {
          page: page - 1,
          size: 10,
          search: actualSearch || undefined
        }
      });
      const paged = res.data?.data || {};
      setInvoicesList(paged.items || []);
      setInvoiceTotalPages(paged.totalPages || 1);
      setInvoiceTotalItems(paged.totalItems || 0);
      setInvoiceCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải hóa đơn:', error);
    }
  };

  const fetchHistoryTransactions = async (medicineId = '') => {
    try {
      const res = await api.get('/inventory/transactions', {
        params: { medicineId: medicineId || undefined }
      });
      setHistoryTransactions(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi tải lịch sử thẻ kho:', error);
    }
  };

  const fetchAllMedicines = async () => {
    try {
      const res = await api.get('/medicines', {
        params: { page: 0, size: 1000 }
      });
      setAllMedicines(res.data?.data?.items || []);
    } catch (error) {
      console.error('Lỗi tải danh sách tất cả thuốc:', error);
    }
  };

  const fetchAllInventories = async () => {
    try {
      const res = await api.get('/inventory', {
        params: { page: 0, size: 1000 }
      });
      setAllInventories(res.data?.data?.items || []);
    } catch (error) {
      console.error('Lỗi tải danh sách tất cả tồn kho:', error);
    }
  };

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      // 1. Lấy tổng số liệu thống kê (size = 1 để tối giản payload)
      const [
        medsRes,
        nearExpiryRes,
        expiredRes,
        lowStockRes,
        receiptsRes,
        issuesRes,
        auditsRes,
        criticalExpiredRes,
        criticalLowStockRes,
        allMedsRes
      ] = await Promise.all([
        api.get('/medicines', { params: { page: 0, size: 1 } }),
        api.get('/inventory', { params: { type: 'NEAR_EXPIRY', page: 0, size: 1 } }),
        api.get('/inventory', { params: { type: 'EXPIRED', page: 0, size: 1 } }),
        api.get('/inventory', { params: { type: 'LOW_STOCK', page: 0, size: 1 } }),
        api.get('/goods-receipts', { params: { page: 0, size: 10 } }),
        api.get('/goods-issues', { params: { page: 0, size: 10 } }),
        api.get('/stock-audits', { params: { page: 0, size: 10 } }),
        api.get('/inventory', { params: { type: 'EXPIRED', page: 0, size: 5 } }),
        api.get('/inventory', { params: { type: 'LOW_STOCK', page: 0, size: 5 } }),
        api.get('/medicines', { params: { page: 0, size: 100 } })
      ]);

      const totalMeds = medsRes.data?.data?.totalItems || 0;
      const nearExpiry = nearExpiryRes.data?.data?.totalItems || 0;
      const expired = expiredRes.data?.data?.totalItems || 0;
      const lowStock = lowStockRes.data?.data?.totalItems || 0;

      setDashboardStats({
        totalMedicines: totalMeds,
        nearExpiryCount: nearExpiry,
        expiredCount: expired,
        lowStockCount: lowStock
      });

      // 2. Chuẩn hóa và gộp nhật ký hoạt động gần đây
      const receipts = (receiptsRes.data?.data?.items || []).map(r => ({
        id: r.receiptId,
        type: 'RECEIPT',
        time: r.receiptTime,
        operator: r.employeeName || 'N/A',
        details: `Nhập kho từ ${r.supplierName || 'N/A'}`,
        status: r.status
      }));

      const issues = (issuesRes.data?.data?.items || []).map(i => ({
        id: i.issueId,
        type: 'ISSUE',
        time: i.issueTime,
        operator: i.employeeName || 'N/A',
        details: `Xuất kho (${i.issueType === 'SALE' ? 'Bán lẻ' : 'Xuất hủy'})`,
        status: i.status
      }));

      const audits = (auditsRes.data?.data?.items || []).map(a => ({
        id: a.auditId,
        type: 'AUDIT',
        time: a.auditTime,
        operator: a.createdByName || 'N/A',
        details: a.note || 'Kiểm kê kho',
        status: a.status
      }));

      const mergedOps = [...receipts, ...issues, ...audits]
        .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
        .slice(0, 5);

      setRecentOperations(mergedOps);

      // 3. Chuẩn hóa cảnh báo khẩn cấp (Hết hạn và Tồn kho thấp)
      const expiredAlerts = (criticalExpiredRes.data?.data?.items || []).map(item => ({
        id: `exp-${item.inventoryId || Math.random()}`,
        type: 'EXPIRED',
        title: item.medicineName,
        desc: `Lô ${item.batchNumber || 'N/A'} đã hết hạn từ ${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('vi-VN') : 'N/A'} (Tồn: ${item.quantity || 0})`,
        severity: 'high'
      }));

      const lowStockAlerts = (criticalLowStockRes.data?.data?.items || []).map(item => ({
        id: `low-${item.inventoryId || Math.random()}`,
        type: 'LOW_STOCK',
        title: item.medicineName,
        desc: `Tồn kho thấp: còn ${item.quantity || 0} ${item.unitName || ''} (Ngưỡng: ${item.minStock || 10})`,
        severity: 'medium'
      }));

      setCriticalAlerts([...expiredAlerts, ...lowStockAlerts]);

      // 4. Tạo dữ liệu xu hướng giao dịch kho (7 ngày qua)
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      const trendMap = {};
      last7Days.forEach(date => {
        const formattedDate = new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        trendMap[date] = { date: formattedDate, 'Nhập kho': 0, 'Xuất kho': 0 };
      });

      const allReceipts = receiptsRes.data?.data?.items || [];
      const allIssues = issuesRes.data?.data?.items || [];

      allReceipts.forEach(r => {
        if (r.receiptTime && r.status === 'CONFIRMED') {
          const dateStr = r.receiptTime.split('T')[0];
          if (trendMap[dateStr]) {
            trendMap[dateStr]['Nhập kho'] += 1;
          }
        }
      });

      allIssues.forEach(i => {
        if (i.issueTime && i.status === 'CONFIRMED') {
          const dateStr = i.issueTime.split('T')[0];
          if (trendMap[dateStr]) {
            trendMap[dateStr]['Xuất kho'] += 1;
          }
        }
      });

      const hasTransactions = allReceipts.some(r => r.status === 'CONFIRMED') || allIssues.some(i => i.status === 'CONFIRMED');
      const trendData = Object.values(trendMap);

      const finalTrendData = hasTransactions ? trendData : [
        { date: '25/05', 'Nhập kho': 4, 'Xuất kho': 2 },
        { date: '26/05', 'Nhập kho': 3, 'Xuất kho': 5 },
        { date: '27/05', 'Nhập kho': 8, 'Xuất kho': 4 },
        { date: '28/05', 'Nhập kho': 5, 'Xuất kho': 7 },
        { date: '29/05', 'Nhập kho': 9, 'Xuất kho': 3 },
        { date: '30/05', 'Nhập kho': 6, 'Xuất kho': 8 },
        { date: '31/05', 'Nhập kho': 11, 'Xuất kho': 6 },
      ];

      setDashboardTrendData(finalTrendData);

      // 5. Thống kê theo nhóm thuốc (Category Distribution)
      const allMeds = allMedsRes.data?.data?.items || [];
      const categoryCounts = {};
      allMeds.forEach(m => {
        const catName = m.catalog?.catalogName || 'Chưa phân loại';
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
      });

      let barChartData = Object.keys(categoryCounts).map(catName => ({
        name: catName,
        'Số lượng đầu thuốc': categoryCounts[catName]
      }));

      if (barChartData.length === 0) {
        barChartData = [
          { name: 'Kháng sinh', 'Số lượng đầu thuốc': 12 },
          { name: 'Giảm đau', 'Số lượng đầu thuốc': 19 },
          { name: 'Tim mạch', 'Số lượng đầu thuốc': 8 },
          { name: 'Hô hấp', 'Số lượng đầu thuốc': 15 },
          { name: 'Dị ứng', 'Số lượng đầu thuốc': 6 },
        ];
      }

      setDashboardCategoryData(barChartData);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Tải dữ liệu ban đầu từ API
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Tải dữ liệu phân trang tự động khi chuyển tab cấu hình
  useEffect(() => {
    if (activeTab === 'catalog') {
      fetchCatalogs(1);
    } else if (activeTab === 'unit') {
      fetchUnits(1);
    } else if (activeTab === 'origin') {
      fetchOrigins(1);
    } else if (activeTab === 'warehouse_supplier') {
      fetchSuppliers();
    } else if (activeTab === 'sys_employees') {
      fetchEmployees();
    } else if (activeTab === 'sys_accounts') {
      fetchAccounts();
      fetchEmployees();
    } else if (activeTab === 'warehouse_inventory') {
      setSearchInventory('');
      setFilterCatalog('');
      setFilterOrigin('');
      setFilterMinStock('');
      setFilterMaxStock('');
      setFilterStartExpiry('');
      setFilterEndExpiry('');
      setFilterInventoryType('ALL');
      setActiveSearchInventory('');
      setActiveFilterCatalog('');
      setActiveFilterOrigin('');
      setActiveFilterMinStock('');
      setActiveFilterMaxStock('');
      setActiveFilterStartExpiry('');
      setActiveFilterEndExpiry('');
      fetchInventory(1, '', 'ALL', '', '', '', '', '', '');
    } else if (activeTab === 'warehouse_receipt') {
      setFilterReceiptStatus('DRAFT');
      fetchReceipts(1, null, null, null, null, 'DRAFT');
      fetchSuppliers();
      fetchAllMedicines();
    } else if (activeTab === 'warehouse_issue') {
      setFilterIssueStatus('DRAFT');
      fetchIssues(1, null, null, null, null, 'DRAFT');
      fetchInventory(1, '', 'ALL');
      fetchAllInventories();
    } else if (activeTab === 'warehouse_audit') {
      setFilterAuditStatus('IN_PROGRESS');
      fetchAudits(1, null, null, null, null, 'IN_PROGRESS');
      fetchAllInventories();
    } else if (activeTab === 'warehouse_history') {
      fetchReceipts(1);
      fetchIssues(1);
      fetchAudits(1);
      fetchHistoryTransactions('');
    } else if (activeTab === 'sales_pos') {
      fetchInventory(1, '', 'ALL');
      fetchCustomers();
    } else if (activeTab === 'sales_customers') {
      setTempSearchCustomer('');
      setActiveSearchCustomer('');
      setCustomerCurrentPage(1);
      fetchCustomers();
    } else if (activeTab === 'sales_invoices') {
      setInvoiceSearchVal('');
      setActiveInvoiceSearchVal('');
      fetchInvoices(1, '');
    } else if (activeTab === 'overview') {
      fetchDashboardData();
    }
  }, [activeTab]);

  // Automatic debounce filters removed. Search triggers manually via Search button.



  const fetchInitialData = async () => {
    try {
      const [catalogsRes, unitsRes, originsRes, medicinesRes, allMedsRes, allInvsRes] = await Promise.all([
        api.get('/catalogs'),
        api.get('/units'),
        api.get('/origins'),
        api.get('/medicines?page=0&size=10'),
        api.get('/medicines?page=0&size=1000'),
        api.get('/inventory?page=0&size=1000')
      ]);

      const catalogsData = catalogsRes.data?.data || [];
      const unitsData = unitsRes.data?.data || [];
      const originsData = originsRes.data?.data || [];

      const pagedMedicineData = medicinesRes.data?.data || {};
      const medicinesData = pagedMedicineData.items || [];

      setCatalogsList(catalogsData);
      setUnitsList(unitsData);
      setOriginsList(originsData);
      setMedicinesList(medicinesData);
      setAllMedicines(allMedsRes.data?.data?.items || []);
      setAllInventories(allInvsRes.data?.data?.items || []);
      setTotalPages(pagedMedicineData.totalPages || 1);
      setTotalItems(pagedMedicineData.totalItems || 0);
      setCurrentPage(1);

      if (medicinesData.length > 0) {
        setSelectedMedicine(medicinesData[0]);
      } else {
        setSelectedMedicine(null);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu ban đầu:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const fetchMedicines = async (search = '', field = '', page = 1) => {
    try {
      const res = await api.get('/medicines', {
        params: {
          search: search || undefined,
          searchField: field || undefined,
          page: page - 1,
          size: 10
        }
      });
      const pagedData = res.data?.data || {};
      const items = pagedData.items || [];
      setMedicinesList(items);
      setTotalPages(pagedData.totalPages || 1);
      setTotalItems(pagedData.totalItems || 0);
      setCurrentPage(page);
      return items;
    } catch (error) {
      console.error('Lỗi tải danh sách thuốc:', error);
      return [];
    }
  };

  const fetchCatalogs = async (page = 1, search = searchCatalog) => {
    try {
      const res = await api.get('/catalogs', {
        params: {
          page: page - 1,
          size: 10,
          search: search || undefined
        }
      });
      const pagedData = res.data?.data || {};
      setPaginatedCatalogs(pagedData.items || []);
      setCatalogTotalPages(pagedData.totalPages || 1);
      setCatalogTotalItems(pagedData.totalItems || 0);
      setCatalogCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải nhóm thuốc:', error);
    }
  };

  const fetchUnits = async (page = 1, search = searchUnit) => {
    try {
      const res = await api.get('/units', {
        params: {
          page: page - 1,
          size: 10,
          search: search || undefined
        }
      });
      const pagedData = res.data?.data || {};
      setPaginatedUnits(pagedData.items || []);
      setUnitTotalPages(pagedData.totalPages || 1);
      setUnitTotalItems(pagedData.totalItems || 0);
      setUnitCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải đơn vị tính:', error);
    }
  };

  const fetchOrigins = async (page = 1, search = searchOrigin) => {
    try {
      const res = await api.get('/origins', {
        params: {
          page: page - 1,
          size: 10,
          search: search || undefined
        }
      });
      const pagedData = res.data?.data || {};
      setPaginatedOrigins(pagedData.items || []);
      setOriginTotalPages(pagedData.totalPages || 1);
      setOriginTotalItems(pagedData.totalItems || 0);
      setOriginCurrentPage(page);
    } catch (error) {
      console.error('Lỗi tải nước sản xuất:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliersList(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách nhà cung cấp:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployeesList(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách nhân viên:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccountsList(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách tài khoản:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomersList(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách khách hàng:', error);
    }
  };
  const [formMode, setFormMode] = useState(null); // null, 'add', or 'edit'
  const [formMedicine, setFormMedicine] = useState({
    medicineID: '',
    medicineName: '',
    image: '',
    ingredients: '',
    unitPrice: 0,
    baseUnit: { unitID: '', unitName: '' },
    catalog: { catalogID: '', catalogName: '' },
    origin: { originID: '', originName: '' },
    alternativeUnits: []
  });

  // States for Catalog Sidebar Form
  const [catalogFormMode, setCatalogFormMode] = useState('add'); // 'add' or 'edit'
  const [catalogForm, setCatalogForm] = useState({ catalogID: '', catalogName: '' });

  // States for Unit Sidebar Form
  const [unitFormMode, setUnitFormMode] = useState('add'); // 'add' or 'edit'
  const [unitForm, setUnitForm] = useState({ unitID: '', unitName: '' });

  // States for Origin Sidebar Form
  const [originFormMode, setOriginFormMode] = useState('add'); // 'add' or 'edit'
  const [originForm, setOriginForm] = useState({ originID: '', originName: '' });

  // States for Customer Split-Layout & Stateful Form

  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerFormMode, setCustomerFormMode] = useState(null); // null, 'add', or 'edit'
  const [customerForm, setCustomerForm] = useState({
    customerID: '',
    fullName: '',
    phoneNumber: '',
    gender: 'Male',
    joinDate: ''
  });
  const [searchCustomer, setSearchCustomer] = useState(''); // Legacy
  const [tempSearchCustomer, setTempSearchCustomer] = useState('');
  const [activeSearchCustomer, setActiveSearchCustomer] = useState('');
  const [customerCurrentPage, setCustomerCurrentPage] = useState(1);
  const [selectedInvMedicine, setSelectedInvMedicine] = useState(null);

  const handleAddNewClick = () => {
    setFormMode('add');
    setFormMedicine({
      medicineID: 'MED-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      medicineName: '',
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80',
      ingredients: '',
      unitPrice: 1000,
      baseUnit: {
        unitID: unitsList[0] ? unitsList[0].unitID : '',
        unitName: unitsList[0] ? unitsList[0].unitName : ''
      },
      catalog: {
        catalogID: catalogsList[0] ? catalogsList[0].catalogID : '',
        catalogName: catalogsList[0] ? catalogsList[0].catalogName : ''
      },
      origin: {
        originID: originsList[0] ? originsList[0].originID : '',
        originName: originsList[0] ? originsList[0].originName : ''
      },
      alternativeUnits: []
    });
    // Cuộn về đầu trang mượt mà
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = () => {
    if (!selectedMedicine) return;
    setFormMode('edit');
    setFormMedicine({
      ...selectedMedicine,
      baseUnit: { ...selectedMedicine.baseUnit },
      catalog: { ...selectedMedicine.catalog },
      origin: { ...selectedMedicine.origin },
      alternativeUnits: selectedMedicine.alternativeUnits ? selectedMedicine.alternativeUnits.map(au => ({ ...au })) : []
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formMedicine.medicineID.trim()) {
      alert('Vui lòng nhập Mã thuốc!');
      return;
    }
    if (!formMedicine.medicineName.trim()) {
      alert('Vui lòng nhập Tên thuốc!');
      return;
    }
    if (!formMedicine.ingredients.trim()) {
      alert('Vui lòng nhập Thành phần!');
      return;
    }
    if (formMedicine.unitPrice <= 0) {
      alert('Đơn giá phải lớn hơn 0!');
      return;
    }

    const payload = {
      medicineID: formMedicine.medicineID.trim(),
      medicineName: formMedicine.medicineName.trim(),
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80',
      ingredients: formMedicine.ingredients.trim(),
      unitPrice: formMedicine.unitPrice,
      unitID: formMedicine.baseUnit?.unitID || null,
      catalogID: formMedicine.catalog?.catalogID || null,
      originID: formMedicine.origin?.originID || null,
      alternativeUnits: (formMedicine.alternativeUnits || []).map(au => ({
        unitID: au.unitID,
        conversionRate: au.conversionRate
      }))
    };

    try {
      if (formMode === 'add') {
        const response = await api.post('/medicines', payload);
        const savedMedicine = response.data?.data;
        alert('Thêm mới thuốc thành công!');

        const freshList = await fetchMedicines('', '', 1);
        const match = freshList.find(m => m.medicineID === savedMedicine.medicineID) || savedMedicine;
        setSelectedMedicine(match);
      } else {
        const response = await api.patch(`/medicines/${formMedicine.medicineID}`, payload);
        const savedMedicine = response.data?.data;
        alert('Cập nhật thông tin thuốc thành công!');

        const freshList = await fetchMedicines(searchMedicine, searchField, currentPage);
        const match = freshList.find(m => m.medicineID === savedMedicine.medicineID) || savedMedicine;
        setSelectedMedicine(match);
      }
      setFormMode(null);
    } catch (error) {
      console.error('Lỗi khi lưu thông tin thuốc:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin thuốc.');
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc với mã ${id}?`)) {
      try {
        await api.delete(`/medicines/${id}`);
        alert('Xóa thuốc thành công!');
        const freshList = await fetchMedicines(searchMedicine, searchField, currentPage);
        if (selectedMedicine && selectedMedicine.medicineID === id) {
          setSelectedMedicine(freshList.length > 0 ? freshList[0] : null);
        }
      } catch (error) {
        console.error('Lỗi khi xóa thuốc:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa thuốc.');
      }
    }
  };

  const handleBaseUnitChange = (e) => {
    const selectedUnit = unitsList.find(u => u.unitID === e.target.value);
    if (selectedUnit) {
      setFormMedicine(prev => ({
        ...prev,
        baseUnit: {
          unitID: selectedUnit.unitID,
          unitName: selectedUnit.unitName
        }
      }));
    }
  };

  const handleCatalogChange = (e) => {
    const selectedCat = catalogsList.find(c => c.catalogID === e.target.value);
    if (selectedCat) {
      setFormMedicine(prev => ({
        ...prev,
        catalog: {
          catalogID: selectedCat.catalogID,
          catalogName: selectedCat.catalogName
        }
      }));
    }
  };

  const handleOriginChange = (e) => {
    const selectedOrig = originsList.find(o => o.originID === e.target.value);
    if (selectedOrig) {
      setFormMedicine(prev => ({
        ...prev,
        origin: {
          originID: selectedOrig.originID,
          originName: selectedOrig.originName
        }
      }));
    }
  };

  const addAlternativeUnit = () => {
    setFormMedicine(prev => ({
      ...prev,
      alternativeUnits: [
        ...prev.alternativeUnits,
        { unitID: unitsList[0] ? unitsList[0].unitID : '', unitName: unitsList[0] ? unitsList[0].unitName : '', conversionRate: 10 }
      ]
    }));
  };

  const removeAlternativeUnit = (index) => {
    setFormMedicine(prev => ({
      ...prev,
      alternativeUnits: prev.alternativeUnits.filter((_, i) => i !== index)
    }));
  };

  const handleAltUnitChange = (index, field, value) => {
    setFormMedicine(prev => {
      const updated = prev.alternativeUnits.map((au, i) => {
        if (i === index) {
          if (field === 'unitID') {
            const selected = unitsList.find(u => u.unitID === value);
            return {
              ...au,
              unitID: value,
              unitName: selected ? selected.unitName : value
            };
          }
          if (field === 'conversionRate') {
            return {
              ...au,
              conversionRate: Number(value) || 0
            };
          }
        }
        return au;
      });
      return { ...prev, alternativeUnits: updated };
    });
  };

  // --- HANDLERS CHO PHÂN HỆ DANH MỤC (CATALOG) ---
  const handleCatalogSave = async (e) => {
    e.preventDefault();
    if (!catalogForm.catalogID.trim()) {
      alert('Vui lòng nhập Mã danh mục!');
      return;
    }
    if (!catalogForm.catalogName.trim()) {
      alert('Vui lòng nhập Tên danh mục!');
      return;
    }

    const payload = {
      catalogID: catalogForm.catalogID.trim(),
      catalogName: catalogForm.catalogName.trim()
    };

    try {
      const isAdd = catalogFormMode === 'add';
      if (isAdd) {
        await api.post('/catalogs', payload);
        alert('Thêm mới danh mục thành công!');
      } else {
        await api.patch(`/catalogs/${catalogForm.catalogID}`, payload);
        alert('Cập nhật danh mục thành công!');
      }
      await fetchCatalogs(isAdd ? 1 : catalogCurrentPage);
      await fetchInitialData();

      // Reset Form
      setCatalogFormMode('add');
      setCatalogForm({ catalogID: '', catalogName: '' });
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục.');
    }
  };

  const handleCatalogEditClick = (item) => {
    setCatalogFormMode('edit');
    setCatalogForm({ ...item });
  };

  const handleCatalogDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục ${id}?`)) {
      try {
        await api.delete(`/catalogs/${id}`);
        alert('Xóa danh mục thành công!');
        await fetchCatalogs(catalogCurrentPage);
        await fetchInitialData();
        if (catalogForm.catalogID === id) {
          setCatalogFormMode('add');
          setCatalogForm({ catalogID: '', catalogName: '' });
        }
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục.');
      }
    }
  };

  const handleCatalogCancel = () => {
    setCatalogFormMode('add');
    setCatalogForm({ catalogID: '', catalogName: '' });
  };

  // --- HANDLERS CHO PHÂN HỆ ĐƠN VỊ TÍNH (UNIT) ---
  const handleUnitSave = async (e) => {
    e.preventDefault();
    if (!unitForm.unitID.trim()) {
      alert('Vui lòng nhập Mã đơn vị!');
      return;
    }
    if (!unitForm.unitName.trim()) {
      alert('Vui lòng nhập Tên đơn vị!');
      return;
    }

    const payload = {
      unitID: unitForm.unitID.trim(),
      unitName: unitForm.unitName.trim()
    };

    try {
      const isAdd = unitFormMode === 'add';
      if (isAdd) {
        await api.post('/units', payload);
        alert('Thêm mới đơn vị tính thành công!');
      } else {
        await api.patch(`/units/${unitForm.unitID}`, payload);
        alert('Cập nhật đơn vị tính thành công!');
      }
      await fetchUnits(isAdd ? 1 : unitCurrentPage);
      await fetchInitialData();

      // Reset Form
      setUnitFormMode('add');
      setUnitForm({ unitID: '', unitName: '' });
    } catch (error) {
      console.error('Lỗi khi lưu đơn vị tính:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu đơn vị tính.');
    }
  };

  const handleUnitEditClick = (item) => {
    setUnitFormMode('edit');
    setUnitForm({ ...item });
  };

  const handleUnitDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn vị ${id}?`)) {
      try {
        await api.delete(`/units/${id}`);
        alert('Xóa đơn vị tính thành công!');
        await fetchUnits(unitCurrentPage);
        await fetchInitialData();
        if (unitForm.unitID === id) {
          setUnitFormMode('add');
          setUnitForm({ unitID: '', unitName: '' });
        }
      } catch (error) {
        console.error('Lỗi khi xóa đơn vị tính:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa đơn vị tính.');
      }
    }
  };

  const handleUnitCancel = () => {
    setUnitFormMode('add');
    setUnitForm({ unitID: '', unitName: '' });
  };

  // --- HANDLERS CHO PHÂN HỆ NƯỚC SẢN XUẤT (ORIGIN) ---
  const handleOriginSave = async (e) => {
    e.preventDefault();
    if (!originForm.originID.trim()) {
      alert('Vui lòng nhập Mã xuất xứ!');
      return;
    }
    if (!originForm.originName.trim()) {
      alert('Vui lòng nhập Tên nước sản xuất!');
      return;
    }

    const payload = {
      originID: originForm.originID.trim(),
      originName: originForm.originName.trim()
    };

    try {
      const isAdd = originFormMode === 'add';
      if (isAdd) {
        await api.post('/origins', payload);
        alert('Thêm mới nước sản xuất thành công!');
      } else {
        await api.patch(`/origins/${originForm.originID}`, payload);
        alert('Cập nhật nước sản xuất thành công!');
      }
      await fetchOrigins(isAdd ? 1 : originCurrentPage);
      await fetchInitialData();

      // Reset Form
      setOriginFormMode('add');
      setOriginForm({ originID: '', originName: '' });
    } catch (error) {
      console.error('Lỗi khi lưu xuất xứ:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu nước sản xuất.');
    }
  };

  const handleOriginEditClick = (item) => {
    setOriginFormMode('edit');
    setOriginForm({ ...item });
  };

  const handleOriginDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa xuất xứ ${id}?`)) {
      try {
        await api.delete(`/origins/${id}`);
        alert('Xóa nước sản xuất thành công!');
        await fetchOrigins(originCurrentPage);
        await fetchInitialData();
        if (originForm.originID === id) {
          setOriginFormMode('add');
          setOriginForm({ originID: '', originName: '' });
        }
      } catch (error) {
        console.error('Lỗi khi xóa xuất xứ:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa nước sản xuất.');
      }
    }
  };

  const handleOriginCancel = () => {
    setOriginFormMode('add');
    setOriginForm({ originID: '', originName: '' });
  };

  // --- HANDLERS CHO PHÂN HỆ NHÀ CUNG CẤP (SUPPLIER) ---
  const handleSupplierSave = async (e) => {
    e.preventDefault();
    if (!supplierForm.supplierID.trim()) {
      alert('Vui lòng nhập Mã nhà cung cấp!');
      return;
    }
    if (!supplierForm.supplierName.trim()) {
      alert('Vui lòng nhập Tên nhà cung cấp!');
      return;
    }
    if (!supplierForm.phoneNumber.trim()) {
      alert('Vui lòng nhập Số điện thoại!');
      return;
    }
    if (!supplierForm.address.trim()) {
      alert('Vui lòng nhập Địa chỉ!');
      return;
    }

    const phonePattern = /^[0-9]{9,15}$/;
    if (!phonePattern.test(supplierForm.phoneNumber.trim())) {
      alert('Số điện thoại không hợp lệ (phải từ 9 đến 15 chữ số)!');
      return;
    }

    const payload = {
      supplierID: supplierForm.supplierID.trim().toUpperCase(),
      supplierName: supplierForm.supplierName.trim(),
      phoneNumber: supplierForm.phoneNumber.trim(),
      address: supplierForm.address.trim()
    };

    try {
      const isAdd = supplierFormMode === 'add';
      if (isAdd) {
        await api.post('/suppliers', payload);
        alert('Thêm mới nhà cung cấp thành công!');
      } else {
        await api.patch(`/suppliers/${supplierForm.supplierID}`, payload);
        alert('Cập nhật thông tin nhà cung cấp thành công!');
      }
      await fetchSuppliers();

      // Reset Form
      setSupplierFormMode('add');
      setSupplierForm({ supplierID: '', supplierName: '', phoneNumber: '', address: '' });
      setSupplierCurrentPage(1);
    } catch (error) {
      console.error('Lỗi khi lưu nhà cung cấp:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu nhà cung cấp.');
    }
  };

  const handleSupplierEditClick = (item) => {
    setSupplierFormMode('edit');
    setSupplierForm({ ...item });
  };

  const handleSupplierDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp ${id}?`)) {
      try {
        await api.delete(`/suppliers/${id}`);
        alert('Xóa nhà cung cấp thành công!');
        await fetchSuppliers();
        if (supplierForm.supplierID === id) {
          setSupplierFormMode('add');
          setSupplierForm({ supplierID: '', supplierName: '', phoneNumber: '', address: '' });
        }
      } catch (error) {
        console.error('Lỗi khi xóa nhà cung cấp:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa nhà cung cấp.');
      }
    }
  };

  const handleSupplierCancel = () => {
    setSupplierFormMode('add');
    setSupplierForm({ supplierID: '', supplierName: '', phoneNumber: '', address: '' });
  };

  // --- HANDLERS CHO PHÂN HỆ NHÂN VIÊN (EMPLOYEE) ---
  const handleEmployeeSave = async (e) => {
    e.preventDefault();
    if (!employeeForm.employeeID.trim()) {
      alert('Vui lòng nhập Mã nhân viên!');
      return;
    }
    if (!employeeForm.fullName.trim()) {
      alert('Vui lòng nhập Họ tên!');
      return;
    }
    if (!employeeForm.phoneNumber.trim()) {
      alert('Vui lòng nhập Số điện thoại!');
      return;
    }
    if (!employeeForm.email.trim()) {
      alert('Vui lòng nhập Email!');
      return;
    }
    if (!employeeForm.yearOfBirth) {
      alert('Vui lòng nhập Năm sinh!');
      return;
    }
    if (!employeeForm.hireDate) {
      alert('Vui lòng chọn Ngày vào làm!');
      return;
    }

    const phonePattern = /^[0-9]{9,15}$/;
    if (!phonePattern.test(employeeForm.phoneNumber.trim())) {
      alert('Số điện thoại không hợp lệ (phải từ 9 đến 15 chữ số)!');
      return;
    }

    const isAdd = employeeFormMode === 'add';

    if (isAdd) {
      if (!employeeForm.username.trim()) {
        alert('Vui lòng nhập Tên đăng nhập cho tài khoản!');
        return;
      }

      const payload = {
        employeeID: employeeForm.employeeID.trim().toUpperCase(),
        fullName: employeeForm.fullName.trim(),
        phoneNumber: employeeForm.phoneNumber.trim(),
        email: employeeForm.email.trim(),
        gender: employeeForm.gender,
        yearOfBirth: Number(employeeForm.yearOfBirth),
        hireDate: employeeForm.hireDate,
        username: employeeForm.username.trim(),
        roleName: employeeForm.roleName,
        isStaff: employeeForm.isStaff,
        isActive: employeeForm.isActive
      };

      try {
        const res = await api.post('/employees/with-account', payload);
        const data = res.data?.data;
        const generatedPass = data?.account?.generatedPassword;
        alert(`Tạo hồ sơ nhân viên và tài khoản thành công!\nMật khẩu khởi tạo tự sinh là: ${generatedPass || '(Không có)'}\nVui lòng lưu lại mật khẩu này.`);
        await fetchEmployees();
        handleEmployeeCancel();
      } catch (error) {
        console.error('Lỗi khi lưu nhân viên kèm tài khoản:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu nhân viên và tài khoản.');
      }
    } else {
      const payload = {
        fullName: employeeForm.fullName.trim(),
        phoneNumber: employeeForm.phoneNumber.trim(),
        email: employeeForm.email.trim(),
        gender: employeeForm.gender,
        yearOfBirth: Number(employeeForm.yearOfBirth),
        hireDate: employeeForm.hireDate
      };

      try {
        await api.patch(`/employees/${employeeForm.employeeID}`, payload);
        alert('Cập nhật hồ sơ nhân viên thành công!');
        await fetchEmployees();
        handleEmployeeCancel();
      } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật nhân viên.');
      }
    }
  };

  const handleEmployeeEditClick = (item) => {
    setEmployeeFormMode('edit');
    setEmployeeForm({
      employeeID: item.employeeID,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      gender: item.gender,
      yearOfBirth: item.yearOfBirth,
      hireDate: item.hireDate,
      username: '',
      roleName: 'Sales',
      isStaff: true,
      isActive: true
    });
  };

  const handleEmployeeDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ${id}?`)) {
      try {
        await api.delete(`/employees/${id}`);
        alert('Xóa nhân viên thành công!');
        await fetchEmployees();
        if (employeeForm.employeeID === id) {
          handleEmployeeCancel();
        }
      } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa nhân viên.');
      }
    }
  };

  const handleEmployeeCancel = () => {
    setEmployeeFormMode(null);
    setEmployeeForm({
      employeeID: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      gender: 'Male',
      yearOfBirth: new Date().getFullYear() - 25,
      hireDate: new Date().toISOString().split('T')[0],
      username: '',
      roleName: 'Sales',
      isStaff: true,
      isActive: true
    });
  };

  // --- HANDLERS CHO PHÂN HỆ TÀI KHOẢN (ACCOUNT) ---
  const handleAccountSave = async (e) => {
    e.preventDefault();
    if (!accountForm.username.trim()) {
      alert('Vui lòng nhập Tên đăng nhập!');
      return;
    }
    if (!accountForm.roleName) {
      alert('Vui lòng chọn Vai trò!');
      return;
    }

    const isAdd = accountFormMode === 'add';

    if (isAdd) {
      if (!accountForm.employeeID) {
        alert('Vui lòng chọn Nhân viên liên kết!');
        return;
      }

      const payload = {
        username: accountForm.username.trim(),
        employeeID: accountForm.employeeID,
        roleName: accountForm.roleName,
        isStaff: accountForm.isStaff,
        isActive: accountForm.isActive
      };

      try {
        const res = await api.post('/accounts', payload);
        const data = res.data?.data;
        const generatedPass = data?.generatedPassword;
        alert(`Tạo tài khoản thành công!\nMật khẩu khởi tạo tự sinh là: ${generatedPass || '(Không có)'}\nVui lòng lưu lại mật khẩu này.`);
        await fetchAccounts();
        handleAccountCancel();
      } catch (error) {
        console.error('Lỗi khi tạo tài khoản lẻ:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản.');
      }
    } else {
      const payload = {
        roleName: accountForm.roleName,
        isStaff: accountForm.isStaff,
        isActive: accountForm.isActive
      };

      try {
        await api.patch(`/accounts/${accountForm.accountID}`, payload);
        alert('Cập nhật tài khoản thành công!');
        await fetchAccounts();
        handleAccountCancel();
      } catch (error) {
        console.error('Lỗi khi cập nhật tài khoản:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản.');
      }
    }
  };

  const handleAccountEditClick = (item) => {
    setAccountFormMode('edit');
    setAccountForm({
      accountID: item.accountID,
      username: item.username,
      roleName: item.role,
      employeeID: item.employee ? item.employee.employeeID : '',
      isStaff: item.isStaff,
      isActive: item.isActive,
      password: ''
    });
  };

  const handleAccountDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ID ${id}?`)) {
      try {
        await api.delete(`/accounts/${id}`);
        alert('Xóa tài khoản thành công!');
        await fetchAccounts();
        if (accountForm.accountID === id) {
          handleAccountCancel();
        }
      } catch (error) {
        console.error('Lỗi khi xóa tài khoản:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa tài khoản.');
      }
    }
  };

  const handleAccountCancel = () => {
    setAccountFormMode('edit');
    setAccountForm({
      accountID: '',
      username: '',
      roleName: 'Sales',
      employeeID: '',
      isStaff: true,
      isActive: true,
      password: ''
    });
  };

  const handleAccountResetPassword = async (e) => {
    e.preventDefault();
    if (!accountForm.accountID) {
      alert('Vui lòng chọn tài khoản cần reset mật khẩu!');
      return;
    }
    if (!accountForm.password.trim()) {
      alert('Vui lòng nhập mật khẩu mới!');
      return;
    }

    try {
      const payload = {
        password: accountForm.password.trim()
      };
      await api.patch(`/accounts/${accountForm.accountID}`, payload);
      alert(`Đổi mật khẩu cho tài khoản "${accountForm.username}" thành công!`);
      setAccountForm(prev => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Lỗi khi reset mật khẩu tài khoản:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    }
  };

  // --- HANDLERS CHO PHÂN HỆ KHÁCH HÀNG (CUSTOMER) ---
  const handleCustomerAddNewClick = () => {
    setCustomerFormMode('add');
    setCustomerForm({
      customerID: 'KH-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      fullName: '',
      phoneNumber: '',
      gender: 'Male',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleCustomerEditClick = () => {
    if (!selectedCustomer) return;
    setCustomerFormMode('edit');
    setCustomerForm({ ...selectedCustomer });
  };

  const handleCustomerSave = async (e) => {
    e.preventDefault();
    if (!customerForm.customerID.trim()) {
      alert('Vui lòng nhập Mã khách hàng!');
      return;
    }
    if (!customerForm.fullName.trim()) {
      alert('Vui lòng nhập Họ và tên!');
      return;
    }
    if (!customerForm.phoneNumber.trim()) {
      alert('Vui lòng nhập Số điện thoại!');
      return;
    }

    try {
      const payload = {
        customerID: customerForm.customerID.trim().toUpperCase(),
        fullName: customerForm.fullName.trim(),
        phoneNumber: customerForm.phoneNumber.trim(),
        gender: customerForm.gender
      };

      if (customerFormMode === 'add') {
        await api.post('/customers', payload);
        alert('Thêm mới khách hàng thành công!');
      } else {
        await api.patch(`/customers/${customerForm.customerID}`, payload);
        alert('Cập nhật khách hàng thành công!');
      }

      await fetchCustomers();
      setCustomerFormMode(null);

      const savedCustomer = {
        ...payload,
        joinDate: customerForm.joinDate || new Date().toISOString().split('T')[0]
      };
      setSelectedCustomer(savedCustomer);
    } catch (error) {
      console.error('Lỗi lưu khách hàng:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu khách hàng!');
    }
  };

  const handleCustomerDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng ${id}?`)) {
      try {
        await api.delete(`/customers/${id}`);
        alert('Xóa khách hàng thành công!');
        await fetchCustomers();
      } catch (error) {
        console.error('Lỗi xóa khách hàng:', error);
        alert(error.response?.data?.message || 'Không thể xóa khách hàng vì đã phát sinh giao dịch!');
      }
    }
  };

  const handleCustomerCancel = () => {
    setCustomerFormMode(null);
  };

  const handleShowInvoiceModal = async (invoiceId) => {
    try {
      const cleanId = typeof invoiceId === 'string' ? invoiceId.replace(/[^0-9]/g, '') : invoiceId;
      if (cleanId) {
        const res = await api.get(`/invoices/${cleanId}`);
        if (res.data?.data) {
          setInvoiceReceiptData(res.data.data);
          setShowReceiptModal(true);
          return;
        }
      }
    } catch (error) {
      console.error('Lỗi tải hóa đơn từ API, sử dụng mock dữ liệu:', error);
    }

    let mockTotal = 150000;
    if (invoiceId === 'DH-1045') mockTotal = 320000;
    if (invoiceId === 'DH-1015') mockTotal = 850000;
    if (invoiceId === 'DH-1099') mockTotal = 1250000;

    const mockInvoice = {
      invoiceID: invoiceId,
      invoiceTime: new Date().toISOString(),
      customerName: selectedCustomer?.fullName || 'Khách hàng thành viên',
      paymentMethod: 'Cash',
      address: selectedCustomer?.address || '',
      details: [
        {
          medicineName: 'Paracetamol 500mg',
          batchId: 'LOT-PARA-001',
          quantity: 2,
          unitPrice: mockTotal / 2,
          subTotal: mockTotal
        }
      ]
    };
    setInvoiceReceiptData(mockInvoice);
    setShowReceiptModal(true);
  };

  const handleAddToPosCart = (item) => {
    if (item.stockQuantity <= 0) {
      alert("Lô hàng này đã hết tồn kho gốc! Không thể bán.");
      return;
    }
    const isExpired = item.expiryDate && new Date(item.expiryDate) <= new Date();
    if (isExpired) {
      if (!window.confirm("CẢNH BÁO: Lô thuốc này đã HẾT HẠN SỬ DỤNG! Bạn có chắc chắn muốn bán lô này không?")) {
        return;
      }
    }

    setPosCart(prev => {
      const existing = prev.find(c => c.inventoryId === item.id);
      if (existing) {
        const nextQty = existing.quantity + 1;
        if (nextQty * existing.conversionRate > item.stockQuantity) {
          alert(`Không thể thêm! Số lượng trong giỏ (${nextQty * existing.conversionRate} ${item.medicine.baseUnit.unitName}) vượt quá tồn kho khả dụng (${item.stockQuantity} ${item.medicine.baseUnit.unitName})`);
          return prev;
        }
        return prev.map(c => c.inventoryId === item.id ? { ...c, quantity: nextQty } : c);
      } else {
        return [...prev, {
          inventoryId: item.id,
          medicineName: item.medicine.medicineName,
          batchId: item.batchId,
          expiryDate: item.expiryDate,
          quantity: 1,
          unitPrice: item.medicine.unitPrice,
          stockQuantity: item.stockQuantity,
          baseUnit: item.medicine.baseUnit,
          alternativeUnits: item.medicine.alternativeUnits || [],
          transactionUnitId: item.medicine.baseUnit.unitID,
          conversionRate: 1,
          note: ''
        }];
      }
    });
  };


  const handlePosCartQtyChange = (inventoryId, val) => {
    const q = Number(val) || 1;
    setPosCart(prev => prev.map(c => {
      if (c.inventoryId === inventoryId) {
        return { ...c, quantity: q };
      }
      return c;
    }));
  };

  const handlePosCartUnitChange = (inventoryId, unitId, item) => {
    let rate = 1;
    if (unitId !== item.baseUnit.unitID) {
      const au = item.alternativeUnits.find(u => (u.unitID || u.unit?.unitID) === unitId);
      if (au) rate = au.conversionRate;
    }
    setPosCart(prev => prev.map(c => {
      if (c.inventoryId === inventoryId) {
        return { ...c, transactionUnitId: unitId, conversionRate: rate };
      }
      return c;
    }));
  };

  const handleRemoveFromPosCart = (inventoryId) => {
    setPosCart(prev => prev.filter(c => c.inventoryId !== inventoryId));
  };

  const handlePosCartNoteChange = (inventoryId, val) => {
    setPosCart(prev => prev.map(c => {
      if (c.inventoryId === inventoryId) {
        return { ...c, note: val };
      }
      return c;
    }));
  };


  const handleOpenCheckoutModal = (e) => {
    e.preventDefault();
    if (posCart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    for (const c of posCart) {
      if (c.quantity <= 0) {
        alert(`Số lượng bán của thuốc ${c.medicineName} phải lớn hơn 0!`);
        return;
      }
      if (c.quantity * c.conversionRate > c.stockQuantity) {
        alert(`Thuốc ${c.medicineName} (Lô: ${c.batchId}) không đủ tồn kho! Số lượng yêu cầu: ${c.quantity * c.conversionRate}, Tồn kho hiện tại: ${c.stockQuantity}`);
        return;
      }
    }

    setPosCashGiven('');
    setShowPosCheckoutModal(true);
  };

  const handlePosCheckout = async (e) => {
    e?.preventDefault();
    try {
      const payload = {
        customerId: posSelectedCustomer?.customerID || null,
        address: posAddress || '',
        paymentMethod: 'Cash', // Cố định thanh toán tiền mặt
        details: posCart.map(c => ({
          inventoryId: c.inventoryId,
          quantity: Number(c.quantity),
          unitPrice: c.unitPrice * c.conversionRate,
          transactionUnitId: c.transactionUnitId,
          conversionRate: Number(c.conversionRate),
          note: c.note || ''
        }))
      };

      const res = await api.post('/invoices', payload);
      const savedInvoice = res.data?.data;

      setInvoiceReceiptData(savedInvoice);
      setShowReceiptModal(true);

      setPosCart([]);
      setPosAddress('');
      setPosSelectedCustomer(null);
      setPosCashGiven('');
      setShowPosCheckoutModal(false);

      alert("Thanh toán hóa đơn bán lẻ thành công!");
      fetchInventory(1, posSearchKeyword, 'ALL');
    } catch (error) {
      console.error("Lỗi khi thanh toán đơn hàng:", error);
      alert("Không thể thanh toán: " + (error.response?.data?.message || error.message));
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleActivityClick = (op) => {
    if (op.type === 'RECEIPT') {
      setReceiptSearchType('receiptId');
      setReceiptSearchVal(op.id);
      setActiveTab('warehouse_receipt');
      fetchReceipts(1, 'receiptId', op.id);
    } else if (op.type === 'ISSUE') {
      setIssueSearchType('issueId');
      setIssueSearchVal(op.id);
      setActiveTab('warehouse_issue');
      fetchIssues(1, 'issueId', op.id);
    } else if (op.type === 'AUDIT') {
      setAuditSearchType('auditId');
      setAuditSearchVal(op.id);
      setActiveTab('warehouse_audit');
      fetchAudits(1, 'auditId', op.id);
    }
  };

  const handleAlertAction = (alert) => {
    if (alert.type === 'EXPIRED') {
      setActiveTab('warehouse_issue');
      setIssueFormMode('add');
      setIssueForm({
        issueType: 'EXPIRED',
        note: `Xuất hủy lô thuốc hết hạn từ cảnh báo: ${alert.title}`,
        details: []
      });
    } else if (alert.type === 'LOW_STOCK') {
      setActiveTab('warehouse_receipt');
      setReceiptFormMode('add');
      setReceiptForm({
        supplierId: '',
        note: `Nhập hàng bổ sung cho thuốc tồn kho thấp: ${alert.title}`,
        details: []
      });
    }
  };

  // 4. RENDER CÁC MÀN HÌNH MAIN CONTENT
  const renderMainContent = () => {
    if (activeTab === 'sales_pos' && role === 'Product_manager') {
      return (
        <div className="content-card">
          <h2 style={{ color: 'var(--error-color)' }}>Không có quyền truy cập</h2>
          <p>Tài khoản của bạn không được phép tạo đơn thuốc (bán lẻ).</p>
        </div>
      );
    }
    if ((activeTab === 'sys_employees' || activeTab === 'sys_accounts') && role !== 'Admin') {
      return (
        <div className="content-card">
          <h2 style={{ color: 'var(--error-color)' }}>Không có quyền truy cập</h2>
          <p>Chỉ Quản trị viên mới được truy cập cài đặt hệ thống.</p>
        </div>
      );
    }

    switch (activeTab) {
      /* PHÂN HỆ TỔNG QUAN */
      case 'overview':
        if (dashboardLoading) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px' }}>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
              `}</style>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h1 className="content-title" style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Tổng Quan Hệ Thống</h1>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Đang tải số liệu từ hệ thống...</span>
              </div>

              {/* Skeleton Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="content-card" style={{ height: '110px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}>
                    <div style={{ width: '40%', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '4px' }}></div>
                    <div style={{ width: '60%', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                  </div>
                ))}
              </div>

              {/* Skeleton Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                {[1, 2].map(n => (
                  <div key={n} className="content-card" style={{ height: '350px', padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px' }}>
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
              }
              .kpi-card {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              .kpi-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03) !important;
              }
              .activity-row:hover td {
                background-color: #f8fafc !important;
              }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="content-title" style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Tổng Quan Hệ Thống</h1>
              <button
                onClick={fetchDashboardData}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Làm mới
              </button>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>

              {/* Card 1: Tổng số đầu thuốc */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid var(--primary-color)', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>TỔNG ĐẦU THUỐC</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{dashboardStats.totalMedicines}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Danh mục sản phẩm</span>
                </div>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                    <path d="m8.5 8.5 7 7" />
                  </svg>
                </div>
              </div>

              {/* Card 2: Lô sắp hết hàng */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid #eab308', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>TỒN KHO THẤP</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#d97706' }}>{dashboardStats.lowStockCount}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Đầu thuốc dưới tối thiểu</span>
                </div>
                <div style={{ backgroundColor: '#fef9c3', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#eab308' }}>
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                  </svg>
                </div>
              </div>

              {/* Card 3: Lô cận hạn sử dụng */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid #f97316', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>THUỐC CẬN HẠN</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#ea580c' }}>{dashboardStats.nearExpiryCount}</span>
                  <span style={{ fontSize: '11px', color: '#ea580c' }}>Cận hạn &lt; 6 tháng</span>
                </div>
                <div style={{ backgroundColor: '#ffedd5', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f97316' }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>

              {/* Card 4: Lô đã hết hạn */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid #ef4444', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>LÔ ĐÃ HẾT HẠN</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626' }}>{dashboardStats.expiredCount}</span>
                  <span style={{ fontSize: '11px', color: '#ef4444' }}>Cần xuất hủy khẩn cấp</span>
                </div>
                <div style={{ backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Recharts Visualizations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>

              {/* Chart 1: Xu hướng giao dịch kho */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  Tần Suất Biến Động Kho (7 ngày gần nhất)
                </h3>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNhap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="colorXuat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} />
                      <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area type="monotone" name="Giao dịch Nhập" dataKey="Nhập kho" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNhap)" />
                      <Area type="monotone" name="Giao dịch Xuất" dataKey="Xuất kho" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorXuat)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Phân bổ theo nhóm */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
                    <path d="M3 3v18h18" />
                    <rect x="7" y="10" width="4" height="7" rx="1" />
                    <rect x="15" y="5" width="4" height="12" rx="1" />
                  </svg>
                  Phân Bổ Thuốc Theo Nhóm Danh Mục
                </h3>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardCategoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} cursor={{ fill: '#f8fafc' }} />
                      <Bar name="Số lượng thuốc" dataKey="Số lượng đầu thuốc" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Bottom Insights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>

              {/* Left Widget: Recent Operations Log */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Nhật Ký Hoạt Động Kho Gần Đây
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Click hàng để xem chi tiết</span>
                </div>
                <div className="custom-table-container" style={{ border: 'none', borderRadius: 0 }}>
                  <table className="custom-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Mã Phiếu</th>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Phân Hệ</th>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Nội Dung</th>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Thời Gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOperations.length > 0 ? (
                        recentOperations.map((op) => {
                          let badgeColor = '#2563eb';
                          let badgeBg = '#dbeafe';
                          let typeText = 'Nhập kho';
                          if (op.type === 'ISSUE') {
                            badgeColor = '#dc2626';
                            badgeBg = '#fee2e2';
                            typeText = 'Xuất kho';
                          } else if (op.type === 'AUDIT') {
                            badgeColor = '#d97706';
                            badgeBg = '#fef9c3';
                            typeText = 'Kiểm kê';
                          }

                          return (
                            <tr
                              key={op.id}
                              onClick={() => handleActivityClick(op)}
                              className="activity-row"
                              style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}
                            >
                              <td style={{ fontWeight: '600', color: '#2563eb', padding: '12px 12px', fontSize: '13px' }}>{op.id}</td>
                              <td style={{ padding: '12px 12px' }}>
                                <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: badgeBg, color: badgeColor }}>
                                  {typeText}
                                </span>
                              </td>
                              <td style={{ padding: '12px 12px', fontSize: '13px', color: '#334155', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={op.details}>
                                {op.details}
                              </td>
                              <td style={{ padding: '12px 12px', fontSize: '12px', color: '#64748b' }}>
                                {op.time ? new Date(op.time).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '---'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>
                            Không có hoạt động kho gần đây
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Widget: Critical Inventory Alerts */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Cảnh Báo Tồn Kho Khẩn Cấp
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '270px', overflowY: 'auto', paddingRight: '4px' }}>
                  {criticalAlerts.length > 0 ? (
                    criticalAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: alert.type === 'EXPIRED' ? '#fee2e2' : '#fffbeb',
                          border: alert.type === 'EXPIRED' ? '1px solid #fecaca' : '1px solid #fef3c7',
                          transition: 'transform 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '75%' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: alert.type === 'EXPIRED' ? '#991b1b' : '#92400e' }}>
                            {alert.title}
                          </span>
                          <span style={{ fontSize: '11px', color: alert.type === 'EXPIRED' ? '#b91c1c' : '#b45309', lineHeight: '1.4' }}>
                            {alert.desc}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAlertAction(alert)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            backgroundColor: alert.type === 'EXPIRED' ? '#ef4444' : '#d97706',
                            color: '#ffffff',
                            transition: 'opacity 0.2s',
                            flexShrink: 0
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          {alert.type === 'EXPIRED' ? 'Xuất hủy' : 'Nhập hàng'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 20px',
                      color: '#10b981',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      gap: '8px',
                      height: '180px'
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Tồn kho an toàn, không có cảnh báo!</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        );

      /* MÀN HÌNH 1: THÔNG TIN THUỐC (Interactive Medicine Detail & Catalog Table) */
      case 'medicine': {
        const filtered = medicinesList;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* KHUNG TRÊN: CHI TIẾT / FORM NHẬP LIỆU THÔNG MINH */}
            {formMode ? (
              <div className="medicine-detail-card">
                <div className="medicine-header-actions">
                  <h2 className="medicine-header-title">
                    {formMode === 'add' ? 'Thêm mới thuốc' : 'Chỉnh sửa thông tin thuốc'}
                  </h2>
                </div>
                <form onSubmit={handleSave} className="form-grid">
                  <div className="form-group">
                    <label className="label">Mã thuốc:</label>
                    <input
                      type="text"
                      className="input"
                      value={formMedicine.medicineID}
                      onChange={(e) => setFormMedicine({ ...formMedicine, medicineID: e.target.value })}
                      disabled={formMode === 'edit'}
                      placeholder="VD: MED-PARA-500"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Tên thuốc:</label>
                    <input
                      type="text"
                      className="input"
                      value={formMedicine.medicineName}
                      onChange={(e) => setFormMedicine({ ...formMedicine, medicineName: e.target.value })}
                      placeholder="VD: Paracetamol 500mg"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Thành phần:</label>
                    <input
                      type="text"
                      className="input"
                      value={formMedicine.ingredients}
                      onChange={(e) => setFormMedicine({ ...formMedicine, ingredients: e.target.value })}
                      placeholder="VD: Paracetamol 500mg và tá dược..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Đơn giá cơ bản (VND):</label>
                    <input
                      type="number"
                      className="input"
                      value={formMedicine.unitPrice}
                      onChange={(e) => setFormMedicine({ ...formMedicine, unitPrice: Number(e.target.value) || 0 })}
                      placeholder="VD: 1500"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Ảnh sản phẩm (Mặc định):</label>
                    <input
                      type="text"
                      className="input"
                      value="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Đơn vị gốc:</label>
                    <SearchableSelect
                      options={unitsList}
                      value={formMedicine.baseUnit.unitID}
                      onChange={(val) => {
                        const selectedUnit = unitsList.find(u => u.unitID === val);
                        if (selectedUnit) {
                          setFormMedicine(prev => ({
                            ...prev,
                            baseUnit: {
                              unitID: selectedUnit.unitID,
                              unitName: selectedUnit.unitName
                            }
                          }));
                        }
                      }}
                      idKey="unitID"
                      nameKey="unitName"
                      placeholder="Chọn đơn vị gốc..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Danh mục:</label>
                    <SearchableSelect
                      options={catalogsList}
                      value={formMedicine.catalog.catalogID}
                      onChange={(val) => {
                        const selectedCat = catalogsList.find(c => c.catalogID === val);
                        if (selectedCat) {
                          setFormMedicine(prev => ({
                            ...prev,
                            catalog: {
                              catalogID: selectedCat.catalogID,
                              catalogName: selectedCat.catalogName
                            }
                          }));
                        }
                      }}
                      idKey="catalogID"
                      nameKey="catalogName"
                      placeholder="Chọn danh mục..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Nước sản xuất:</label>
                    <SearchableSelect
                      options={originsList}
                      value={formMedicine.origin.originID}
                      onChange={(val) => {
                        const selectedOrig = originsList.find(o => o.originID === val);
                        if (selectedOrig) {
                          setFormMedicine(prev => ({
                            ...prev,
                            origin: {
                              originID: selectedOrig.originID,
                              originName: selectedOrig.originName
                            }
                          }));
                        }
                      }}
                      idKey="originID"
                      nameKey="originName"
                      placeholder="Chọn nước sản xuất..."
                    />
                  </div>

                  {/* Quản lý đơn vị tính quy đổi phụ */}
                  <div className="form-group-full" style={{ marginTop: '10px', borderTop: '1px dashed #cbd5e1', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span className="label" style={{ margin: 0 }}>Đơn vị quy đổi phụ (nếu có)</span>
                      <button type="button" className="btn-action btn-select" onClick={addAlternativeUnit}>
                        Thêm đơn vị quy đổi
                      </button>
                    </div>

                    {formMedicine.alternativeUnits && formMedicine.alternativeUnits.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {formMedicine.alternativeUnits.map((alt, index) => (
                          <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 2 }}>
                              <SearchableSelect
                                options={unitsList}
                                value={alt.unitID}
                                onChange={(val) => handleAltUnitChange(index, 'unitID', val)}
                                idKey="unitID"
                                nameKey="unitName"
                                placeholder="Chọn đơn vị phụ..."
                              />
                            </div>
                            <span style={{ fontSize: '14px', color: '#64748b' }}>Tỉ lệ: 1 {alt.unitName} = </span>
                            <input
                              type="number"
                              className="input"
                              style={{ flex: 1, padding: '8px' }}
                              value={alt.conversionRate}
                              onChange={(e) => handleAltUnitChange(index, 'conversionRate', e.target.value)}
                              placeholder="Số lượng"
                              required
                            />
                            <span style={{ fontSize: '14px', color: '#64748b' }}>{formMedicine.baseUnit.unitName}</span>
                            <button
                              type="button"
                              className="btn-action btn-delete"
                              style={{ padding: '8px 12px' }}
                              onClick={() => removeAlternativeUnit(index)}
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Chưa thiết lập đơn vị quy đổi phụ nào cho thuốc này.</p>
                    )}
                  </div>

                  <div className="form-actions form-group-full">
                    <button type="button" className="btn-action btn-cancel" onClick={() => setFormMode(null)}>
                      Hủy bỏ
                    </button>
                    <button type="submit" className="btn-action btn-select">
                      Lưu lại
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="medicine-detail-card">
                {selectedMedicine ? (
                  <>
                    <div className="medicine-header-actions">
                      <h2 className="medicine-header-title">Thông Tin Chi Tiết Thuốc</h2>
                      {(role === 'Admin' || role === 'Product_manager') && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-action btn-edit" onClick={handleEditClick}>
                            Chỉnh sửa
                          </button>
                          <button className="btn-action btn-delete" onClick={() => handleDelete(selectedMedicine.medicineID)}>
                            Xóa thuốc
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="medicine-layout">
                      {/* Cột trái: Ảnh sản phẩm thực tế */}
                      <div className="medicine-image-box">
                        <img src={selectedMedicine.image} alt={selectedMedicine.medicineName} className="medicine-img" />
                      </div>
                      {/* Cột phải: Dòng chi tiết thuộc tính */}
                      <div className="medicine-info-list">
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Mã thuốc:</span> {selectedMedicine.medicineID}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Tên thuốc:</span> <strong>{selectedMedicine.medicineName}</strong>
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Thành phần:</span> {selectedMedicine.ingredients}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Nhóm danh mục:</span> {selectedMedicine.catalog.catalogName}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Nước sản xuất:</span> {selectedMedicine.origin.originName}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Đơn giá cơ bản:</span> <span style={{ color: '#059669', fontWeight: 'bold' }}>{selectedMedicine.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} VND / {selectedMedicine.baseUnit.unitName}</span>
                        </div>

                        {/* HIỂN THỊ DANH SÁCH ĐƠN VỊ QUY ĐỔI PHỤ VÀ TỰ ĐỘNG TÍNH GIÁ */}
                        {selectedMedicine.alternativeUnits && selectedMedicine.alternativeUnits.length > 0 && (
                          <div style={{ marginTop: '16px' }}>
                            <span className="medicine-info-label" style={{ display: 'block', marginBottom: '6px' }}>Đơn vị quy đổi:</span>
                            <div className="alt-units-container">
                              {selectedMedicine.alternativeUnits.map((alt) => (
                                <div key={alt.unitID} className="alt-unit-badge">
                                  <span className="alt-unit-title">{alt.unitName}</span>
                                  <span>Tỉ lệ: 1 {alt.unitName} = {alt.conversionRate} {selectedMedicine.baseUnit.unitName}</span>
                                  <span className="alt-unit-price">{(selectedMedicine.unitPrice * alt.conversionRate).toLocaleString('en-US', { minimumFractionDigits: 2 })} VND</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    <h2 className="medicine-header-title" style={{ marginBottom: '10px' }}>Không có thuốc nào được chọn</h2>
                    <p>Vui lòng chọn một thuốc từ danh sách bên dưới hoặc bấm nút "Thêm mới thuốc" để bắt đầu.</p>
                  </div>
                )}
              </div>
            )}

            {/* KHUNG DƯỚI: DANH SÁCH BẢNG CHỌN THUỐC */}
            <div className="content-card">
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>Danh sách thuốc</h2>

              <div className="table-actions">
                <div className="advanced-search-group">
                  <select
                    className="search-select"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                  >
                    <option value="medicineName">Tên thuốc</option>
                    <option value="medicineID">Mã thuốc</option>
                    <option value="ingredients">Thành phần</option>
                    <option value="catalog">Nhóm thuốc</option>
                    <option value="origin">Nước sản xuất</option>
                  </select>
                  <input
                    type="text"
                    placeholder={`Tìm kiếm theo ${searchField === 'medicineName' ? 'tên thuốc' :
                      searchField === 'medicineID' ? 'mã thuốc' :
                        searchField === 'ingredients' ? 'thành phần' :
                          searchField === 'catalog' ? 'nhóm thuốc' : 'nước sản xuất'
                      }...`}
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={searchMedicine}
                    onChange={(e) => setSearchMedicine(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchMedicines(searchMedicine, searchField);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => fetchMedicines(searchMedicine, searchField)}
                  >
                    Tìm kiếm
                  </button>
                  {searchMedicine && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={async () => {
                        setSearchMedicine('');
                        setSearchField('medicineName');
                        const freshList = await fetchMedicines('', '', 1);
                        if (freshList.length > 0) {
                          setSelectedMedicine(freshList[0]);
                        }
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
                {(role === 'Admin' || role === 'Product_manager') && (
                  <button className="btn-create" onClick={handleAddNewClick}>
                    Thêm mới thuốc
                  </button>
                )}
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mã thuốc</th>
                      <th>Tên thuốc</th>
                      <th>Đơn vị cơ bản</th>
                      <th>Đơn giá gốc</th>
                      <th>Nhóm thuốc</th>
                      <th>Nước sản xuất</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((item) => (
                        <tr key={item.medicineID} style={selectedMedicine && selectedMedicine.medicineID === item.medicineID ? { backgroundColor: '#f0fdf4' } : {}}>
                          <td style={{ fontWeight: '600' }}>{item.medicineID}</td>
                          <td>{item.medicineName}</td>
                          <td>{item.baseUnit.unitName}</td>
                          <td style={{ color: '#059669', fontWeight: '500' }}>{item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} VND</td>
                          <td>{item.catalog.catalogName}</td>
                          <td>{item.origin.originName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-action btn-select"
                              style={{ marginRight: '6px' }}
                              onClick={() => {
                                setSelectedMedicine(item);
                                setFormMode(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              Chọn
                            </button>
                            {(role === 'Admin' || role === 'Product_manager') && (
                              <button
                                className="btn-action btn-delete"
                                onClick={() => handleDelete(item.medicineID)}
                              >
                                Xóa
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy loại thuốc nào phù hợp.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalItems > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Hiển thị {Math.min((currentPage - 1) * 10 + 1, totalItems)} - {Math.min(currentPage * 10, totalItems)} của {totalItems} thuốc
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-buttons">
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => fetchMedicines(searchMedicine, searchField, currentPage - 1)}
                      >
                        ◀ Trang trước
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => fetchMedicines(searchMedicine, searchField, page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => fetchMedicines(searchMedicine, searchField, currentPage + 1)}
                      >
                        Trang sau ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }

      /* MÀN HÌNH 2: DANH MỤC (Catalog Manager) */
      case 'catalog': {
        const filtered = paginatedCatalogs;

        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH BẢNG */}
            <div className="split-left content-card">
              <h1 className="content-title">Quản Lý Danh Mục Nhóm Thuốc</h1>

              <div className="table-actions">
                <div className="advanced-search-group" style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm Mã danh mục, Tên danh mục..."
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={searchCatalog}
                    onChange={(e) => setSearchCatalog(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchCatalogs(1, searchCatalog);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => fetchCatalogs(1, searchCatalog)}
                  >
                    Tìm kiếm
                  </button>
                  {searchCatalog && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setSearchCatalog('');
                        fetchCatalogs(1, '');
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mã danh mục</th>
                      <th>Tên danh mục</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((item) => (
                        <tr key={item.catalogID} style={catalogForm.catalogID === item.catalogID ? { backgroundColor: '#f0fdf4' } : {}}>
                          <td style={{ fontWeight: '600' }}>{item.catalogID}</td>
                          <td>{item.catalogName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleCatalogEditClick(item)}
                              disabled={role === 'Sales'}
                              style={role === 'Sales' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleCatalogDelete(item.catalogID)}
                              disabled={role === 'Sales'}
                              style={role === 'Sales' ? { opacity: 0.5, cursor: 'not-allowed', marginLeft: '6px' } : { marginLeft: '6px' }}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy danh mục nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {catalogTotalItems > 0 && (
                <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                  <div className="pagination-info" style={{ fontSize: '12px' }}>
                    Hiển thị {Math.min((catalogCurrentPage - 1) * 10 + 1, catalogTotalItems)} - {Math.min(catalogCurrentPage * 10, catalogTotalItems)} của {catalogTotalItems} danh mục
                  </div>
                  {catalogTotalPages > 1 && (
                    <div className="pagination-buttons" style={{ gap: '4px' }}>
                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={catalogCurrentPage === 1}
                        onClick={() => fetchCatalogs(catalogCurrentPage - 1)}
                      >
                        ◀
                      </button>

                      {Array.from({ length: catalogTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${catalogCurrentPage === page ? 'active' : ''}`}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={() => fetchCatalogs(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={catalogCurrentPage === catalogTotalPages}
                        onClick={() => fetchCatalogs(catalogCurrentPage + 1)}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: FORM THÊM / SỬA */}
            <div className="split-right content-card" style={{ borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', background: '#ffffff', border: '1px solid #e2e8f0', opacity: role === 'Sales' ? 0.75 : 1 }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                {catalogFormMode === 'add' ? 'Thêm Mới Danh Mục' : '✏️ Hiệu Chỉnh Danh Mục'}
              </h2>
              <form onSubmit={role === 'Sales' ? (e) => e.preventDefault() : handleCatalogSave}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Mã danh mục:</label>
                  <input
                    type="text"
                    className="input"
                    style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px', cursor: role === 'Sales' ? 'not-allowed' : 'text' }}
                    value={catalogForm.catalogID}
                    onChange={(e) => setCatalogForm({ ...catalogForm, catalogID: e.target.value })}
                    disabled={catalogFormMode === 'edit' || role === 'Sales'}
                    placeholder="VD: THUOC-GIAM-DAU"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Tên danh mục:</label>
                  <input
                    type="text"
                    className="input"
                    style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px', cursor: role === 'Sales' ? 'not-allowed' : 'text' }}
                    value={catalogForm.catalogName}
                    onChange={(e) => setCatalogForm({ ...catalogForm, catalogName: e.target.value })}
                    disabled={role === 'Sales'}
                    placeholder="VD: Thuốc giảm đau, hạ sốt"
                    required
                  />
                </div>
                <div className="form-actions" style={{ marginTop: '24px', gap: '8px' }}>
                  {catalogFormMode === 'edit' && (
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      style={{ padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: role === 'Sales' ? 'not-allowed' : 'pointer', opacity: role === 'Sales' ? 0.5 : 1 }}
                      onClick={handleCatalogCancel}
                      disabled={role === 'Sales'}
                    >
                      Hủy bỏ
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-action btn-select"
                    style={{ flexGrow: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: role === 'Sales' ? 'not-allowed' : 'pointer', opacity: role === 'Sales' ? 0.5 : 1 }}
                    disabled={role === 'Sales'}
                  >
                    {catalogFormMode === 'add' ? 'Thêm mới' : 'Lưu lại'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }

      /* MÀN HÌNH 3: ĐƠN VỊ TÍNH (Unit Manager) */
      case 'unit': {
        const filtered = paginatedUnits;

        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH BẢNG */}
            <div className="split-left content-card">
              <h1 className="content-title">Quản Lý Đơn Vị Tính</h1>

              <div className="table-actions">
                <div className="advanced-search-group" style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm Mã đơn vị tính, Tên đơn vị tính..."
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={searchUnit}
                    onChange={(e) => setSearchUnit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchUnits(1, searchUnit);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => fetchUnits(1, searchUnit)}
                  >
                    Tìm kiếm
                  </button>
                  {searchUnit && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setSearchUnit('');
                        fetchUnits(1, '');
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mã đơn vị tính</th>
                      <th>Tên đơn vị tính</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((item) => (
                        <tr key={item.unitID} style={unitForm.unitID === item.unitID ? { backgroundColor: '#f0fdf4' } : {}}>
                          <td style={{ fontWeight: '600' }}>{item.unitID}</td>
                          <td>{item.unitName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleUnitEditClick(item)}
                              disabled={role === 'Sales'}
                              style={role === 'Sales' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleUnitDelete(item.unitID)}
                              disabled={role === 'Sales'}
                              style={role === 'Sales' ? { opacity: 0.5, cursor: 'not-allowed', marginLeft: '6px' } : { marginLeft: '6px' }}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy đơn vị nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {unitTotalItems > 0 && (
                <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                  <div className="pagination-info" style={{ fontSize: '12px' }}>
                    Hiển thị {Math.min((unitCurrentPage - 1) * 10 + 1, unitTotalItems)} - {Math.min(unitCurrentPage * 10, unitTotalItems)} của {unitTotalItems} đơn vị tính
                  </div>
                  {unitTotalPages > 1 && (
                    <div className="pagination-buttons" style={{ gap: '4px' }}>
                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={unitCurrentPage === 1}
                        onClick={() => fetchUnits(unitCurrentPage - 1)}
                      >
                        ◀
                      </button>

                      {Array.from({ length: unitTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${unitCurrentPage === page ? 'active' : ''}`}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={() => fetchUnits(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={unitCurrentPage === unitTotalPages}
                        onClick={() => fetchUnits(unitCurrentPage + 1)}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: FORM THÊM / SỬA */}
            <div className="split-right content-card" style={{ borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', background: '#ffffff', border: '1px solid #e2e8f0', opacity: role === 'Sales' ? 0.75 : 1 }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                {unitFormMode === 'add' ? 'Thêm Mới Đơn Vị' : '✏️ Hiệu Chỉnh Đơn Vị'}
              </h2>
              <form onSubmit={role === 'Sales' ? (e) => e.preventDefault() : handleUnitSave}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Mã đơn vị tính:</label>
                  <input
                    type="text"
                    className="input"
                    style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px', cursor: role === 'Sales' ? 'not-allowed' : 'text' }}
                    value={unitForm.unitID}
                    onChange={(e) => setUnitForm({ ...unitForm, unitID: e.target.value })}
                    disabled={unitFormMode === 'edit' || role === 'Sales'}
                    placeholder="VD: VIEN"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Tên đơn vị tính:</label>
                  <input
                    type="text"
                    className="input"
                    style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px', cursor: role === 'Sales' ? 'not-allowed' : 'text' }}
                    value={unitForm.unitName}
                    onChange={(e) => setUnitForm({ ...unitForm, unitName: e.target.value })}
                    disabled={role === 'Sales'}
                    placeholder="VD: Viên"
                    required
                  />
                </div>
                <div className="form-actions" style={{ marginTop: '24px', gap: '8px' }}>
                  {unitFormMode === 'edit' && (
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      style={{ padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: role === 'Sales' ? 'not-allowed' : 'pointer', opacity: role === 'Sales' ? 0.5 : 1 }}
                      onClick={handleUnitCancel}
                      disabled={role === 'Sales'}
                    >
                      Hủy bỏ
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-action btn-select"
                    style={{ flexGrow: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: role === 'Sales' ? 'not-allowed' : 'pointer', opacity: role === 'Sales' ? 0.5 : 1 }}
                    disabled={role === 'Sales'}
                  >
                    {unitFormMode === 'add' ? 'Thêm mới' : 'Lưu lại'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }

      /* MÀN HÌNH 4: NƯỚC SẢN XUẤT (Origin Manager) */
      case 'origin': {
        const filtered = paginatedOrigins;

        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH BẢNG */}
            <div className="split-left content-card">
              <h1 className="content-title">Quản Lý Xuất Xứ</h1>

              <div className="table-actions">
                <div className="advanced-search-group" style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm Mã nước sản xuất, Tên nước sản xuất..."
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={searchOrigin}
                    onChange={(e) => setSearchOrigin(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchOrigins(1, searchOrigin);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => fetchOrigins(1, searchOrigin)}
                  >
                    Tìm kiếm
                  </button>
                  {searchOrigin && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setSearchOrigin('');
                        fetchOrigins(1, '');
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mã xuất xứ</th>
                      <th>Tên quốc gia</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((item) => (
                        <tr key={item.originID} style={originForm.originID === item.originID ? { backgroundColor: '#f0fdf4' } : {}}>
                          <td style={{ fontWeight: '600' }}>{item.originID}</td>
                          <td>{item.originName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleOriginEditClick(item)}
                              disabled={role === 'Sales'}
                              style={role === 'Sales' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleOriginDelete(item.originID)}
                              disabled={role === 'Sales'}
                              style={role === 'Sales' ? { opacity: 0.5, cursor: 'not-allowed', marginLeft: '6px' } : { marginLeft: '6px' }}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy quốc gia nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {originTotalItems > 0 && (
                <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                  <div className="pagination-info" style={{ fontSize: '12px' }}>
                    Hiển thị {Math.min((originCurrentPage - 1) * 10 + 1, originTotalItems)} - {Math.min(originCurrentPage * 10, originTotalItems)} của {originTotalItems} nước sản xuất
                  </div>
                  {originTotalPages > 1 && (
                    <div className="pagination-buttons" style={{ gap: '4px' }}>
                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={originCurrentPage === 1}
                        onClick={() => fetchOrigins(originCurrentPage - 1)}
                      >
                        ◀
                      </button>

                      {Array.from({ length: originTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${originCurrentPage === page ? 'active' : ''}`}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={() => fetchOrigins(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={originCurrentPage === originTotalPages}
                        onClick={() => fetchOrigins(originCurrentPage + 1)}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: FORM THÊM / SỬA */}
            <div className="split-right content-card" style={{ borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', background: '#ffffff', border: '1px solid #e2e8f0', opacity: role === 'Sales' ? 0.75 : 1 }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                {originFormMode === 'add' ? 'Thêm Mới Xuất Xứ' : '✏️ Hiệu Chỉnh Xuất Xứ'}
              </h2>
              <form onSubmit={role === 'Sales' ? (e) => e.preventDefault() : handleOriginSave}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Mã xuất xứ:</label>
                  <input
                    type="text"
                    className="input"
                    style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px', cursor: role === 'Sales' ? 'not-allowed' : 'text' }}
                    value={originForm.originID}
                    onChange={(e) => setOriginForm({ ...originForm, originID: e.target.value })}
                    disabled={originFormMode === 'edit' || role === 'Sales'}
                    placeholder="VD: VN"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Tên quốc gia:</label>
                  <input
                    type="text"
                    className="input"
                    style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px', cursor: role === 'Sales' ? 'not-allowed' : 'text' }}
                    value={originForm.originName}
                    onChange={(e) => setOriginForm({ ...originForm, originName: e.target.value })}
                    disabled={role === 'Sales'}
                    placeholder="VD: Việt Nam"
                    required
                  />
                </div>
                <div className="form-actions" style={{ marginTop: '24px', gap: '8px' }}>
                  {originFormMode === 'edit' && (
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      style={{ padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: role === 'Sales' ? 'not-allowed' : 'pointer', opacity: role === 'Sales' ? 0.5 : 1 }}
                      onClick={handleOriginCancel}
                      disabled={role === 'Sales'}
                    >
                      Hủy bỏ
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-action btn-select"
                    style={{ flexGrow: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: role === 'Sales' ? 'not-allowed' : 'pointer', opacity: role === 'Sales' ? 0.5 : 1 }}
                    disabled={role === 'Sales'}
                  >
                    {originFormMode === 'add' ? 'Thêm mới' : 'Lưu lại'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }

      /* PHÂN HỆ KHO THUỐC */
      case 'warehouse_inventory': {
        const handleInventorySearch = () => {
          setActiveSearchInventory(searchInventory);
          setActiveFilterCatalog(filterCatalog);
          setActiveFilterOrigin(filterOrigin);
          setActiveFilterMinStock(filterMinStock);
          setActiveFilterMaxStock(filterMaxStock);
          setActiveFilterStartExpiry(filterStartExpiry);
          setActiveFilterEndExpiry(filterEndExpiry);
          fetchInventory(
            1,
            searchInventory,
            filterInventoryType,
            filterCatalog,
            filterOrigin,
            filterMinStock,
            filterMaxStock,
            filterStartExpiry,
            filterEndExpiry
          );
        };

        return (
          <div className="content-card">
            <h1 className="content-title">Quản Lý Tồn Kho Thực Tế</h1>

            <div className="search-panel">
              {/* Main Search & Advanced Filter Toggle */}
              <div className="search-panel-main" style={{ gap: '10px', alignItems: 'center' }}>
                <div className="search-input-wrapper" style={{ flexGrow: 1 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-input-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm theo tên thuốc, mã lô hoặc hoạt chất chính..."
                    className="search-input search-input-with-icon"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={searchInventory}
                    onChange={(e) => setSearchInventory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleInventorySearch();
                      }
                    }}
                  />
                  {searchInventory && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => {
                        setSearchInventory('');
                        setActiveSearchInventory('');
                        fetchInventory(
                          1,
                          '',
                          filterInventoryType,
                          activeFilterCatalog,
                          activeFilterOrigin,
                          activeFilterMinStock,
                          activeFilterMaxStock,
                          activeFilterStartExpiry,
                          activeFilterEndExpiry
                        );
                      }}
                      title="Xóa tìm kiếm"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-create"
                  style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                  onClick={handleInventorySearch}
                >
                  Tìm kiếm
                </button>
                {(searchInventory || filterCatalog || filterOrigin || filterMinStock || filterMaxStock || filterStartExpiry || filterEndExpiry || filterInventoryType !== 'ALL' || activeSearchInventory || activeFilterCatalog || activeFilterOrigin || activeFilterMinStock || activeFilterMaxStock || activeFilterStartExpiry || activeFilterEndExpiry) && (
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setSearchInventory('');
                      setFilterCatalog('');
                      setFilterOrigin('');
                      setFilterMinStock('');
                      setFilterMaxStock('');
                      setFilterStartExpiry('');
                      setFilterEndExpiry('');
                      setFilterInventoryType('ALL');

                      setActiveSearchInventory('');
                      setActiveFilterCatalog('');
                      setActiveFilterOrigin('');
                      setActiveFilterMinStock('');
                      setActiveFilterMaxStock('');
                      setActiveFilterStartExpiry('');
                      setActiveFilterEndExpiry('');
                      fetchInventory(1, '', 'ALL', '', '', '', '', '', '');
                    }}
                  >
                    Đặt lại
                  </button>
                )}

                <button
                  type="button"
                  className={`btn-toggle-advanced ${showAdvanced ? 'active' : ''}`}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Bộ lọc nâng cao
                </button>
              </div>

              {/* Status Quick Filter Chips */}
              <div className="filter-chips-container">
                <button
                  type="button"
                  className={`filter-chip ${filterInventoryType === 'ALL' ? 'active-all' : ''}`}
                  onClick={() => {
                    setFilterInventoryType('ALL');
                    fetchInventory(1, activeSearchInventory, 'ALL', activeFilterCatalog, activeFilterOrigin, activeFilterMinStock, activeFilterMaxStock, activeFilterStartExpiry, activeFilterEndExpiry);
                  }}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterInventoryType === 'LOW_STOCK' ? 'active-low-stock' : ''}`}
                  onClick={() => {
                    setFilterInventoryType('LOW_STOCK');
                    fetchInventory(1, activeSearchInventory, 'LOW_STOCK', activeFilterCatalog, activeFilterOrigin, activeFilterMinStock, activeFilterMaxStock, activeFilterStartExpiry, activeFilterEndExpiry);
                  }}
                >
                  Tồn kho thấp (&lt; 20)
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterInventoryType === 'NEAR_EXPIRY' ? 'active-near-expiry' : ''}`}
                  onClick={() => {
                    setFilterInventoryType('NEAR_EXPIRY');
                    fetchInventory(1, activeSearchInventory, 'NEAR_EXPIRY', activeFilterCatalog, activeFilterOrigin, activeFilterMinStock, activeFilterMaxStock, activeFilterStartExpiry, activeFilterEndExpiry);
                  }}
                >
                  Sắp hết hạn (&lt; 6 tháng)
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterInventoryType === 'EXPIRED' ? 'active-expired' : ''}`}
                  onClick={() => {
                    setFilterInventoryType('EXPIRED');
                    fetchInventory(1, activeSearchInventory, 'EXPIRED', activeFilterCatalog, activeFilterOrigin, activeFilterMinStock, activeFilterMaxStock, activeFilterStartExpiry, activeFilterEndExpiry);
                  }}
                >
                  Đã hết hạn
                </button>
              </div>

              {/* Collapsible Advanced Filters Panel */}
              {showAdvanced && (
                <div className="advanced-filter-panel">
                  <div className="advanced-filter-group">
                    <label className="advanced-filter-label">Nhóm Danh Mục</label>
                    <select
                      className="advanced-filter-input"
                      value={filterCatalog}
                      onChange={(e) => setFilterCatalog(e.target.value)}
                    >
                      <option value="">Tất cả danh mục</option>
                      {catalogsList.map((cat) => (
                        <option key={cat.catalogID} value={cat.catalogID}>
                          {cat.catalogName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="advanced-filter-group">
                    <label className="advanced-filter-label">Nước Sản Xuất</label>
                    <select
                      className="advanced-filter-input"
                      value={filterOrigin}
                      onChange={(e) => setFilterOrigin(e.target.value)}
                    >
                      <option value="">Tất cả xuất xứ</option>
                      {originsList.map((ori) => (
                        <option key={ori.originID} value={ori.originID}>
                          {ori.originName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="advanced-filter-group">
                    <label className="advanced-filter-label">Số Lượng Tồn</label>
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        className="advanced-filter-input"
                        style={{ width: '100%' }}
                        value={filterMinStock}
                        onChange={(e) => setFilterMinStock(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInventorySearch();
                          }
                        }}
                      />
                      <span style={{ color: '#94a3b8' }}>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="advanced-filter-input"
                        style={{ width: '100%' }}
                        value={filterMaxStock}
                        onChange={(e) => setFilterMaxStock(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInventorySearch();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="advanced-filter-group">
                    <label className="advanced-filter-label">Hạn Sử Dụng</label>
                    <div className="range-inputs">
                      <input
                        type="date"
                        className="advanced-filter-input"
                        style={{ width: '100%' }}
                        value={filterStartExpiry}
                        onChange={(e) => setFilterStartExpiry(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInventorySearch();
                          }
                        }}
                      />
                      <span style={{ color: '#94a3b8' }}>-</span>
                      <input
                        type="date"
                        className="advanced-filter-input"
                        style={{ width: '100%' }}
                        value={filterEndExpiry}
                        onChange={(e) => setFilterEndExpiry(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInventorySearch();
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filter Tags */}
              {(activeSearchInventory || filterInventoryType !== 'ALL' || activeFilterCatalog || activeFilterOrigin || activeFilterMinStock !== '' || activeFilterMaxStock !== '' || activeFilterStartExpiry || activeFilterEndExpiry) && (
                <div className="active-tags-container">
                  <span className="active-tag-label">Đang lọc theo:</span>
                  {activeSearchInventory && (
                    <span className="active-tag">
                      Từ khóa: "{activeSearchInventory}"
                      <button type="button" className="active-tag-remove" onClick={() => {
                        setSearchInventory('');
                        setActiveSearchInventory('');
                        fetchInventory(
                          1,
                          '',
                          filterInventoryType,
                          activeFilterCatalog,
                          activeFilterOrigin,
                          activeFilterMinStock,
                          activeFilterMaxStock,
                          activeFilterStartExpiry,
                          activeFilterEndExpiry
                        );
                      }}>✕</button>
                    </span>
                  )}
                  {filterInventoryType !== 'ALL' && (
                    <span className="active-tag">
                      Trạng thái: {
                        filterInventoryType === 'LOW_STOCK' ? 'Tồn kho thấp' :
                          filterInventoryType === 'NEAR_EXPIRY' ? 'Sắp hết hạn' : 'Đã hết hạn'
                      }
                      <button type="button" className="active-tag-remove" onClick={() => {
                        setFilterInventoryType('ALL');
                        fetchInventory(
                          1,
                          activeSearchInventory,
                          'ALL',
                          activeFilterCatalog,
                          activeFilterOrigin,
                          activeFilterMinStock,
                          activeFilterMaxStock,
                          activeFilterStartExpiry,
                          activeFilterEndExpiry
                        );
                      }}>✕</button>
                    </span>
                  )}
                  {activeFilterCatalog && (
                    <span className="active-tag">
                      Danh mục: {catalogsList.find(c => c.catalogID === activeFilterCatalog)?.catalogName || activeFilterCatalog}
                      <button type="button" className="active-tag-remove" onClick={() => {
                        setFilterCatalog('');
                        setActiveFilterCatalog('');
                        fetchInventory(
                          1,
                          activeSearchInventory,
                          filterInventoryType,
                          '',
                          activeFilterOrigin,
                          activeFilterMinStock,
                          activeFilterMaxStock,
                          activeFilterStartExpiry,
                          activeFilterEndExpiry
                        );
                      }}>✕</button>
                    </span>
                  )}
                  {activeFilterOrigin && (
                    <span className="active-tag">
                      Xuất xứ: {originsList.find(o => o.originID === activeFilterOrigin)?.originName || activeFilterOrigin}
                      <button type="button" className="active-tag-remove" onClick={() => {
                        setFilterOrigin('');
                        setActiveFilterOrigin('');
                        fetchInventory(
                          1,
                          activeSearchInventory,
                          filterInventoryType,
                          activeFilterCatalog,
                          '',
                          activeFilterMinStock,
                          activeFilterMaxStock,
                          activeFilterStartExpiry,
                          activeFilterEndExpiry
                        );
                      }}>✕</button>
                    </span>
                  )}
                  {(activeFilterMinStock !== '' || activeFilterMaxStock !== '') && (
                    <span className="active-tag">
                      Tồn kho: {activeFilterMinStock !== '' ? `≥${activeFilterMinStock}` : ''} {activeFilterMaxStock !== '' ? `≤${activeFilterMaxStock}` : ''}
                      <button type="button" className="active-tag-remove" onClick={() => {
                        setFilterMinStock('');
                        setFilterMaxStock('');
                        setActiveFilterMinStock('');
                        setActiveFilterMaxStock('');
                        fetchInventory(
                          1,
                          activeSearchInventory,
                          filterInventoryType,
                          activeFilterCatalog,
                          activeFilterOrigin,
                          '',
                          '',
                          activeFilterStartExpiry,
                          activeFilterEndExpiry
                        );
                      }}>✕</button>
                    </span>
                  )}
                  {(activeFilterStartExpiry || activeFilterEndExpiry) && (
                    <span className="active-tag">
                      Hạn dùng: {activeFilterStartExpiry ? `từ ${activeFilterStartExpiry}` : ''} {activeFilterEndExpiry ? `đến ${activeFilterEndExpiry}` : ''}
                      <button type="button" className="active-tag-remove" onClick={() => {
                        setFilterStartExpiry('');
                        setFilterEndExpiry('');
                        setActiveFilterStartExpiry('');
                        setActiveFilterEndExpiry('');
                        fetchInventory(
                          1,
                          activeSearchInventory,
                          filterInventoryType,
                          activeFilterCatalog,
                          activeFilterOrigin,
                          activeFilterMinStock,
                          activeFilterMaxStock,
                          '',
                          ''
                        );
                      }}>✕</button>
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={() => {
                      setSearchInventory('');
                      setFilterCatalog('');
                      setFilterOrigin('');
                      setFilterMinStock('');
                      setFilterMaxStock('');
                      setFilterStartExpiry('');
                      setFilterEndExpiry('');
                      setFilterInventoryType('ALL');

                      setActiveSearchInventory('');
                      setActiveFilterCatalog('');
                      setActiveFilterOrigin('');
                      setActiveFilterMinStock('');
                      setActiveFilterMaxStock('');
                      setActiveFilterStartExpiry('');
                      setActiveFilterEndExpiry('');
                      fetchInventory(1, '', 'ALL', '', '', '', '', '', '');
                    }}
                  >
                    Đặt lại tất cả
                  </button>
                </div>
              )}
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Tên Thuốc</th>
                    <th>Mã Lô</th>
                    <th>Ngày Sản Xuất</th>
                    <th>Hạn Sử Dụng</th>
                    <th>Số Lượng Tồn</th>
                    <th>Đơn Vị Gốc</th>
                    <th>Trạng Thái</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoriesList.length > 0 ? (
                    inventoriesList.map((item) => {
                      const isExpired = item.expiryDate && new Date(item.expiryDate) <= new Date();
                      const isNearExpiry = item.expiryDate && !isExpired && new Date(item.expiryDate) <= new Date(new Date().setMonth(new Date().getMonth() + 6));
                      const isLowStock = item.stockQuantity < 20;

                      let statusBadge = <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: '#d1fae5', color: '#065f46' }}>Bình thường</span>;
                      if (item.status === 'SOLD_OUT') {
                        statusBadge = <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: '#e2e8f0', color: '#475569' }}>Bán hết</span>;
                      } else if (item.status === 'DISPOSED') {
                        statusBadge = <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#d97706' }}>Đã xuất hủy</span>;
                      } else if (item.status === 'ADJUSTED') {
                        statusBadge = <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: '#f3e8ff', color: '#7c3aed' }}>Kiểm kê về 0</span>;
                      } else if (isExpired) {
                        statusBadge = <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: '#fee2e2', color: '#991b1b' }}>Đã hết hạn</span>;
                      } else if (isNearExpiry) {
                        statusBadge = <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: '#ffedd5', color: '#9a3412' }}>Cận hạn</span>;
                      } else if (isLowStock) {
                        statusBadge = <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: '#fef9c3', color: '#854d0e' }}>Tồn kho thấp</span>;
                      }


                      return (
                        <tr key={item.id}>
                          <td style={{ fontWeight: '600' }}>{item.medicine.medicineName}</td>
                          <td style={{ fontFamily: 'monospace' }}>{item.batchId}</td>
                          <td>{item.manufacturedDate || '---'}</td>
                          <td>{item.expiryDate}</td>
                          <td style={{ fontWeight: '700' }}>{item.stockQuantity}</td>
                          <td>{item.medicine.baseUnit.unitName}</td>
                          <td>{statusBadge}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="btn-action btn-select"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                              onClick={() => setSelectedInvMedicine(item.medicine)}
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không có dữ liệu tồn kho lô nào phù hợp.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {inventoryTotalItems > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Hiển thị {Math.min((inventoryCurrentPage - 1) * 10 + 1, inventoryTotalItems)} - {Math.min(inventoryCurrentPage * 10, inventoryTotalItems)} của {inventoryTotalItems} dòng lô
                </div>
                {inventoryTotalPages > 1 && (
                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={inventoryCurrentPage === 1}
                      onClick={() => fetchInventory(inventoryCurrentPage - 1, activeSearchInventory, filterInventoryType, activeFilterCatalog, activeFilterOrigin, activeFilterMinStock, activeFilterMaxStock, activeFilterStartExpiry, activeFilterEndExpiry)}
                    >
                      ◀ Trước
                    </button>
                    {Array.from({ length: inventoryTotalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`pagination-btn ${inventoryCurrentPage === p ? 'active' : ''}`}
                        onClick={() => fetchInventory(p, activeSearchInventory, filterInventoryType, activeFilterCatalog, activeFilterOrigin, activeFilterMinStock, activeFilterMaxStock, activeFilterStartExpiry, activeFilterEndExpiry)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={inventoryCurrentPage === inventoryTotalPages}
                      onClick={() => fetchInventory(inventoryCurrentPage + 1, activeSearchInventory, filterInventoryType, activeFilterCatalog, activeFilterOrigin, activeFilterMinStock, activeFilterMaxStock, activeFilterStartExpiry, activeFilterEndExpiry)}
                    >
                      Sau ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Medicine Detail Centered Modal */}
            {selectedInvMedicine && (
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1100
              }}>
                <div className="content-card" style={{
                  width: '800px',
                  maxWidth: '95%',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  padding: '24px',
                  position: 'relative',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
                    <h2 className="medicine-header-title" style={{ margin: 0 }}>Thông Tin Chi Tiết Thuốc</h2>
                    <button
                      type="button"
                      className="btn-action btn-delete"
                      style={{ padding: '4px 12px' }}
                      onClick={() => setSelectedInvMedicine(null)}
                    >
                      Đóng x
                    </button>
                  </div>

                  <div className="medicine-layout">
                    {/* Cột trái: Ảnh sản phẩm thực tế */}
                    <div className="medicine-image-box">
                      <img src={selectedInvMedicine.image} alt={selectedInvMedicine.medicineName} className="medicine-img" />
                    </div>
                    {/* Cột phải: Dòng chi tiết thuộc tính */}
                    <div className="medicine-info-list">
                      <div className="medicine-info-row">
                        <span className="medicine-info-label">Mã thuốc:</span> {selectedInvMedicine.medicineID}
                      </div>
                      <div className="medicine-info-row">
                        <span className="medicine-info-label">Tên thuốc:</span> <strong>{selectedInvMedicine.medicineName}</strong>
                      </div>
                      <div className="medicine-info-row">
                        <span className="medicine-info-label">Thành phần:</span> {selectedInvMedicine.ingredients}
                      </div>
                      <div className="medicine-info-row">
                        <span className="medicine-info-label">Nhóm danh mục:</span> {selectedInvMedicine.catalog?.catalogName || '---'}
                      </div>
                      <div className="medicine-info-row">
                        <span className="medicine-info-label">Nước sản xuất:</span> {selectedInvMedicine.origin?.originName || '---'}
                      </div>
                      <div className="medicine-info-row">
                        <span className="medicine-info-label">Đơn giá cơ bản:</span> <span style={{ color: '#059669', fontWeight: 'bold' }}>{(selectedInvMedicine.unitPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} VND / {selectedInvMedicine.baseUnit?.unitName || '---'}</span>
                      </div>

                      {/* HIỂN THỊ DANH SÁCH ĐƠN VỊ QUY ĐỔI PHỤ VÀ TỰ ĐỘNG TÍNH GIÁ */}
                      {selectedInvMedicine.alternativeUnits && selectedInvMedicine.alternativeUnits.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <span className="medicine-info-label" style={{ display: 'block', marginBottom: '6px' }}>Đơn vị quy đổi:</span>
                          <div className="alt-units-container">
                            {selectedInvMedicine.alternativeUnits.map((alt) => {
                              const uName = alt.unitName || alt.unit?.unitName || alt.unitID;
                              return (
                                <div key={alt.unitID || alt.unit?.unitID} className="alt-unit-badge">
                                  <span className="alt-unit-title">{uName}</span>
                                  <span>Tỉ lệ: 1 {uName} = {alt.conversionRate} {selectedInvMedicine.baseUnit?.unitName || '---'}</span>
                                  <span className="alt-unit-price">{((selectedInvMedicine.unitPrice || 0) * alt.conversionRate).toLocaleString('en-US', { minimumFractionDigits: 2 })} VND</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <button
                      type="button"
                      className="btn-action"
                      style={{ backgroundColor: '#64748b', color: 'white', minWidth: '100px' }}
                      onClick={() => setSelectedInvMedicine(null)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'warehouse_receipt': {
        const handleAddLine = () => {
          const medsSource = allMedicines.length > 0 ? allMedicines : medicinesList;
          const detailLine = {
            medicineId: medsSource[0]?.medicineID || '',
            medicineName: medsSource[0]?.medicineName || '',
            batchId: '',
            quantity: 1,
            importPrice: 1000,
            expiryDate: new Date().toISOString().split('T')[0],
            manufacturedDate: new Date().toISOString().split('T')[0],
            transactionUnitId: medsSource[0]?.baseUnit?.unitID || '',
            conversionRate: 1
          };
          setReceiptForm(prev => ({
            ...prev,
            details: [...prev.details, detailLine]
          }));
        };

        const handleRemoveLine = (idx) => {
          setReceiptForm(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== idx)
          }));
        };

        const handleEditReceiptDraft = (item) => {
          setReceiptForm({
            receiptId: item.receiptId,
            supplierId: suppliersList.find(s => s.supplierName === item.supplierName)?.supplierID || suppliersList[0]?.supplierID || '',
            note: item.note || '',
            details: item.details ? item.details.map(d => {
              const med = allMedicines.find(m => m.medicineName === d.medicineName) || medicinesList.find(m => m.medicineName === d.medicineName);
              return {
                medicineId: d.medicineId || med?.medicineID || '',
                medicineName: d.medicineName,
                batchId: d.batchId || '',
                quantity: d.quantity || 1,
                importPrice: d.importPrice || 0,
                expiryDate: d.expiryDate ? d.expiryDate.split('T')[0] : new Date().toISOString().split('T')[0],
                manufacturedDate: d.manufacturedDate ? d.manufacturedDate.split('T')[0] : new Date().toISOString().split('T')[0],
                transactionUnitId: unitsList.find(u => u.unitName === d.transactionUnitName)?.unitID || med?.baseUnit?.unitID || '',
                conversionRate: d.conversionRate || 1
              };
            }) : []
          });
          setReceiptFormMode('add');
        };

        const handleLineChange = (idx, field, value) => {
          setReceiptForm(prev => {
            const updated = prev.details.map((line, i) => {
              if (i === idx) {
                const copy = { ...line, [field]: value };
                if (field === 'medicineId') {
                  const med = allMedicines.find(m => m.medicineID === value) || medicinesList.find(m => m.medicineID === value);
                  if (med) {
                    copy.medicineName = med.medicineName;
                    copy.transactionUnitId = med.baseUnit?.unitID || '';
                    copy.conversionRate = 1;
                  }
                }
                if (field === 'transactionUnitId') {
                  const med = allMedicines.find(m => m.medicineID === line.medicineId) || medicinesList.find(m => m.medicineID === line.medicineId);
                  if (med) {
                    if (med.baseUnit && med.baseUnit.unitID === value) {
                      copy.conversionRate = 1;
                    } else if (med.alternativeUnits) {
                      const au = med.alternativeUnits.find(u => (u.unitID || u.unit?.unitID) === value);
                      if (au) {
                        copy.conversionRate = au.conversionRate;
                      }
                    }
                  }
                }
                return copy;
              }
              return line;
            });
            return { ...prev, details: updated };
          });
        };

        const handleSaveReceiptDraft = async (e) => {
          e.preventDefault();
          if (!receiptForm.supplierId) {
            alert('Vui lòng chọn Nhà cung cấp!');
            return;
          }
          if (receiptForm.details.length === 0) {
            alert('Vui lòng thêm ít nhất một dòng thuốc nhập!');
            return;
          }

          // Business logic validations for Goods Receipt
          for (const d of receiptForm.details) {
            if (Number(d.quantity) <= 0) {
              alert('Số lượng nhập phải lớn hơn 0!');
              return;
            }
            if (Number(d.importPrice) < 0) {
              alert('Giá nhập không được âm!');
              return;
            }
            if (d.manufacturedDate && d.expiryDate && new Date(d.manufacturedDate) >= new Date(d.expiryDate)) {
              alert('Hạn sử dụng phải sau Ngày sản xuất!');
              return;
            }
          }

          try {
            await api.post('/goods-receipts', {
              receiptId: receiptForm.receiptId || null,
              supplierId: receiptForm.supplierId,
              note: receiptForm.note,
              details: receiptForm.details.map(d => ({
                medicineId: d.medicineId,
                batchId: d.batchId || 'LO-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
                quantity: Number(d.quantity) || 1,
                importPrice: Number(d.importPrice) || 0,
                expiryDate: d.expiryDate,
                manufacturedDate: d.manufacturedDate,
                transactionUnitId: d.transactionUnitId,
                conversionRate: Number(d.conversionRate) || 1
              }))
            });
            alert('Lưu phiếu nhập kho (Đang xử lý) thành công!');
            setReceiptFormMode(null);
            fetchReceipts(1);
          } catch (error) {
            console.error('Lỗi lưu phiếu nhập (Đang xử lý):', error);
            alert('Không thể lưu phiếu nhập (Đang xử lý): ' + (error.response?.data?.message || error.message));
          }
        };

        const handleConfirmReceipt = async (id) => {
          if (window.confirm(`Bạn có chắc muốn XÁC NHẬN NHẬP KHO cho phiếu ${id}? Hành động này sẽ cập nhật trực tiếp tồn kho thực tế và KHÔNG THỂ SỬA ĐỔI.`)) {
            try {
              await api.patch(`/goods-receipts/${id}/confirm`);
              alert('Xác nhận nhập kho thành công! Kho đã được cập nhật.');
              fetchReceipts(1);
            } catch (error) {
              console.error('Lỗi xác nhận nhập kho:', error);
              alert('Xác nhận nhập kho thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        const handleCancelReceipt = async (id) => {
          if (window.confirm(`Bạn có chắc muốn HỦY BỎ phiếu nhập ${id}?`)) {
            try {
              await api.patch(`/goods-receipts/${id}/cancel`);
              alert('Đã hủy phiếu nhập kho thành công.');
              fetchReceipts(1);
            } catch (error) {
              console.error('Lỗi hủy phiếu:', error);
              alert('Hủy phiếu thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        return (
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 className="content-title">Phiếu Nhập Kho</h1>
              {(role === 'Admin' || role === 'Product_manager') && (
                <button className="btn-create" onClick={() => {
                  setReceiptForm({
                    supplierId: suppliersList[0]?.supplierID || '',
                    note: '',
                    details: []
                  });
                  setReceiptFormMode('add');
                }}>
                  Lập phiếu nhập mới
                </button>
              )}
            </div>

            <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <div className="advanced-search-group" style={{ width: '100%', gap: '10px', alignItems: 'center' }}>
                <select
                  className="search-select"
                  style={{ width: '160px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  value={receiptSearchType}
                  onChange={(e) => {
                    setReceiptSearchType(e.target.value);
                    setReceiptSearchVal('');
                    setFilterReceiptStart('');
                    setFilterReceiptEnd('');
                  }}
                >
                  <option value="receiptId">Mã Phiếu</option>
                  <option value="batchId">Mã Lô</option>
                  <option value="supplier">Nhà Cung Cấp</option>
                  <option value="employee">Người Lập</option>
                  <option value="status">Trạng Thái</option>
                  <option value="time">Thời Gian</option>
                </select>

                {receiptSearchType === 'time' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Từ ngày:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterReceiptStart}
                      onChange={(e) => setFilterReceiptStart(e.target.value)}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>đến:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterReceiptEnd}
                      onChange={(e) => setFilterReceiptEnd(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      receiptSearchType === 'receiptId' ? 'Tìm kiếm theo mã phiếu...' :
                        receiptSearchType === 'batchId' ? 'Tìm kiếm theo mã lô thuốc...' :
                          receiptSearchType === 'supplier' ? 'Tìm kiếm theo tên nhà cung cấp...' :
                            receiptSearchType === 'employee' ? 'Tìm kiếm theo tên người lập...' :
                              'Tìm kiếm theo trạng thái (DRAFT - Đang xử lý, CONFIRMED...)...'
                    }
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={receiptSearchVal}
                    onChange={(e) => setReceiptSearchVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd);
                      }
                    }}
                  />
                )}

                <button
                  type="button"
                  className="btn-create"
                  style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                  onClick={() => fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd)}
                >
                  Tìm kiếm
                </button>
                {(receiptSearchVal || filterReceiptStart || filterReceiptEnd) && (
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setReceiptSearchVal('');
                      setFilterReceiptStart('');
                      setFilterReceiptEnd('');
                      fetchReceipts(1, receiptSearchType, '', '', '');
                    }}
                  >
                    Đặt lại
                  </button>
                )}
              </div>

              {/* Status Quick Filter Chips */}
              <div className="filter-chips-container">
                <button
                  type="button"
                  className={`filter-chip ${filterReceiptStatus === 'ALL' ? 'active-all' : ''}`}
                  onClick={() => {
                    setFilterReceiptStatus('ALL');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'ALL');
                  }}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterReceiptStatus === 'DRAFT' ? 'active-low-stock' : ''}`}
                  onClick={() => {
                    setFilterReceiptStatus('DRAFT');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'DRAFT');
                  }}
                >
                  Đang xử lý
                </button>
                <button
                  type="button"
                  className="filter-chip"
                  style={filterReceiptStatus === 'CONFIRMED' ? { backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#15803d', fontWeight: '600' } : {}}
                  onClick={() => {
                    setFilterReceiptStatus('CONFIRMED');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'CONFIRMED');
                  }}
                >
                  Đã nhập kho
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterReceiptStatus === 'CANCELLED' ? 'active-expired' : ''}`}
                  onClick={() => {
                    setFilterReceiptStatus('CANCELLED');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'CANCELLED');
                  }}
                >
                  Đã hủy
                </button>
              </div>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã Phiếu</th>
                    <th>Thời Gian</th>
                    <th>Nhà Cung Cấp</th>
                    <th>Người Lập</th>
                    <th>Trạng Thái</th>
                    <th style={{ textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptsList.length > 0 ? (
                    receiptsList.map((item) => {
                      let statusColor = '#94a3b8'; // DRAFT
                      let statusText = 'Đang xử lý';
                      if (item.status === 'CONFIRMED') {
                        statusColor = 'var(--success-color)';
                        statusText = 'Đã nhập kho';
                      } else if (item.status === 'CANCELLED') {
                        statusColor = 'var(--error-color)';
                        statusText = 'Đã hủy';
                      }

                      return (
                        <tr key={item.receiptId}>
                          <td style={{ fontWeight: '600' }}>{item.receiptId}</td>
                          <td>{item.receiptTime ? new Date(item.receiptTime).toLocaleString('vi-VN') : ''}</td>
                          <td>{item.supplierName}</td>
                          <td>{item.employeeName}</td>
                          <td>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', backgroundColor: '#f1f5f9', color: statusColor }}>
                              {statusText}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="action-dropdown-container">
                              <button
                                type="button"
                                className="action-dropdown-trigger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(prev =>
                                    prev && prev.type === 'receipt' && prev.id === item.receiptId
                                      ? null
                                      : { type: 'receipt', id: item.receiptId }
                                  );
                                }}
                              >
                                Thao tác
                              </button>
                              {activeDropdown && activeDropdown.type === 'receipt' && activeDropdown.id === item.receiptId && (
                                <div className="action-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="action-dropdown-item"
                                    onClick={() => {
                                      setSelectedReceipt(item);
                                      setReceiptFormMode('view');
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    Xem chi tiết
                                  </button>
                                  {item.status === 'DRAFT' && (role === 'Admin' || role === 'Product_manager') && (
                                    <>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-warning"
                                        onClick={() => {
                                          handleEditReceiptDraft(item);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Chỉnh sửa
                                      </button>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-error"
                                        onClick={() => {
                                          handleCancelReceipt(item.receiptId);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Hủy phiếu
                                      </button>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-success"
                                        onClick={() => {
                                          handleConfirmReceipt(item.receiptId);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Xác nhận
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Chưa có phiếu nhập kho nào được tạo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {receiptTotalItems > 0 && (
              <div className="pagination-container" style={{ marginTop: '15px' }}>
                <div className="pagination-info">
                  Hiển thị {Math.min((receiptCurrentPage - 1) * 10 + 1, receiptTotalItems)} - {Math.min(receiptCurrentPage * 10, receiptTotalItems)} của {receiptTotalItems} phiếu nhập
                </div>
                {receiptTotalPages > 1 && (
                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={receiptCurrentPage === 1}
                      onClick={() => fetchReceipts(receiptCurrentPage - 1)}
                    >
                      ◀ Trang trước
                    </button>
                    {Array.from({ length: receiptTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${receiptCurrentPage === page ? 'active' : ''}`}
                        onClick={() => fetchReceipts(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={receiptCurrentPage === receiptTotalPages}
                      onClick={() => fetchReceipts(receiptCurrentPage + 1)}
                    >
                      Trang sau ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* FORM MODAL THÊM MỚI / XEM PHIẾU */}
            {receiptFormMode && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div className="content-card" style={{ width: '98%', height: '128vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#ffffff', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', flexShrink: 0 }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase' }}>
                      {receiptFormMode === 'add' ? (receiptForm.receiptId ? `Hiệu Chỉnh Phiếu Nhập (Đang xử lý) (${receiptForm.receiptId})` : 'Lập Phiếu Nhập Mới') : 'Chi Tiết Phiếu Nhập'}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {receiptFormMode === 'view' && (
                        <button
                          type="button"
                          className="btn-action btn-select"
                          style={{ padding: '4px 12px' }}
                          onClick={handlePrintReceipt}
                        >
                          In Phiếu
                        </button>
                      )}
                      <button className="btn-action btn-cancel" style={{ padding: '4px 8px' }} onClick={() => setReceiptFormMode(null)}>X đóng</button>
                    </div>
                  </div>

                  {receiptFormMode === 'add' ? (
                    <form onSubmit={handleSaveReceiptDraft} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      <div className="form-group" style={{ flexShrink: 0 }}>
                        <label className="label">Nhà cung cấp:</label>
                        <SearchableSelect
                          options={suppliersList}
                          value={receiptForm.supplierId}
                          onChange={(val) => setReceiptForm({ ...receiptForm, supplierId: val })}
                          idKey="supplierID"
                          nameKey="supplierName"
                          placeholder="Chọn nhà cung cấp..."
                        />
                      </div>

                      <div className="form-group" style={{ flexShrink: 0 }}>
                        <label className="label">Ghi chú phiếu nhập:</label>
                        <textarea
                          className="input"
                          style={{ height: '60px', resize: 'none' }}
                          value={receiptForm.note}
                          onChange={(e) => setReceiptForm({ ...receiptForm, note: e.target.value })}
                          placeholder="Nhập ghi chú hàng..."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0', flexShrink: 0 }}>
                        <span className="label">Danh sách thuốc nhập:</span>
                        <button type="button" className="btn-action btn-select" onClick={handleAddLine}>+ Thêm thuốc</button>
                      </div>

                      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '15px', background: '#f8fafc' }}>
                        <table className="custom-table" style={{ margin: 0, border: 'none', minWidth: '1000px' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              <th style={{ width: '50px', padding: '10px', textAlign: 'center' }}>STT</th>
                              <th style={{ width: '250px', padding: '10px' }}>Chọn thuốc</th>
                              <th style={{ width: '120px', padding: '10px' }}>Đơn vị nhập</th>
                              <th style={{ width: '120px', padding: '10px' }}>Lô nhập</th>
                              <th style={{ width: '140px', padding: '10px' }}>Ngày sản xuất</th>
                              <th style={{ width: '140px', padding: '10px' }}>Hạn sử dụng</th>
                              <th style={{ width: '90px', padding: '10px' }}>SL nhập</th>
                              <th style={{ width: '120px', padding: '10px' }}>Giá nhập (đ)</th>
                              <th style={{ width: '70px', padding: '10px', textAlign: 'center' }}>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {receiptForm.details.length === 0 ? (
                              <tr>
                                <td colSpan="9" style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '24px' }}>Chưa có dòng thuốc nào được thêm.</td>
                              </tr>
                            ) : (
                              receiptForm.details.map((line, idx) => {
                                const med = (allMedicines.length > 0 ? allMedicines : medicinesList).find(m => m.medicineID === line.medicineId);
                                const rowUnits = [];
                                if (med) {
                                  if (med.baseUnit) {
                                    rowUnits.push({
                                      unitID: med.baseUnit.unitID,
                                      unitName: med.baseUnit.unitName,
                                      conversionRate: 1
                                    });
                                  }
                                  if (med.alternativeUnits) {
                                    med.alternativeUnits.forEach(au => {
                                      const uId = au.unitID || au.unit?.unitID;
                                      const uName = au.unitName || au.unit?.unitName || uId;
                                      if (uId) {
                                        rowUnits.push({
                                          unitID: uId,
                                          unitName: uName,
                                          conversionRate: au.conversionRate
                                        });
                                      }
                                    });
                                  }
                                }
                                return (
                                  <tr key={idx}>
                                    <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600' }}>#{idx + 1}</td>
                                    <td style={{ padding: '8px' }}>
                                      <SearchableSelect
                                        options={allMedicines.length > 0 ? allMedicines : medicinesList}
                                        value={line.medicineId}
                                        onChange={(val) => handleLineChange(idx, 'medicineId', val)}
                                        idKey="medicineID"
                                        nameKey="medicineName"
                                        placeholder="Chọn thuốc..."
                                        style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <SearchableSelect
                                        options={rowUnits}
                                        value={line.transactionUnitId}
                                        onChange={(val) => handleLineChange(idx, 'transactionUnitId', val)}
                                        idKey="unitID"
                                        nameKey="unitName"
                                        placeholder="Chọn đơn vị..."
                                        style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="text"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.batchId}
                                        placeholder="BATCH-01"
                                        onChange={(e) => handleLineChange(idx, 'batchId', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="date"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.manufacturedDate}
                                        onChange={(e) => handleLineChange(idx, 'manufacturedDate', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="date"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.expiryDate}
                                        onChange={(e) => handleLineChange(idx, 'expiryDate', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="number"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.quantity}
                                        onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="number"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.importPrice}
                                        onChange={(e) => handleLineChange(idx, 'importPrice', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      <button type="button" className="btn-action btn-delete" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleRemoveLine(idx)}>Xóa</button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="form-actions" style={{ flexShrink: 0 }}>
                        <button type="button" className="btn-action btn-cancel" onClick={() => setReceiptFormMode(null)}>Hủy bỏ</button>
                        <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1 }}>Lưu chứng từ (Đang xử lý)</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      {selectedReceipt && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflow: 'hidden' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', flexShrink: 0 }}>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Mã phiếu:</strong> <span style={{ fontWeight: '600' }}>{selectedReceipt.receiptId}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Nhà cung cấp:</strong> <span>{selectedReceipt.supplierName}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Người lập:</strong> <span>{selectedReceipt.employeeName}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Thời gian:</strong> <span>{selectedReceipt.receiptTime ? new Date(selectedReceipt.receiptTime).toLocaleString('vi-VN') : '---'}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Trạng thái:</strong> <strong style={{ color: selectedReceipt.status === 'CONFIRMED' ? 'var(--success-color)' : 'var(--error-color)' }}>{selectedReceipt.status}</strong></div>
                          </div>
                          <div style={{ flexShrink: 0 }}><strong style={{ fontSize: '13px', color: '#64748b' }}>Ghi chú:</strong> <span>{selectedReceipt.note || '(Không có)'}</span></div>

                          <div style={{ marginTop: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span className="label" style={{ marginBottom: '6px', flexShrink: 0 }}>Chi tiết dòng thuốc nhập:</span>
                            <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}>
                              <table className="custom-table" style={{ margin: 0, border: 'none' }}>
                                <thead>
                                  <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ textAlign: 'center', width: '50px' }}>STT</th>
                                    <th>Tên thuốc</th>
                                    <th>Mã lô</th>
                                    <th>Ngày sản xuất</th>
                                    <th>Hạn sử dụng</th>
                                    <th>Số lượng</th>
                                    <th>Đơn vị nhập</th>
                                    <th style={{ textAlign: 'right' }}>Đơn giá nhập</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedReceipt.details && selectedReceipt.details.map((d, i) => (
                                    <tr key={i}>
                                      <td style={{ textAlign: 'center', fontWeight: '600' }}>#{i + 1}</td>
                                      <td style={{ fontWeight: '600' }}>{d.medicineName}</td>
                                      <td>{d.batchId}</td>
                                      <td>{d.manufacturedDate || '---'}</td>
                                      <td>{d.expiryDate || '---'}</td>
                                      <td>{d.quantity}</td>
                                      <td>{d.transactionUnitName || '---'}</td>
                                      <td style={{ textAlign: 'right', color: 'var(--success-hover)', fontWeight: '600' }}>{d.importPrice.toLocaleString()}đ</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'warehouse_issue': {
        const handleAddIssueLine = () => {
          const invsSource = allInventories.length > 0 ? allInventories : inventoriesList;
          const detailLine = {
            inventoryId: invsSource[0]?.id || '',
            batchId: invsSource[0]?.batchId || '',
            medicineName: invsSource[0]?.medicine?.medicineName || '',
            quantity: 1,
            transactionUnitId: invsSource[0]?.medicine?.baseUnit?.unitID || '',
            conversionRate: 1
          };
          setIssueForm(prev => ({
            ...prev,
            details: [...prev.details, detailLine]
          }));
        };

        const handleRemoveIssueLine = (idx) => {
          setIssueForm(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== idx)
          }));
        };

        const handleIssueLineChange = (idx, field, value) => {
          setIssueForm(prev => {
            const updated = prev.details.map((line, i) => {
              if (i === idx) {
                const copy = { ...line, [field]: value };
                if (field === 'inventoryId') {
                  const inv = allInventories.find(v => v.id === value) || inventoriesList.find(v => v.id === value);
                  if (inv) {
                    copy.batchId = inv.batchId;
                    copy.medicineName = inv.medicine.medicineName;
                    copy.transactionUnitId = inv.medicine.baseUnit?.unitID || '';
                    copy.conversionRate = 1;
                  }
                }
                if (field === 'transactionUnitId') {
                  const inv = allInventories.find(v => v.id === line.inventoryId) || inventoriesList.find(v => v.id === line.inventoryId);
                  if (inv && inv.medicine) {
                    const med = inv.medicine;
                    if (med.baseUnit && med.baseUnit.unitID === value) {
                      copy.conversionRate = 1;
                    } else if (med.alternativeUnits) {
                      const au = med.alternativeUnits.find(u => (u.unitID || u.unit?.unitID) === value);
                      if (au) {
                        copy.conversionRate = au.conversionRate;
                      }
                    }
                  }
                }
                return copy;
              }
              return line;
            });
            return { ...prev, details: updated };
          });
        };

        const handleEditIssueDraft = (item) => {
          setIssueForm({
            issueId: item.issueId,
            issueType: item.issueType || 'EXPIRED',
            note: item.note || '',
            details: item.details ? item.details.map(d => {
              const inv = allInventories.find(v => v.id === d.inventoryId) || inventoriesList.find(v => v.id === d.inventoryId);
              const med = inv?.medicine;
              return {
                inventoryId: d.inventoryId,
                batchId: d.batchId || inv?.batchId || '',
                medicineName: d.medicineName || med?.medicineName || '',
                quantity: d.quantity || 1,
                transactionUnitId: unitsList.find(u => u.unitName === d.transactionUnitName)?.unitID || med?.baseUnit?.unitID || '',
                conversionRate: d.conversionRate || 1
              };
            }) : []
          });
          setIssueFormMode('add');
        };

        const handleAutoExpiredIssue = () => {
          const today = new Date();
          const sourceInvs = allInventories.length > 0 ? allInventories : inventoriesList;
          const expiredBatches = sourceInvs.filter(item => {
            return item.expiryDate && new Date(item.expiryDate) <= today && item.stockQuantity > 0;
          });

          if (expiredBatches.length === 0) {
            alert('Hiện tại không có lô thuốc nào đã hết hạn còn tồn kho để lập phiếu xuất hủy!');
            return;
          }

          const details = expiredBatches.map(item => ({
            inventoryId: item.id,
            batchId: item.batchId,
            medicineName: item.medicine.medicineName,
            quantity: item.stockQuantity,
            transactionUnitId: item.medicine.baseUnit?.unitID || '',
            conversionRate: 1
          }));

          setIssueForm({
            issueType: 'EXPIRED',
            note: 'Xuất tiêu hủy tự động các lô thuốc đã hết hạn sử dụng.',
            details: details,
            isAutoExpired: true
          });
          setIssueFormMode('add');
        };

        const handleSaveIssueDraft = async (e) => {
          e.preventDefault();
          if (issueForm.details.length === 0) {
            alert('Vui lòng thêm ít nhất một lô xuất!');
            return;
          }

          // Business logic validations for Goods Issue
          for (const d of issueForm.details) {
            const inv = allInventories.find(v => v.id === d.inventoryId) || inventoriesList.find(v => v.id === d.inventoryId);
            if (inv) {
              const requestedQty = Number(d.quantity) * Number(d.conversionRate);
              if (requestedQty <= 0) {
                alert(`Số lượng xuất của thuốc ${inv.medicine?.medicineName} phải lớn hơn 0!`);
                return;
              }
              if (requestedQty > inv.stockQuantity) {
                alert(`Lô thuốc ${inv.medicine?.medicineName} (Lô: ${inv.batchId}) không đủ tồn kho để xuất! Yêu cầu: ${requestedQty}, Hiện có: ${inv.stockQuantity}`);
                return;
              }
            }
          }

          try {
            await api.post('/goods-issues', {
              issueId: issueForm.issueId || null,
              issueType: issueForm.issueType,
              note: issueForm.note,
              details: issueForm.details.map(d => ({
                inventoryId: d.inventoryId,
                quantity: Number(d.quantity) || 1,
                transactionUnitId: d.transactionUnitId,
                conversionRate: Number(d.conversionRate) || 1
              }))
            });
            alert('Lưu phiếu xuất kho (Đang xử lý) thành công!');
            setIssueFormMode(null);
            fetchIssues(1);
          } catch (error) {
            console.error('Lỗi lập phiếu xuất:', error);
            alert('Thao tác thất bại: ' + (error.response?.data?.message || error.message));
          }
        };

        const handleConfirmIssue = async (id) => {
          if (window.confirm(`Bạn có chắc muốn XÁC NHẬN XUẤT KHO cho phiếu ${id}? Hành động này sẽ trừ tồn kho và KHÔNG THỂ SỬA ĐỔI.`)) {
            try {
              await api.patch(`/goods-issues/${id}/confirm`);
              alert('Xác nhận xuất kho thành công! Kho đã được trừ.');
              fetchIssues(1);
            } catch (error) {
              console.error('Lỗi xuất kho:', error);
              alert('Xuất kho thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        const handleCancelIssue = async (id) => {
          if (window.confirm(`Bạn có chắc muốn HỦY PHIẾU xuất ${id}?`)) {
            try {
              await api.patch(`/goods-issues/${id}/cancel`);
              alert('Đã hủy phiếu xuất thành công.');
              fetchIssues(1);
            } catch (error) {
              console.error('Lỗi hủy phiếu:', error);
              alert('Hủy phiếu thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        return (
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 className="content-title">Phiếu Xuất Kho</h1>
              {(role === 'Admin' || role === 'Product_manager') && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-create"
                    style={{ backgroundColor: '#f97316' }}
                    onClick={handleAutoExpiredIssue}
                  >
                    Xuất hủy quá hạn
                  </button>
                  <button className="btn-create" style={{ backgroundColor: 'var(--error-color)' }} onClick={() => {
                    setIssueForm({
                      issueType: 'EXPIRED',
                      note: '',
                      details: []
                    });
                    setIssueFormMode('add');
                  }}>
                    Lập phiếu xuất mới
                  </button>
                </div>
              )}
            </div>

            <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <div className="advanced-search-group" style={{ width: '100%', gap: '10px', alignItems: 'center' }}>
                <select
                  className="search-select"
                  style={{ width: '160px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  value={issueSearchType}
                  onChange={(e) => {
                    setIssueSearchType(e.target.value);
                    setIssueSearchVal('');
                    setFilterIssueStart('');
                    setFilterIssueEnd('');
                  }}
                >
                  <option value="issueId">Mã Phiếu</option>
                  <option value="batchId">Mã Lô</option>
                  <option value="issueType">Lý Do Xuất</option>
                  <option value="employee">Người Lập</option>
                  <option value="status">Trạng Thái</option>
                  <option value="time">Thời Gian</option>
                </select>

                {issueSearchType === 'time' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Từ ngày:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterIssueStart}
                      onChange={(e) => setFilterIssueStart(e.target.value)}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>đến:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterIssueEnd}
                      onChange={(e) => setFilterIssueEnd(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      issueSearchType === 'issueId' ? 'Tìm kiếm theo mã phiếu...' :
                        issueSearchType === 'batchId' ? 'Tìm kiếm theo mã lô thuốc...' :
                          issueSearchType === 'issueType' ? 'Tìm kiếm theo lý do xuất...' :
                            issueSearchType === 'employee' ? 'Tìm kiếm theo tên người lập...' :
                              'Tìm kiếm theo trạng thái (DRAFT - Đang xử lý, CONFIRMED...)...'
                    }
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={issueSearchVal}
                    onChange={(e) => setIssueSearchVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd);
                      }
                    }}
                  />
                )}

                <button
                  type="button"
                  className="btn-create"
                  style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                  onClick={() => fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd)}
                >
                  Tìm kiếm
                </button>
                {(issueSearchVal || filterIssueStart || filterIssueEnd) && (
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setIssueSearchVal('');
                      setFilterIssueStart('');
                      setFilterIssueEnd('');
                      fetchIssues(1, issueSearchType, '', '', '');
                    }}
                  >
                    Đặt lại
                  </button>
                )}
              </div>

              {/* Status Quick Filter Chips */}
              <div className="filter-chips-container">
                <button
                  type="button"
                  className={`filter-chip ${filterIssueStatus === 'ALL' ? 'active-all' : ''}`}
                  onClick={() => {
                    setFilterIssueStatus('ALL');
                    fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'ALL');
                  }}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterIssueStatus === 'DRAFT' ? 'active-low-stock' : ''}`}
                  onClick={() => {
                    setFilterIssueStatus('DRAFT');
                    fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'DRAFT');
                  }}
                >
                  Đang xử lý
                </button>
                <button
                  type="button"
                  className="filter-chip"
                  style={filterIssueStatus === 'CONFIRMED' ? { backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#15803d', fontWeight: '600' } : {}}
                  onClick={() => {
                    setFilterIssueStatus('CONFIRMED');
                    fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'CONFIRMED');
                  }}
                >
                  Đã xuất kho
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterIssueStatus === 'CANCELLED' ? 'active-expired' : ''}`}
                  onClick={() => {
                    setFilterIssueStatus('CANCELLED');
                    fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'CANCELLED');
                  }}
                >
                  Đã hủy
                </button>
              </div>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã Phiếu</th>
                    <th>Thời Gian</th>
                    <th>Lý Do Xuất</th>
                    <th>Người Xuất</th>
                    <th>Trạng Thái</th>
                    <th style={{ textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {issuesList.length > 0 ? (
                    issuesList.map((item) => {
                      let statusColor = '#94a3b8';
                      let statusText = 'Đang xử lý';
                      if (item.status === 'CONFIRMED') {
                        statusColor = 'var(--success-color)';
                        statusText = 'Đã xuất kho';
                      } else if (item.status === 'CANCELLED') {
                        statusColor = 'var(--error-color)';
                        statusText = 'Đã hủy';
                      }

                      return (
                        <tr key={item.issueId}>
                          <td style={{ fontWeight: '600' }}>{item.issueId}</td>
                          <td>{item.issueTime ? new Date(item.issueTime).toLocaleString('vi-VN') : ''}</td>
                          <td style={{ fontWeight: '600', color: item.issueType === 'SALE' ? 'var(--success-hover)' : 'var(--error-hover)' }}>{item.issueType}</td>
                          <td>{item.employeeName}</td>
                          <td>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', backgroundColor: '#f1f5f9', color: statusColor }}>
                              {statusText}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="action-dropdown-container">
                              <button
                                type="button"
                                className="action-dropdown-trigger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(prev =>
                                    prev && prev.type === 'issue' && prev.id === item.issueId
                                      ? null
                                      : { type: 'issue', id: item.issueId }
                                  );
                                }}
                              >
                                Thao tác
                              </button>
                              {activeDropdown && activeDropdown.type === 'issue' && activeDropdown.id === item.issueId && (
                                <div className="action-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="action-dropdown-item"
                                    onClick={() => {
                                      setSelectedIssue(item);
                                      setIssueFormMode('view');
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    Xem chi tiết
                                  </button>
                                  {item.status === 'DRAFT' && (role === 'Admin' || role === 'Product_manager') && (
                                    <>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-warning"
                                        onClick={() => {
                                          handleEditIssueDraft(item);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Chỉnh sửa
                                      </button>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-error"
                                        onClick={() => {
                                          handleCancelIssue(item.issueId);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Hủy phiếu
                                      </button>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-success"
                                        onClick={() => {
                                          handleConfirmIssue(item.issueId);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Xác nhận
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Chưa có phiếu xuất kho nào được tạo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {issueTotalItems > 0 && (
              <div className="pagination-container" style={{ marginTop: '15px' }}>
                <div className="pagination-info">
                  Hiển thị {Math.min((issueCurrentPage - 1) * 10 + 1, issueTotalItems)} - {Math.min(issueCurrentPage * 10, issueTotalItems)} của {issueTotalItems} phiếu xuất
                </div>
                {issueTotalPages > 1 && (
                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={issueCurrentPage === 1}
                      onClick={() => fetchIssues(issueCurrentPage - 1)}
                    >
                      ◀ Trang trước
                    </button>
                    {Array.from({ length: issueTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${issueCurrentPage === page ? 'active' : ''}`}
                        onClick={() => fetchIssues(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={issueCurrentPage === issueTotalPages}
                      onClick={() => fetchIssues(issueCurrentPage + 1)}
                    >
                      Trang sau ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            {issueFormMode && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div className="content-card" style={{ width: '98%', height: '128vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#ffffff', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', flexShrink: 0 }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase' }}>
                      {issueFormMode === 'add' ? (issueForm.issueId ? `Hiệu Chỉnh Phiếu Xuất (Đang xử lý) (${issueForm.issueId})` : 'Lập Phiếu Xuất Mới') : 'Chi Tiết Phiếu Xuất'}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {issueFormMode === 'view' && (
                        <button
                          type="button"
                          className="btn-action btn-select"
                          style={{ padding: '4px 12px' }}
                          onClick={handlePrintIssue}
                        >
                          In Phiếu
                        </button>
                      )}
                      <button className="btn-action btn-cancel" style={{ padding: '4px 8px' }} onClick={() => setIssueFormMode(null)}>X đóng</button>
                    </div>
                  </div>

                  {issueFormMode === 'add' ? (
                    <form onSubmit={handleSaveIssueDraft} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      <div className="form-group" style={{ flexShrink: 0 }}>
                        <label className="label">Lý do xuất kho:</label>
                        <select
                          className="select-input"
                          value={issueForm.issueType}
                          onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })}
                          required
                          disabled={issueForm.isAutoExpired}
                        >
                          <option value="EXPIRED">Xuất tiêu hủy quá hạn</option>
                          <option value="DAMAGED">Hao hụt, hư hỏng, vỡ</option>
                          <option value="RETURN_SUPPLIER">Trả hàng nhà cung cấp</option>
                          <option value="OTHER">Xuất khác</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ flexShrink: 0 }}>
                        <label className="label">Ghi chú xuất kho:</label>
                        <textarea
                          className="input"
                          style={{ height: '60px', resize: 'none' }}
                          value={issueForm.note}
                          onChange={(e) => setIssueForm({ ...issueForm, note: e.target.value })}
                          placeholder="Ghi chú xuất kho..."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0', flexShrink: 0 }}>
                        <span className="label">Lô hàng xuất kho:</span>
                        <button type="button" className="btn-action btn-brand" onClick={handleAddIssueLine}>+ Thêm lô xuất</button>
                      </div>

                      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '15px', background: '#f8fafc' }}>
                        <table className="custom-table" style={{ margin: 0, border: 'none', minWidth: '800px' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              <th style={{ width: '50px', padding: '10px', textAlign: 'center' }}>STT</th>
                              <th style={{ width: '350px', padding: '10px' }}>Chọn lô trong kho</th>
                              <th style={{ width: '120px', padding: '10px' }}>Đơn vị xuất</th>
                              <th style={{ width: '100px', padding: '10px' }}>SL xuất</th>
                              <th style={{ width: '80px', padding: '10px', textAlign: 'center' }}>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const mappedInventories = (allInventories.length > 0 ? allInventories : inventoriesList).map(inv => ({
                                ...inv,
                                displayName: `${inv.medicine?.medicineName || 'Không rõ'} (Lô: ${inv.batchId} | Còn: ${inv.stockQuantity})`
                              }));
                              return issueForm.details.length === 0 ? (
                                <tr>
                                  <td colSpan="5" style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '24px' }}>Chưa có lô xuất nào được chọn.</td>
                                </tr>
                              ) : (
                                issueForm.details.map((line, idx) => {
                                  const inv = (allInventories.length > 0 ? allInventories : inventoriesList).find(v => v.id === line.inventoryId);
                                  const rowUnits = [];
                                  if (inv && inv.medicine) {
                                    const med = inv.medicine;
                                    if (med.baseUnit) {
                                      rowUnits.push({
                                        unitID: med.baseUnit.unitID,
                                        unitName: med.baseUnit.unitName,
                                        conversionRate: 1
                                      });
                                    }
                                    if (med.alternativeUnits) {
                                      med.alternativeUnits.forEach(au => {
                                        const uId = au.unitID || au.unit?.unitID;
                                        const uName = au.unitName || au.unit?.unitName || uId;
                                        if (uId) {
                                          rowUnits.push({
                                            unitID: uId,
                                            unitName: uName,
                                            conversionRate: au.conversionRate
                                          });
                                        }
                                      });
                                    }
                                  }
                                  return (
                                    <tr key={idx}>
                                      <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600' }}>#{idx + 1}</td>
                                      <td style={{ padding: '8px' }}>
                                        <SearchableSelect
                                          options={mappedInventories}
                                          value={line.inventoryId}
                                          onChange={(val) => handleIssueLineChange(idx, 'inventoryId', val)}
                                          idKey="id"
                                          nameKey="displayName"
                                          placeholder="Chọn lô xuất..."
                                          style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                        />
                                      </td>
                                      <td style={{ padding: '8px' }}>
                                        <SearchableSelect
                                          options={rowUnits}
                                          value={line.transactionUnitId}
                                          onChange={(val) => handleIssueLineChange(idx, 'transactionUnitId', val)}
                                          idKey="unitID"
                                          nameKey="unitName"
                                          placeholder="Chọn đơn vị..."
                                          style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                        />
                                      </td>
                                      <td style={{ padding: '8px' }}>
                                        <input
                                          type="number"
                                          className="input"
                                          style={{ padding: '6px', width: '100%' }}
                                          value={line.quantity}
                                          onChange={(e) => handleIssueLineChange(idx, 'quantity', e.target.value)}
                                          required
                                        />
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <button type="button" className="btn-action btn-delete" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleRemoveIssueLine(idx)}>Xóa</button>
                                      </td>
                                    </tr>
                                  );
                                })
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>

                      <div className="form-actions" style={{ flexShrink: 0 }}>
                        <button type="button" className="btn-action btn-cancel" onClick={() => setIssueFormMode(null)}>Hủy bỏ</button>
                        <button type="submit" className="btn-action btn-delete" style={{ flexGrow: 1, backgroundColor: 'var(--error-color)' }}>Lưu phiếu xuất (Đang xử lý)</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      {selectedIssue && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflow: 'hidden' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', flexShrink: 0 }}>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Mã phiếu xuất:</strong> <span style={{ fontWeight: '600' }}>{selectedIssue.issueId}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Lý do xuất:</strong> <strong style={{ color: 'var(--error-hover)' }}>{selectedIssue.issueType}</strong></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Người lập:</strong> <span>{selectedIssue.employeeName}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Thời gian:</strong> <span>{selectedIssue.issueTime ? new Date(selectedIssue.issueTime).toLocaleString('vi-VN') : '---'}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Trạng thái:</strong> <strong style={{ color: selectedIssue.status === 'CONFIRMED' ? 'var(--success-color)' : 'var(--error-color)' }}>{selectedIssue.status}</strong></div>
                          </div>
                          <div style={{ flexShrink: 0 }}><strong style={{ fontSize: '13px', color: '#64748b' }}>Ghi chú:</strong> <span>{selectedIssue.note || '(Không có)'}</span></div>

                          <div style={{ marginTop: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span className="label" style={{ marginBottom: '6px', flexShrink: 0 }}>Chi tiết lô thuốc xuất:</span>
                            <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}>
                              <table className="custom-table" style={{ margin: 0, border: 'none' }}>
                                <thead>
                                  <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ textAlign: 'center', width: '50px' }}>STT</th>
                                    <th>Tên thuốc</th>
                                    <th>Mã lô</th>
                                    <th>Số lượng xuất</th>
                                    <th>Đơn vị xuất</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedIssue.details && selectedIssue.details.map((d, i) => (
                                    <tr key={i}>
                                      <td style={{ textAlign: 'center', fontWeight: '600' }}>#{i + 1}</td>
                                      <td style={{ fontWeight: '600' }}>{d.medicineName}</td>
                                      <td>{d.batchId}</td>
                                      <td>{d.quantity}</td>
                                      <td>{d.transactionUnitName || '---'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'warehouse_audit': {
        const handleCancelAudit = async (id) => {
          if (window.confirm(`Bạn có chắc muốn HỦY PHIẾU kiểm kê ${id}?`)) {
            try {
              await api.patch(`/stock-audits/${id}/cancel`);
              alert('Đã hủy phiếu kiểm kê thành công.');
              fetchAudits(1);
            } catch (error) {
              console.error('Lỗi hủy phiếu:', error);
              alert('Hủy phiếu thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        const handleSaveDraftQuantity = async (e) => {
          e.preventDefault();
          if (!selectedAudit) return;
          try {
            await api.put(`/stock-audits/${selectedAudit.auditId}/items`, {
              note: auditForm.note,
              details: auditForm.details.map(d => ({
                inventoryId: d.inventoryId,
                actualQuantity: d.actualQuantity !== null && d.actualQuantity !== '' ? Number(d.actualQuantity) : null,
                note: d.note
              }))
            });
            alert('Đã lưu số thực tế tạm thời thành công!');
            setAuditFormMode(null);
            fetchAudits(1);
          } catch (error) {
            console.error('Lỗi lưu tạm:', error);
            alert('Không thể lưu: ' + (error.response?.data?.message || error.message));
          }
        };

        const handleConfirmAudit = async (id) => {
          if (window.confirm(`Bạn có chắc muốn XÁC NHẬN HOÀN THÀNH đối soát kiểm kê cho phiếu ${id}? Tồn kho sổ sách sẽ được đồng bộ theo tồn thực tế và phiếu bị khóa.`)) {
            try {
              await api.patch(`/stock-audits/${id}/confirm`);
              alert('Hoàn tất đối soát kiểm kê thành công! Kho đã được đồng bộ khớp số thực tế.');
              fetchAudits(1);
            } catch (error) {
              console.error('Lỗi hoàn thành đối soát:', error);
              alert('Thao tác thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        const handleCreateAudit = async () => {
          if (window.confirm('Tạo phiếu kiểm kê mới? Hệ thống sẽ chụp lại số lượng tồn kho sổ sách hiện tại của tất cả các thuốc.')) {
            try {
              const res = await api.post('/stock-audits', { note: 'Kiểm kê định kỳ quầy thuốc' });
              alert('Khởi tạo phiếu kiểm kê thành công!');
              fetchAudits(1);
              setSelectedAudit(res.data?.data);
              setAuditForm({ note: res.data?.data.note || '', details: res.data?.data.details || [] });
              setAuditFormMode('edit');
            } catch (error) {
              console.error('Lỗi tạo phiếu kiểm kê:', error);
              alert('Lỗi tạo phiếu: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        const handleAuditLineActualChange = (inventoryId, val) => {
          setAuditForm(prev => {
            const updated = prev.details.map(line => {
              if (line.inventoryId === inventoryId) {
                const actual = val !== '' ? Number(val) : null;
                const discrepancy = actual !== null ? (actual - line.systemQuantity) : null;
                return { ...line, actualQuantity: actual, discrepancy };
              }
              return line;
            });
            return { ...prev, details: updated };
          });
        };

        return (
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 className="content-title">Phiếu Kiểm Kê Kho</h1>
              {(role === 'Admin' || role === 'Product_manager') && (
                <button className="btn-create" style={{ backgroundColor: 'var(--warning-color)' }} onClick={handleCreateAudit}>
                  Tạo phiếu kiểm kê
                </button>
              )}
            </div>

            <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <div className="advanced-search-group" style={{ width: '100%', gap: '10px', alignItems: 'center' }}>
                <select
                  className="search-select"
                  style={{ width: '160px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  value={auditSearchType}
                  onChange={(e) => {
                    setAuditSearchType(e.target.value);
                    setAuditSearchVal('');
                    setFilterAuditStart('');
                    setFilterAuditEnd('');
                  }}
                >
                  <option value="auditId">Mã Phiếu</option>
                  <option value="batchId">Mã Lô</option>
                  <option value="createdBy">Người Lập</option>
                  <option value="status">Trạng Thái</option>
                  <option value="time">Thời Gian</option>
                </select>

                {auditSearchType === 'time' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Từ ngày:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterAuditStart}
                      onChange={(e) => setFilterAuditStart(e.target.value)}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>đến:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterAuditEnd}
                      onChange={(e) => setFilterAuditEnd(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      auditSearchType === 'auditId' ? 'Tìm kiếm theo mã phiếu...' :
                        auditSearchType === 'batchId' ? 'Tìm kiếm theo mã lô thuốc...' :
                          auditSearchType === 'createdBy' ? 'Tìm kiếm theo tên người lập...' :
                            'Tìm kiếm theo trạng thái (IN_PROGRESS - Đang xử lý, CONFIRMED...)...'
                    }
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={auditSearchVal}
                    onChange={(e) => setAuditSearchVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchAudits(1, auditSearchType, auditSearchVal, filterAuditStart, filterAuditEnd);
                      }
                    }}
                  />
                )}

                <button
                  type="button"
                  className="btn-create"
                  style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                  onClick={() => fetchAudits(1, auditSearchType, auditSearchVal, filterAuditStart, filterAuditEnd)}
                >
                  Tìm kiếm
                </button>
                {(auditSearchVal || filterAuditStart || filterAuditEnd) && (
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setAuditSearchVal('');
                      setFilterAuditStart('');
                      setFilterAuditEnd('');
                      fetchAudits(1, auditSearchType, '', '', '');
                    }}
                  >
                    Đặt lại
                  </button>
                )}
              </div>

              {/* Status Quick Filter Chips */}
              <div className="filter-chips-container">
                <button
                  type="button"
                  className={`filter-chip ${filterAuditStatus === 'ALL' ? 'active-all' : ''}`}
                  onClick={() => {
                    setFilterAuditStatus('ALL');
                    fetchAudits(1, auditSearchType, auditSearchVal, filterAuditStart, filterAuditEnd, 'ALL');
                  }}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterAuditStatus === 'IN_PROGRESS' ? 'active-low-stock' : ''}`}
                  onClick={() => {
                    setFilterAuditStatus('IN_PROGRESS');
                    fetchAudits(1, auditSearchType, auditSearchVal, filterAuditStart, filterAuditEnd, 'IN_PROGRESS');
                  }}
                  style={filterAuditStatus === 'IN_PROGRESS' ? { backgroundColor: '#ffedd5', borderColor: '#f97316', color: '#c2410c' } : {}}
                >
                  Đang xử lý
                </button>
                <button
                  type="button"
                  className="filter-chip"
                  style={filterAuditStatus === 'CONFIRMED' ? { backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#15803d', fontWeight: '600' } : {}}
                  onClick={() => {
                    setFilterAuditStatus('CONFIRMED');
                    fetchAudits(1, auditSearchType, auditSearchVal, filterAuditStart, filterAuditEnd, 'CONFIRMED');
                  }}
                >
                  Đã hoàn thành
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterAuditStatus === 'CANCELLED' ? 'active-expired' : ''}`}
                  onClick={() => {
                    setFilterAuditStatus('CANCELLED');
                    fetchAudits(1, auditSearchType, auditSearchVal, filterAuditStart, filterAuditEnd, 'CANCELLED');
                  }}
                >
                  Đã hủy
                </button>
              </div>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã Phiếu</th>
                    <th>Người Lập</th>
                    <th>Ghi Chú</th>
                    <th>Trạng Thái</th>
                    <th style={{ textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {auditsList.length > 0 ? (
                    auditsList.map((item) => {
                      let statusColor = '#94a3b8';
                      let statusText = 'Đang xử lý';
                      if (item.status === 'IN_PROGRESS' || item.status === 'DRAFT') {
                        statusColor = 'var(--warning-hover)';
                        statusText = 'Đang xử lý';
                      } else if (item.status === 'CONFIRMED') {
                        statusColor = 'var(--success-color)';
                        statusText = 'Đã hoàn thành';
                      } else if (item.status === 'CANCELLED') {
                        statusColor = 'var(--error-color)';
                        statusText = 'Đã hủy';
                      }

                      return (
                        <tr key={item.auditId}>
                          <td style={{ fontWeight: '600' }}>{item.auditId}</td>
                          <td>{item.createdByName}</td>
                          <td>{item.note || 'Kiểm kê kho'}</td>
                          <td>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', backgroundColor: '#f1f5f9', color: statusColor }}>
                              {statusText}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="action-dropdown-container">
                              <button
                                type="button"
                                className="action-dropdown-trigger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(prev =>
                                    prev && prev.type === 'audit' && prev.id === item.auditId
                                      ? null
                                      : { type: 'audit', id: item.auditId }
                                  );
                                }}
                              >
                                Thao tác
                              </button>
                              {activeDropdown && activeDropdown.type === 'audit' && activeDropdown.id === item.auditId && (
                                <div className="action-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="action-dropdown-item"
                                    onClick={() => {
                                      setSelectedAudit(item);
                                      setAuditForm({ note: item.note || '', details: item.details || [] });
                                      setAuditFormMode('view');
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    Xem chi tiết
                                  </button>
                                  {(item.status === 'IN_PROGRESS' || item.status === 'DRAFT') && (
                                    <button
                                      type="button"
                                      className="action-dropdown-item"
                                      onClick={() => {
                                        setSelectedAudit(item);
                                        setAuditForm({ note: item.note || '', details: item.details || [] });
                                        setAuditFormMode('edit');
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      Đếm kho
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="action-dropdown-item"
                                    onClick={() => {
                                      handlePrintAudit(item);
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    In phiếu
                                  </button>
                                  {(item.status === 'IN_PROGRESS' || item.status === 'DRAFT') && (role === 'Admin' || role === 'Product_manager') && (
                                    <>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-error"
                                        onClick={() => {
                                          handleCancelAudit(item.auditId);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Hủy phiếu
                                      </button>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-success"
                                        onClick={() => {
                                          handleConfirmAudit(item.auditId);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Hoàn thành
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Chưa có phiếu kiểm kê kho nào được lập.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {auditTotalItems > 0 && (
              <div className="pagination-container" style={{ marginTop: '15px' }}>
                <div className="pagination-info">
                  Hiển thị {Math.min((auditCurrentPage - 1) * 10 + 1, auditTotalItems)} - {Math.min(auditCurrentPage * 10, auditTotalItems)} của {auditTotalItems} phiếu kiểm kê
                </div>
                {auditTotalPages > 1 && (
                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={auditCurrentPage === 1}
                      onClick={() => fetchAudits(auditCurrentPage - 1)}
                    >
                      ◀ Trang trước
                    </button>
                    {Array.from({ length: auditTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${auditCurrentPage === page ? 'active' : ''}`}
                        onClick={() => fetchAudits(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={auditCurrentPage === auditTotalPages}
                      onClick={() => fetchAudits(auditCurrentPage + 1)}
                    >
                      Trang sau ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            {auditFormMode && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div className="content-card" style={{ width: '98%', height: '128vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#ffffff', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', flexShrink: 0 }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase' }}>
                      {auditFormMode === 'edit' ? 'Nhập Số Đếm Thực Tế' : 'Xem Chi Tiết Kiểm Kê'}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {auditFormMode === 'view' && (
                        <button
                          type="button"
                          className="btn-action btn-select"
                          style={{ padding: '4px 12px' }}
                          onClick={() => handlePrintAudit(selectedAudit)}
                        >
                          In Phiếu
                        </button>
                      )}
                      <button className="btn-action btn-cancel" style={{ padding: '4px 8px' }} onClick={() => setAuditFormMode(null)}>X đóng</button>
                    </div>
                  </div>

                  {auditFormMode === 'edit' ? (
                    <form onSubmit={handleSaveDraftQuantity} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      <div className="form-group" style={{ flexShrink: 0 }}>
                        <label className="label">Ghi chú phiếu kiểm kê:</label>
                        <input
                          type="text"
                          className="input"
                          value={auditForm.note}
                          onChange={(e) => setAuditForm({ ...auditForm, note: e.target.value })}
                          placeholder="Ghi chú phiếu kiểm kê..."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0', flexShrink: 0 }}>
                        <span className="label">Bảng đối soát chi tiết tồn kho:</span>
                      </div>

                      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '15px', background: '#f8fafc' }}>
                        <table className="custom-table" style={{ margin: 0, border: 'none', minWidth: '800px' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              <th style={{ width: '50px', padding: '10px', textAlign: 'center' }}>STT</th>
                              <th style={{ width: '350px', padding: '10px' }}>Tên thuốc & lô hàng</th>
                              <th style={{ width: '130px', padding: '10px', textAlign: 'center' }}>Số lượng sổ sách</th>
                              <th style={{ width: '100px', padding: '10px', textAlign: 'center' }}>Đơn vị</th>
                              <th style={{ width: '170px', padding: '10px' }}>Tồn thực tế đếm</th>
                              <th style={{ width: '100px', padding: '10px', textAlign: 'right' }}>Chênh lệch</th>
                            </tr>
                          </thead>
                          <tbody>
                            {auditForm.details.map((d, i) => (
                              <tr key={i}>
                                <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600' }}>#{i + 1}</td>
                                <td style={{ padding: '8px' }}>
                                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{d.medicineName}</div>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>Lô: {d.batchId} | Gốc: {d.inventoryId}</div>
                                </td>
                                <td style={{ textAlign: 'center', padding: '8px', fontWeight: '700' }}>{d.systemQuantity}</td>
                                <td style={{ textAlign: 'center', padding: '8px' }}>{d.unitName || '---'}</td>
                                <td style={{ padding: '8px' }}>
                                  <input
                                    type="number"
                                    className="input"
                                    style={{ padding: '6px', width: '100%' }}
                                    value={d.actualQuantity !== null && d.actualQuantity !== undefined ? d.actualQuantity : ''}
                                    placeholder="Thực đếm"
                                    onChange={(e) => handleAuditLineActualChange(d.inventoryId, e.target.value)}
                                    required
                                  />
                                </td>
                                <td style={{ padding: '8px', textAlign: 'right' }}>
                                  {d.discrepancy !== null && d.discrepancy !== undefined ? (
                                    <strong style={{ color: d.discrepancy > 0 ? '#10b981' : d.discrepancy < 0 ? '#ef4444' : '#64748b' }}>
                                      {d.discrepancy > 0 ? `+${d.discrepancy}` : d.discrepancy}
                                    </strong>
                                  ) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>chưa đếm</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="form-actions" style={{ flexShrink: 0 }}>
                        <button type="button" className="btn-action btn-cancel" onClick={() => setAuditFormMode(null)}>Đóng</button>
                        <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1, backgroundColor: 'var(--warning-hover)' }}>Lưu số thực tế đếm tạm</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      {selectedAudit && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflow: 'hidden' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', flexShrink: 0 }}>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Mã phiếu kiểm:</strong> <span style={{ fontWeight: '600' }}>{selectedAudit.auditId}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Người lập:</strong> <span>{selectedAudit.createdByName}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Thời gian:</strong> <span>{selectedAudit.auditTime ? new Date(selectedAudit.auditTime).toLocaleString('vi-VN') : '---'}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Trạng thái:</strong> <strong style={{ color: selectedAudit.status === 'CONFIRMED' ? 'var(--success-color)' : 'var(--warning-hover)' }}>{selectedAudit.status}</strong></div>
                          </div>
                          <div style={{ flexShrink: 0 }}><strong style={{ fontSize: '13px', color: '#64748b' }}>Ghi chú:</strong> <span>{selectedAudit.note || '(Không có)'}</span></div>

                          <div style={{ marginTop: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span className="label" style={{ marginBottom: '6px', flexShrink: 0 }}>Bảng chi tiết chênh lệch đối soát:</span>
                            <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}>
                              <table className="custom-table" style={{ margin: 0, border: 'none' }}>
                                <thead>
                                  <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ textAlign: 'center', width: '50px' }}>STT</th>
                                    <th>Tên thuốc</th>
                                    <th>Mã lô</th>
                                    <th style={{ textAlign: 'center' }}>Sổ sách</th>
                                    <th style={{ textAlign: 'center' }}>Đơn vị</th>
                                    <th style={{ textAlign: 'center' }}>Thực đếm</th>
                                    <th style={{ textAlign: 'right' }}>Chênh lệch</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedAudit.details && selectedAudit.details.map((d, i) => (
                                    <tr key={i}>
                                      <td style={{ textAlign: 'center', fontWeight: '600' }}>#{i + 1}</td>
                                      <td style={{ fontWeight: '600' }}>{d.medicineName}</td>
                                      <td>{d.batchId}</td>
                                      <td style={{ textAlign: 'center' }}>{d.systemQuantity}</td>
                                      <td style={{ textAlign: 'center' }}>{d.unitName || '---'}</td>
                                      <td style={{ textAlign: 'center' }}>{d.actualQuantity}</td>
                                      <td style={{ textAlign: 'right' }}>
                                        <strong style={{ color: d.discrepancy > 0 ? '#10b981' : d.discrepancy < 0 ? '#ef4444' : '#64748b' }}>
                                          {d.discrepancy > 0 ? `+${d.discrepancy}` : d.discrepancy}
                                        </strong>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'warehouse_history': {
        return (
          <div className="content-card">
            <h1 className="content-title">Lịch Sử Giao Dịch Kho & Thẻ Kho</h1>

            {/* Subtabs */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                className="btn-action"
                style={{
                  backgroundColor: activeHistoryTab === 'DOCUMENTS' ? 'var(--primary-color)' : '#e2e8f0',
                  color: activeHistoryTab === 'DOCUMENTS' ? 'white' : '#4b5563',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}
                onClick={() => setActiveHistoryTab('DOCUMENTS')}
              >
                Danh Sách Chứng từ
              </button>
              <button
                type="button"
                className="btn-action"
                style={{
                  backgroundColor: activeHistoryTab === 'STOCK_CARD' ? 'var(--primary-color)' : '#e2e8f0',
                  color: activeHistoryTab === 'STOCK_CARD' ? 'white' : '#4b5563',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}
                onClick={() => {
                  setActiveHistoryTab('STOCK_CARD');
                  setStockCardCurrentPage(1);
                  setStockCardSearchType('referenceId');
                  setStockCardSearchVal('');
                  setFilterStockCardStart('');
                  setFilterStockCardEnd('');
                  setActiveStockCardSearchType('referenceId');
                  setActiveStockCardSearchVal('');
                  setActiveFilterStockCardStart('');
                  setActiveFilterStockCardEnd('');
                  fetchHistoryTransactions('');
                }}
              >
                Thẻ kho (Stock Card)
              </button>
            </div>

            {activeHistoryTab === 'DOCUMENTS' ? (
              <div>
                <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '15px' }}>
                  Dưới đây là thống kê tổng số lượng chứng từ và nhật ký các giao dịch kho gần đây nhất từ hệ thống.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
                  <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>TỔNG PHIẾU NHẬP KHO</span>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{receiptTotalItems}</span>
                    <span style={{ fontSize: '11px', color: 'var(--success-color)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setActiveTab('warehouse_receipt')}>Quản lý ngay ➔</span>
                  </div>
                  <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>TỔNG PHIẾU XUẤT KHO</span>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{issueTotalItems}</span>
                    <span style={{ fontSize: '11px', color: 'var(--error-hover)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setActiveTab('warehouse_issue')}>Quản lý ngay ➔</span>
                  </div>
                  <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>TỔNG PHIẾU KIỂM KÊ</span>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: '#eab308' }}>{auditTotalItems}</span>
                    <span style={{ fontSize: '11px', color: 'var(--warning-hover)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setActiveTab('warehouse_audit')}>Quản lý ngay ➔</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>Danh Sách Chứng Từ Giao Dịch Gần Đây</h3>
                  <div className="custom-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Mã Chứng Từ</th>
                          <th>Loại Chứng Từ</th>
                          <th>Thời Gian Giao Dịch</th>
                          <th>Người Thực Hiện</th>
                          <th>Ghi Chú</th>
                          <th>Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const combinedDocs = [
                            ...receiptsList.map(r => ({
                              id: r.receiptId,
                              type: 'NHAP',
                              typeName: 'Nhập kho',
                              time: r.receiptTime,
                              employeeName: r.employeeName,
                              status: r.status,
                              note: r.note || `Nhập kho từ nhà cung cấp: ${r.supplierName}`,
                              rawItem: r
                            })),
                            ...issuesList.map(i => ({
                              id: i.issueId,
                              type: 'XUAT',
                              typeName: 'Xuất kho',
                              time: i.issueTime,
                              employeeName: i.employeeName,
                              status: i.status,
                              note: i.note || `Xuất kho lý do: ${i.issueType}`,
                              rawItem: i
                            })),
                            ...auditsList.map(a => ({
                              id: a.auditId,
                              type: 'KIEMKE',
                              typeName: 'Kiểm kê kho',
                              time: a.auditTime,
                              employeeName: a.createdByName,
                              status: a.status,
                              note: a.note || 'Kiểm kê kho định kỳ',
                              rawItem: a
                            }))
                          ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
                            .slice(0, 10);

                          if (combinedDocs.length === 0) {
                            return (
                              <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy chứng từ giao dịch nào trong hệ thống.</td>
                              </tr>
                            );
                          }

                          return combinedDocs.map((doc) => {
                            let statusColor = '#94a3b8';
                            let statusText = 'Đang xử lý';
                            if (doc.status === 'CONFIRMED') {
                              statusColor = 'var(--success-color)';
                              statusText = doc.type === 'KIEMKE' ? 'Đã hoàn thành' : (doc.type === 'NHAP' ? 'Đã nhập kho' : 'Đã xuất kho');
                            } else if (doc.status === 'CANCELLED') {
                              statusColor = 'var(--error-color)';
                              statusText = 'Đã hủy';
                            } else if (doc.status === 'IN_PROGRESS' || doc.status === 'DRAFT') {
                              statusColor = 'var(--warning-hover)';
                              statusText = 'Đang xử lý';
                            }

                            return (
                              <tr key={doc.id}>
                                <td style={{ fontWeight: '700', color: '#0f172a' }}>{doc.id}</td>
                                <td>
                                  <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    backgroundColor: doc.type === 'NHAP' ? '#e6f4ea' : (doc.type === 'XUAT' ? '#fce8e6' : '#fef7e0'),
                                    color: doc.type === 'NHAP' ? 'var(--success-hover)' : (doc.type === 'XUAT' ? 'var(--error-hover)' : 'var(--warning-hover)')
                                  }}>
                                    {doc.typeName}
                                  </span>
                                </td>
                                <td>{doc.time ? new Date(doc.time).toLocaleString('vi-VN') : ''}</td>
                                <td>{doc.employeeName}</td>
                                <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.note}</td>
                                <td>
                                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', backgroundColor: '#f1f5f9', color: statusColor }}>
                                    {statusText}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="table-actions" style={{ marginBottom: '20px' }}>
                  <div className="advanced-search-group" style={{ width: '100%', gap: '10px', alignItems: 'center' }}>
                    <select
                      className="search-select"
                      style={{ width: '160px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      value={stockCardSearchType}
                      onChange={(e) => {
                        setStockCardSearchType(e.target.value);
                        setStockCardSearchVal('');
                        setFilterStockCardStart('');
                        setFilterStockCardEnd('');
                      }}
                    >
                      <option value="time">Thời Gian</option>
                      <option value="type">Loại Biến Động</option>
                      <option value="referenceId">Mã Chứng Từ</option>
                      <option value="medicineName">Tên Thuốc</option>
                      <option value="batchId">Mã Lô</option>
                    </select>

                    {stockCardSearchType === 'time' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Từ ngày:</span>
                        <input
                          type="date"
                          className="search-input"
                          style={{ width: '100%', maxWidth: '180px' }}
                          value={filterStockCardStart}
                          onChange={(e) => setFilterStockCardStart(e.target.value)}
                        />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>đến:</span>
                        <input
                          type="date"
                          className="search-input"
                          style={{ width: '100%', maxWidth: '180px' }}
                          value={filterStockCardEnd}
                          onChange={(e) => setFilterStockCardEnd(e.target.value)}
                        />
                      </div>
                    ) : stockCardSearchType === 'type' ? (
                      <select
                        className="search-select"
                        style={{ maxWidth: 'none', flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={stockCardSearchVal}
                        onChange={(e) => setStockCardSearchVal(e.target.value)}
                      >
                        <option value="">Tất cả loại biến động</option>
                        <option value="IMPORT">Nhập kho lô (IMPORT)</option>
                        <option value="EXPORT">Xuất hủy kho (EXPORT)</option>
                        <option value="SALE">Xuất bán lẻ (SALE)</option>
                        <option value="AUDIT_ADJUST">Đối soát kiểm kê (AUDIT_ADJUST)</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={
                          stockCardSearchType === 'referenceId' ? 'Tìm kiếm theo mã chứng từ...' :
                            stockCardSearchType === 'medicineName' ? 'Tìm kiếm theo tên thuốc...' :
                              'Tìm kiếm theo mã lô...'
                        }
                        className="search-input"
                        style={{ maxWidth: 'none', flexGrow: 1 }}
                        value={stockCardSearchVal}
                        onChange={(e) => setStockCardSearchVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setActiveStockCardSearchType(stockCardSearchType);
                            setActiveStockCardSearchVal(stockCardSearchVal);
                            setActiveFilterStockCardStart(filterStockCardStart);
                            setActiveFilterStockCardEnd(filterStockCardEnd);
                            setStockCardCurrentPage(1);
                          }
                        }}
                      />
                    )}

                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setActiveStockCardSearchType(stockCardSearchType);
                        setActiveStockCardSearchVal(stockCardSearchVal);
                        setActiveFilterStockCardStart(filterStockCardStart);
                        setActiveFilterStockCardEnd(filterStockCardEnd);
                        setStockCardCurrentPage(1);
                      }}
                    >
                      Tìm kiếm
                    </button>
                    {(stockCardSearchVal || filterStockCardStart || filterStockCardEnd) && (
                      <button
                        type="button"
                        className="btn-create"
                        style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setStockCardSearchType('time');
                          setStockCardSearchVal('');
                          setFilterStockCardStart('');
                          setFilterStockCardEnd('');
                          setActiveStockCardSearchType('time');
                          setActiveStockCardSearchVal('');
                          setActiveFilterStockCardStart('');
                          setActiveFilterStockCardEnd('');
                          setStockCardCurrentPage(1);
                        }}
                      >
                        Đặt lại
                      </button>
                    )}
                  </div>
                </div>

                {(() => {
                  const filteredTransactions = historyTransactions.filter(tx => {
                    // 1. Filter by time
                    if (activeStockCardSearchType === 'time') {
                      if (activeFilterStockCardStart) {
                        const start = new Date(activeFilterStockCardStart);
                        start.setHours(0, 0, 0, 0);
                        const txTime = new Date(tx.transactionTime);
                        if (txTime < start) return false;
                      }
                      if (activeFilterStockCardEnd) {
                        const end = new Date(activeFilterStockCardEnd);
                        end.setHours(23, 59, 59, 999);
                        const txTime = new Date(tx.transactionTime);
                        if (txTime > end) return false;
                      }
                    }
                    // 2. Filter by type
                    else if (activeStockCardSearchType === 'type') {
                      if (activeStockCardSearchVal) {
                        const val = activeStockCardSearchVal.toLowerCase().trim();
                        let typeText = '';
                        if (tx.type === 'IMPORT') typeText = 'nhập kho lô';
                        else if (tx.type === 'EXPORT') typeText = 'xuất hủy kho';
                        else if (tx.type === 'SALE') typeText = 'xuất bán lẻ';
                        else if (tx.type === 'AUDIT_ADJUST') typeText = 'đối soát kiểm kê';

                        const matchType = tx.type.toLowerCase().includes(val) || typeText.includes(val);
                        if (!matchType) return false;
                      }
                    }
                    // 3. Filter by referenceId
                    else if (activeStockCardSearchType === 'referenceId') {
                      if (activeStockCardSearchVal) {
                        const val = activeStockCardSearchVal.toLowerCase().trim();
                        if (!tx.referenceId?.toLowerCase().includes(val)) return false;
                      }
                    }
                    // 4. Filter by medicineName
                    else if (activeStockCardSearchType === 'medicineName') {
                      if (activeStockCardSearchVal) {
                        const val = activeStockCardSearchVal.toLowerCase().trim();
                        if (!tx.medicineName?.toLowerCase().includes(val)) return false;
                      }
                    }
                    // 5. Filter by batchId
                    else if (activeStockCardSearchType === 'batchId') {
                      if (activeStockCardSearchVal) {
                        const val = activeStockCardSearchVal.toLowerCase().trim();
                        if (!tx.batchId?.toLowerCase().includes(val)) return false;
                      }
                    }
                    return true;
                  });

                  const itemsPerPage = 10;
                  const totalItems = filteredTransactions.length;
                  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
                  const currentPage = Math.min(stockCardCurrentPage, totalPages);
                  const indexOfLastItem = currentPage * itemsPerPage;
                  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

                  return (
                    <>
                      <div className="custom-table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Thời Gian</th>
                              <th>Loại Biến Động</th>
                              <th>Mã Chứng Từ</th>
                              <th>Tên Thuốc</th>
                              <th>Mã Lô</th>
                              <th>Lượng Biến Động</th>
                              <th>Tồn Cuối Cùng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentTransactions.length > 0 ? (
                              currentTransactions.map((tx) => {
                                let typeColor = '#64748b';
                                let typeText = tx.type;
                                if (tx.type === 'IMPORT') {
                                  typeColor = 'var(--success-color)';
                                  typeText = 'Nhập kho lô';
                                } else if (tx.type === 'EXPORT') {
                                  typeColor = 'var(--error-hover)';
                                  typeText = 'Xuất hủy kho';
                                } else if (tx.type === 'SALE') {
                                  typeColor = 'var(--primary-color)';
                                  typeText = 'Xuất bán lẻ';
                                } else if (tx.type === 'AUDIT_ADJUST') {
                                  typeColor = 'var(--warning-hover)';
                                  typeText = 'Đối soát kiểm kê';
                                }

                                return (
                                  <tr key={tx.id}>
                                    <td>{tx.transactionTime ? new Date(tx.transactionTime).toLocaleString('vi-VN') : ''}</td>
                                    <td>
                                      <strong style={{ color: typeColor }}>{typeText}</strong>
                                    </td>
                                    <td style={{ fontWeight: '600' }}>{tx.referenceId}</td>
                                    <td>{tx.medicineName}</td>
                                    <td style={{ fontFamily: 'monospace' }}>{tx.batchId}</td>
                                    <td style={{ fontWeight: '700', color: tx.quantityChanged > 0 ? 'var(--success-color)' : 'var(--error-color)' }}>
                                      {tx.quantityChanged > 0 ? `+${tx.quantityChanged}` : tx.quantityChanged}
                                    </td>
                                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{tx.endingBalance}</td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Chưa có lịch sử giao dịch kho lô nào cho loại thuốc này.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalItems > 0 && (
                        <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                          <div className="pagination-info" style={{ fontSize: '12px' }}>
                            Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems} giao dịch
                          </div>
                          {totalPages > 1 && (
                            <div className="pagination-buttons" style={{ gap: '4px' }}>
                              <button
                                type="button"
                                className="pagination-btn"
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                disabled={currentPage === 1}
                                onClick={() => setStockCardCurrentPage(currentPage - 1)}
                              >
                                ◀
                              </button>

                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  type="button"
                                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                  style={{ padding: '6px 10px', fontSize: '12px' }}
                                  onClick={() => setStockCardCurrentPage(page)}
                                >
                                  {page}
                                </button>
                              ))}

                              <button
                                type="button"
                                className="pagination-btn"
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                disabled={currentPage === totalPages}
                                onClick={() => setStockCardCurrentPage(currentPage + 1)}
                              >
                                ▶
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        );
      }
      case 'warehouse_supplier': {
        const filtered = suppliersList.filter(s =>
          s.supplierName.toLowerCase().includes(searchSupplier.toLowerCase()) ||
          s.supplierID.toLowerCase().includes(searchSupplier.toLowerCase()) ||
          (s.phoneNumber && s.phoneNumber.toLowerCase().includes(searchSupplier.toLowerCase())) ||
          (s.address && s.address.toLowerCase().includes(searchSupplier.toLowerCase()))
        );

        // Client side pagination
        const itemsPerPage = 10;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        const currentPage = Math.min(supplierCurrentPage, totalPages);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentSuppliers = filtered.slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH BẢNG */}
            <div className="split-left content-card">
              <h1 className="content-title">Quản Lý Nhà Cung Cấp</h1>

              <div className="table-actions">
                <div className="advanced-search-group" style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhà cung cấp theo mã, tên, SĐT..."
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={tempSearchSupplier}
                    onChange={(e) => {
                      setTempSearchSupplier(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setSearchSupplier(tempSearchSupplier);
                        setSupplierCurrentPage(1);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setSearchSupplier(tempSearchSupplier);
                      setSupplierCurrentPage(1);
                    }}
                  >
                    Tìm kiếm
                  </button>
                  {(tempSearchSupplier || searchSupplier) && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setTempSearchSupplier('');
                        setSearchSupplier('');
                        setSupplierCurrentPage(1);
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mã NCC</th>
                      <th>Tên nhà cung cấp</th>
                      <th>Số điện thoại</th>
                      <th>Địa chỉ</th>
                      {role !== 'Sales' && <th style={{ textAlign: 'center' }}>Hành động</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSuppliers.length > 0 ? (
                      currentSuppliers.map((item) => (
                        <tr key={item.supplierID} style={supplierForm.supplierID === item.supplierID ? { backgroundColor: '#f0fdf4' } : {}}>
                          <td style={{ fontWeight: '600' }}>{item.supplierID}</td>
                          <td>{item.supplierName}</td>
                          <td>{item.phoneNumber}</td>
                          <td>{item.address}</td>
                          {role !== 'Sales' && (
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button className="btn-action btn-edit" style={{ marginRight: '6px' }} onClick={() => handleSupplierEditClick(item)}>Sửa</button>
                              <button className="btn-action btn-delete" onClick={() => handleSupplierDelete(item.supplierID)}>Xóa</button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={role !== 'Sales' ? 5 : 4} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy nhà cung cấp nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalItems > 0 && (
                <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                  <div className="pagination-info" style={{ fontSize: '12px' }}>
                    Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems} nhà cung cấp
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-buttons" style={{ gap: '4px' }}>
                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={currentPage === 1}
                        onClick={() => setSupplierCurrentPage(currentPage - 1)}
                      >
                        ◀
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={() => setSupplierCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={currentPage === totalPages}
                        onClick={() => setSupplierCurrentPage(currentPage + 1)}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: FORM THÊM / SỬA */}
            {role !== 'Sales' && (
              <div className="split-right content-card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', background: '#ffffff' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  {supplierFormMode === 'add' ? 'Thêm Mới Nhà Cung Cấp' : '✏️ Hiệu Chỉnh Nhà Cung Cấp'}
                </h2>
                <form onSubmit={handleSupplierSave}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Mã nhà cung cấp:</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={supplierForm.supplierID}
                      onChange={(e) => setSupplierForm({ ...supplierForm, supplierID: e.target.value })}
                      disabled={supplierFormMode === 'edit'}
                      placeholder="VD: NCC-DUOC-HA-TAY"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Tên nhà cung cấp:</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={supplierForm.supplierName}
                      onChange={(e) => setSupplierForm({ ...supplierForm, supplierName: e.target.value })}
                      placeholder="VD: Công ty Cổ phần Dược phẩm Hà Tây"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Số điện thoại:</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={supplierForm.phoneNumber}
                      onChange={(e) => setSupplierForm({ ...supplierForm, phoneNumber: e.target.value })}
                      placeholder="VD: 02433824685"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Địa chỉ:</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={supplierForm.address}
                      onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                      placeholder="VD: 10A Quang Trung, Hà Đông, Hà Nội"
                      required
                    />
                  </div>
                  <div className="form-actions" style={{ marginTop: '24px', gap: '8px' }}>
                    {supplierFormMode === 'edit' && (
                      <button type="button" className="btn-action btn-cancel" style={{ padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onClick={handleSupplierCancel}>
                        Hủy bỏ
                      </button>
                    )}
                    <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                      {supplierFormMode === 'add' ? 'Thêm mới' : 'Lưu lại'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      }

      /* PHÂN HỆ BÁN HÀNG */
      case 'sales_pos': {
        const cartTotal = posCart.reduce((sum, item) => sum + item.quantity * (item.unitPrice * item.conversionRate), 0);

        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH LÔ HÀNG TRONG KHO */}
            <div className="split-left content-card">
              <h1 className="content-title">Quầy Bán Thuốc</h1>

              <div className="table-actions" style={{ marginTop: '20px' }}>
                <div className="advanced-search-group" style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Tìm theo tên thuốc, mã lô hoặc hoạt chất chính để bán..."
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={posSearchKeyword}
                    onChange={(e) => setPosSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchInventory(1, posSearchKeyword, 'ALL');
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--primary-color)', whiteSpace: 'nowrap' }}
                    onClick={() => fetchInventory(1, posSearchKeyword, 'ALL')}
                  >
                    Tìm kiếm
                  </button>
                  {posSearchKeyword && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setPosSearchKeyword('');
                        fetchInventory(1, '', 'ALL');
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Tên Thuốc</th>
                      <th>Mã Lô</th>
                      <th>Hạn Sử Dụng</th>
                      <th>Giá Gốc</th>
                      <th>Số Lượng Tồn</th>
                      <th>Đơn Vị Gốc</th>
                      <th style={{ textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoriesList.length > 0 ? (
                      inventoriesList.map((item) => {
                        const isExpired = item.expiryDate && new Date(item.expiryDate) <= new Date();
                        const isNearExpiry = item.expiryDate && !isExpired && new Date(item.expiryDate) <= new Date(new Date().setMonth(new Date().getMonth() + 6));
                        const isLowStock = item.stockQuantity < 20;

                        let statusBadge = null;
                        if (isExpired) {
                          statusBadge = <span style={{ display: 'block', width: 'fit-content', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', backgroundColor: '#fee2e2', color: '#991b1b', marginTop: '2px' }}>Hết hạn</span>;
                        } else if (isNearExpiry) {
                          statusBadge = <span style={{ display: 'block', width: 'fit-content', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', backgroundColor: '#ffedd5', color: '#9a3412', marginTop: '2px' }}>Cận hạn</span>;
                        } else if (isLowStock) {
                          statusBadge = <span style={{ display: 'block', width: 'fit-content', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', backgroundColor: '#fef9c3', color: '#854d0e', marginTop: '2px' }}>Ít hàng</span>;
                        }

                        return (
                          <tr key={item.id} style={item.stockQuantity <= 0 ? { opacity: 0.6 } : {}}>
                            <td>
                              <div style={{ fontWeight: '600' }}>{item.medicine.medicineName}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{item.medicine.ingredients}</div>
                            </td>
                            <td style={{ fontFamily: 'monospace' }}>{item.batchId}</td>
                            <td>
                              <div>{item.expiryDate}</div>
                              {statusBadge}
                            </td>
                            <td style={{ fontWeight: '500' }}>{item.medicine.unitPrice.toLocaleString()}đ</td>
                            <td style={{ fontWeight: '700', color: item.stockQuantity <= 0 ? '#ef4444' : '#0f172a' }}>
                              {item.stockQuantity}
                            </td>
                            <td>{item.medicine.baseUnit.unitName}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="btn-action btn-select"
                                style={(item.stockQuantity <= 0 || isExpired) ? { backgroundColor: '#cbd5e1', cursor: 'not-allowed', color: '#64748b' } : {}}
                                disabled={item.stockQuantity <= 0 || isExpired}
                                onClick={() => handleAddToPosCart(item)}
                              >
                                {item.stockQuantity <= 0 ? 'Hết hàng' : isExpired ? 'Đã hết hạn' : 'Chọn Bán'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không có lô thuốc nào khả dụng trong kho. Gõ tìm kiếm hoặc tải lại.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              {inventoryTotalItems > 0 && (
                <div className="pagination-container" style={{ marginTop: '15px' }}>
                  <div className="pagination-info">
                    Hiển thị {Math.min((inventoryCurrentPage - 1) * 10 + 1, inventoryTotalItems)} - {Math.min(inventoryCurrentPage * 10, inventoryTotalItems)} của {inventoryTotalItems} dòng lô
                  </div>
                  {inventoryTotalPages > 1 && (
                    <div className="pagination-buttons">
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={inventoryCurrentPage === 1}
                        onClick={() => fetchInventory(inventoryCurrentPage - 1, posSearchKeyword, 'ALL')}
                      >
                        ◀ Trước
                      </button>
                      {Array.from({ length: inventoryTotalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`pagination-btn ${inventoryCurrentPage === p ? 'active' : ''}`}
                          onClick={() => fetchInventory(p, posSearchKeyword, 'ALL')}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={inventoryCurrentPage === inventoryTotalPages}
                        onClick={() => fetchInventory(inventoryCurrentPage + 1, posSearchKeyword, 'ALL')}
                      >
                        Sau ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: GIỎ HÀNG & THAO TÁC THANH TOÁN */}
            <div className="split-right content-card" style={{ width: '520px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Giỏ Hàng
              </h2>

              <form onSubmit={handleOpenCheckoutModal}>
                <span className="label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Danh sách sản phẩm chọn:</span>

                {/* Giỏ hàng scrollable */}
                <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '8px', marginBottom: '15px' }}>
                  {posCart.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '24px' }}></span>
                      <span>Chưa chọn lô thuốc nào để bán.<br />Click [Chọn Bán] ở bên trái.</span>
                    </div>
                  ) : (
                    posCart.map((line, idx) => {
                      const baseUnitOpt = { unitID: line.baseUnit.unitID, unitName: line.baseUnit.unitName, conversionRate: 1 };
                      const altUnits = line.alternativeUnits ? line.alternativeUnits.map(au => ({
                        unitID: au.unitID || au.unit?.unitID,
                        unitName: au.unitName || au.unit?.unitName || au.unitID,
                        conversionRate: au.conversionRate
                      })) : [];
                      const allUnits = [baseUnitOpt, ...altUnits];

                      const currentPrice = line.unitPrice * line.conversionRate;
                      const hasStockWarning = line.quantity * line.conversionRate > line.stockQuantity;

                      return (
                        <div key={line.inventoryId} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', flexGrow: 1, paddingRight: '10px' }}>
                              #{idx + 1}. {line.medicineName}
                            </span>
                            <button
                              type="button"
                              className="btn-action btn-delete"
                              style={{ padding: '2px 6px', fontSize: '11px', flexShrink: 0 }}
                              onClick={() => handleRemoveFromPosCart(line.inventoryId)}
                            >
                              Xóa
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>Lô: {line.batchId}</span>
                            <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>HSD: {line.expiryDate}</span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                            <div>
                              <label className="label" style={{ fontSize: '10px', margin: 0, color: '#64748b' }}>Đơn vị:</label>
                              <select
                                className="select-input"
                                style={{ padding: '4px 6px', fontSize: '11px', height: '28px', marginTop: '2px' }}
                                value={line.transactionUnitId}
                                onChange={(e) => handlePosCartUnitChange(line.inventoryId, e.target.value, line)}
                              >
                                {allUnits.map(u => (
                                  <option key={u.unitID} value={u.unitID}>{u.unitName} (x{u.conversionRate})</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="label" style={{ fontSize: '10px', margin: 0, color: '#64748b' }}>SL:</label>
                              <input
                                type="number"
                                className="input"
                                style={{ padding: '4px 6px', fontSize: '11px', height: '28px', marginTop: '2px' }}
                                value={line.quantity}
                                onChange={(e) => handlePosCartQtyChange(line.inventoryId, e.target.value)}
                                min="1"
                                required
                              />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <label className="label" style={{ fontSize: '10px', margin: 0, color: '#64748b', textAlign: 'right', display: 'block' }}>Thành tiền:</label>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--success-hover)', display: 'block', marginTop: '4px' }}>
                                {(line.quantity * currentPrice).toLocaleString()}đ
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <span style={{ fontSize: '12px' }}></span>
                            <input
                              type="text"
                              placeholder="Ghi chú sử dụng (VD: Uống sau ăn)..."
                              className="input"
                              style={{ padding: '4px 8px', fontSize: '11px', height: '26px', width: '100%', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                              value={line.note || ''}
                              onChange={(e) => handlePosCartNoteChange(line.inventoryId, e.target.value)}
                            />
                          </div>

                          {hasStockWarning && (
                            <span style={{ color: 'var(--error-color)', fontSize: '10px', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                              ⚠️ Vượt quá tồn kho! (Tồn tối đa: {Math.floor(line.stockQuantity / line.conversionRate)} {allUnits.find(u => u.unitID === line.transactionUnitId)?.unitName})
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Tính toán thanh toán */}
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                    <span>Tổng số dòng sản phẩm:</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{posCart.length} dòng</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#0f172a', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                    <span>TỔNG THÀNH TIỀN:</span>
                    <span style={{ color: 'var(--success-hover)', fontSize: '18px' }}>{cartTotal.toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-action btn-cancel"
                    onClick={() => {
                      if (window.confirm("Xóa toàn bộ giỏ hàng?")) setPosCart([]);
                    }}
                    disabled={posCart.length === 0}
                  >
                    Xóa giỏ
                  </button>
                  <button
                    type="submit"
                    className="btn-action btn-select"
                    style={{
                      flexGrow: 1,
                      backgroundColor: posCart.length === 0 || posCart.some(c => c.quantity * c.conversionRate > c.stockQuantity) ? '#cbd5e1' : 'var(--success-color)'
                    }}
                    disabled={posCart.length === 0 || posCart.some(c => c.quantity * c.conversionRate > c.stockQuantity)}
                  >
                    XÁC NHẬN TẠO ĐƠN
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }

      case 'sales_invoices': {
        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH HÓA ĐƠN */}
            <div className="split-left content-card">
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h1 className="content-title">Nhật Ký Hóa Đơn Bán Lẻ</h1>
                </div>

                <div className="advanced-search-group">
                  <input
                    type="text"
                    placeholder="Tìm theo số HĐ, khách hàng, tên thuốc, mã lô, phương thức thanh toán..."
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={invoiceSearchVal}
                    onChange={(e) => setInvoiceSearchVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setActiveInvoiceSearchVal(invoiceSearchVal);
                        fetchInvoices(1, invoiceSearchVal);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setActiveInvoiceSearchVal(invoiceSearchVal);
                      fetchInvoices(1, invoiceSearchVal);
                    }}
                  >
                    Tìm kiếm
                  </button>
                  {(invoiceSearchVal || activeInvoiceSearchVal) && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setInvoiceSearchVal('');
                        setActiveInvoiceSearchVal('');
                        fetchInvoices(1, '');
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Số Hóa Đơn</th>
                      <th>Ngày Lập</th>
                      <th>Khách Hàng</th>
                      <th>Địa Chỉ</th>
                      <th>Thanh Toán</th>
                      <th>Tổng Tiền</th>
                      <th style={{ textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesList.length > 0 ? (
                      invoicesList.map((item) => {
                        const invTotal = item.details?.reduce((sum, d) => sum + (d.subTotal || 0), 0) || 0;

                        return (
                          <tr key={item.invoiceID}>
                            <td style={{ fontWeight: '600' }}>HĐ-{item.invoiceID}</td>
                            <td>{item.invoiceTime ? new Date(item.invoiceTime).toLocaleString('vi-VN') : ''}</td>
                            <td style={{ fontWeight: '500' }}>{item.customerName || 'Khách vãng lai'}</td>
                            <td>{item.address || '---'}</td>
                            <td>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '700',
                                backgroundColor: '#f1f5f9',
                                color: item.paymentMethod === 'Cash' ? '#22c55e' : 'var(--primary-color)'
                              }}>
                                {item.paymentMethod === 'Cash' ? 'Tiền mặt' : 'Thẻ/Bank'}
                              </span>
                            </td>
                            <td style={{ fontWeight: '700', color: 'var(--success-hover)' }}>
                              {invTotal.toLocaleString()}đ
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="btn-action btn-select"
                                onClick={() => setSelectedInvoice(item)}
                              >
                                Chi Tiết
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Chưa có hóa đơn bán lẻ nào được ghi nhận.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              {invoiceTotalItems > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Hiển thị {Math.min((invoiceCurrentPage - 1) * 10 + 1, invoiceTotalItems)} - {Math.min(invoiceCurrentPage * 10, invoiceTotalItems)} của {invoiceTotalItems} hóa đơn
                  </div>
                  {invoiceTotalPages > 1 && (
                    <div className="pagination-buttons">
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={invoiceCurrentPage === 1}
                        onClick={() => fetchInvoices(invoiceCurrentPage - 1, activeInvoiceSearchVal)}
                      >
                        ◀
                      </button>
                      {Array.from({ length: invoiceTotalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`pagination-btn ${invoiceCurrentPage === p ? 'active' : ''}`}
                          onClick={() => fetchInvoices(p, activeInvoiceSearchVal)}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={invoiceCurrentPage === invoiceTotalPages}
                        onClick={() => fetchInvoices(invoiceCurrentPage + 1, activeInvoiceSearchVal)}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: CHI TIẾT HÓA ĐƠN ĐÃ CHỌN */}
            <div className="split-right content-card" style={{ width: '520px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', color: '#0f172a' }}>
                Chi Tiết Hóa Đơn
              </h2>

              {selectedInvoice ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div><span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Số hóa đơn:</span><strong style={{ fontSize: '14px', color: '#0f172a' }}>HĐ-{selectedInvoice.invoiceID}</strong></div>
                    <div><span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Ngày lập:</span><span style={{ fontSize: '13px', fontWeight: '500' }}>{selectedInvoice.invoiceTime ? new Date(selectedInvoice.invoiceTime).toLocaleString('vi-VN') : ''}</span></div>
                    <div><span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Khách hàng:</span><span style={{ fontSize: '13px', fontWeight: '600' }}>{selectedInvoice.customerName || 'Khách vãng lai'}</span></div>
                    <div><span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Hình thức thanh toán:</span><span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--success-hover)' }}> {selectedInvoice.paymentMethod === 'Cash' ? 'Tiền mặt' : 'Thẻ / Bank'}</span></div>
                  </div>

                  {selectedInvoice.address && (
                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: '600' }}>Địa chỉ giao nhận hàng:</span>
                      <span style={{ color: '#334155' }}>{selectedInvoice.address}</span>
                    </div>
                  )}

                  <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '5px 0' }} />

                  <span className="label" style={{ marginBottom: '6px', fontWeight: '600', color: '#475569' }}>Danh sách sản phẩm đã mua:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', maxHeight: '280px', overflowY: 'auto', background: '#f8fafc' }}>
                    {selectedInvoice.details && selectedInvoice.details.map((d, i) => (
                      <div key={i} style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: '#1e293b', fontSize: '13px' }}>
                          <span>{d.medicineName}</span>
                          <span style={{ color: 'var(--success-hover)' }}>{d.subTotal?.toLocaleString()}đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          <span>Lô: {d.batchId} | Số lượng: {d.quantity}</span>
                          <span>Đơn giá: {d.unitPrice?.toLocaleString()}đ</span>
                        </div>
                        {d.note && (
                          <div style={{ fontSize: '11px', color: '#dc2626', background: '#fef2f2', padding: '4px 8px', borderRadius: '4px', borderLeft: '3px solid #ef4444', fontStyle: 'italic', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span></span>
                            <span>{d.note}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                      <span>TỔNG THANH TOÁN:</span>
                      <span style={{ color: 'var(--success-hover)', fontSize: '18px' }}>
                        {(selectedInvoice.details?.reduce((sum, d) => sum + (d.subTotal || 0), 0) || 0).toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', fontWeight: '600' }}
                      onClick={() => setSelectedInvoice(null)}
                    >
                      Đóng chi tiết
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-select"
                      style={{ flex: 1, backgroundColor: 'var(--success-color)', padding: '10px', borderRadius: '6px', fontWeight: '600' }}
                      onClick={() => {
                        setInvoiceReceiptData(selectedInvoice);
                        setShowReceiptModal(true);
                      }}
                    >
                      In hóa đơn
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>Vui lòng chọn một hóa đơn ở bảng bên trái để xem chi tiết & in hóa đơn.</p>
              )}
            </div>
          </div>
        );
      }
      case 'sales_orders':
        return (
          <div className="content-card">
            <h1 className="content-title">Quản Lý Đơn Đặt Hàng</h1>
            <div className="content-body" style={{ marginTop: '15px' }}>
              <p>Màn hình quản lý các đơn thuốc đặt trước của khách hàng hoặc các đơn giao hàng đi tỉnh (Order).</p>
              <p style={{ marginTop: '10px', color: '#64748b', fontStyle: 'italic' }}>Giao diện quản lý đơn đặt hàng sẽ được xây dựng ở các bước tiếp theo.</p>
            </div>
          </div>
        );
      case 'sales_customers': {
        const filtered = customersList.filter(c =>
          c.fullName.toLowerCase().includes(activeSearchCustomer.toLowerCase()) ||
          c.phoneNumber.toLowerCase().includes(activeSearchCustomer.toLowerCase()) ||
          c.customerID.toLowerCase().includes(activeSearchCustomer.toLowerCase())
        );

        // Client side pagination
        const itemsPerPage = 10;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        const currentPage = Math.min(customerCurrentPage, totalPages);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentCustomers = filtered.slice(indexOfFirstItem, indexOfLastItem);

        const renderCustomerRightPanel = () => {
          if (customerFormMode) {
            return (
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  {customerFormMode === 'add' ? ' Thêm Mới Khách Hàng' : 'Hiệu Chỉnh Khách Hàng'}
                </h2>
                <form onSubmit={handleCustomerSave}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Mã khách hàng:</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={customerForm.customerID}
                      onChange={(e) => setCustomerForm({ ...customerForm, customerID: e.target.value })}
                      disabled={customerFormMode === 'edit'}
                      placeholder="VD: KH-ANH-091"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Họ và tên:</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={customerForm.fullName}
                      onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                      placeholder="VD: Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Số điện thoại:</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={customerForm.phoneNumber}
                      onChange={(e) => setCustomerForm({ ...customerForm, phoneNumber: e.target.value })}
                      placeholder="VD: 0912345678"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Giới tính:</label>
                    <select
                      className="select-input"
                      style={{ padding: '10px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100%', outline: 'none' }}
                      value={customerForm.gender}
                      onChange={(e) => setCustomerForm({ ...customerForm, gender: e.target.value })}
                    >
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px' }}>Ngày gia nhập:</label>
                    <input
                      type="date"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '6px' }}
                      value={customerForm.joinDate ? customerForm.joinDate.split('T')[0] : ''}
                      disabled
                    />
                    <small style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      * Ngày gia nhập được tự động tạo và không thể chỉnh sửa.
                    </small>
                  </div>
                  <div className="form-actions" style={{ marginTop: '24px', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      style={{ padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      onClick={handleCustomerCancel}
                    >
                      Hủy bỏ
                    </button>
                    <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                      {customerFormMode === 'add' ? 'Thêm mới' : 'Lưu lại'}
                    </button>
                  </div>
                </form>
              </div>
            );
          }

          if (selectedCustomer) {
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
                    Chi Tiết Khách Hàng
                  </h2>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(role === 'Admin' || role === 'Sales') && (
                      <button
                        className="btn-action btn-edit"
                        style={{ margin: 0, padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => {
                          setCustomerFormMode('edit');
                          setCustomerForm({ ...selectedCustomer });
                        }}
                      >
                        Sửa
                      </button>
                    )}
                    {role === 'Admin' && (
                      <button
                        className="btn-action btn-delete"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => handleCustomerDelete(selectedCustomer.customerID)}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                  <div><span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Mã khách hàng:</span><strong style={{ fontSize: '13px', color: '#0f172a' }}>{selectedCustomer.customerID}</strong></div>
                  <div><span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Họ và tên:</span><strong style={{ fontSize: '13px', color: '#0f172a' }}>{selectedCustomer.fullName}</strong></div>
                  <div><span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Số điện thoại:</span><strong style={{ fontSize: '13px', color: '#0f172a' }}>{selectedCustomer.phoneNumber}</strong></div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Giới tính:</span>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: selectedCustomer.gender === 'Male' ? '#dbeafe' : '#fce7f3',
                      color: selectedCustomer.gender === 'Male' ? '#1e40af' : '#9d174d'
                    }}>
                      {selectedCustomer.gender === 'Male' ? 'Nam' : 'Nữ'}
                    </span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Ngày gia nhập:</span>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{selectedCustomer.joinDate ? selectedCustomer.joinDate.split('T')[0] : ''}</span>
                  </div>
                </div>

                {/* LỊCH SỬ MUA HÀNG - PLACEHOLDER */}
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Lịch Sử Mua Hàng
                  </h3>

                  <div className="custom-table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table className="custom-table" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr style={{ height: '30px' }}>
                          <th style={{ padding: '8px 10px', fontSize: '11px', backgroundColor: 'var(--success-hover)', color: '#ffffff' }}>Mã đơn</th>
                          <th style={{ padding: '8px 10px', fontSize: '11px', backgroundColor: 'var(--success-hover)', color: '#ffffff' }}>Ngày mua</th>
                          <th style={{ padding: '8px 10px', fontSize: '11px', backgroundColor: 'var(--success-hover)', color: '#ffffff' }}>Tổng tiền</th>
                          <th style={{ padding: '8px 10px', fontSize: '11px', backgroundColor: 'var(--success-hover)', color: '#ffffff', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.customerID === 'KH-ANH-091' || selectedCustomer.customerID === 'CUST001' ? (
                          <>
                            <tr>
                              <td style={{ padding: '8px', fontWeight: '600' }}>DH-1002</td>
                              <td style={{ padding: '8px' }}>2026-05-10</td>
                              <td style={{ padding: '8px', color: '#059669', fontWeight: '600' }}>150,000đ</td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <button
                                  className="btn-action btn-select"
                                  style={{ padding: '3px 6px', fontSize: '10px' }}
                                  onClick={() => handleShowInvoiceModal('DH-1002')}
                                >
                                  Xem chi tiết
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px', fontWeight: '600' }}>DH-1045</td>
                              <td style={{ padding: '8px' }}>2026-05-22</td>
                              <td style={{ padding: '8px', color: '#059669', fontWeight: '600' }}>320,000đ</td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <button
                                  className="btn-action btn-select"
                                  style={{ padding: '3px 6px', fontSize: '10px' }}
                                  onClick={() => handleShowInvoiceModal('DH-1045')}
                                >
                                  Xem chi tiết
                                </button>
                              </td>
                            </tr>
                          </>
                        ) : selectedCustomer.customerID === 'KH-BINH-098' || selectedCustomer.customerID === 'CUST002' ? (
                          <tr>
                            <td style={{ padding: '8px', fontWeight: '600' }}>DH-1015</td>
                            <td style={{ padding: '8px' }}>2026-05-18</td>
                            <td style={{ padding: '8px', color: '#059669', fontWeight: '600' }}>85,000đ</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <button
                                className="btn-action btn-select"
                                style={{ padding: '3px 6px', fontSize: '10px' }}
                                onClick={() => handleShowInvoiceModal('DH-1015')}
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ) : selectedCustomer.customerID === 'KH-CHI-090' || selectedCustomer.customerID === 'CUST003' ? (
                          <tr>
                            <td style={{ padding: '8px', fontWeight: '600' }}>DH-1099</td>
                            <td style={{ padding: '8px' }}>2026-05-25</td>
                            <td style={{ padding: '8px', color: '#059669', fontWeight: '600' }}>1,250,000đ</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <button
                                className="btn-action btn-select"
                                style={{ padding: '3px 6px', fontSize: '10px' }}
                                onClick={() => handleShowInvoiceModal('DH-1099')}
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '12px', fontStyle: 'italic' }}>
                              Chưa có lịch sử mua hàng.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#cbd5e1' }}></div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>
                Chưa Chọn Khách Hàng
              </h2>
              <p style={{ fontSize: '13px', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto' }}>
                Vui lòng chọn một khách hàng từ danh sách bên trái hoặc nhấn nút <strong>"Thêm khách hàng"</strong> để thao tác.
              </p>
            </div>
          );
        };

        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH BẢNG KHÁCH HÀNG */}
            <div className="split-left content-card">
              <h1 className="content-title">Quản Lý Khách Hàng</h1>

              <div className="table-actions" style={{ marginBottom: '20px' }}>
                <div className="advanced-search-group">
                  <input
                    type="text"
                    placeholder="Tìm tên, SĐT hoặc mã khách hàng..."
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={tempSearchCustomer}
                    onChange={(e) => setTempSearchCustomer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setActiveSearchCustomer(tempSearchCustomer);
                        setCustomerCurrentPage(1);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setActiveSearchCustomer(tempSearchCustomer);
                      setCustomerCurrentPage(1);
                    }}
                  >
                    Tìm kiếm
                  </button>
                  {(tempSearchCustomer || activeSearchCustomer) && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setTempSearchCustomer('');
                        setActiveSearchCustomer('');
                        setCustomerCurrentPage(1);
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
                {(role === 'Admin' || role === 'Sales') && (
                  <button className="btn-create" style={{ whiteSpace: 'nowrap' }} onClick={handleCustomerAddNewClick}>
                    Thêm khách hàng
                  </button>
                )}
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mã KH</th>
                      <th>Họ và tên</th>
                      <th>Số điện thoại</th>
                      <th>Giới tính</th>
                      <th>Ngày tham gia</th>
                      <th style={{ textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map((item) => (
                        <tr
                          key={item.customerID}
                          style={selectedCustomer && selectedCustomer.customerID === item.customerID ? { backgroundColor: '#f0fdf4' } : {}}
                        >
                          <td style={{ fontWeight: '600' }}>{item.customerID}</td>
                          <td style={{ fontWeight: '500' }}>{item.fullName}</td>
                          <td>{item.phoneNumber}</td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: item.gender === 'Male' ? '#dbeafe' : '#fce7f3',
                              color: item.gender === 'Male' ? '#1e40af' : '#9d174d'
                            }}>
                              {item.gender === 'Male' ? 'Nam' : 'Nữ'}
                            </span>
                          </td>
                          <td>{item.joinDate ? item.joinDate.split('T')[0] : ''}</td>
                          <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <button
                              className="btn-action btn-select"
                              style={{ marginRight: '6px' }}
                              onClick={() => {
                                setSelectedCustomer(item);
                                setCustomerFormMode(null);
                              }}
                            >
                              Chọn
                            </button>
                            {(role === 'Admin' || role === 'Sales') && (
                              <button
                                className="btn-action btn-edit"
                                style={{ marginRight: '6px' }}
                                onClick={() => {
                                  setSelectedCustomer(item);
                                  setCustomerFormMode('edit');
                                  setCustomerForm({ ...item });
                                }}
                              >
                                Sửa
                              </button>
                            )}
                            {role === 'Admin' && (
                              <button
                                className="btn-action btn-delete"
                                onClick={() => handleCustomerDelete(item.customerID)}
                              >
                                Xóa
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                          Không tìm thấy khách hàng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalItems > 0 && (
                <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                  <div className="pagination-info" style={{ fontSize: '12px' }}>
                    Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems} khách hàng
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-buttons" style={{ gap: '4px' }}>
                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={currentPage === 1}
                        onClick={() => setCustomerCurrentPage(currentPage - 1)}
                      >
                        ◀
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={() => setCustomerCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={currentPage === totalPages}
                        onClick={() => setCustomerCurrentPage(currentPage + 1)}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: CHI TIẾT HOẶC FORM THÊM / SỬA KHÁCH HÀNG */}
            <div className="split-right content-card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', background: '#ffffff' }}>
              {renderCustomerRightPanel()}
            </div>
          </div>
        );
      }

      /* PHÂN HỆ HỆ THỐNG */
      case 'sys_employees': {
        const filtered = employeesList.filter(e =>
          e.fullName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
          e.employeeID.toLowerCase().includes(searchEmployee.toLowerCase()) ||
          (e.phoneNumber && e.phoneNumber.toLowerCase().includes(searchEmployee.toLowerCase())) ||
          (e.email && e.email.toLowerCase().includes(searchEmployee.toLowerCase()))
        );

        // Client side pagination
        const itemsPerPage = 10;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        const currentPage = Math.min(employeeCurrentPage, totalPages);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentEmployees = filtered.slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div className="content-card" style={{ width: '100%' }}>
            <h1 className="content-title">Quản Lý Nhân Viên</h1>

            <div className="table-actions">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên theo mã, tên, SĐT..."
                className="search-input"
                style={{ maxWidth: 'none', flexGrow: 1 }}
                value={searchEmployee}
                onChange={(e) => {
                  setSearchEmployee(e.target.value);
                  setEmployeeCurrentPage(1);
                }}
              />
              <button
                className="btn-create"
                onClick={() => {
                  setEmployeeFormMode('add');
                  setEmployeeForm({
                    employeeID: 'NV' + Math.random().toString(36).substring(2, 6).toUpperCase(),
                    fullName: '',
                    phoneNumber: '',
                    email: '',
                    gender: 'Male',
                    yearOfBirth: new Date().getFullYear() - 25,
                    hireDate: new Date().toISOString().split('T')[0],
                    username: '',
                    roleName: 'Sales',
                    isStaff: true,
                    isActive: true
                  });
                }}
              >
                Thêm nhân viên
              </button>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ tên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Giới tính</th>
                    <th>Năm sinh</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((item) => (
                      <tr key={item.employeeID}>
                        <td style={{ fontWeight: '600' }}>{item.employeeID}</td>
                        <td>{item.fullName}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.email}</td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: item.gender === 'Male' ? '#dbeafe' : '#fce7f3',
                            color: item.gender === 'Male' ? '#1e40af' : '#9d174d'
                          }}>
                            {item.gender === 'Male' ? 'Nam' : 'Nữ'}
                          </span>
                        </td>
                        <td>{item.yearOfBirth}</td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button className="btn-action btn-edit" style={{ marginRight: '6px' }} onClick={() => handleEmployeeEditClick(item)}>Sửa</button>
                          <button className="btn-action btn-delete" onClick={() => handleEmployeeDelete(item.employeeID)}>Xóa</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy nhân viên nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalItems > 0 && (
              <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                <div className="pagination-info" style={{ fontSize: '12px' }}>
                  Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems} nhân viên
                </div>
                {totalPages > 1 && (
                  <div className="pagination-buttons" style={{ gap: '4px' }}>
                    <button
                      type="button"
                      className="pagination-btn"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      disabled={currentPage === 1}
                      onClick={() => setEmployeeCurrentPage(currentPage - 1)}
                    >
                      ◀
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => setEmployeeCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="pagination-btn"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      disabled={currentPage === totalPages}
                      onClick={() => setEmployeeCurrentPage(currentPage + 1)}
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MODAL POPUP FORM THÊM / SỬA */}
            {employeeFormMode && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(6px)'
              }}>
                <div className="content-card" style={{
                  width: '650px',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  padding: '28px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      {employeeFormMode === 'add' ? 'Thêm mới nhân viên' : `Chỉnh sửa nhân viên`}
                    </h2>
                    <button
                      type="button"
                      onClick={handleEmployeeCancel}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        lineHeight: 1,
                        padding: '4px'
                      }}
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleEmployeeSave}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>
                      I. Thông tin nhân sự
                    </h3>
                    <div className="form-group">
                      <label className="label">Mã nhân viên:</label>
                      <input
                        type="text"
                        className="input"
                        value={employeeForm.employeeID}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, employeeID: e.target.value })}
                        disabled={employeeFormMode === 'edit'}
                        placeholder="VD: NV001"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Họ tên nhân viên:</label>
                      <input
                        type="text"
                        className="input"
                        value={employeeForm.fullName}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                        placeholder="VD: Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Số điện thoại:</label>
                      <input
                        type="text"
                        className="input"
                        value={employeeForm.phoneNumber}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, phoneNumber: e.target.value })}
                        placeholder="VD: 0987654321"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Email:</label>
                      <input
                        type="email"
                        className="input"
                        value={employeeForm.email}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                        placeholder="VD: nv001@gmail.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Giới tính:</label>
                      <select
                        className="select-input"
                        value={employeeForm.gender}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
                      >
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Năm sinh:</label>
                      <input
                        type="number"
                        className="input"
                        value={employeeForm.yearOfBirth}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, yearOfBirth: Number(e.target.value) || '' })}
                        placeholder="VD: 1995"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Ngày vào làm:</label>
                      <input
                        type="date"
                        className="input"
                        value={employeeForm.hireDate}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })}
                        required
                      />
                    </div>

                    {employeeFormMode === 'add' && (
                      <>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px' }}>
                          II. Thông tin tài khoản liên kết (Bắt buộc)
                        </h3>
                        <div className="form-group">
                          <label className="label">Tên đăng nhập:</label>
                          <input
                            type="text"
                            className="input"
                            value={employeeForm.username}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                            placeholder="VD: nguyenvana"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="label">Vai trò (Role):</label>
                          <select
                            className="select-input"
                            value={employeeForm.roleName}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, roleName: e.target.value })}
                          >
                            <option value="Sales">Bán hàng (Sales)</option>
                            <option value="Product_manager">Quản lý kho (Product Manager)</option>
                            <option value="Admin">Quản trị viên (Admin)</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={employeeForm.isStaff}
                              onChange={(e) => setEmployeeForm({ ...employeeForm, isStaff: e.target.checked })}
                            />
                            Nhân viên hệ thống (isStaff)
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={employeeForm.isActive}
                              onChange={(e) => setEmployeeForm({ ...employeeForm, isActive: e.target.checked })}
                            />
                            Kích hoạt tài khoản (isActive)
                          </label>
                        </div>
                      </>
                    )}

                    <div className="form-actions" style={{ marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <button type="button" className="btn-action btn-cancel" style={{ marginRight: '6px' }} onClick={handleEmployeeCancel}>
                        Hủy bỏ
                      </button>
                      <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1 }}>
                        {employeeFormMode === 'add' ? 'Thêm mới' : 'Lưu lại'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'sys_accounts': {
        const filtered = accountsList.filter(a =>
          a.username.toLowerCase().includes(searchAccount.toLowerCase()) ||
          (a.role && a.role.toLowerCase().includes(searchAccount.toLowerCase())) ||
          (a.employee && a.employee.fullName.toLowerCase().includes(searchAccount.toLowerCase())) ||
          (a.employee && a.employee.employeeID.toLowerCase().includes(searchAccount.toLowerCase()))
        );

        // Client side pagination
        const itemsPerPage = 10;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        const currentPage = Math.min(accountCurrentPage, totalPages);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentAccounts = filtered.slice(indexOfFirstItem, indexOfLastItem);

        // Employees list that don't have accounts yet (for manual creation)
        const unlinkedEmployees = employeesList.filter(emp =>
          !accountsList.some(acc => acc.employee && acc.employee.employeeID === emp.employeeID)
        );

        return (
          <div className="split-layout">
            {/* CỘT TRÁI: DANH SÁCH BẢNG TÀI KHOẢN */}
            <div className="split-left content-card">
              <h1 className="content-title">Tài Khoản & Phân Quyền</h1>

              <div className="table-actions">
                <input
                  type="text"
                  placeholder="Tìm kiếm tài khoản theo username, quyền, nhân viên..."
                  className="search-input"
                  style={{ maxWidth: 'none', flexGrow: 1 }}
                  value={searchAccount}
                  onChange={(e) => {
                    setSearchAccount(e.target.value);
                    setAccountCurrentPage(1);
                  }}
                />
                <button
                  className="btn-create"
                  onClick={() => {
                    setAccountFormMode('add');
                    setAccountForm({
                      accountID: '',
                      username: '',
                      roleName: 'Sales',
                      employeeID: unlinkedEmployees[0] ? unlinkedEmployees[0].employeeID : '',
                      isStaff: true,
                      isActive: true,
                      password: ''
                    });
                  }}
                >
                  Cấp tài khoản
                </button>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên đăng nhập</th>
                      <th>Quyền (Role)</th>
                      <th>Nhân viên liên kết</th>
                      <th>Nhân viên (isStaff)</th>
                      <th>Trạng thái</th>
                      <th>First Login</th>
                      <th style={{ textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAccounts.length > 0 ? (
                      currentAccounts.map((item) => (
                        <tr key={item.accountID} style={accountForm.accountID === item.accountID ? { backgroundColor: '#f0fdf4' } : {}}>
                          <td style={{ fontWeight: '600' }}>{item.accountID}</td>
                          <td style={{ fontWeight: '600', color: '#1e3a8a' }}>{item.username}</td>
                          <td>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: item.role === 'Admin' ? '#fee2e2' : item.role === 'Product_manager' ? '#fef3c7' : '#dcfce7',
                              color: item.role === 'Admin' ? '#991b1b' : item.role === 'Product_manager' ? '#92400e' : '#166534'
                            }}>
                              {item.role}
                            </span>
                          </td>
                          <td>
                            {item.employee ? (
                              <span style={{ fontSize: '13px' }}>
                                <strong>{item.employee.fullName}</strong> ({item.employee.employeeID})
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không liên kết</span>
                            )}
                          </td>
                          <td>
                            <span style={{ color: item.isStaff ? '#166534' : '#94a3b8' }}>
                              {item.isStaff ? 'Có' : 'Không'}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: item.isActive ? '#d1fae5' : '#f3f4f6',
                              color: item.isActive ? '#065f46' : '#374151'
                            }}>
                              {item.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: item.isFirstLogin ? '#ea580c' : '#94a3b8' }}>
                              {item.isFirstLogin ? 'Chưa đổi mật khẩu' : 'Đã đổi'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <button className="btn-action btn-edit" style={{ marginRight: '6px' }} onClick={() => handleAccountEditClick(item)}>Sửa</button>
                            <button className="btn-action btn-delete" onClick={() => handleAccountDelete(item.accountID)}>Xóa</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy tài khoản nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalItems > 0 && (
                <div className="pagination-container" style={{ borderRadius: '0 0 8px 8px', marginTop: '10px', padding: '10px 14px' }}>
                  <div className="pagination-info" style={{ fontSize: '12px' }}>
                    Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems} tài khoản
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-buttons" style={{ gap: '4px' }}>
                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={currentPage === 1}
                        onClick={() => setAccountCurrentPage(currentPage - 1)}
                      >
                        ◀
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={() => setAccountCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        disabled={currentPage === totalPages}
                        onClick={() => setAccountCurrentPage(currentPage + 1)}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: FORM CHỈNH SỬA / CẤP LẺ & RESET PASSWORD */}
            <div className="split-right" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '420px' }}>
              <div className="content-card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', background: '#ffffff' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  {accountFormMode === 'add' ? 'Cấp Tài Khoản Mới' : 'Hiệu Chỉnh Tài Khoản'}
                </h2>
                <form onSubmit={handleAccountSave}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Tên đăng nhập (username):</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      value={accountForm.username}
                      onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                      disabled={accountFormMode === 'edit'}
                      placeholder="VD: nguyenvana"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Vai trò (Role):</label>
                    <select
                      className="select-input"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                      value={accountForm.roleName}
                      onChange={(e) => setAccountForm({ ...accountForm, roleName: e.target.value })}
                      required
                    >
                      <option value="Sales">Bán hàng (Sales)</option>
                      <option value="Product_manager">Quản lý kho (Product Manager)</option>
                      <option value="Admin">Quản trị viên (Admin)</option>
                    </select>
                  </div>

                  {accountFormMode === 'add' ? (
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Nhân viên liên kết:</label>
                      {unlinkedEmployees.length > 0 ? (
                        (() => {
                          const mappedEmployees = unlinkedEmployees.map(emp => ({
                            ...emp,
                            displayName: `${emp.fullName} (${emp.employeeID})`
                          }));
                          return (
                            <SearchableSelect
                              options={mappedEmployees}
                              value={accountForm.employeeID}
                              onChange={(val) => setAccountForm({ ...accountForm, employeeID: val })}
                              idKey="employeeID"
                              nameKey="displayName"
                              placeholder="Chọn nhân viên..."
                            />
                          );
                        })()
                      ) : (
                        <input
                          type="text"
                          className="input"
                          style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b' }}
                          value="(Không còn nhân viên nào chưa có tài khoản)"
                          disabled
                        />
                      )}
                    </div>
                  ) : (
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Nhân viên liên kết (Không thể đổi):</label>
                      <input
                        type="text"
                        className="input"
                        style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b' }}
                        value={
                          accountsList.find(a => a.accountID === accountForm.accountID)?.employee
                            ? `${accountsList.find(a => a.accountID === accountForm.accountID).employee.fullName} (${accountsList.find(a => a.accountID === accountForm.accountID).employee.employeeID})`
                            : 'Không liên kết'
                        }
                        disabled
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '500', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        checked={accountForm.isStaff}
                        onChange={(e) => setAccountForm({ ...accountForm, isStaff: e.target.checked })}
                      />
                      Nhân viên hệ thống (isStaff)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '500', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        checked={accountForm.isActive}
                        onChange={(e) => setAccountForm({ ...accountForm, isActive: e.target.checked })}
                      />
                      Kích hoạt tài khoản (isActive)
                    </label>
                  </div>

                  <div className="form-actions" style={{ marginTop: '24px', gap: '8px', display: 'flex' }}>
                    {accountFormMode === 'add' && (
                      <button
                        type="button"
                        className="btn-action btn-cancel"
                        style={{ padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                        onClick={handleAccountCancel}
                      >
                        Hủy bỏ
                      </button>
                    )}
                    <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: 'var(--primary-color)' }}>
                      {accountFormMode === 'add' ? 'Cấp tài khoản' : 'Lưu lại'}
                    </button>
                  </div>
                </form>
              </div>

              {accountFormMode === 'edit' && accountForm.accountID && (
                <div className="content-card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', background: '#ffffff' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    🔒 Đổi Mật Khẩu Tài Khoản
                  </h2>
                  <form onSubmit={handleAccountResetPassword}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="label" style={{ fontWeight: '600', color: '#475569', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Mật khẩu mới:</label>
                      <input
                        type="password"
                        className="input"
                        style={{ padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        value={accountForm.password}
                        onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                        placeholder="Nhập mật khẩu mới..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-create"
                      style={{ width: '100%', border: 'none', marginTop: '14px', backgroundColor: '#e11d48', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#ffffff', cursor: 'pointer' }}
                    >
                      Đặt lại mật khẩu 🔒
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        );
      }

      /* CÁC TAB GIẢ ĐỊNH CHO BUTTONS KHÁC */
      default:
        return (
          <div className="content-card">
            <h1 className="content-title">{activeTab.toUpperCase()} Screen</h1>
            <div className="content-body">
              <p>Đây là màn hình chức năng thuộc {activeTab}. Hệ thống đã dựng sẵn khung điều hướng và cấu trúc submenu.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="sidebar">
        {/* User profile section */}
        <div className="user-profile">
          <div className="user-name">{username}</div>
          <div className="user-role">{role}</div>
        </div>

        {/* CÂY MENU ĐA CẤP (COLLAPSIBLE SIDEBAR) */}
        <nav className="menu-list">

          {/* MENU 0: TỔNG QUAN (Single button, no submenus) */}
          <div>
            <button
              className={`menu-btn-parent ${activeTab === 'overview' ? 'active' : ''}`}
              style={activeTab === 'overview' ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' } : {}}
              onClick={() => {
                setActiveTab('overview');
                setExpandedMenus({
                  thuoc: false,
                  kho: false,
                  banHang: false,
                  heThong: false
                });
              }}
            >
              <span>Tổng quan</span>
            </button>
          </div>

          {/* MENU 1: THUỐC (Parent key: 'thuoc') */}
          <div>
            <button className="menu-btn-parent" onClick={() => toggleMenu('thuoc')}>
              <span>Thuốc</span>
              <span className="menu-arrow">{expandedMenus.thuoc ? '▲' : '▼'}</span>
            </button>
            {expandedMenus.thuoc && (
              <div className="submenu-list">
                <button className={`submenu-btn ${activeTab === 'medicine' ? 'active' : ''}`} onClick={() => setActiveTab('medicine')}>
                  Thông tin thuốc
                </button>
                <button className={`submenu-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
                  Danh mục
                </button>
                <button className={`submenu-btn ${activeTab === 'unit' ? 'active' : ''}`} onClick={() => setActiveTab('unit')}>
                  Đơn vị tính
                </button>
                <button className={`submenu-btn ${activeTab === 'origin' ? 'active' : ''}`} onClick={() => setActiveTab('origin')}>
                  Xuất xứ
                </button>
              </div>
            )}
          </div>

          {/* MENU 2: KHO THUỐC (Parent key: 'kho') */}
          <div>
            <button className="menu-btn-parent" onClick={() => toggleMenu('kho')}>
              <span>Kho thuốc</span>
              <span className="menu-arrow">{expandedMenus.kho ? '▲' : '▼'}</span>
            </button>
            {expandedMenus.kho && (
              <div className="submenu-list">
                <button className={`submenu-btn ${activeTab === 'warehouse_inventory' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_inventory')}>
                  Tồn kho thực tế
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_history' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_history')}>
                  Lịch sử kho
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_receipt' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_receipt')}>
                  Phiếu nhập kho
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_issue' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_issue')}>
                  Phiếu xuất kho
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_audit' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_audit')}>
                  Phiếu kiểm kê
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_supplier' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_supplier')}>
                  Nhà cung cấp
                </button>
              </div>
            )}
          </div>

          {/* MENU 3: BÁN HÀNG (Parent key: 'banHang') */}
          <div>
            <button className="menu-btn-parent" onClick={() => toggleMenu('banHang')}>
              <span>Bán hàng</span>
              <span className="menu-arrow">{expandedMenus.banHang ? '▲' : '▼'}</span>
            </button>
            {expandedMenus.banHang && (
              <div className="submenu-list">
                {role !== 'Product_manager' && (
                  <button className={`submenu-btn ${activeTab === 'sales_pos' ? 'active' : ''}`} onClick={() => setActiveTab('sales_pos')}>
                    Quầy bán thuốc
                  </button>
                )}
                <button className={`submenu-btn ${activeTab === 'sales_invoices' ? 'active' : ''}`} onClick={() => setActiveTab('sales_invoices')}>
                  Danh sách hóa đơn
                </button>
                <button className={`submenu-btn ${activeTab === 'sales_customers' ? 'active' : ''}`} onClick={() => setActiveTab('sales_customers')}>
                  Khách hàng
                </button>

              </div>
            )}
          </div>

          {/* MENU 4: HỆ THỐNG (Parent key: 'heThong') */}
          {role === 'Admin' && (
            <div>
              <button className="menu-btn-parent" onClick={() => toggleMenu('heThong')}>
                <span>Hệ thống</span>
                <span className="menu-arrow">{expandedMenus.heThong ? '▲' : '▼'}</span>
              </button>
              {expandedMenus.heThong && (
                <div className="submenu-list">
                  <button className={`submenu-btn ${activeTab === 'sys_employees' ? 'active' : ''}`} onClick={() => setActiveTab('sys_employees')}>
                    Quản lý nhân viên
                  </button>
                  <button className={`submenu-btn ${activeTab === 'sys_accounts' ? 'active' : ''}`} onClick={() => setActiveTab('sys_accounts')}>
                    Tài khoản & Phân quyền
                  </button>
                </div>
              )}
            </div>
          )}

        </nav>

        {/* NÚT ĐĂNG XUẤT */}
        <div className="logout-container">
          <button onClick={handleLogout} className="btn-logout">
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* VÙNG MAIN CONTENT */}
      <main className="main-content">
        {renderMainContent()}
      </main>

      {/* CHECKOUT MODAL OVERLAY */}
      {showPosCheckoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            background: '#ffffff',
            width: '520px',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                XÁC NHẬN THANH TOÁN ĐƠN HÀNG
              </h3>
              <button
                type="button"
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', lineHeight: '1' }}
                onClick={() => setShowPosCheckoutModal(false)}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePosCheckout}>
              {/* Danh sách sản phẩm thanh toán */}
              <div style={{ marginBottom: '16px' }}>
                <label className="label" style={{ fontWeight: '600', color: '#334155', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Sản phẩm thanh toán:</label>
                <div style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '10px',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {posCart.map((line, idx) => {
                    const currentPrice = line.unitPrice * line.conversionRate;
                    const uName = line.alternativeUnits && line.transactionUnitId !== line.baseUnit.unitID
                      ? (line.alternativeUnits.find(au => (au.unitID || au.unit?.unitID) === line.transactionUnitId)?.unitName || line.transactionUnitId)
                      : line.baseUnit.unitName;

                    return (
                      <div key={line.inventoryId} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '6px', borderBottom: idx < posCart.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>
                          <span>{idx + 1}. {line.medicineName}</span>
                          <span style={{ color: 'var(--success-hover)' }}>{(line.quantity * currentPrice).toLocaleString()}đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          <span>SL: {line.quantity} {uName} (Đơn giá: {currentPrice.toLocaleString()}đ)</span>
                          {line.note && <span style={{ fontStyle: 'italic', color: '#475569' }}> {line.note}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chọn Khách hàng */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="label" style={{ fontWeight: '600', color: '#334155', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Khách hàng thành viên:</label>
                {(() => {
                  const mappedCustomers = [
                    { customerID: '', displayName: 'Khách lẻ vãng lai' },
                    ...customersList.map(c => ({
                      ...c,
                      displayName: `${c.fullName} (${c.phoneNumber})`
                    }))
                  ];
                  return (
                    <SearchableSelect
                      options={mappedCustomers}
                      value={posSelectedCustomer?.customerID || ''}
                      onChange={(val) => {
                        const c = customersList.find(cust => cust.customerID === val);
                        setPosSelectedCustomer(c || null);
                        if (c) {
                          setPosAddress(c.address || '');
                        } else {
                          setPosAddress('');
                        }
                      }}
                      idKey="customerID"
                      nameKey="displayName"
                      placeholder="Chọn khách hàng..."
                    />
                  );
                })()}
              </div>

              {/* Nhập Địa chỉ */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="label" style={{ fontWeight: '600', color: '#334155', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Địa chỉ người mua:</label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  value={posAddress}
                  onChange={(e) => setPosAddress(e.target.value)}
                  placeholder="Nhập địa chỉ giao hàng (không bắt buộc)..."
                />
              </div>

              {/* Hình thức thanh toán (Fix cứng Tiền mặt) */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="label" style={{ fontWeight: '600', color: '#334155', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Hình thức thanh toán:</label>
                <div style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Tiền mặt
                </div>
              </div>

              {/* Tổng tiền & Tiền mặt thanh toán */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#475569' }}>
                  <span>Tổng tiền cần thanh toán:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{posCart.reduce((sum, item) => sum + item.quantity * (item.unitPrice * item.conversionRate), 0).toLocaleString()}đ</span>
                </div>

                <div className="form-group" style={{ marginBottom: '12px', marginTop: '12px' }}>
                  <label className="label" style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Số tiền khách đưa:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      className="input"
                      placeholder="Nhập số tiền khách đưa..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '2px solid #22c55e',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1e293b'
                      }}
                      value={posCashGiven}
                      onChange={(e) => setPosCashGiven(e.target.value)}
                      min="0"
                      required
                    />
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#64748b' }}>đ</span>
                  </div>
                </div>

                {/* Quick money select buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {[
                    posCart.reduce((sum, item) => sum + item.quantity * (item.unitPrice * item.conversionRate), 0),
                    10000, 20000, 50000, 100000, 200000, 500000
                  ].map((val, idx) => {
                    if (val <= 0) return null;
                    return (
                      <button
                        key={idx}
                        type="button"
                        style={{
                          padding: '6px 10px',
                          fontSize: '12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          color: '#334155',
                          fontWeight: '500'
                        }}
                        onClick={() => setPosCashGiven(val.toString())}
                      >
                        {idx === 0 ? 'Đủ tiền' : val.toLocaleString() + 'đ'}
                      </button>
                    );
                  })}
                </div>

                {/* Tiền thừa trả khách */}
                {(() => {
                  const total = posCart.reduce((sum, item) => sum + item.quantity * (item.unitPrice * item.conversionRate), 0);
                  const given = Number(posCashGiven) || 0;
                  const change = given - total;
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Tiền thối lại cho khách:</span>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        color: change < 0 ? '#ef4444' : '#22c55e'
                      }}>
                        {change < 0 ? 'Chưa đủ tiền khách đưa' : `${change.toLocaleString()}đ`}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-action btn-cancel"
                  style={{ flex: 1, padding: '12px', borderRadius: '6px', fontWeight: '600' }}
                  onClick={() => setShowPosCheckoutModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-action btn-select"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    backgroundColor: (Number(posCashGiven) || 0) < posCart.reduce((sum, item) => sum + item.quantity * (item.unitPrice * item.conversionRate), 0) ? '#cbd5e1' : 'var(--success-color)',
                    color: 'white',
                    border: 'none',
                    cursor: (Number(posCashGiven) || 0) < posCart.reduce((sum, item) => sum + item.quantity * (item.unitPrice * item.conversionRate), 0) ? 'not-allowed' : 'pointer'
                  }}
                  disabled={(Number(posCashGiven) || 0) < posCart.reduce((sum, item) => sum + item.quantity * (item.unitPrice * item.conversionRate), 0)}
                >
                  HOÀN TẤT & IN HÓA ĐƠN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIMULATED THERMAL RECEIPT MODAL */}
      {showReceiptModal && invoiceReceiptData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff',
            width: '500px',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Courier New, Courier, monospace',
            color: '#000',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '2px solid #334155'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>PIS PHARMACY</h2>
              <p style={{ fontSize: '13px', margin: '2px 0' }}>123 Đường Láng, Đống Đa, Hà Nội</p>
              <p style={{ fontSize: '13px', margin: '2px 0' }}>SĐT: 024.1234.5678</p>
              <div style={{ borderBottom: '1px dashed #000', margin: '12px 0' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>HÓA ĐƠN BÁN LẺ</h3>
              <p style={{ fontSize: '13px', margin: '2px 0' }}>Số: HĐ-{invoiceReceiptData.invoiceID}</p>
              <p style={{ fontSize: '13px', margin: '2px 0' }}>Ngày: {new Date(invoiceReceiptData.invoiceTime).toLocaleString('vi-VN')}</p>
            </div>

            {/* Customer Details */}
            <div style={{ fontSize: '13px', marginBottom: '10px' }}>
              <p style={{ margin: '3px 0' }}><strong>Khách hàng:</strong> {invoiceReceiptData.customerName || 'Khách vãng lai'}</p>
              {invoiceReceiptData.address && <p style={{ margin: '3px 0' }}><strong>Địa chỉ:</strong> {invoiceReceiptData.address}</p>}
              <p style={{ margin: '3px 0' }}><strong>Thanh toán:</strong> {invoiceReceiptData.paymentMethod === 'Cash' ? 'Tiền mặt' : 'Chuyển khoản / Thẻ'}</p>
            </div>

            <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

            {/* Items Table */}
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px dashed #000' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '5px' }}>Tên thuốc</th>
                  <th style={{ textAlign: 'right', paddingBottom: '5px' }}>SL</th>
                  <th style={{ textAlign: 'right', paddingBottom: '5px' }}>Đ.Giá</th>
                  <th style={{ textAlign: 'right', paddingBottom: '5px' }}>T.Tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoiceReceiptData.details && invoiceReceiptData.details.map((d, i) => (
                  <tr key={i} style={{ verticalAlign: 'top' }}>
                    <td style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                      {d.medicineName}
                      <div style={{ fontSize: '11px', color: '#555' }}>Lô: {d.batchId}</div>
                    </td>
                    <td style={{ textAlign: 'right', paddingTop: '5px' }}>{d.quantity}</td>
                    <td style={{ textAlign: 'right', paddingTop: '5px' }}>{d.unitPrice?.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', paddingTop: '5px' }}>{d.subTotal?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

            {/* Calculations */}
            <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px', alignSelf: 'flex-end', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px', marginTop: '5px' }}>
                <span>TỔNG CỘNG:</span>
                <span>{invoiceReceiptData.details?.reduce((sum, d) => sum + (d.subTotal || 0), 0).toLocaleString()}đ</span>
              </div>
            </div>

            <div style={{ borderBottom: '1px dashed #000', margin: '12px 0' }} />

            {/* Footer text */}
            <div style={{ textAlign: 'center', fontSize: '12px', fontStyle: 'italic' }}>
              <p style={{ margin: '4px 0' }}>Cảm ơn quý khách. Hẹn gặp lại!</p>
              <p style={{ margin: '4px 0' }}>Mã tra cứu hóa đơn điện tử: PIS-INV-{invoiceReceiptData.invoiceID}</p>
            </div>

            {/* Close buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', fontFamily: 'Inter, sans-serif' }}>
              <button
                type="button"
                className="btn-action btn-cancel"
                style={{ flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer' }}
                onClick={() => setShowReceiptModal(false)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn-action btn-select"
                style={{ flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => {
                  window.print();
                }}
              >
                In Hóa Đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
