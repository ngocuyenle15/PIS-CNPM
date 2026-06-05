/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesPos = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
      
};

export default SalesPos;
