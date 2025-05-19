import { Link } from 'react-router-dom';
import './Navbar.css'; // Create this file for styling

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">CardSignal</div>
      <div className="navbar-links">
        <Link to="/cards" className="nav-link">Cards</Link>
        <Link to="/cardlinks" className="nav-link">Card Links</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
}