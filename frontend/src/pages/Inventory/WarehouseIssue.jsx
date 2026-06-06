/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import api from '../../services/api';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WarehouseIssue = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();


  const handleAddIssueLine = () => {
    const invsSource = allInventories.length > 0 ? allInventories : inventoriesList;
    const detailLine = {
      inventoryId: invsSource[0]?.id || '',
      batchId: invsSource[0]?.batchId || '',
      medicineName: invsSource[0]?.medicine?.medicineName || '',
      quantity: 1,
      transactionUnitId: invsSource[0]?.medicine?.baseUnit?.unitID || '',
      conversionRate: 1
    };
    setIssueForm(prev => ({
      ...prev,
      details: [...prev.details, detailLine]
    }));
  };

  const handleRemoveIssueLine = (idx) => {
    setIssueForm(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== idx)
    }));
  };

  const handleIssueLineChange = (idx, field, value) => {
    setIssueForm(prev => {
      const updated = prev.details.map((line, i) => {
        if (i === idx) {
          const copy = { ...line, [field]: value };
          if (field === 'inventoryId') {
            const inv = allInventories.find(v => v.id === value) || inventoriesList.find(v => v.id === value);
            if (inv) {
              copy.batchId = inv.batchId;
              copy.medicineName = inv.medicine.medicineName;
              copy.transactionUnitId = inv.medicine.baseUnit?.unitID || '';
              copy.conversionRate = 1;
            }
          }
          if (field === 'transactionUnitId') {
            const inv = allInventories.find(v => v.id === line.inventoryId) || inventoriesList.find(v => v.id === line.inventoryId);
            if (inv && inv.medicine) {
              const med = inv.medicine;
              if (med.baseUnit && med.baseUnit.unitID === value) {
                copy.conversionRate = 1;
              } else if (med.alternativeUnits) {
                const au = med.alternativeUnits.find(u => (u.unitID || u.unit?.unitID) === value);
                if (au) {
                  copy.conversionRate = au.conversionRate;
                }
              }
            }
          }
          return copy;
        }
        return line;
      });
      return { ...prev, details: updated };
    });
  };

  const handleEditIssueDraft = (item) => {
    setIssueForm({
      issueId: item.issueId,
      issueType: item.issueType || 'EXPIRED',
      note: item.note || '',
      details: item.details ? item.details.map(d => {
        const inv = allInventories.find(v => v.id === d.inventoryId) || inventoriesList.find(v => v.id === d.inventoryId);
        const med = inv?.medicine;
        return {
          inventoryId: d.inventoryId,
          batchId: d.batchId || inv?.batchId || '',
          medicineName: d.medicineName || med?.medicineName || '',
          quantity: d.quantity || 1,
          transactionUnitId: unitsList.find(u => u.unitName === d.transactionUnitName)?.unitID || med?.baseUnit?.unitID || '',
          conversionRate: d.conversionRate || 1
        };
      }) : []
    });
    setIssueFormMode('add');
  };

  const handleAutoExpiredIssue = () => {
    const today = new Date();
    const sourceInvs = allInventories.length > 0 ? allInventories : inventoriesList;
    const expiredBatches = sourceInvs.filter(item => {
      return item.expiryDate && new Date(item.expiryDate) <= today && item.stockQuantity > 0;
    });

    if (expiredBatches.length === 0) {
      alert('Hiện tại không có lô thuốc nào đã hết hạn còn tồn kho để lập phiếu xuất hủy!');
      return;
    }

    const details = expiredBatches.map(item => ({
      inventoryId: item.id,
      batchId: item.batchId,
      medicineName: item.medicine.medicineName,
      quantity: item.stockQuantity,
      transactionUnitId: item.medicine.baseUnit?.unitID || '',
      conversionRate: 1
    }));

    setIssueForm({
      issueType: 'EXPIRED',
      note: 'Xuất tiêu hủy tự động các lô thuốc đã hết hạn sử dụng.',
      details: details,
      isAutoExpired: true
    });
    setIssueFormMode('add');
  };

  const handleSaveIssueDraft = async (e) => {
    e.preventDefault();
    if (issueForm.details.length === 0) {
      alert('Vui lòng thêm ít nhất một lô xuất!');
      return;
    }

    // Business logic validations for Goods Issue
    for (const d of issueForm.details) {
      const inv = allInventories.find(v => v.id === d.inventoryId) || inventoriesList.find(v => v.id === d.inventoryId);
      if (inv) {
        const requestedQty = Number(d.quantity) * Number(d.conversionRate);
        if (requestedQty <= 0) {
          alert(`Số lượng xuất của thuốc ${inv.medicine?.medicineName} phải lớn hơn 0!`);
          return;
        }
        if (requestedQty > inv.stockQuantity) {
          alert(`Lô thuốc ${inv.medicine?.medicineName} (Lô: ${inv.batchId}) không đủ tồn kho để xuất! Yêu cầu: ${requestedQty}, Hiện có: ${inv.stockQuantity}`);
          return;
        }
      }
    }

    try {
      await api.post('/goods-issues', {
        issueId: issueForm.issueId || null,
        issueType: issueForm.issueType,
        note: issueForm.note,
        details: issueForm.details.map(d => ({
          inventoryId: d.inventoryId,
          quantity: Number(d.quantity) || 1,
          transactionUnitId: d.transactionUnitId,
          conversionRate: Number(d.conversionRate) || 1
        }))
      });
      alert('Lưu phiếu xuất kho (Đang xử lý) thành công!');
      setIssueFormMode(null);
      fetchIssues(1);
    } catch (error) {
      console.error('Lỗi lập phiếu xuất:', error);
      alert('Thao tác thất bại: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleConfirmIssue = async (id) => {
    if (window.confirm(`Bạn có chắc muốn XÁC NHẬN XUẤT KHO cho phiếu ${id}? Hành động này sẽ trừ tồn kho và KHÔNG THỂ SỬA ĐỔI.`)) {
      try {
        await api.patch(`/goods-issues/${id}/confirm`);
        alert('Xác nhận xuất kho thành công! Kho đã được trừ.');
        fetchIssues(1);
      } catch (error) {
        console.error('Lỗi xuất kho:', error);
        alert('Xuất kho thất bại: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCancelIssue = async (id) => {
    if (window.confirm(`Bạn có chắc muốn HỦY PHIẾU xuất ${id}?`)) {
      try {
        await api.patch(`/goods-issues/${id}/cancel`);
        alert('Đã hủy phiếu xuất thành công.');
        fetchIssues(1);
      } catch (error) {
        console.error('Lỗi hủy phiếu:', error);
        alert('Hủy phiếu thất bại: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="content-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="content-title">Phiếu Xuất Kho</h1>
        {(role === 'Admin' || role === 'Product_manager') && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-create"
              style={{ backgroundColor: '#f97316' }}
              onClick={handleAutoExpiredIssue}
            >
              Xuất hủy quá hạn
            </button>
            <button className="btn-create" style={{ backgroundColor: 'var(--error-color)' }} onClick={() => {
              setIssueForm({
                issueType: 'EXPIRED',
                note: '',
                details: []
              });
              setIssueFormMode('add');
            }}>
              Lập phiếu xuất mới
            </button>
          </div>
        )}
      </div>

      <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
        <div className="advanced-search-group" style={{ width: '100%', gap: '10px', alignItems: 'center' }}>
          <select
            className="search-select"
            style={{ width: '160px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            value={issueSearchType}
            onChange={(e) => {
              setIssueSearchType(e.target.value);
              setIssueSearchVal('');
              setFilterIssueStart('');
              setFilterIssueEnd('');
            }}
          >
            <option value="issueId">Mã Phiếu</option>
            <option value="batchId">Mã Lô</option>
            <option value="issueType">Lý Do Xuất</option>
            <option value="employee">Người Lập</option>
            <option value="status">Trạng Thái</option>
            <option value="time">Thời Gian</option>
          </select>

          {issueSearchType === 'time' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Từ ngày:</span>
              <input
                type="date"
                className="search-input"
                style={{ width: '100%', maxWidth: '180px' }}
                value={filterIssueStart}
                onChange={(e) => setFilterIssueStart(e.target.value)}
              />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>đến:</span>
              <input
                type="date"
                className="search-input"
                style={{ width: '100%', maxWidth: '180px' }}
                value={filterIssueEnd}
                onChange={(e) => setFilterIssueEnd(e.target.value)}
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder={
                issueSearchType === 'issueId' ? 'Tìm kiếm theo mã phiếu...' :
                  issueSearchType === 'batchId' ? 'Tìm kiếm theo mã lô thuốc...' :
                    issueSearchType === 'issueType' ? 'Tìm kiếm theo lý do xuất...' :
                      issueSearchType === 'employee' ? 'Tìm kiếm theo tên người lập...' :
                        'Tìm kiếm theo trạng thái (DRAFT - Đang xử lý, CONFIRMED...)...'
              }
              className="search-input"
              style={{ maxWidth: 'none', flexGrow: 1 }}
              value={issueSearchVal}
              onChange={(e) => setIssueSearchVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd);
                }
              }}
            />
          )}

          <button
            type="button"
            className="btn-create"
            style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
            onClick={() => fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd)}
          >
            Tìm kiếm
          </button>
          {(issueSearchVal || filterIssueStart || filterIssueEnd) && (
            <button
              type="button"
              className="btn-create"
              style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
              onClick={() => {
                setIssueSearchVal('');
                setFilterIssueStart('');
                setFilterIssueEnd('');
                fetchIssues(1, issueSearchType, '', '', '');
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
            className={`filter-chip ${filterIssueStatus === 'ALL' ? 'active-all' : ''}`}
            onClick={() => {
              setFilterIssueStatus('ALL');
              fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'ALL');
            }}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={`filter-chip ${filterIssueStatus === 'DRAFT' ? 'active-low-stock' : ''}`}
            onClick={() => {
              setFilterIssueStatus('DRAFT');
              fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'DRAFT');
            }}
          >
            Đang xử lý
          </button>
          <button
            type="button"
            className="filter-chip"
            style={filterIssueStatus === 'CONFIRMED' ? { backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#15803d', fontWeight: '600' } : {}}
            onClick={() => {
              setFilterIssueStatus('CONFIRMED');
              fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'CONFIRMED');
            }}
          >
            Đã xuất kho
          </button>
          <button
            type="button"
            className={`filter-chip ${filterIssueStatus === 'CANCELLED' ? 'active-expired' : ''}`}
            onClick={() => {
              setFilterIssueStatus('CANCELLED');
              fetchIssues(1, issueSearchType, issueSearchVal, filterIssueStart, filterIssueEnd, 'CANCELLED');
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
              <th>Thời Gian</th>
              <th>Lý Do Xuất</th>
              <th>Người Xuất</th>
              <th>Trạng Thái</th>
              <th style={{ textAlign: 'center' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {issuesList.length > 0 ? (
              issuesList.map((item) => {
                let statusColor = '#94a3b8';
                let statusText = 'Đang xử lý';
                if (item.status === 'CONFIRMED') {
                  statusColor = 'var(--success-color)';
                  statusText = 'Đã xuất kho';
                } else if (item.status === 'CANCELLED') {
                  statusColor = 'var(--error-color)';
                  statusText = 'Đã hủy';
                }

                return (
                  <tr key={item.issueId}>
                    <td style={{ fontWeight: '600' }}>{item.issueId}</td>
                    <td>{item.issueTime ? new Date(item.issueTime).toLocaleString('vi-VN') : ''}</td>
                    <td style={{ fontWeight: '600', color: item.issueType === 'SALE' ? 'var(--success-hover)' : 'var(--error-hover)' }}>{item.issueType}</td>
                    <td>{item.employeeName}</td>
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
                              prev && prev.type === 'issue' && prev.id === item.issueId
                                ? null
                                : { type: 'issue', id: item.issueId }
                            );
                          }}
                        >
                          Thao tác
                        </button>
                        {activeDropdown && activeDropdown.type === 'issue' && activeDropdown.id === item.issueId && (
                          <div className="action-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="action-dropdown-item"
                              onClick={() => {
                                setSelectedIssue(item);
                                setIssueFormMode('view');
                                setActiveDropdown(null);
                              }}
                            >
                              Xem chi tiết
                            </button>
                            {item.status === 'DRAFT' && (role === 'Admin' || role === 'Product_manager') && (
                              <>
                                <button
                                  type="button"
                                  className="action-dropdown-item text-warning"
                                  onClick={() => {
                                    handleEditIssueDraft(item);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Chỉnh sửa
                                </button>
                                <button
                                  type="button"
                                  className="action-dropdown-item text-error"
                                  onClick={() => {
                                    handleCancelIssue(item.issueId);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Hủy phiếu
                                </button>
                                <button
                                  type="button"
                                  className="action-dropdown-item text-success"
                                  onClick={() => {
                                    handleConfirmIssue(item.issueId);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Xác nhận
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
                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Chưa có phiếu xuất kho nào được tạo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {issueTotalItems > 0 && (
        <div className="pagination-container" style={{ marginTop: '15px' }}>
          <div className="pagination-info">
            Hiển thị {Math.min((issueCurrentPage - 1) * 10 + 1, issueTotalItems)} - {Math.min(issueCurrentPage * 10, issueTotalItems)} của {issueTotalItems} phiếu xuất
          </div>
          {issueTotalPages > 1 && (
            <div className="pagination-buttons">
              <button
                type="button"
                className="pagination-btn"
                disabled={issueCurrentPage === 1}
                onClick={() => fetchIssues(issueCurrentPage - 1)}
              >
                ◀ Trang trước
              </button>
              {Array.from({ length: issueTotalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`pagination-btn ${issueCurrentPage === page ? 'active' : ''}`}
                  onClick={() => fetchIssues(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="pagination-btn"
                disabled={issueCurrentPage === issueTotalPages}
                onClick={() => fetchIssues(issueCurrentPage + 1)}
              >
                Trang sau ▶
              </button>
            </div>
          )}
        </div>
      )}

      {issueFormMode && (
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
                {issueFormMode === 'add' ? (issueForm.issueId ? `Hiệu Chỉnh Phiếu Xuất (Đang xử lý) (${issueForm.issueId})` : 'Lập Phiếu Xuất Mới') : 'Chi Tiết Phiếu Xuất'}
              </h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {issueFormMode === 'view' && (
                  <button
                    type="button"
                    className="btn-action btn-select"
                    style={{ padding: '4px 12px' }}
                    onClick={handlePrintIssue}
                  >
                    In Phiếu
                  </button>
                )}
                <button className="btn-action btn-cancel" style={{ padding: '4px 8px' }} onClick={() => setIssueFormMode(null)}>X đóng</button>
              </div>
            </div>

            {issueFormMode === 'add' ? (
              <form onSubmit={handleSaveIssueDraft} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div className="form-group" style={{ flexShrink: 0 }}>
                  <label className="label">Lý do xuất kho:</label>
                  <select
                    className="select-input"
                    value={issueForm.issueType}
                    onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })}
                    required
                    disabled={issueForm.isAutoExpired}
                  >
                    <option value="EXPIRED">Xuất tiêu hủy quá hạn</option>
                    <option value="DAMAGED">Hao hụt, hư hỏng, vỡ</option>
                    <option value="RETURN_SUPPLIER">Trả hàng nhà cung cấp</option>
                    <option value="OTHER">Xuất khác</option>
                  </select>
                </div>

                <div className="form-group" style={{ flexShrink: 0 }}>
                  <label className="label">Ghi chú xuất kho:</label>
                  <textarea
                    className="input"
                    style={{ height: '60px', resize: 'none' }}
                    value={issueForm.note}
                    onChange={(e) => setIssueForm({ ...issueForm, note: e.target.value })}
                    placeholder="Ghi chú xuất kho..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0', flexShrink: 0 }}>
                  <span className="label">Lô hàng xuất kho:</span>
                  <button type="button" className="btn-action btn-brand" onClick={handleAddIssueLine}>+ Thêm lô xuất</button>
                </div>

                <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '15px', background: '#f8fafc' }}>
                  <table className="custom-table" style={{ margin: 0, border: 'none', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ width: '50px', padding: '10px', textAlign: 'center' }}>STT</th>
                        <th style={{ width: '350px', padding: '10px' }}>Chọn lô trong kho</th>
                        <th style={{ width: '120px', padding: '10px' }}>Đơn vị xuất</th>
                        <th style={{ width: '100px', padding: '10px' }}>SL xuất</th>
                        <th style={{ width: '80px', padding: '10px', textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const mappedInventories = (allInventories.length > 0 ? allInventories : inventoriesList).map(inv => ({
                          ...inv,
                          displayName: `${inv.medicine?.medicineName || 'Không rõ'} (Lô: ${inv.batchId} | Còn: ${inv.stockQuantity})`
                        }));
                        return issueForm.details.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '24px' }}>Chưa có lô xuất nào được chọn.</td>
                          </tr>
                        ) : (
                          issueForm.details.map((line, idx) => {
                            const inv = (allInventories.length > 0 ? allInventories : inventoriesList).find(v => v.id === line.inventoryId);
                            const rowUnits = [];
                            if (inv && inv.medicine) {
                              const med = inv.medicine;
                              if (med.baseUnit) {
                                rowUnits.push({
                                  unitID: med.baseUnit.unitID,
                                  unitName: med.baseUnit.unitName,
                                  conversionRate: 1
                                });
                              }
                              if (med.alternativeUnits) {
                                med.alternativeUnits.forEach(au => {
                                  const uId = au.unitID || au.unit?.unitID;
                                  const uName = au.unitName || au.unit?.unitName || uId;
                                  if (uId) {
                                    rowUnits.push({
                                      unitID: uId,
                                      unitName: uName,
                                      conversionRate: au.conversionRate
                                    });
                                  }
                                });
                              }
                            }
                            return (
                              <tr key={idx}>
                                <td style={{ textAlign: 'center', padding: '8px', fontWeight: '600' }}>#{idx + 1}</td>
                                <td style={{ padding: '8px' }}>
                                  <SearchableSelect
                                    options={mappedInventories}
                                    value={line.inventoryId}
                                    onChange={(val) => handleIssueLineChange(idx, 'inventoryId', val)}
                                    idKey="id"
                                    nameKey="displayName"
                                    placeholder="Chọn lô xuất..."
                                    style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                  />
                                </td>
                                <td style={{ padding: '8px' }}>
                                  <SearchableSelect
                                    options={rowUnits}
                                    value={line.transactionUnitId}
                                    onChange={(val) => handleIssueLineChange(idx, 'transactionUnitId', val)}
                                    idKey="unitID"
                                    nameKey="unitName"
                                    placeholder="Chọn đơn vị..."
                                    style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                  />
                                </td>
                                <td style={{ padding: '8px' }}>
                                  <input
                                    type="number"
                                    className="input"
                                    style={{ padding: '6px', width: '100%' }}
                                    value={line.quantity}
                                    onChange={(e) => handleIssueLineChange(idx, 'quantity', e.target.value)}
                                    required
                                  />
                                </td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>
                                  <button type="button" className="btn-action btn-delete" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleRemoveIssueLine(idx)}>Xóa</button>
                                </td>
                              </tr>
                            );
                          })
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="form-actions" style={{ flexShrink: 0 }}>
                  <button type="button" className="btn-action btn-cancel" onClick={() => setIssueFormMode(null)}>Hủy bỏ</button>
                  <button type="submit" className="btn-action btn-delete" style={{ flexGrow: 1, backgroundColor: 'var(--error-color)' }}>Lưu phiếu xuất (Đang xử lý)</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {selectedIssue && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', flexShrink: 0 }}>
                      <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Mã phiếu xuất:</strong> <span style={{ fontWeight: '600' }}>{selectedIssue.issueId}</span></div>
                      <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Lý do xuất:</strong> <strong style={{ color: 'var(--error-hover)' }}>{selectedIssue.issueType}</strong></div>
                      <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Người lập:</strong> <span>{selectedIssue.employeeName}</span></div>
                      <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Thời gian:</strong> <span>{selectedIssue.issueTime ? new Date(selectedIssue.issueTime).toLocaleString('vi-VN') : '---'}</span></div>
                      <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Trạng thái:</strong> <strong style={{ color: selectedIssue.status === 'CONFIRMED' ? 'var(--success-color)' : 'var(--error-color)' }}>{selectedIssue.status}</strong></div>
                    </div>
                    <div style={{ flexShrink: 0 }}><strong style={{ fontSize: '13px', color: '#64748b' }}>Ghi chú:</strong> <span>{selectedIssue.note || '(Không có)'}</span></div>

                    <div style={{ marginTop: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span className="label" style={{ marginBottom: '6px', flexShrink: 0 }}>Chi tiết lô thuốc xuất:</span>
                      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}>
                        <table className="custom-table" style={{ margin: 0, border: 'none' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              <th style={{ textAlign: 'center', width: '50px' }}>STT</th>
                              <th>Tên thuốc</th>
                              <th>Mã lô</th>
                              <th>Số lượng xuất</th>
                              <th>Đơn vị xuất</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedIssue.details && selectedIssue.details.map((d, i) => (
                              <tr key={i}>
                                <td style={{ textAlign: 'center', fontWeight: '600' }}>#{i + 1}</td>
                                <td style={{ fontWeight: '600' }}>{d.medicineName}</td>
                                <td>{d.batchId}</td>
                                <td>{d.quantity}</td>
                                <td>{d.transactionUnitName || '---'}</td>
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

export default WarehouseIssue;
