import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<App initialPage="planner" />} />
        <Route path="/daily-tasks" element={<App initialPage="daily-tasks" />} />
        <Route path="/weekly-review" element={<App initialPage="weekly-review" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
