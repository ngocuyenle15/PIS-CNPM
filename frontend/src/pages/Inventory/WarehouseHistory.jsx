/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WarehouseHistory = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, setCurrentPage, setTotalPages, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
                    {(stockCardSearchVal || filterStockCardStart || filterStockCardEnd || activeStockCardSearchVal || activeFilterStockCardStart || activeFilterStockCardEnd) && (
                      <button
                        type="button"
                        className="btn-create"
                        style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setStockCardSearchType('referenceId');
                          setStockCardSearchVal('');
                          setFilterStockCardStart('');
                          setFilterStockCardEnd('');
                          setActiveStockCardSearchType('referenceId');
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
      
};

export default WarehouseHistory;
