import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [isForgot, setIsForgot] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login/', {
        username: username.trim(),
        password: password
      });

      const { data } = response.data;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      setSuccess('Đăng nhập thành công! Đang truy cập hệ thống...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      
      // Bắt lỗi đăng nhập lần đầu tiên yêu cầu đổi mật khẩu
      if (errorMsg.includes('đổi mật khẩu trong lần đăng nhập đầu tiên') || errorMsg.includes('đổi mật khẩu lần đầu')) {
        navigate('/change-password', {
          state: {
            username: username.trim(),
            oldPassword: password,
            infoMessage: 'Tài khoản chưa đổi mật khẩu lần đầu. Vui lòng thiết lập mật khẩu mới bên dưới.'
          }
        });
        return;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password/', {
        username: username.trim(),
        email: email.trim()
      });

      // Theo yêu cầu của user: "nếu thành công thì chuyển sang trang đổi mật khẩu chứ không lấy mật khẩu trong response"
      // Chuyển hướng trực tiếp sang trang đổi mật khẩu với username được điền sẵn
      navigate('/change-password', {
        state: {
          username: username.trim(),
          infoMessage: 'Mật khẩu tạm thời đã được sinh thành công. Vui lòng kiểm tra log backend và thực hiện đổi mật khẩu bên dưới.'
        }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Yêu cầu thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Hệ Thống PIS</h1>
        <p className="subtitle">Quản lý kho dược phẩm & bán hàng</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!isForgot ? (
          /* FORM ĐĂNG NHẬP */
          <form onSubmit={handleLoginSubmit}>
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
              <label className="label" htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>

            <div className="link-group">
              <span
                className="link"
                onClick={() => {
                  setIsForgot(true);
                  setError('');
                  setSuccess('');
                }}
              >
                Đăng nhập lần đầu / Quên mật khẩu?
              </span>
            </div>
          </form>
        ) : (
          /* FORM YÊU CẦU CẤP LẠI MẬT KHẨU */
          <form onSubmit={handleForgotSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="forgot-username">Tên đăng nhập</label>
              <input
                id="forgot-username"
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
              <label className="label" htmlFor="forgot-email">Email nhân viên</label>
              <input
                id="forgot-email"
                type="email"
                className="input"
                placeholder="Nhập email đã đăng ký..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <p className="helper-text">Mật khẩu mới sẽ được sinh ngẫu nhiên và in tại log hệ thống.</p>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại mật khẩu'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => {
                setIsForgot(false);
                setError('');
                setSuccess('');
              }}
            >
              Quay lại Đăng nhập
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
