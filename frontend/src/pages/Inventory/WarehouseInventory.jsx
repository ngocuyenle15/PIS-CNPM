/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WarehouseInventory = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
                        <span className="medicine-info-label">Đơn giá cơ bản:</span> <span style={{ color: '#059669', fontWeight: 'bold' }}>{(selectedInvMedicine.unitPrice || 0).toLocaleString('en-US')} VND / {selectedInvMedicine.baseUnit?.unitName || '---'}</span>
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
                                  <span className="alt-unit-price">{((selectedInvMedicine.unitPrice || 0) * alt.conversionRate).toLocaleString('en-US')} VND</span>
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
      
};

export default WarehouseInventory;
