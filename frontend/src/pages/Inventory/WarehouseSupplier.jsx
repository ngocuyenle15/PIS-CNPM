/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WarehouseSupplier = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, setCurrentPage, setTotalPages, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
                  {supplierFormMode === 'add' ? 'Thêm Mới Nhà Cung Cấp' : 'Hiệu Chỉnh Nhà Cung Cấp'}
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
      
};

export default WarehouseSupplier;
