/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WarehouseAudit = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
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
      
};

export default WarehouseAudit;
