import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ChangePassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [infoMessage, setInfoMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Đọc dữ liệu chuyển hướng từ Login
  useEffect(() => {
    if (location.state) {
      if (location.state.username) setUsername(location.state.username);
      if (location.state.oldPassword) setOldPassword(location.state.oldPassword);
      if (location.state.infoMessage) setInfoMessage(location.state.infoMessage);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Kiểm tra trùng khớp mật khẩu mới ở client
    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu mới và mật khẩu xác nhận không trùng khớp!');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/change-password/', {
        username: username.trim(),
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
      });

      setSuccess('Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...');
      
      // Xóa thông tin lưu trữ cũ để đảm bảo đăng nhập sạch sẽ
      localStorage.clear();

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Thiết Lập Mật Khẩu</h1>
        <p className="subtitle">Đặt mật khẩu mới cho tài khoản của bạn</p>

        {infoMessage && !success && !error && (
          <div className="alert alert-success" style={{ backgroundColor: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', borderColor: 'rgba(79, 70, 229, 0.15)' }}>
            {infoMessage}
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              className="input"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="oldPassword">Mật khẩu cũ / Mật khẩu tạm thời</label>
            <input
              id="oldPassword"
              type="password"
              className="input"
              placeholder="Nhập mật khẩu cũ hoặc tạm thời..."
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="newPassword">Mật khẩu mới</label>
            <input
              id="newPassword"
              type="password"
              className="input"
              placeholder="Nhập mật khẩu mới..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
            <input
              id="confirmNewPassword"
              type="password"
              className="input"
              placeholder="Xác nhận mật khẩu mới..."
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Đang thực hiện...' : 'Đặt lại mật khẩu'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            disabled={loading}
            onClick={() => navigate('/login')}
          >
            Quay lại Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
