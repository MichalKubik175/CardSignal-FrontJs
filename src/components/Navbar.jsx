import { Link } from 'react-router-dom';
import './Navbar.css'; // Create this file for styling

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">My App</div>
      <div className="navbar-links">
        <Link to="/cards" className="nav-link">Cards</Link>
        <Link to="/cardlinks" className="nav-link">My Card Links</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
}