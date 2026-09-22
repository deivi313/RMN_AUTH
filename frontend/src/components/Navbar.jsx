import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Products App</Link>
      <div className="links">
        {user ? (
          <>
            <Link to="/">My products</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/products">All products</Link>
              </>
            )}
            <span className="muted">{user.name}</span>
            <button className="secondary" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
