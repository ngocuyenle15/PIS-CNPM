/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Catalog = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
      
};

export default Catalog;
