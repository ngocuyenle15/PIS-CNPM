/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import api from '../../services/api';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WarehouseReceipt = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
        const handleAddLine = () => {
          const medsSource = allMedicines.length > 0 ? allMedicines : medicinesList;
          const detailLine = {
            medicineId: medsSource[0]?.medicineID || '',
            medicineName: medsSource[0]?.medicineName || '',
            batchId: '',
            quantity: 1,
            importPrice: 1000,
            expiryDate: new Date().toISOString().split('T')[0],
            manufacturedDate: new Date().toISOString().split('T')[0],
            transactionUnitId: medsSource[0]?.baseUnit?.unitID || '',
            conversionRate: 1
          };
          setReceiptForm(prev => ({
            ...prev,
            details: [...prev.details, detailLine]
          }));
        };

        const handleRemoveLine = (idx) => {
          setReceiptForm(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== idx)
          }));
        };

        const handleEditReceiptDraft = (item) => {
          setReceiptForm({
            receiptId: item.receiptId,
            supplierId: suppliersList.find(s => s.supplierName === item.supplierName)?.supplierID || suppliersList[0]?.supplierID || '',
            note: item.note || '',
            details: item.details ? item.details.map(d => {
              const med = allMedicines.find(m => m.medicineName === d.medicineName) || medicinesList.find(m => m.medicineName === d.medicineName);
              return {
                medicineId: d.medicineId || med?.medicineID || '',
                medicineName: d.medicineName,
                batchId: d.batchId || '',
                quantity: d.quantity || 1,
                importPrice: d.importPrice || 0,
                expiryDate: d.expiryDate ? d.expiryDate.split('T')[0] : new Date().toISOString().split('T')[0],
                manufacturedDate: d.manufacturedDate ? d.manufacturedDate.split('T')[0] : new Date().toISOString().split('T')[0],
                transactionUnitId: unitsList.find(u => u.unitName === d.transactionUnitName)?.unitID || med?.baseUnit?.unitID || '',
                conversionRate: d.conversionRate || 1
              };
            }) : []
          });
          setReceiptFormMode('add');
        };

        const handleLineChange = (idx, field, value) => {
          setReceiptForm(prev => {
            const updated = prev.details.map((line, i) => {
              if (i === idx) {
                const copy = { ...line, [field]: value };
                if (field === 'medicineId') {
                  const med = allMedicines.find(m => m.medicineID === value) || medicinesList.find(m => m.medicineID === value);
                  if (med) {
                    copy.medicineName = med.medicineName;
                    copy.transactionUnitId = med.baseUnit?.unitID || '';
                    copy.conversionRate = 1;
                  }
                }
                if (field === 'transactionUnitId') {
                  const med = allMedicines.find(m => m.medicineID === line.medicineId) || medicinesList.find(m => m.medicineID === line.medicineId);
                  if (med) {
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

        const handleSaveReceiptDraft = async (e) => {
          e.preventDefault();
          if (!receiptForm.supplierId) {
            alert('Vui lòng chọn Nhà cung cấp!');
            return;
          }
          if (receiptForm.details.length === 0) {
            alert('Vui lòng thêm ít nhất một dòng thuốc nhập!');
            return;
          }

          // Business logic validations for Goods Receipt
          for (const d of receiptForm.details) {
            if (Number(d.quantity) <= 0) {
              alert('Số lượng nhập phải lớn hơn 0!');
              return;
            }
            if (Number(d.importPrice) < 0) {
              alert('Giá nhập không được âm!');
              return;
            }
            if (d.manufacturedDate && d.expiryDate && new Date(d.manufacturedDate) >= new Date(d.expiryDate)) {
              alert('Hạn sử dụng phải sau Ngày sản xuất!');
              return;
            }
          }

          try {
            await api.post('/goods-receipts', {
              receiptId: receiptForm.receiptId || null,
              supplierId: receiptForm.supplierId,
              note: receiptForm.note,
              details: receiptForm.details.map(d => ({
                medicineId: d.medicineId,
                batchId: d.batchId || 'LO-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
                quantity: Number(d.quantity) || 1,
                importPrice: Number(d.importPrice) || 0,
                expiryDate: d.expiryDate,
                manufacturedDate: d.manufacturedDate,
                transactionUnitId: d.transactionUnitId,
                conversionRate: Number(d.conversionRate) || 1
              }))
            });
            alert('Lưu phiếu nhập kho (Đang xử lý) thành công!');
            setReceiptFormMode(null);
            fetchReceipts(1);
          } catch (error) {
            console.error('Lỗi lưu phiếu nhập (Đang xử lý):', error);
            alert('Không thể lưu phiếu nhập (Đang xử lý): ' + (error.response?.data?.message || error.message));
          }
        };

        const handleConfirmReceipt = async (id) => {
          if (window.confirm(`Bạn có chắc muốn XÁC NHẬN NHẬP KHO cho phiếu ${id}? Hành động này sẽ cập nhật trực tiếp tồn kho thực tế và KHÔNG THỂ SỬA ĐỔI.`)) {
            try {
              await api.patch(`/goods-receipts/${id}/confirm`);
              alert('Xác nhận nhập kho thành công! Kho đã được cập nhật.');
              fetchReceipts(1);
            } catch (error) {
              console.error('Lỗi xác nhận nhập kho:', error);
              alert('Xác nhận nhập kho thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        const handleCancelReceipt = async (id) => {
          if (window.confirm(`Bạn có chắc muốn HỦY BỎ phiếu nhập ${id}?`)) {
            try {
              await api.patch(`/goods-receipts/${id}/cancel`);
              alert('Đã hủy phiếu nhập kho thành công.');
              fetchReceipts(1);
            } catch (error) {
              console.error('Lỗi hủy phiếu:', error);
              alert('Hủy phiếu thất bại: ' + (error.response?.data?.message || error.message));
            }
          }
        };

        return (
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 className="content-title">Phiếu Nhập Kho</h1>
              {(role === 'Admin' || role === 'Product_manager') && (
                <button className="btn-create" onClick={() => {
                  setReceiptForm({
                    supplierId: suppliersList[0]?.supplierID || '',
                    note: '',
                    details: []
                  });
                  setReceiptFormMode('add');
                }}>
                  Lập phiếu nhập mới
                </button>
              )}
            </div>

            <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <div className="advanced-search-group" style={{ width: '100%', gap: '10px', alignItems: 'center' }}>
                <select
                  className="search-select"
                  style={{ width: '160px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  value={receiptSearchType}
                  onChange={(e) => {
                    setReceiptSearchType(e.target.value);
                    setReceiptSearchVal('');
                    setFilterReceiptStart('');
                    setFilterReceiptEnd('');
                  }}
                >
                  <option value="receiptId">Mã Phiếu</option>
                  <option value="batchId">Mã Lô</option>
                  <option value="supplier">Nhà Cung Cấp</option>
                  <option value="employee">Người Lập</option>
                  <option value="status">Trạng Thái</option>
                  <option value="time">Thời Gian</option>
                </select>

                {receiptSearchType === 'time' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>Từ ngày:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterReceiptStart}
                      onChange={(e) => setFilterReceiptStart(e.target.value)}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>đến:</span>
                    <input
                      type="date"
                      className="search-input"
                      style={{ width: '100%', maxWidth: '180px' }}
                      value={filterReceiptEnd}
                      onChange={(e) => setFilterReceiptEnd(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      receiptSearchType === 'receiptId' ? 'Tìm kiếm theo mã phiếu...' :
                        receiptSearchType === 'batchId' ? 'Tìm kiếm theo mã lô thuốc...' :
                          receiptSearchType === 'supplier' ? 'Tìm kiếm theo tên nhà cung cấp...' :
                            receiptSearchType === 'employee' ? 'Tìm kiếm theo tên người lập...' :
                              'Tìm kiếm theo trạng thái (DRAFT - Đang xử lý, CONFIRMED...)...'
                    }
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={receiptSearchVal}
                    onChange={(e) => setReceiptSearchVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd);
                      }
                    }}
                  />
                )}

                <button
                  type="button"
                  className="btn-create"
                  style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                  onClick={() => fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd)}
                >
                  Tìm kiếm
                </button>
                {(receiptSearchVal || filterReceiptStart || filterReceiptEnd) && (
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: '#64748b', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setReceiptSearchVal('');
                      setFilterReceiptStart('');
                      setFilterReceiptEnd('');
                      fetchReceipts(1, receiptSearchType, '', '', '');
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
                  className={`filter-chip ${filterReceiptStatus === 'ALL' ? 'active-all' : ''}`}
                  onClick={() => {
                    setFilterReceiptStatus('ALL');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'ALL');
                  }}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterReceiptStatus === 'DRAFT' ? 'active-low-stock' : ''}`}
                  onClick={() => {
                    setFilterReceiptStatus('DRAFT');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'DRAFT');
                  }}
                >
                  Đang xử lý
                </button>
                <button
                  type="button"
                  className="filter-chip"
                  style={filterReceiptStatus === 'CONFIRMED' ? { backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#15803d', fontWeight: '600' } : {}}
                  onClick={() => {
                    setFilterReceiptStatus('CONFIRMED');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'CONFIRMED');
                  }}
                >
                  Đã nhập kho
                </button>
                <button
                  type="button"
                  className={`filter-chip ${filterReceiptStatus === 'CANCELLED' ? 'active-expired' : ''}`}
                  onClick={() => {
                    setFilterReceiptStatus('CANCELLED');
                    fetchReceipts(1, receiptSearchType, receiptSearchVal, filterReceiptStart, filterReceiptEnd, 'CANCELLED');
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
                    <th>Nhà Cung Cấp</th>
                    <th>Người Lập</th>
                    <th>Trạng Thái</th>
                    <th style={{ textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptsList.length > 0 ? (
                    receiptsList.map((item) => {
                      let statusColor = '#94a3b8'; // DRAFT
                      let statusText = 'Đang xử lý';
                      if (item.status === 'CONFIRMED') {
                        statusColor = 'var(--success-color)';
                        statusText = 'Đã nhập kho';
                      } else if (item.status === 'CANCELLED') {
                        statusColor = 'var(--error-color)';
                        statusText = 'Đã hủy';
                      }

                      return (
                        <tr key={item.receiptId}>
                          <td style={{ fontWeight: '600' }}>{item.receiptId}</td>
                          <td>{item.receiptTime ? new Date(item.receiptTime).toLocaleString('vi-VN') : ''}</td>
                          <td>{item.supplierName}</td>
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
                                    prev && prev.type === 'receipt' && prev.id === item.receiptId
                                      ? null
                                      : { type: 'receipt', id: item.receiptId }
                                  );
                                }}
                              >
                                Thao tác
                              </button>
                              {activeDropdown && activeDropdown.type === 'receipt' && activeDropdown.id === item.receiptId && (
                                <div className="action-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="action-dropdown-item"
                                    onClick={() => {
                                      setSelectedReceipt(item);
                                      setReceiptFormMode('view');
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
                                          handleEditReceiptDraft(item);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Chỉnh sửa
                                      </button>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-error"
                                        onClick={() => {
                                          handleCancelReceipt(item.receiptId);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        Hủy phiếu
                                      </button>
                                      <button
                                        type="button"
                                        className="action-dropdown-item text-success"
                                        onClick={() => {
                                          handleConfirmReceipt(item.receiptId);
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
                      <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Chưa có phiếu nhập kho nào được tạo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {receiptTotalItems > 0 && (
              <div className="pagination-container" style={{ marginTop: '15px' }}>
                <div className="pagination-info">
                  Hiển thị {Math.min((receiptCurrentPage - 1) * 10 + 1, receiptTotalItems)} - {Math.min(receiptCurrentPage * 10, receiptTotalItems)} của {receiptTotalItems} phiếu nhập
                </div>
                {receiptTotalPages > 1 && (
                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={receiptCurrentPage === 1}
                      onClick={() => fetchReceipts(receiptCurrentPage - 1)}
                    >
                      ◀ Trang trước
                    </button>
                    {Array.from({ length: receiptTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${receiptCurrentPage === page ? 'active' : ''}`}
                        onClick={() => fetchReceipts(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={receiptCurrentPage === receiptTotalPages}
                      onClick={() => fetchReceipts(receiptCurrentPage + 1)}
                    >
                      Trang sau ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* FORM MODAL THÊM MỚI / XEM PHIẾU */}
            {receiptFormMode && (
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
                      {receiptFormMode === 'add' ? (receiptForm.receiptId ? `Hiệu Chỉnh Phiếu Nhập (Đang xử lý) (${receiptForm.receiptId})` : 'Lập Phiếu Nhập Mới') : 'Chi Tiết Phiếu Nhập'}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {receiptFormMode === 'view' && (
                        <button
                          type="button"
                          className="btn-action btn-select"
                          style={{ padding: '4px 12px' }}
                          onClick={handlePrintReceipt}
                        >
                          In Phiếu
                        </button>
                      )}
                      <button className="btn-action btn-cancel" style={{ padding: '4px 8px' }} onClick={() => setReceiptFormMode(null)}>X đóng</button>
                    </div>
                  </div>

                  {receiptFormMode === 'add' ? (
                    <form onSubmit={handleSaveReceiptDraft} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      <div className="form-group" style={{ flexShrink: 0 }}>
                        <label className="label">Nhà cung cấp:</label>
                        <SearchableSelect
                          options={suppliersList}
                          value={receiptForm.supplierId}
                          onChange={(val) => setReceiptForm({ ...receiptForm, supplierId: val })}
                          idKey="supplierID"
                          nameKey="supplierName"
                          placeholder="Chọn nhà cung cấp..."
                        />
                      </div>

                      <div className="form-group" style={{ flexShrink: 0 }}>
                        <label className="label">Ghi chú phiếu nhập:</label>
                        <textarea
                          className="input"
                          style={{ height: '60px', resize: 'none' }}
                          value={receiptForm.note}
                          onChange={(e) => setReceiptForm({ ...receiptForm, note: e.target.value })}
                          placeholder="Nhập ghi chú hàng..."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0', flexShrink: 0 }}>
                        <span className="label">Danh sách thuốc nhập:</span>
                        <button type="button" className="btn-action btn-select" onClick={handleAddLine}>+ Thêm thuốc</button>
                      </div>

                      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '15px', background: '#f8fafc' }}>
                        <table className="custom-table" style={{ margin: 0, border: 'none', minWidth: '1000px' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              <th style={{ width: '50px', padding: '10px', textAlign: 'center' }}>STT</th>
                              <th style={{ width: '250px', padding: '10px' }}>Chọn thuốc</th>
                              <th style={{ width: '120px', padding: '10px' }}>Đơn vị nhập</th>
                              <th style={{ width: '120px', padding: '10px' }}>Lô nhập</th>
                              <th style={{ width: '140px', padding: '10px' }}>Ngày sản xuất</th>
                              <th style={{ width: '140px', padding: '10px' }}>Hạn sử dụng</th>
                              <th style={{ width: '90px', padding: '10px' }}>SL nhập</th>
                              <th style={{ width: '120px', padding: '10px' }}>Giá nhập (đ)</th>
                              <th style={{ width: '70px', padding: '10px', textAlign: 'center' }}>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {receiptForm.details.length === 0 ? (
                              <tr>
                                <td colSpan="9" style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '24px' }}>Chưa có dòng thuốc nào được thêm.</td>
                              </tr>
                            ) : (
                              receiptForm.details.map((line, idx) => {
                                const med = (allMedicines.length > 0 ? allMedicines : medicinesList).find(m => m.medicineID === line.medicineId);
                                const rowUnits = [];
                                if (med) {
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
                                        options={allMedicines.length > 0 ? allMedicines : medicinesList}
                                        value={line.medicineId}
                                        onChange={(val) => handleLineChange(idx, 'medicineId', val)}
                                        idKey="medicineID"
                                        nameKey="medicineName"
                                        placeholder="Chọn thuốc..."
                                        style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <SearchableSelect
                                        options={rowUnits}
                                        value={line.transactionUnitId}
                                        onChange={(val) => handleLineChange(idx, 'transactionUnitId', val)}
                                        idKey="unitID"
                                        nameKey="unitName"
                                        placeholder="Chọn đơn vị..."
                                        style={{ padding: '6px 12px', minHeight: '34px', height: '34px', borderRadius: '6px', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="text"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.batchId}
                                        placeholder="BATCH-01"
                                        onChange={(e) => handleLineChange(idx, 'batchId', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="date"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.manufacturedDate}
                                        onChange={(e) => handleLineChange(idx, 'manufacturedDate', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="date"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.expiryDate}
                                        onChange={(e) => handleLineChange(idx, 'expiryDate', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="number"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.quantity}
                                        onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                      <input
                                        type="number"
                                        className="input"
                                        style={{ padding: '6px', width: '100%' }}
                                        value={line.importPrice}
                                        onChange={(e) => handleLineChange(idx, 'importPrice', e.target.value)}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      <button type="button" className="btn-action btn-delete" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleRemoveLine(idx)}>Xóa</button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="form-actions" style={{ flexShrink: 0 }}>
                        <button type="button" className="btn-action btn-cancel" onClick={() => setReceiptFormMode(null)}>Hủy bỏ</button>
                        <button type="submit" className="btn-action btn-select" style={{ flexGrow: 1 }}>Lưu chứng từ (Đang xử lý)</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                      {selectedReceipt && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflow: 'hidden' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', flexShrink: 0 }}>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Mã phiếu:</strong> <span style={{ fontWeight: '600' }}>{selectedReceipt.receiptId}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Nhà cung cấp:</strong> <span>{selectedReceipt.supplierName}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Người lập:</strong> <span>{selectedReceipt.employeeName}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Thời gian:</strong> <span>{selectedReceipt.receiptTime ? new Date(selectedReceipt.receiptTime).toLocaleString('vi-VN') : '---'}</span></div>
                            <div><strong style={{ fontSize: '13px', color: '#64748b' }}>Trạng thái:</strong> <strong style={{ color: selectedReceipt.status === 'CONFIRMED' ? 'var(--success-color)' : 'var(--error-color)' }}>{selectedReceipt.status}</strong></div>
                          </div>
                          <div style={{ flexShrink: 0 }}><strong style={{ fontSize: '13px', color: '#64748b' }}>Ghi chú:</strong> <span>{selectedReceipt.note || '(Không có)'}</span></div>

                          <div style={{ marginTop: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span className="label" style={{ marginBottom: '6px', flexShrink: 0 }}>Chi tiết dòng thuốc nhập:</span>
                            <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}>
                              <table className="custom-table" style={{ margin: 0, border: 'none' }}>
                                <thead>
                                  <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ textAlign: 'center', width: '50px' }}>STT</th>
                                    <th>Tên thuốc</th>
                                    <th>Mã lô</th>
                                    <th>Ngày sản xuất</th>
                                    <th>Hạn sử dụng</th>
                                    <th>Số lượng</th>
                                    <th>Đơn vị nhập</th>
                                    <th style={{ textAlign: 'right' }}>Đơn giá nhập</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedReceipt.details && selectedReceipt.details.map((d, i) => (
                                    <tr key={i}>
                                      <td style={{ textAlign: 'center', fontWeight: '600' }}>#{i + 1}</td>
                                      <td style={{ fontWeight: '600' }}>{d.medicineName}</td>
                                      <td>{d.batchId}</td>
                                      <td>{d.manufacturedDate || '---'}</td>
                                      <td>{d.expiryDate || '---'}</td>
                                      <td>{d.quantity}</td>
                                      <td>{d.transactionUnitName || '---'}</td>
                                      <td style={{ textAlign: 'right', color: 'var(--success-hover)', fontWeight: '600' }}>{d.importPrice.toLocaleString()}đ</td>
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

export default WarehouseReceipt;
