/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesInvoices = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, handlePrintInvoice, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
                                Chọn
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
            <div className="split-right content-card" style={{ width: '540px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Chi Tiết Hóa Đơn
                </h2>
                {selectedInvoice && (
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Đã thanh toán
                  </span>
                )}
              </div>

              {selectedInvoice ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
                  {/* Grid thông tin chung */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px', fontWeight: '500' }}>
                        Số hóa đơn
                      </span>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>HĐ-{selectedInvoice.invoiceID}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px', fontWeight: '500' }}>
                        Thời gian lập
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                        {selectedInvoice.invoiceTime ? new Date(selectedInvoice.invoiceTime).toLocaleString('vi-VN') : ''}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px', fontWeight: '500' }}>
                        Khách hàng
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e3a8a' }}>
                        {selectedInvoice.customerName || 'Khách vãng lai'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px', fontWeight: '500' }}>
                        Hình thức thanh toán
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: selectedInvoice.paymentMethod === 'Cash' ? '#16a34a' : 'var(--primary-color)'
                      }}>
                        {selectedInvoice.paymentMethod === 'Cash' ? 'Tiền mặt' : 'Thẻ / Bank'}
                      </span>
                    </div>
                  </div>

                  {selectedInvoice.address && (
                    <div style={{ background: '#f0f9ff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #bae6fd', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Địa chỉ giao nhận hàng:
                      </span>
                      <span style={{ color: '#0c4a6e', fontWeight: '500' }}>{selectedInvoice.address}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Danh sách sản phẩm ({selectedInvoice.details?.length || 0})
                    </span>

                    <div style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#ffffff',
                      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8fafc', padding: '10px 12px', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sản phẩm</th>
                              <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8fafc', padding: '10px 12px', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', width: '50px' }}>SL</th>
                              <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8fafc', padding: '10px 12px', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', width: '85px' }}>Đơn giá</th>
                              <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8fafc', padding: '10px 12px', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', width: '95px' }}>Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedInvoice.details && selectedInvoice.details.map((d, i) => (
                              <React.Fragment key={i}>
                                <tr
                                  style={{
                                    borderBottom: d.note ? 'none' : '1px solid #f1f5f9',
                                    transition: 'background-color 0.15s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                    if (d.note && e.currentTarget.nextSibling) {
                                      e.currentTarget.nextSibling.style.backgroundColor = '#f8fafc';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    if (d.note && e.currentTarget.nextSibling) {
                                      e.currentTarget.nextSibling.style.backgroundColor = 'transparent';
                                    }
                                  }}
                                >
                                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '12.5px', lineHeight: '1.4' }}>
                                      {d.medicineName}
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '1px 5px', borderRadius: '4px', fontSize: '9.5px', fontWeight: '700', marginTop: '4px' }}>
                                      Lô: {d.batchId}
                                    </div>
                                  </td>
                                  <td style={{ padding: '10px 12px', verticalAlign: 'top', textAlign: 'center', fontWeight: '600', color: '#334155' }}>
                                    {d.quantity}
                                  </td>
                                  <td style={{ padding: '10px 12px', verticalAlign: 'top', textAlign: 'right', color: '#64748b' }}>
                                    {d.unitPrice?.toLocaleString()}đ
                                  </td>
                                  <td style={{ padding: '10px 12px', verticalAlign: 'top', textAlign: 'right', fontWeight: '800', color: '#10b981' }}>
                                    {d.subTotal?.toLocaleString()}đ
                                  </td>
                                </tr>
                                {d.note && (
                                  <tr
                                    style={{
                                      borderBottom: '1px solid #f1f5f9',
                                      transition: 'background-color 0.15s'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#f8fafc';
                                      if (e.currentTarget.previousSibling) {
                                        e.currentTarget.previousSibling.style.backgroundColor = '#f8fafc';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                      if (e.currentTarget.previousSibling) {
                                        e.currentTarget.previousSibling.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                  >
                                    <td colSpan="4" style={{ padding: '0 12px 10px 12px' }}>
                                      <div style={{
                                        fontSize: '11px',
                                        color: '#b91c1c',
                                        background: '#fef2f2',
                                        padding: '5px 10px',
                                        borderRadius: '6px',
                                        borderLeft: '3px solid #ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                      }}>
                                        <span style={{ fontSize: '11px' }}></span>
                                        <span style={{ fontWeight: '500' }}>HDSD: {d.note}</span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Tổng thanh toán */}
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0',
                    marginTop: 'auto',
                    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#065f46', letterSpacing: '0.05em' }}>
                        TỔNG THANH TOÁN
                      </span>
                      <span style={{ color: '#059669', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.02em' }}>
                        {(selectedInvoice.details?.reduce((sum, d) => sum + (d.subTotal || 0), 0) || 0).toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  {/* Hành động */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '13px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#f8fafc',
                        color: '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      onClick={() => setSelectedInvoice(null)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.color = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      Đóng chi tiết
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-select"
                      style={{
                        flex: 1,
                        backgroundColor: 'var(--success-color)',
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
                        boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.2)',
                        transition: 'all 0.15s'
                      }}
                      onClick={() => {
                        handlePrintInvoice(selectedInvoice);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(0.95)';
                        e.currentTarget.style.boxShadow = '0 4px 12px -1px rgba(34, 197, 94, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(34, 197, 94, 0.2)';
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
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', flexGrow: 1, gap: '12px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    marginBottom: '8px'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#475569', margin: 0 }}>
                    Chưa Chọn Hóa Đơn
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', maxWidth: '280px', margin: 0 }}>
                    Vui lòng chọn một hóa đơn từ danh sách bên trái để xem thông tin chi tiết và in hóa đơn.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      
};

export default SalesInvoices;
