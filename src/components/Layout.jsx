import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This renders child routes */}
      </main>
    </div>
  )
}