/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SysManagement = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, setCurrentPage, setTotalPages, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Quản Trị Hệ Thống - Nhân Viên & Tài Khoản
      </h2>
      {(() => {
        const filtered = employeesList.filter(e => {
          const isEmployeeActive = e.isActive !== false;
          if (filterEmployeeStatus === 'ACTIVE' && !isEmployeeActive) return false;
          if (filterEmployeeStatus === 'INACTIVE' && isEmployeeActive) return false;

          const linkedAcc = accountsList.find(acc => acc.employee && acc.employee.employeeID === e.employeeID);
          const searchLower = searchEmployee.toLowerCase();
          return (
            e.fullName.toLowerCase().includes(searchLower) ||
            e.employeeID.toLowerCase().includes(searchLower) ||
            (e.phoneNumber && e.phoneNumber.toLowerCase().includes(searchLower)) ||
            (e.email && e.email.toLowerCase().includes(searchLower)) ||
            (linkedAcc && linkedAcc.username.toLowerCase().includes(searchLower))
          );
        });

        const itemsPerPage = 10;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        const currentPage = Math.min(employeeCurrentPage, totalPages);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentEmployees = filtered.slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div className="content-card" style={{ width: '100%', border: 'none', padding: 0, boxShadow: 'none', background: 'transparent' }}>
            <div className="table-actions">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên theo mã, tên, SĐT, tài khoản..."
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
                    isActive: true,
                    hasAccount: false,
                    accountID: null,
                    password: '',
                    createAccountForExisting: false
                  });
                }}
              >
                Thêm nhân viên
              </button>
            </div>

            <div className="filter-chips-container" style={{ marginTop: '12px', marginBottom: '16px' }}>
              <button
                type="button"
                className="filter-chip"
                style={filterEmployeeStatus === 'ACTIVE' ? { backgroundColor: '#d1fae5', borderColor: '#10b981', color: '#065f46', fontWeight: '600' } : {}}
                onClick={() => {
                  setFilterEmployeeStatus('ACTIVE');
                  setEmployeeCurrentPage(1);
                }}
              >
                Hoạt động
              </button>
              <button
                type="button"
                className="filter-chip"
                style={filterEmployeeStatus === 'INACTIVE' ? { backgroundColor: '#fee2e2', borderColor: '#f87171', color: '#991b1b', fontWeight: '600' } : {}}
                onClick={() => {
                  setFilterEmployeeStatus('INACTIVE');
                  setEmployeeCurrentPage(1);
                }}
              >
                Bị khóa
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
                    <th>Tài khoản</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((item) => {
                      const linkedAcc = accountsList.find(acc => acc.employee && acc.employee.employeeID === item.employeeID);
                      return (
                        <tr key={item.employeeID}>
                          <td style={{ fontWeight: '600' }}>{item.employeeID}</td>
                          <td style={{ fontWeight: '600' }}>{item.fullName}</td>
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
                          <td>
                            {linkedAcc ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '13px' }}>
                                  {linkedAcc.username}
                                </div>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    backgroundColor: linkedAcc.role === 'Admin' ? '#fee2e2' : linkedAcc.role === 'Product_manager' ? '#fef3c7' : '#dcfce7',
                                    color: linkedAcc.role === 'Admin' ? '#991b1b' : linkedAcc.role === 'Product_manager' ? '#92400e' : '#166534'
                                  }}>
                                    {linkedAcc.role === 'Admin' ? 'Admin' : linkedAcc.role === 'Product_manager' ? 'Quản lý kho' : 'Bán hàng'}
                                  </span>
                                  <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    backgroundColor: linkedAcc.isActive ? '#d1fae5' : '#f1f5f9',
                                    color: linkedAcc.isActive ? '#065f46' : '#64748b',
                                    border: linkedAcc.isActive ? 'none' : '1px solid #cbd5e1'
                                  }}>
                                    {linkedAcc.isActive ? 'Đang hoạt động' : 'Bị khóa'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>
                                🚫 Chưa cấp tài khoản
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <button className="btn-action btn-edit" onClick={() => handleEmployeeEditClick(item)}>Chi tiết & Sửa</button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy nhân viên nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
                  width: '750px',
                  maxHeight: '95vh',
                  overflowY: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  padding: '20px 24px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      {employeeFormMode === 'add' ? 'Thêm mới nhân viên & tài khoản' : `Chỉnh sửa nhân viên & tài khoản`}
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
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px' }}>
                      I. Thông tin nhân sự
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Mã nhân viên:</label>
                        <input
                          type="text"
                          className="input"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          value={employeeForm.employeeID}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, employeeID: e.target.value })}
                          disabled={employeeFormMode === 'edit'}
                          placeholder="VD: NV001"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Họ tên nhân viên:</label>
                        <input
                          type="text"
                          className="input"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          value={employeeForm.fullName}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                          placeholder="VD: Nguyễn Văn A"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Số điện thoại:</label>
                        <input
                          type="text"
                          className="input"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          value={employeeForm.phoneNumber}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, phoneNumber: e.target.value })}
                          placeholder="VD: 0987654321"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Email:</label>
                        <input
                          type="email"
                          className="input"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          value={employeeForm.email}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                          placeholder="VD: nv001@gmail.com"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Giới tính:</label>
                        <select
                          className="select-input"
                          style={{ padding: '8px 12px', fontSize: '13px', height: '37px' }}
                          value={employeeForm.gender}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
                        >
                          <option value="Male">Nam</option>
                          <option value="Female">Nữ</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Năm sinh:</label>
                        <input
                          type="number"
                          className="input"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          value={employeeForm.yearOfBirth}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, yearOfBirth: Number(e.target.value) || '' })}
                          placeholder="VD: 1995"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                        <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Ngày vào làm:</label>
                        <input
                          type="date"
                          className="input"
                          style={{ padding: '8px 12px', fontSize: '13px' }}
                          value={employeeForm.hireDate}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {employeeFormMode === 'add' ? (
                      <>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginTop: '16px', marginBottom: '12px' }}>
                          II. Thông tin tài khoản liên kết (Bắt buộc)
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Tên đăng nhập:</label>
                            <input
                              type="text"
                              className="input"
                              style={{ padding: '8px 12px', fontSize: '13px' }}
                              value={employeeForm.username}
                              onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                              placeholder="VD: nguyenvana"
                              required
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Vai trò (Role):</label>
                            <select
                              className="select-input"
                              style={{ padding: '8px 12px', fontSize: '13px', height: '37px' }}
                              value={employeeForm.roleName}
                              onChange={(e) => setEmployeeForm({ ...employeeForm, roleName: e.target.value })}
                            >
                              <option value="Sales">Bán hàng (Sales)</option>
                              <option value="Product_manager">Quản lý kho (Product Manager)</option>
                              <option value="Admin">Quản trị viên (Admin)</option>
                            </select>
                          </div>
                          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginTop: '16px', marginBottom: '12px' }}>
                          II. Thông tin tài khoản liên kết
                        </h3>

                        {employeeForm.hasAccount ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Tên đăng nhập (username):</label>
                              <input
                                type="text"
                                className="input"
                                style={{ padding: '8px 12px', fontSize: '13px', backgroundColor: '#f1f5f9', color: '#64748b' }}
                                value={employeeForm.username}
                                disabled
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Vai trò (Role):</label>
                              <select
                                className="select-input"
                                style={{ padding: '8px 12px', fontSize: '13px', height: '37px' }}
                                value={employeeForm.roleName}
                                onChange={(e) => setEmployeeForm({ ...employeeForm, roleName: e.target.value })}
                              >
                                <option value="Sales">Bán hàng (Sales)</option>
                                <option value="Product_manager">Quản lý kho (Product Manager)</option>
                                <option value="Admin">Quản trị viên (Admin)</option>
                              </select>
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
                            <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '4px' }}>
                              <label className="label" style={{ fontSize: '13px', marginBottom: '4px', color: '#e11d48', fontWeight: '600' }}>Đặt lại mật khẩu (Để trống nếu không đổi):</label>
                              <input
                                type="password"
                                className="input"
                                style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid #fda4af' }}
                                value={employeeForm.password}
                                onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                                placeholder="Nhập mật khẩu mới nếu muốn đổi..."
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                checked={employeeForm.createAccountForExisting}
                                onChange={(e) => setEmployeeForm({ ...employeeForm, createAccountForExisting: e.target.checked })}
                              />
                              Cấp tài khoản mới cho nhân viên này
                            </label>

                            {employeeForm.createAccountForExisting && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Tên đăng nhập:</label>
                                  <input
                                    type="text"
                                    className="input"
                                    style={{ padding: '8px 12px', fontSize: '13px' }}
                                    value={employeeForm.username}
                                    onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                                    placeholder="VD: nguyenvana"
                                    required={employeeForm.createAccountForExisting}
                                  />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="label" style={{ fontSize: '13px', marginBottom: '4px' }}>Vai trò (Role):</label>
                                  <select
                                    className="select-input"
                                    style={{ padding: '8px 12px', fontSize: '13px', height: '37px' }}
                                    value={employeeForm.roleName}
                                    onChange={(e) => setEmployeeForm({ ...employeeForm, roleName: e.target.value })}
                                  >
                                    <option value="Sales">Bán hàng (Sales)</option>
                                    <option value="Product_manager">Quản lý kho (Product Manager)</option>
                                    <option value="Admin">Quản trị viên (Admin)</option>
                                  </select>
                                </div>
                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
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
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <div className="form-actions" style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      <button type="button" className="btn-action btn-cancel" style={{ marginRight: '6px' }} onClick={handleEmployeeCancel}>
                        Hủy bỏ
                      </button>
                      <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1, backgroundColor: 'var(--primary-color)', border: 'none', color: '#ffffff' }}>
                        {employeeFormMode === 'add' ? 'Thêm mới' : 'Lưu lại'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );

};

export default SysManagement;
