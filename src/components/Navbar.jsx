import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ background: '#eee', padding: '1rem' }}>
      <Link to="/cards" style={{ marginRight: '1rem' }}>Cards</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}