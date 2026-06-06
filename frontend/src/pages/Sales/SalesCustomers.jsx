/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesCustomers = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, setCurrentPage, setTotalPages, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
      
};

export default SalesCustomers;
