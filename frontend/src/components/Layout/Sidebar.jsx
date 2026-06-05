import React from 'react';

const Sidebar = ({
  username, role, getRoleClass, getRoleDisplayName,
  activeTab, setActiveTab, expandedMenus, setExpandedMenus,
  toggleMenu, handleLogout
}) => {
  return (
      <aside className="sidebar">
        {/* User profile section */}
        <div className="user-profile">
          <div className="user-avatar-container">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="user-status-indicator"></span>
          </div>
          <div className="user-info">
            <div className="user-name" title={username}>{username}</div>
            <div className={`user-role-badge ${getRoleClass(role)}`}>
              {getRoleDisplayName(role)}
            </div>
          </div>
        </div>

        {/* CÂY MENU ĐA CẤP (COLLAPSIBLE SIDEBAR) */}
        <nav className="menu-list">

          {/* MENU 0: TỔNG QUAN (Single button, no submenus) */}
          <div>
            <button
              className={`menu-btn-parent ${activeTab === 'overview' ? 'active' : ''}`}
              style={activeTab === 'overview' ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' } : {}}
              onClick={() => {
                setActiveTab('overview');
                setExpandedMenus({
                  thuoc: false,
                  kho: false,
                  banHang: false,
                  heThong: false
                });
              }}
            >
              <span>Tổng quan</span>
            </button>
          </div>

          {/* MENU 1: THUỐC (Parent key: 'thuoc') */}
          <div>
            <button className="menu-btn-parent" onClick={() => toggleMenu('thuoc')}>
              <span>Thuốc</span>
              <span className="menu-arrow">{expandedMenus.thuoc ? '▲' : '▼'}</span>
            </button>
            {expandedMenus.thuoc && (
              <div className="submenu-list">
                <button className={`submenu-btn ${activeTab === 'medicine' ? 'active' : ''}`} onClick={() => setActiveTab('medicine')}>
                  Thông tin thuốc
                </button>
                <button className={`submenu-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
                  Danh mục
                </button>
                <button className={`submenu-btn ${activeTab === 'unit' ? 'active' : ''}`} onClick={() => setActiveTab('unit')}>
                  Đơn vị tính
                </button>
                <button className={`submenu-btn ${activeTab === 'origin' ? 'active' : ''}`} onClick={() => setActiveTab('origin')}>
                  Xuất xứ
                </button>
              </div>
            )}
          </div>

          {/* MENU 2: KHO THUỐC (Parent key: 'kho') */}
          <div>
            <button className="menu-btn-parent" onClick={() => toggleMenu('kho')}>
              <span>Kho thuốc</span>
              <span className="menu-arrow">{expandedMenus.kho ? '▲' : '▼'}</span>
            </button>
            {expandedMenus.kho && (
              <div className="submenu-list">
                <button className={`submenu-btn ${activeTab === 'warehouse_inventory' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_inventory')}>
                  Tồn kho thực tế
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_history' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_history')}>
                  Lịch sử kho
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_receipt' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_receipt')}>
                  Phiếu nhập kho
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_issue' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_issue')}>
                  Phiếu xuất kho
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_audit' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_audit')}>
                  Phiếu kiểm kê
                </button>
                <button className={`submenu-btn ${activeTab === 'warehouse_supplier' ? 'active' : ''}`} onClick={() => setActiveTab('warehouse_supplier')}>
                  Nhà cung cấp
                </button>
              </div>
            )}
          </div>

          {/* MENU 3: BÁN HÀNG (Parent key: 'banHang') */}
          <div>
            <button className="menu-btn-parent" onClick={() => toggleMenu('banHang')}>
              <span>Bán hàng</span>
              <span className="menu-arrow">{expandedMenus.banHang ? '▲' : '▼'}</span>
            </button>
            {expandedMenus.banHang && (
              <div className="submenu-list">
                {role !== 'Product_manager' && (
                  <button className={`submenu-btn ${activeTab === 'sales_pos' ? 'active' : ''}`} onClick={() => setActiveTab('sales_pos')}>
                    Quầy bán thuốc
                  </button>
                )}
                <button className={`submenu-btn ${activeTab === 'sales_invoices' ? 'active' : ''}`} onClick={() => setActiveTab('sales_invoices')}>
                  Danh sách hóa đơn
                </button>
                <button className={`submenu-btn ${activeTab === 'sales_customers' ? 'active' : ''}`} onClick={() => setActiveTab('sales_customers')}>
                  Khách hàng
                </button>

              </div>
            )}
          </div>

          {/* MENU 4: HỆ THỐNG */}
          {role === 'Admin' && (
            <div>
              <button
                className={`menu-btn-parent ${activeTab === 'sys_management' ? 'active' : ''}`}
                style={activeTab === 'sys_management' ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' } : {}}
                onClick={() => {
                  setActiveTab('sys_management');
                  setExpandedMenus({
                    thuoc: false,
                    kho: false,
                    banHang: false,
                    heThong: false
                  });
                }}
              >
                <span>Quản trị hệ thống</span>
              </button>
            </div>
          )}

        </nav>

        {/* NÚT ĐĂNG XUẤT */}
        <div className="logout-container">
          <button onClick={handleLogout} className="btn-logout">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
