import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ children, ...buttonProps }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/auth', { replace: true });
  };

  return (
    <button type="button" onClick={handleLogout} {...buttonProps}>
      {children}
    </button>
  );
}
