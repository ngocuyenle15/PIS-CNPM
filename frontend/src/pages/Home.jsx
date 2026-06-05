import Medicine from './Medicine/Medicine';
import Catalog from './Medicine/Catalog';
import Unit from './Medicine/Unit';
import Origin from './Medicine/Origin';
import WarehouseInventory from './Inventory/WarehouseInventory';
import WarehouseReceipt from './Inventory/WarehouseReceipt';
import WarehouseIssue from './Inventory/WarehouseIssue';
import WarehouseAudit from './Inventory/WarehouseAudit';
import WarehouseHistory from './Inventory/WarehouseHistory';
import WarehouseSupplier from './Inventory/WarehouseSupplier';
import SalesPos from './Sales/SalesPos';
import SalesInvoices from './Sales/SalesInvoices';
import SalesCustomers from './Sales/SalesCustomers';
import SysManagement from './System/SysManagement';
import Overview from './Overview/Overview';
import { HomeContext } from '../context/HomeContext';
import Sidebar from '../components/Layout/Sidebar';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SearchableSelect from '../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const printContent = (title, htmlContent) => {
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

  const getRoleClass = (r) => {
    if (r === 'Admin') return 'role-admin';
    if (r === 'Product_manager') return 'role-manager';
    return 'role-staff';
  };

  const getRoleDisplayName = (r) => {
    if (r === 'Admin') return 'Quản trị viên';
    if (r === 'Product_manager') return 'Quản lý kho';
    return 'Nhân viên';
  };


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
    const isHeThong = ['sys_management'].includes(initialTab);

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
  const [innerSystemTab, setInnerSystemTab] = useState('employees');
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
    isActive: true,
    hasAccount: false,
    accountID: null,
    password: '',
    createAccountForExisting: false
  });
  const [employeeCurrentPage, setEmployeeCurrentPage] = useState(1);
  const [filterEmployeeStatus, setFilterEmployeeStatus] = useState('ACTIVE');

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
        allMedsRes,
        invoicesRes
      ] = await Promise.all([
        api.get('/medicines', { params: { page: 0, size: 1 } }),
        api.get('/inventory', { params: { type: 'NEAR_EXPIRY', page: 0, size: 1 } }),
        api.get('/inventory', { params: { type: 'EXPIRED', page: 0, size: 1 } }),
        api.get('/inventory', { params: { type: 'LOW_STOCK', page: 0, size: 1 } }),
        api.get('/goods-receipts', { params: { page: 0, size: 100 } }),
        api.get('/goods-issues', { params: { page: 0, size: 100 } }),
        api.get('/stock-audits', { params: { page: 0, size: 10 } }),
        api.get('/inventory', { params: { type: 'EXPIRED', page: 0, size: 5 } }),
        api.get('/inventory', { params: { type: 'LOW_STOCK', page: 0, size: 5 } }),
        api.get('/medicines', { params: { page: 0, size: 100 } }),
        api.get('/invoices', { params: { page: 0, size: 100 } })
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
        id: `exp-${item.id || Math.random()}`,
        type: 'EXPIRED',
        title: item.medicine?.medicineName || 'N/A',
        desc: `Lô ${item.batchId || 'N/A'} đã hết hạn từ ${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('vi-VN') : 'N/A'} (Tồn: ${item.stockQuantity ?? 0} ${item.medicine?.baseUnit?.unitName || ''})`,
        severity: 'high'
      }));

      const lowStockAlerts = (criticalLowStockRes.data?.data?.items || []).map(item => ({
        id: `low-${item.id || Math.random()}`,
        type: 'LOW_STOCK',
        title: item.medicine?.medicineName || 'N/A',
        desc: `Tồn kho thấp: còn ${item.stockQuantity ?? 0} ${item.medicine?.baseUnit?.unitName || ''} (Ngưỡng: 20 ${item.medicine?.baseUnit?.unitName || ''})`,
        severity: 'medium'
      }));

      setCriticalAlerts([...expiredAlerts, ...lowStockAlerts]);

      // 4. Tạo dữ liệu xu hướng giao dịch kho (7 ngày qua)
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      });

      const trendMap = {};
      last7Days.forEach(date => {
        const formattedDate = new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        trendMap[date] = { date: formattedDate, 'Nhập kho': 0, 'Xuất kho': 0 };
      });

      const allReceipts = receiptsRes.data?.data?.items || [];
      const allIssues = issuesRes.data?.data?.items || [];
      const allInvoices = invoicesRes.data?.data?.items || [];

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

      allInvoices.forEach(inv => {
        if (inv.invoiceTime) {
          const dateStr = inv.invoiceTime.split('T')[0];
          if (trendMap[dateStr]) {
            trendMap[dateStr]['Xuất kho'] += 1;
          }
        }
      });

      const hasTransactions = allReceipts.some(r => r.status === 'CONFIRMED') || allIssues.some(i => i.status === 'CONFIRMED') || allInvoices.length > 0;
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
    } else if (activeTab === 'sys_management') {
      fetchEmployees();
      fetchAccounts();
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
        await fetchAccounts();
        handleEmployeeCancel();
      } catch (error) {
        console.error('Lỗi khi lưu nhân viên kèm tài khoản:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu nhân viên và tài khoản.');
      }
    } else {
      const employeePayload = {
        fullName: employeeForm.fullName.trim(),
        phoneNumber: employeeForm.phoneNumber.trim(),
        email: employeeForm.email.trim(),
        gender: employeeForm.gender,
        yearOfBirth: Number(employeeForm.yearOfBirth),
        hireDate: employeeForm.hireDate,
        isActive: employeeForm.isActive
      };

      try {
        // 1. Update Employee Profile
        await api.patch(`/employees/${employeeForm.employeeID}`, employeePayload);

        // 2. Handle Linked Account
        if (employeeForm.hasAccount) {
          // Update existing account
          const accountPayload = {
            roleName: employeeForm.roleName,
            isStaff: employeeForm.isStaff,
            isActive: employeeForm.isActive
          };
          if (employeeForm.password && employeeForm.password.trim()) {
            accountPayload.password = employeeForm.password.trim();
          }
          await api.patch(`/accounts/${employeeForm.accountID}`, accountPayload);
          alert('Cập nhật thông tin nhân viên và tài khoản thành công!');
        } else if (employeeForm.createAccountForExisting) {
          // Create new account for existing employee
          if (!employeeForm.username.trim()) {
            alert('Vui lòng nhập Tên đăng nhập!');
            return;
          }
          const accountPayload = {
            username: employeeForm.username.trim(),
            employeeID: employeeForm.employeeID,
            roleName: employeeForm.roleName,
            isStaff: employeeForm.isStaff,
            isActive: employeeForm.isActive
          };
          const resAcc = await api.post('/accounts', accountPayload);
          const genPassword = resAcc.data?.data?.generatedPassword;
          alert(`Cập nhật nhân viên và tạo tài khoản thành công!\nMật khẩu khởi tạo tự sinh là: ${genPassword || '(Không có)'}\nVui lòng lưu lại mật khẩu này.`);
        } else {
          alert('Cập nhật hồ sơ nhân viên thành công!');
        }

        await fetchEmployees();
        await fetchAccounts();
        handleEmployeeCancel();
      } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên/tài khoản:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
      }
    }
  };

  const handleEmployeeEditClick = (item) => {
    const linkedAcc = accountsList.find(acc => acc.employee && acc.employee.employeeID === item.employeeID);
    setEmployeeFormMode('edit');
    setEmployeeForm({
      employeeID: item.employeeID,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      gender: item.gender,
      yearOfBirth: item.yearOfBirth,
      hireDate: item.hireDate,
      username: linkedAcc ? linkedAcc.username : '',
      roleName: linkedAcc ? linkedAcc.role : 'Sales',
      isStaff: linkedAcc ? linkedAcc.isStaff : true,
      isActive: linkedAcc ? linkedAcc.isActive : true,
      hasAccount: !!linkedAcc,
      accountID: linkedAcc ? linkedAcc.accountID : null,
      password: '',
      createAccountForExisting: false
    });
  };

  const handleEmployeeDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ${id}?`)) {
      try {
        await api.delete(`/employees/${id}`);
        alert('Xóa nhân viên thành công!');
        await fetchEmployees();
        await fetchAccounts();
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
      isActive: true,
      hasAccount: false,
      accountID: null,
      password: '',
      createAccountForExisting: false
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
      alert("Giỏ hàng không được để trống!");
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
      if (!c.note || !c.note.trim()) {
        alert(`Vui lòng nhập ghi chú hướng dẫn sử dụng cho thuốc ${c.medicineName}!`);
        return;
      }
    }

    setPosCashGiven('');
    setShowPosCheckoutModal(true);
  };

  const handlePosCheckout = async (e) => {
    e?.preventDefault();
    if (posCart.length === 0) {
      alert("Giỏ hàng không được để trống!");
      return;
    }
    for (const c of posCart) {
      if (!c.note || !c.note.trim()) {
        alert(`Vui lòng nhập ghi chú hướng dẫn sử dụng cho thuốc ${c.medicineName}!`);
        return;
      }
    }
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
    if (activeTab === 'sys_management' && role !== 'Admin') {
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
        return <Overview />;
      case 'medicine': return <Medicine />;


      /* MÀN HÌNH 2: DANH MỤC (Catalog Manager) */
      case 'catalog': return <Catalog />;


      /* MÀN HÌNH 3: ĐƠN VỊ TÍNH (Unit Manager) */
      case 'unit': return <Unit />;


      /* MÀN HÌNH 4: NƯỚC SẢN XUẤT (Origin Manager) */
      case 'origin': return <Origin />;


      /* PHÂN HỆ KHO THUỐC */
      case 'warehouse_inventory': return <WarehouseInventory />;


      case 'warehouse_receipt': return <WarehouseReceipt />;


      case 'warehouse_issue': return <WarehouseIssue />;


      case 'warehouse_audit': return <WarehouseAudit />;


      case 'warehouse_history': return <WarehouseHistory />;

      case 'warehouse_supplier': return <WarehouseSupplier />;


      /* PHÂN HỆ BÁN HÀNG */
      case 'sales_pos': return <SalesPos />;


      case 'sales_invoices': return <SalesInvoices />;

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
      case 'sales_customers': return <SalesCustomers />;


      /* PHÂN HỆ HỆ THỐNG */
      case 'sys_management': return <SysManagement />;


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

  
  const contextValue = {
    activeTab,
    setActiveTab,
    expandedMenus,
    setExpandedMenus,
    searchMedicine,
    setSearchMedicine,
    searchCatalog,
    setSearchCatalog,
    searchUnit,
    setSearchUnit,
    searchOrigin,
    setSearchOrigin,
    searchField,
    setSearchField,
    catalogsList,
    setCatalogsList,
    unitsList,
    setUnitsList,
    originsList,
    setOriginsList,
    paginatedCatalogs,
    setPaginatedCatalogs,
    paginatedUnits,
    setPaginatedUnits,
    paginatedOrigins,
    setPaginatedOrigins,
    medicinesList,
    setMedicinesList,
    selectedMedicine,
    setSelectedMedicine,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    totalItems,
    setTotalItems,
    catalogCurrentPage,
    setCatalogCurrentPage,
    catalogTotalPages,
    setCatalogTotalPages,
    catalogTotalItems,
    setCatalogTotalItems,
    unitCurrentPage,
    setUnitCurrentPage,
    unitTotalPages,
    setUnitTotalPages,
    unitTotalItems,
    setUnitTotalItems,
    originCurrentPage,
    setOriginCurrentPage,
    originTotalPages,
    setOriginTotalPages,
    originTotalItems,
    setOriginTotalItems,
    suppliersList,
    setSuppliersList,
    searchSupplier,
    setSearchSupplier,
    tempSearchSupplier,
    setTempSearchSupplier,
    supplierFormMode,
    setSupplierFormMode,
    supplierForm,
    setSupplierForm,
    supplierCurrentPage,
    setSupplierCurrentPage,
    innerSystemTab,
    setInnerSystemTab,
    employeesList,
    setEmployeesList,
    searchEmployee,
    setSearchEmployee,
    employeeFormMode,
    setEmployeeFormMode,
    employeeForm,
    setEmployeeForm,
    employeeCurrentPage,
    setEmployeeCurrentPage,
    filterEmployeeStatus,
    setFilterEmployeeStatus,
    accountsList,
    setAccountsList,
    searchAccount,
    setSearchAccount,
    accountFormMode,
    setAccountFormMode,
    accountForm,
    setAccountForm,
    accountCurrentPage,
    setAccountCurrentPage,
    inventoriesList,
    setInventoriesList,
    searchInventory,
    setSearchInventory,
    filterInventoryType,
    setFilterInventoryType,
    showAdvanced,
    setShowAdvanced,
    filterCatalog,
    setFilterCatalog,
    filterOrigin,
    setFilterOrigin,
    filterMinStock,
    setFilterMinStock,
    filterMaxStock,
    setFilterMaxStock,
    filterStartExpiry,
    setFilterStartExpiry,
    filterEndExpiry,
    setFilterEndExpiry,
    activeSearchInventory,
    setActiveSearchInventory,
    activeFilterCatalog,
    setActiveFilterCatalog,
    activeFilterOrigin,
    setActiveFilterOrigin,
    activeFilterMinStock,
    setActiveFilterMinStock,
    activeFilterMaxStock,
    setActiveFilterMaxStock,
    activeFilterStartExpiry,
    setActiveFilterStartExpiry,
    activeFilterEndExpiry,
    setActiveFilterEndExpiry,
    inventoryCurrentPage,
    setInventoryCurrentPage,
    inventoryTotalPages,
    setInventoryTotalPages,
    inventoryTotalItems,
    setInventoryTotalItems,
    receiptsList,
    setReceiptsList,
    receiptCurrentPage,
    setReceiptCurrentPage,
    receiptTotalPages,
    setReceiptTotalPages,
    receiptTotalItems,
    setReceiptTotalItems,
    receiptForm,
    setReceiptForm,
    receiptFormMode,
    setReceiptFormMode,
    selectedReceipt,
    setSelectedReceipt,
    searchReceipt,
    setSearchReceipt,
    receiptSearchType,
    setReceiptSearchType,
    receiptSearchVal,
    setReceiptSearchVal,
    filterReceiptStart,
    setFilterReceiptStart,
    filterReceiptEnd,
    setFilterReceiptEnd,
    filterReceiptStatus,
    setFilterReceiptStatus,
    issuesList,
    setIssuesList,
    issueCurrentPage,
    setIssueCurrentPage,
    issueTotalPages,
    setIssueTotalPages,
    issueTotalItems,
    setIssueTotalItems,
    issueForm,
    setIssueForm,
    issueFormMode,
    setIssueFormMode,
    selectedIssue,
    setSelectedIssue,
    searchIssue,
    setSearchIssue,
    issueSearchType,
    setIssueSearchType,
    issueSearchVal,
    setIssueSearchVal,
    filterIssueStart,
    setFilterIssueStart,
    filterIssueEnd,
    setFilterIssueEnd,
    filterIssueStatus,
    setFilterIssueStatus,
    auditsList,
    setAuditsList,
    auditCurrentPage,
    setAuditCurrentPage,
    auditTotalPages,
    setAuditTotalPages,
    auditTotalItems,
    setAuditTotalItems,
    auditForm,
    setAuditForm,
    auditFormMode,
    setAuditFormMode,
    selectedAudit,
    setSelectedAudit,
    searchAudit,
    setSearchAudit,
    auditSearchType,
    setAuditSearchType,
    auditSearchVal,
    setAuditSearchVal,
    filterAuditStart,
    setFilterAuditStart,
    filterAuditEnd,
    setFilterAuditEnd,
    filterAuditStatus,
    setFilterAuditStatus,
    historyTransactions,
    setHistoryTransactions,
    selectedMedicineForHistory,
    setSelectedMedicineForHistory,
    activeHistoryTab,
    setActiveHistoryTab,
    stockCardCurrentPage,
    setStockCardCurrentPage,
    activeDropdown,
    setActiveDropdown,
    stockCardSearchType,
    setStockCardSearchType,
    stockCardSearchVal,
    setStockCardSearchVal,
    filterStockCardStart,
    setFilterStockCardStart,
    filterStockCardEnd,
    setFilterStockCardEnd,
    activeStockCardSearchType,
    setActiveStockCardSearchType,
    activeStockCardSearchVal,
    setActiveStockCardSearchVal,
    activeFilterStockCardStart,
    setActiveFilterStockCardStart,
    activeFilterStockCardEnd,
    setActiveFilterStockCardEnd,
    posCart,
    setPosCart,
    posSearchKeyword,
    setPosSearchKeyword,
    posFilteredInventory,
    setPosFilteredInventory,
    posSelectedCustomer,
    setPosSelectedCustomer,
    posPaymentMethod,
    setPosPaymentMethod,
    posAddress,
    setPosAddress,
    showPosCheckoutModal,
    setShowPosCheckoutModal,
    posCashGiven,
    setPosCashGiven,
    invoicesList,
    setInvoicesList,
    invoiceCurrentPage,
    setInvoiceCurrentPage,
    invoiceTotalPages,
    setInvoiceTotalPages,
    invoiceTotalItems,
    setInvoiceTotalItems,
    selectedInvoice,
    setSelectedInvoice,
    invoiceSearchVal,
    setInvoiceSearchVal,
    activeInvoiceSearchVal,
    setActiveInvoiceSearchVal,
    showReceiptModal,
    setShowReceiptModal,
    invoiceReceiptData,
    setInvoiceReceiptData,
    dashboardStats,
    setDashboardStats,
    recentOperations,
    setRecentOperations,
    criticalAlerts,
    setCriticalAlerts,
    dashboardTrendData,
    setDashboardTrendData,
    dashboardCategoryData,
    setDashboardCategoryData,
    dashboardLoading,
    setDashboardLoading,
    allMedicines,
    setAllMedicines,
    allInventories,
    setAllInventories,
    formMode,
    setFormMode,
    formMedicine,
    setFormMedicine,
    catalogFormMode,
    setCatalogFormMode,
    catalogForm,
    setCatalogForm,
    unitFormMode,
    setUnitFormMode,
    unitForm,
    setUnitForm,
    originFormMode,
    setOriginFormMode,
    originForm,
    setOriginForm,
    customersList,
    setCustomersList,
    selectedCustomer,
    setSelectedCustomer,
    customerFormMode,
    setCustomerFormMode,
    customerForm,
    setCustomerForm,
    searchCustomer,
    setSearchCustomer,
    tempSearchCustomer,
    setTempSearchCustomer,
    activeSearchCustomer,
    setActiveSearchCustomer,
    customerCurrentPage,
    setCustomerCurrentPage,
    selectedInvMedicine,
    setSelectedInvMedicine,
    handlePrintReceipt,
    handlePrintIssue,
    handlePrintAudit,
    handleAddNewClick,
    handleEditClick,
    handleSave,
    handleDelete,
    handleBaseUnitChange,
    handleCatalogChange,
    handleOriginChange,
    handleAltUnitChange,
    handleCatalogSave,
    handleCatalogEditClick,
    handleCatalogDelete,
    handleCatalogCancel,
    handleUnitSave,
    handleUnitEditClick,
    handleUnitDelete,
    handleUnitCancel,
    handleOriginSave,
    handleOriginEditClick,
    handleOriginDelete,
    handleOriginCancel,
    handleSupplierSave,
    handleSupplierEditClick,
    handleSupplierDelete,
    handleSupplierCancel,
    handleEmployeeSave,
    handleEmployeeEditClick,
    handleEmployeeDelete,
    handleEmployeeCancel,
    handleAccountSave,
    handleAccountEditClick,
    handleAccountDelete,
    handleAccountCancel,
    handleAccountResetPassword,
    handleCustomerAddNewClick,
    handleCustomerEditClick,
    handleCustomerSave,
    handleCustomerDelete,
    handleCustomerCancel,
    handleShowInvoiceModal,
    handleAddToPosCart,
    handlePosCartQtyChange,
    handlePosCartUnitChange,
    handleRemoveFromPosCart,
    handlePosCartNoteChange,
    handleOpenCheckoutModal,
    handlePosCheckout,
    handleLogout,
    handleActivityClick,
    handleAlertAction,
    fetchInventory,
    fetchReceipts,
    fetchIssues,
    fetchAudits,
    fetchInvoices,
    fetchHistoryTransactions,
    fetchAllMedicines,
    fetchAllInventories,
    fetchDashboardData,
    fetchInitialData,
    fetchMedicines,
    fetchCatalogs,
    fetchUnits,
    fetchOrigins,
    fetchSuppliers,
    fetchEmployees,
    fetchAccounts,
    fetchCustomers,
    toggleMenu,
    username,
    role,
    getRoleClass,
    getRoleDisplayName
  };

  return (
    <HomeContext.Provider value={contextValue}>
    <div className="dashboard-layout">
      {/* SIDEBAR BÊN TRÁI */}
      <Sidebar 
        username={username}
        role={role}
        getRoleClass={getRoleClass}
        getRoleDisplayName={getRoleDisplayName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        toggleMenu={toggleMenu}
        handleLogout={handleLogout}
      />

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
                      <div key={line.inventoryId} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '8px', borderBottom: idx < posCart.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>
                          <span>{idx + 1}. {line.medicineName}</span>
                          <span style={{ color: 'var(--success-hover)' }}>{(line.quantity * currentPrice).toLocaleString()}đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          <span>SL: {line.quantity} {uName} (Đơn giá: {currentPrice.toLocaleString()}đ)</span>
                        </div>
                        {line.note && (
                          <div style={{
                            fontSize: '10.5px',
                            color: '#b91c1c',
                            background: '#fef2f2',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            borderLeft: '3px solid #ef4444',
                            marginTop: '4px',
                            fontWeight: '500',
                            alignSelf: 'flex-start',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span>📝 HDSD:</span>
                            <span>{line.note}</span>
                          </div>
                        )}
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
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            background: '#ffffff',
            width: '640px',
            padding: '36px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#1e293b',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid #e2e8f0'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 6px 0', color: 'var(--primary-color)', letterSpacing: '0.05em' }}>PIS PHARMACY</h2>
              <p style={{ fontSize: '13px', margin: '4px 0', color: '#64748b', fontWeight: '500' }}>📍 123 Đường Láng, Đống Đa, Hà Nội</p>
              <p style={{ fontSize: '13px', margin: '4px 0', color: '#64748b', fontWeight: '500' }}>📞 SĐT: 024.1234.5678</p>
              <div style={{ borderBottom: '2px dashed #e2e8f0', margin: '16px 0' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '8px 0', color: '#0f172a', letterSpacing: '0.1em' }}>HÓA ĐƠN BÁN LẺ</h3>
              <p style={{ fontSize: '13px', margin: '4px 0', color: '#64748b' }}>Số: <strong style={{ color: '#0f172a' }}>HĐ-{invoiceReceiptData.invoiceID}</strong></p>
              <p style={{ fontSize: '13px', margin: '4px 0', color: '#64748b' }}>Ngày: {new Date(invoiceReceiptData.invoiceTime).toLocaleString('vi-VN')}</p>
            </div>

            {/* Customer Details */}
            <div style={{
              fontSize: '13.5px',
              marginBottom: '16px',
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              <div><span style={{ color: '#64748b' }}>Khách hàng:</span> <strong style={{ color: '#0f172a' }}>{invoiceReceiptData.customerName || 'Khách vãng lai'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Thanh toán:</span> <strong style={{ color: '#16a34a' }}>{invoiceReceiptData.paymentMethod === 'Cash' ? '💵 Tiền mặt' : '💳 Thẻ / Bank'}</strong></div>
              {invoiceReceiptData.address && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b' }}>Địa chỉ:</span> <strong style={{ color: '#0f172a' }}>{invoiceReceiptData.address}</strong>
                </div>
              )}
            </div>

            <div style={{ borderBottom: '1px solid #e2e8f0', margin: '12px 0' }} />

            {/* Items Table */}
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #0f172a', color: '#0f172a' }}>
                  <th style={{ padding: '8px 4px', fontWeight: '800' }}>Tên thuốc</th>
                  <th style={{ padding: '8px 4px', fontWeight: '800', textAlign: 'center', width: '50px' }}>SL</th>
                  <th style={{ padding: '8px 4px', fontWeight: '800', textAlign: 'right', width: '90px' }}>Đơn giá</th>
                  <th style={{ padding: '8px 4px', fontWeight: '800', textAlign: 'right', width: '110px' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoiceReceiptData.details && invoiceReceiptData.details.map((d, i) => (
                  <React.Fragment key={i}>
                    <tr style={{ borderBottom: d.note ? 'none' : '1px solid #f1f5f9', verticalAlign: 'top' }}>
                      <td style={{ padding: '12px 4px 6px 4px' }}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{d.medicineName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Lô: {d.batchId}</div>
                      </td>
                      <td style={{ padding: '12px 4px 6px 4px', textAlign: 'center', fontWeight: '600' }}>{d.quantity}</td>
                      <td style={{ padding: '12px 4px 6px 4px', textAlign: 'right', color: '#475569' }}>{d.unitPrice?.toLocaleString()}đ</td>
                      <td style={{ padding: '12px 4px 6px 4px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>{d.subTotal?.toLocaleString()}đ</td>
                    </tr>
                    {d.note && (
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td colSpan="4" style={{ padding: '0 4px 12px 4px' }}>
                          <div style={{
                            fontSize: '11px',
                            color: '#b91c1c',
                            background: '#fef2f2',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            borderLeft: '3px solid #ef4444',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span>📝 HDSD:</span>
                            <span>{d.note}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div style={{ borderBottom: '2px solid #0f172a', margin: '16px 0' }} />

            {/* Calculations */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{
                background: '#ecfdf5',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid #a7f3d0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#065f46', letterSpacing: '0.05em' }}>TỔNG CỘNG THANH TOÁN:</span>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#059669' }}>
                  {invoiceReceiptData.details?.reduce((sum, d) => sum + (d.subTotal || 0), 0).toLocaleString()}đ
                </span>
              </div>
            </div>

            {/* Footer text */}
            <div style={{ textAlign: 'center', fontSize: '12.5px', color: '#64748b', fontStyle: 'italic', marginBottom: '24px' }}>
              <p style={{ margin: '4px 0', fontWeight: '500' }}>Cảm ơn quý khách. Hẹn gặp lại!</p>
              <p style={{ margin: '4px 0' }}>Mã tra cứu hóa đơn điện tử: PIS-INV-{invoiceReceiptData.invoiceID}</p>
            </div>

            {/* Close buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-action btn-cancel"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onClick={() => setShowReceiptModal(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#1e293b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn-action btn-select"
                style={{
                  flex: 1,
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
                  transition: 'all 0.15s'
                }}
                onClick={() => {
                  window.print();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.95)';
                  e.currentTarget.style.boxShadow = '0 4px 12px -1px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.2)';
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </HomeContext.Provider>
  );
}

export default Home;
