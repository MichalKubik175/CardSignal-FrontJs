import { Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Cards from './pages/Protected/Cards'
import Layout from './components/layout'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/cards" element={<Cards />} />
      </Route>
    </Routes>
  )
}