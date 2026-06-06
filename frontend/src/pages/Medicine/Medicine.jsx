/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { printContent } from '../Home';
import SearchableSelect from '../../components/SearchableSelect';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Medicine = () => {
  const { activeTab, setActiveTab, expandedMenus, setExpandedMenus, searchMedicine, setSearchMedicine, searchCatalog, setSearchCatalog, searchUnit, setSearchUnit, searchOrigin, setSearchOrigin, searchField, setSearchField, catalogsList, setCatalogsList, unitsList, setUnitsList, originsList, setOriginsList, paginatedCatalogs, setPaginatedCatalogs, paginatedUnits, setPaginatedUnits, paginatedOrigins, setPaginatedOrigins, medicinesList, setMedicinesList, selectedMedicine, setSelectedMedicine, currentPage, setCurrentPage, totalPages, setTotalPages, totalItems, setTotalItems, catalogCurrentPage, setCatalogCurrentPage, catalogTotalPages, setCatalogTotalPages, catalogTotalItems, setCatalogTotalItems, unitCurrentPage, setUnitCurrentPage, unitTotalPages, setUnitTotalPages, unitTotalItems, setUnitTotalItems, originCurrentPage, setOriginCurrentPage, originTotalPages, setOriginTotalPages, originTotalItems, setOriginTotalItems, suppliersList, setSuppliersList, searchSupplier, setSearchSupplier, tempSearchSupplier, setTempSearchSupplier, supplierFormMode, setSupplierFormMode, supplierForm, setSupplierForm, supplierCurrentPage, setSupplierCurrentPage, innerSystemTab, setInnerSystemTab, employeesList, setEmployeesList, searchEmployee, setSearchEmployee, employeeFormMode, setEmployeeFormMode, employeeForm, setEmployeeForm, employeeCurrentPage, setEmployeeCurrentPage, filterEmployeeStatus, setFilterEmployeeStatus, accountsList, setAccountsList, searchAccount, setSearchAccount, accountFormMode, setAccountFormMode, accountForm, setAccountForm, accountCurrentPage, setAccountCurrentPage, inventoriesList, setInventoriesList, searchInventory, setSearchInventory, filterInventoryType, setFilterInventoryType, showAdvanced, setShowAdvanced, filterCatalog, setFilterCatalog, filterOrigin, setFilterOrigin, filterMinStock, setFilterMinStock, filterMaxStock, setFilterMaxStock, filterStartExpiry, setFilterStartExpiry, filterEndExpiry, setFilterEndExpiry, activeSearchInventory, setActiveSearchInventory, activeFilterCatalog, setActiveFilterCatalog, activeFilterOrigin, setActiveFilterOrigin, activeFilterMinStock, setActiveFilterMinStock, activeFilterMaxStock, setActiveFilterMaxStock, activeFilterStartExpiry, setActiveFilterStartExpiry, activeFilterEndExpiry, setActiveFilterEndExpiry, inventoryCurrentPage, setInventoryCurrentPage, inventoryTotalPages, setInventoryTotalPages, inventoryTotalItems, setInventoryTotalItems, receiptsList, setReceiptsList, receiptCurrentPage, setReceiptCurrentPage, receiptTotalPages, setReceiptTotalPages, receiptTotalItems, setReceiptTotalItems, receiptForm, setReceiptForm, receiptFormMode, setReceiptFormMode, selectedReceipt, setSelectedReceipt, searchReceipt, setSearchReceipt, receiptSearchType, setReceiptSearchType, receiptSearchVal, setReceiptSearchVal, filterReceiptStart, setFilterReceiptStart, filterReceiptEnd, setFilterReceiptEnd, filterReceiptStatus, setFilterReceiptStatus, issuesList, setIssuesList, issueCurrentPage, setIssueCurrentPage, issueTotalPages, setIssueTotalPages, issueTotalItems, setIssueTotalItems, issueForm, setIssueForm, issueFormMode, setIssueFormMode, selectedIssue, setSelectedIssue, searchIssue, setSearchIssue, issueSearchType, setIssueSearchType, issueSearchVal, setIssueSearchVal, filterIssueStart, setFilterIssueStart, filterIssueEnd, setFilterIssueEnd, filterIssueStatus, setFilterIssueStatus, auditsList, setAuditsList, auditCurrentPage, setAuditCurrentPage, auditTotalPages, setAuditTotalPages, auditTotalItems, setAuditTotalItems, auditForm, setAuditForm, auditFormMode, setAuditFormMode, selectedAudit, setSelectedAudit, searchAudit, setSearchAudit, auditSearchType, setAuditSearchType, auditSearchVal, setAuditSearchVal, filterAuditStart, setFilterAuditStart, filterAuditEnd, setFilterAuditEnd, filterAuditStatus, setFilterAuditStatus, historyTransactions, setHistoryTransactions, selectedMedicineForHistory, setSelectedMedicineForHistory, activeHistoryTab, setActiveHistoryTab, stockCardCurrentPage, setStockCardCurrentPage, activeDropdown, setActiveDropdown, stockCardSearchType, setStockCardSearchType, stockCardSearchVal, setStockCardSearchVal, filterStockCardStart, setFilterStockCardStart, filterStockCardEnd, setFilterStockCardEnd, activeStockCardSearchType, setActiveStockCardSearchType, activeStockCardSearchVal, setActiveStockCardSearchVal, activeFilterStockCardStart, setActiveFilterStockCardStart, activeFilterStockCardEnd, setActiveFilterStockCardEnd, posCart, setPosCart, posSearchKeyword, setPosSearchKeyword, posFilteredInventory, setPosFilteredInventory, posSelectedCustomer, setPosSelectedCustomer, posPaymentMethod, setPosPaymentMethod, posAddress, setPosAddress, showPosCheckoutModal, setShowPosCheckoutModal, posCashGiven, setPosCashGiven, invoicesList, setInvoicesList, invoiceCurrentPage, setInvoiceCurrentPage, invoiceTotalPages, setInvoiceTotalPages, invoiceTotalItems, setInvoiceTotalItems, selectedInvoice, setSelectedInvoice, invoiceSearchVal, setInvoiceSearchVal, activeInvoiceSearchVal, setActiveInvoiceSearchVal, showReceiptModal, setShowReceiptModal, invoiceReceiptData, setInvoiceReceiptData, dashboardStats, setDashboardStats, recentOperations, setRecentOperations, criticalAlerts, setCriticalAlerts, dashboardTrendData, setDashboardTrendData, dashboardCategoryData, setDashboardCategoryData, dashboardLoading, setDashboardLoading, allMedicines, setAllMedicines, allInventories, setAllInventories, formMode, setFormMode, formMedicine, setFormMedicine, catalogFormMode, setCatalogFormMode, catalogForm, setCatalogForm, unitFormMode, setUnitFormMode, unitForm, setUnitForm, originFormMode, setOriginFormMode, originForm, setOriginForm, customersList, setCustomersList, selectedCustomer, setSelectedCustomer, customerFormMode, setCustomerFormMode, customerForm, setCustomerForm, searchCustomer, setSearchCustomer, tempSearchCustomer, setTempSearchCustomer, activeSearchCustomer, setActiveSearchCustomer, customerCurrentPage, setCustomerCurrentPage, selectedInvMedicine, setSelectedInvMedicine, handleOutsideClick, fetchInventory, fetchReceipts, fetchIssues, handlePrintReceipt, handlePrintIssue, handlePrintAudit, fetchAudits, fetchInvoices, fetchHistoryTransactions, fetchAllMedicines, fetchAllInventories, fetchDashboardData, fetchInitialData, fetchMedicines, fetchCatalogs, fetchUnits, fetchOrigins, fetchSuppliers, fetchEmployees, fetchAccounts, fetchCustomers, handleAddNewClick, handleEditClick, handleSave, handleDelete, handleBaseUnitChange, handleCatalogChange, handleOriginChange, handleAltUnitChange, addAlternativeUnit, removeAlternativeUnit, handleCatalogSave, handleCatalogEditClick, handleCatalogDelete, handleCatalogCancel, handleUnitSave, handleUnitEditClick, handleUnitDelete, handleUnitCancel, handleOriginSave, handleOriginEditClick, handleOriginDelete, handleOriginCancel, handleSupplierSave, handleSupplierEditClick, handleSupplierDelete, handleSupplierCancel, handleEmployeeSave, handleEmployeeEditClick, handleEmployeeDelete, handleEmployeeCancel, handleAccountSave, handleAccountEditClick, handleAccountDelete, handleAccountCancel, handleAccountResetPassword, handleCustomerAddNewClick, handleCustomerEditClick, handleCustomerSave, handleCustomerDelete, handleCustomerCancel, handleShowInvoiceModal, handleAddToPosCart, handlePosCartQtyChange, handlePosCartUnitChange, handleRemoveFromPosCart, handlePosCartNoteChange, handleOpenCheckoutModal, handlePosCheckout, handleLogout, handleActivityClick, handleAlertAction, handleInventorySearch, handleAddLine, handleRemoveLine, handleEditReceiptDraft, handleLineChange, handleSaveReceiptDraft, handleConfirmReceipt, handleCancelReceipt, handleAddIssueLine, handleRemoveIssueLine, handleIssueLineChange, handleEditIssueDraft, handleAutoExpiredIssue, handleSaveIssueDraft, handleConfirmIssue, handleCancelIssue, handleCancelAudit, handleSaveDraftQuantity, handleConfirmAudit, handleCreateAudit, handleAuditLineActualChange, username, role, getRoleClass, getRoleDisplayName, toggleMenu } = useHomeContext();

  
        const filtered = medicinesList;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* KHUNG TRÊN: CHI TIẾT / FORM NHẬP LIỆU THÔNG MINH */}
            {formMode ? (
              <div className="medicine-detail-card">
                <div className="medicine-header-actions">
                  <h2 className="medicine-header-title">
                    {formMode === 'add' ? 'Thêm mới thuốc' : 'Chỉnh sửa thông tin thuốc'}
                  </h2>
                </div>
                <form onSubmit={handleSave} className="form-grid">
                  <div className="form-group">
                    <label className="label">Mã thuốc:</label>
                    <input
                      type="text"
                      className="input"
                      value={formMedicine.medicineID}
                      onChange={(e) => setFormMedicine({ ...formMedicine, medicineID: e.target.value })}
                      disabled={formMode === 'edit'}
                      placeholder="VD: MED-PARA-500"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Tên thuốc:</label>
                    <input
                      type="text"
                      className="input"
                      value={formMedicine.medicineName}
                      onChange={(e) => setFormMedicine({ ...formMedicine, medicineName: e.target.value })}
                      placeholder="VD: Paracetamol 500mg"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Thành phần:</label>
                    <input
                      type="text"
                      className="input"
                      value={formMedicine.ingredients}
                      onChange={(e) => setFormMedicine({ ...formMedicine, ingredients: e.target.value })}
                      placeholder="VD: Paracetamol 500mg và tá dược..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Đơn giá cơ bản (VND):</label>
                    <input
                      type="number"
                      className="input"
                      value={formMedicine.unitPrice}
                      onChange={(e) => setFormMedicine({ ...formMedicine, unitPrice: Number(e.target.value) || 0 })}
                      placeholder="VD: 1500"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Ảnh sản phẩm (Mặc định):</label>
                    <input
                      type="text"
                      className="input"
                      value="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Đơn vị gốc:</label>
                    <SearchableSelect
                      options={unitsList}
                      value={formMedicine.baseUnit.unitID}
                      onChange={(val) => {
                        const selectedUnit = unitsList.find(u => u.unitID === val);
                        if (selectedUnit) {
                          setFormMedicine(prev => ({
                            ...prev,
                            baseUnit: {
                              unitID: selectedUnit.unitID,
                              unitName: selectedUnit.unitName
                            }
                          }));
                        }
                      }}
                      idKey="unitID"
                      nameKey="unitName"
                      placeholder="Chọn đơn vị gốc..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Danh mục:</label>
                    <SearchableSelect
                      options={catalogsList}
                      value={formMedicine.catalog.catalogID}
                      onChange={(val) => {
                        const selectedCat = catalogsList.find(c => c.catalogID === val);
                        if (selectedCat) {
                          setFormMedicine(prev => ({
                            ...prev,
                            catalog: {
                              catalogID: selectedCat.catalogID,
                              catalogName: selectedCat.catalogName
                            }
                          }));
                        }
                      }}
                      idKey="catalogID"
                      nameKey="catalogName"
                      placeholder="Chọn danh mục..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Nước sản xuất:</label>
                    <SearchableSelect
                      options={originsList}
                      value={formMedicine.origin.originID}
                      onChange={(val) => {
                        const selectedOrig = originsList.find(o => o.originID === val);
                        if (selectedOrig) {
                          setFormMedicine(prev => ({
                            ...prev,
                            origin: {
                              originID: selectedOrig.originID,
                              originName: selectedOrig.originName
                            }
                          }));
                        }
                      }}
                      idKey="originID"
                      nameKey="originName"
                      placeholder="Chọn nước sản xuất..."
                    />
                  </div>

                  {/* Quản lý đơn vị tính quy đổi phụ */}
                  <div className="form-group-full" style={{ marginTop: '10px', borderTop: '1px dashed #cbd5e1', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span className="label" style={{ margin: 0 }}>Đơn vị quy đổi phụ (nếu có)</span>
                      <button type="button" className="btn-action btn-select" onClick={addAlternativeUnit}>
                        Thêm đơn vị quy đổi
                      </button>
                    </div>

                    {formMedicine.alternativeUnits && formMedicine.alternativeUnits.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {formMedicine.alternativeUnits.map((alt, index) => (
                          <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 2 }}>
                              <SearchableSelect
                                options={unitsList}
                                value={alt.unitID}
                                onChange={(val) => handleAltUnitChange(index, 'unitID', val)}
                                idKey="unitID"
                                nameKey="unitName"
                                placeholder="Chọn đơn vị phụ..."
                              />
                            </div>
                            <span style={{ fontSize: '14px', color: '#64748b' }}>Tỉ lệ: 1 {alt.unitName} = </span>
                            <input
                              type="number"
                              className="input"
                              style={{ flex: 1, padding: '8px' }}
                              value={alt.conversionRate}
                              onChange={(e) => handleAltUnitChange(index, 'conversionRate', e.target.value)}
                              placeholder="Số lượng"
                              required
                            />
                            <span style={{ fontSize: '14px', color: '#64748b' }}>{formMedicine.baseUnit.unitName}</span>
                            <button
                              type="button"
                              className="btn-action btn-delete"
                              style={{ padding: '8px 12px' }}
                              onClick={() => removeAlternativeUnit(index)}
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Chưa thiết lập đơn vị quy đổi phụ nào cho thuốc này.</p>
                    )}
                  </div>

                  <div className="form-actions form-group-full">
                    <button type="button" className="btn-action btn-cancel" onClick={() => setFormMode(null)}>
                      Hủy bỏ
                    </button>
                    <button type="submit" className="btn-action btn-select">
                      Lưu lại
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="medicine-detail-card">
                {selectedMedicine ? (
                  <>
                    <div className="medicine-header-actions">
                      <h2 className="medicine-header-title">Thông Tin Chi Tiết Thuốc</h2>
                      {(role === 'Admin' || role === 'Product_manager') && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-action btn-edit" onClick={handleEditClick}>
                            Chỉnh sửa
                          </button>
                          <button className="btn-action btn-delete" onClick={() => handleDelete(selectedMedicine.medicineID)}>
                            Xóa thuốc
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="medicine-layout">
                      {/* Cột trái: Ảnh sản phẩm thực tế */}
                      <div className="medicine-image-box">
                        <img src={selectedMedicine.image} alt={selectedMedicine.medicineName} className="medicine-img" />
                      </div>
                      {/* Cột phải: Dòng chi tiết thuộc tính */}
                      <div className="medicine-info-list">
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Mã thuốc:</span> {selectedMedicine.medicineID}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Tên thuốc:</span> <strong>{selectedMedicine.medicineName}</strong>
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Thành phần:</span> {selectedMedicine.ingredients}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Nhóm danh mục:</span> {selectedMedicine.catalog.catalogName}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Nước sản xuất:</span> {selectedMedicine.origin.originName}
                        </div>
                        <div className="medicine-info-row">
                          <span className="medicine-info-label">Đơn giá cơ bản:</span> <span style={{ color: '#059669', fontWeight: 'bold' }}>{selectedMedicine.unitPrice.toLocaleString('en-US')} VND / {selectedMedicine.baseUnit.unitName}</span>
                        </div>

                        {/* HIỂN THỊ DANH SÁCH ĐƠN VỊ QUY ĐỔI PHỤ VÀ TỰ ĐỘNG TÍNH GIÁ */}
                        {selectedMedicine.alternativeUnits && selectedMedicine.alternativeUnits.length > 0 && (
                          <div style={{ marginTop: '16px' }}>
                            <span className="medicine-info-label" style={{ display: 'block', marginBottom: '6px' }}>Đơn vị quy đổi:</span>
                            <div className="alt-units-container">
                              {selectedMedicine.alternativeUnits.map((alt) => (
                                <div key={alt.unitID} className="alt-unit-badge">
                                  <span className="alt-unit-title">{alt.unitName}</span>
                                  <span>Tỉ lệ: 1 {alt.unitName} = {alt.conversionRate} {selectedMedicine.baseUnit.unitName}</span>
                                  <span className="alt-unit-price">{(selectedMedicine.unitPrice * alt.conversionRate).toLocaleString('en-US')} VND</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    <h2 className="medicine-header-title" style={{ marginBottom: '10px' }}>Không có thuốc nào được chọn</h2>
                    <p>Vui lòng chọn một thuốc từ danh sách bên dưới hoặc bấm nút "Thêm mới thuốc" để bắt đầu.</p>
                  </div>
                )}
              </div>
            )}

            {/* KHUNG DƯỚI: DANH SÁCH BẢNG CHỌN THUỐC */}
            <div className="content-card">
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>Danh sách thuốc</h2>

              <div className="table-actions">
                <div className="advanced-search-group">
                  <select
                    className="search-select"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                  >
                    <option value="medicineName">Tên thuốc</option>
                    <option value="medicineID">Mã thuốc</option>
                    <option value="ingredients">Thành phần</option>
                    <option value="catalog">Nhóm thuốc</option>
                    <option value="origin">Nước sản xuất</option>
                  </select>
                  <input
                    type="text"
                    placeholder={`Tìm kiếm theo ${searchField === 'medicineName' ? 'tên thuốc' :
                      searchField === 'medicineID' ? 'mã thuốc' :
                        searchField === 'ingredients' ? 'thành phần' :
                          searchField === 'catalog' ? 'nhóm thuốc' : 'nước sản xuất'
                      }...`}
                    className="search-input"
                    style={{ maxWidth: 'none', flexGrow: 1 }}
                    value={searchMedicine}
                    onChange={(e) => setSearchMedicine(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchMedicines(searchMedicine, searchField);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-create"
                    style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap' }}
                    onClick={() => fetchMedicines(searchMedicine, searchField)}
                  >
                    Tìm kiếm
                  </button>
                  {searchMedicine && (
                    <button
                      type="button"
                      className="btn-create"
                      style={{ backgroundColor: 'var(--success-color)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={async () => {
                        setSearchMedicine('');
                        setSearchField('medicineName');
                        const freshList = await fetchMedicines('', '', 1);
                        if (freshList.length > 0) {
                          setSelectedMedicine(freshList[0]);
                        }
                      }}
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
                {(role === 'Admin' || role === 'Product_manager') && (
                  <button className="btn-create" onClick={handleAddNewClick}>
                    Thêm mới thuốc
                  </button>
                )}
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mã thuốc</th>
                      <th>Tên thuốc</th>
                      <th>Đơn vị cơ bản</th>
                      <th>Đơn giá gốc</th>
                      <th>Nhóm thuốc</th>
                      <th>Nước sản xuất</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((item) => (
                        <tr key={item.medicineID} style={selectedMedicine && selectedMedicine.medicineID === item.medicineID ? { backgroundColor: '#f0fdf4' } : {}}>
                          <td style={{ fontWeight: '600' }}>{item.medicineID}</td>
                          <td>{item.medicineName}</td>
                          <td>{item.baseUnit.unitName}</td>
                          <td style={{ color: '#059669', fontWeight: '500' }}>{item.unitPrice.toLocaleString('en-US')} VND</td>
                          <td>{item.catalog.catalogName}</td>
                          <td>{item.origin.originName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-action btn-select"
                              style={{ marginRight: '6px' }}
                              onClick={() => {
                                setSelectedMedicine(item);
                                setFormMode(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              Chọn
                            </button>
                            {(role === 'Admin' || role === 'Product_manager') && (
                              <button
                                className="btn-action btn-delete"
                                onClick={() => handleDelete(item.medicineID)}
                              >
                                Xóa
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Không tìm thấy loại thuốc nào phù hợp.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalItems > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Hiển thị {Math.min((currentPage - 1) * 10 + 1, totalItems)} - {Math.min(currentPage * 10, totalItems)} của {totalItems} thuốc
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-buttons">
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => fetchMedicines(searchMedicine, searchField, currentPage - 1)}
                      >
                        ◀ Trang trước
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => fetchMedicines(searchMedicine, searchField, page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => fetchMedicines(searchMedicine, searchField, currentPage + 1)}
                      >
                        Trang sau ▶
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      
};

export default Medicine;
