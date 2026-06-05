import React from 'react';
import { useHomeContext } from '../../context/HomeContext';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Overview = () => {
  const { dashboardLoading, dashboardStats, dashboardTrendData, dashboardCategoryData, recentOperations, criticalAlerts, handleActivityClick, handleAlertAction, fetchDashboardData } = useHomeContext();

  
        if (dashboardLoading) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px' }}>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
              `}</style>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h1 className="content-title" style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Tổng Quan Hệ Thống</h1>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Đang tải số liệu từ hệ thống...</span>
              </div>

              {/* Skeleton Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="content-card" style={{ height: '110px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}>
                    <div style={{ width: '40%', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '4px' }}></div>
                    <div style={{ width: '60%', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                  </div>
                ))}
              </div>

              {/* Skeleton Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                {[1, 2].map(n => (
                  <div key={n} className="content-card" style={{ height: '350px', padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px' }}>
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
              }
              .kpi-card {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              .kpi-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03) !important;
              }
              .activity-row:hover td {
                background-color: #f8fafc !important;
              }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="content-title" style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Tổng Quan Hệ Thống</h1>
              <button
                onClick={fetchDashboardData}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Làm mới
              </button>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>

              {/* Card 1: Tổng số đầu thuốc */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid var(--primary-color)', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>TỔNG ĐẦU THUỐC</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{dashboardStats.totalMedicines}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Danh mục sản phẩm</span>
                </div>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                    <path d="m8.5 8.5 7 7" />
                  </svg>
                </div>
              </div>

              {/* Card 2: Lô sắp hết hàng */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid #eab308', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>TỒN KHO THẤP</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#d97706' }}>{dashboardStats.lowStockCount}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Đầu thuốc dưới tối thiểu</span>
                </div>
                <div style={{ backgroundColor: '#fef9c3', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#eab308' }}>
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                  </svg>
                </div>
              </div>

              {/* Card 3: Lô cận hạn sử dụng */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid #f97316', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>THUỐC CẬN HẠN</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#ea580c' }}>{dashboardStats.nearExpiryCount}</span>
                  <span style={{ fontSize: '11px', color: '#ea580c' }}>Cận hạn &lt; 6 tháng</span>
                </div>
                <div style={{ backgroundColor: '#ffedd5', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f97316' }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>

              {/* Card 4: Lô đã hết hạn */}
              <div className="content-card kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderLeft: '4px solid #ef4444', borderRadius: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>LÔ ĐÃ HẾT HẠN</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626' }}>{dashboardStats.expiredCount}</span>
                  <span style={{ fontSize: '11px', color: '#ef4444' }}>Cần xuất hủy khẩn cấp</span>
                </div>
                <div style={{ backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Recharts Visualizations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>

              {/* Chart 1: Xu hướng giao dịch kho */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  Tần Suất Biến Động Kho (7 ngày gần nhất)
                </h3>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNhap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="colorXuat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} />
                      <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area type="monotone" name="Giao dịch Nhập" dataKey="Nhập kho" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNhap)" />
                      <Area type="monotone" name="Giao dịch Xuất" dataKey="Xuất kho" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorXuat)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Phân bổ theo nhóm */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
                    <path d="M3 3v18h18" />
                    <rect x="7" y="10" width="4" height="7" rx="1" />
                    <rect x="15" y="5" width="4" height="12" rx="1" />
                  </svg>
                  Phân Bổ Thuốc Theo Nhóm Danh Mục
                </h3>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardCategoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} cursor={{ fill: '#f8fafc' }} />
                      <Bar name="Số lượng thuốc" dataKey="Số lượng đầu thuốc" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Bottom Insights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>

              {/* Left Widget: Recent Operations Log */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Nhật Ký Hoạt Động Kho Gần Đây
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Click hàng để xem chi tiết</span>
                </div>
                <div className="custom-table-container" style={{ border: 'none', borderRadius: 0 }}>
                  <table className="custom-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Mã Phiếu</th>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Phân Hệ</th>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Nội Dung</th>
                        <th style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '12px', padding: '10px 12px', fontWeight: '600' }}>Thời Gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOperations.length > 0 ? (
                        recentOperations.map((op) => {
                          let badgeColor = '#2563eb';
                          let badgeBg = '#dbeafe';
                          let typeText = 'Nhập kho';
                          if (op.type === 'ISSUE') {
                            badgeColor = '#dc2626';
                            badgeBg = '#fee2e2';
                            typeText = 'Xuất kho';
                          } else if (op.type === 'AUDIT') {
                            badgeColor = '#d97706';
                            badgeBg = '#fef9c3';
                            typeText = 'Kiểm kê';
                          }

                          return (
                            <tr
                              key={op.id}
                              onClick={() => handleActivityClick(op)}
                              className="activity-row"
                              style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}
                            >
                              <td style={{ fontWeight: '600', color: '#2563eb', padding: '12px 12px', fontSize: '13px' }}>{op.id}</td>
                              <td style={{ padding: '12px 12px' }}>
                                <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: badgeBg, color: badgeColor }}>
                                  {typeText}
                                </span>
                              </td>
                              <td style={{ padding: '12px 12px', fontSize: '13px', color: '#334155', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={op.details}>
                                {op.details}
                              </td>
                              <td style={{ padding: '12px 12px', fontSize: '12px', color: '#64748b' }}>
                                {op.time ? new Date(op.time).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '---'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>
                            Không có hoạt động kho gần đây
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Widget: Critical Inventory Alerts */}
              <div className="content-card" style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Cảnh Báo Tồn Kho Khẩn Cấp
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '270px', overflowY: 'auto', paddingRight: '4px' }}>
                  {criticalAlerts.length > 0 ? (
                    criticalAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: alert.type === 'EXPIRED' ? '#fee2e2' : '#fffbeb',
                          border: alert.type === 'EXPIRED' ? '1px solid #fecaca' : '1px solid #fef3c7',
                          transition: 'transform 0.15s'
                        }}
                      >
                        <span style={{ fontWeight: '600', fontSize: '13px', color: alert.type === 'EXPIRED' ? '#991b1b' : '#92400e' }}>
                          {alert.title}
                        </span>
                        <span style={{ fontSize: '11px', color: alert.type === 'EXPIRED' ? '#b91c1c' : '#b45309', lineHeight: '1.4' }}>
                          {alert.desc}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 20px',
                      color: '#10b981',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      gap: '8px',
                      height: '180px'
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Tồn kho an toàn, không có cảnh báo!</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        );

      /* MÀN HÌNH 1: THÔNG TIN THUỐC (Interactive Medicine Detail & Catalog Table) */
      
};

export default Overview;
