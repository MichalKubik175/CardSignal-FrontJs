import React from 'react'
import ReactDOM from 'react-dom/client'
import router from './App'
import App from './App'
import { RouterProvider } from "react-router";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>
)