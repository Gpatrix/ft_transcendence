import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import  Login from "./pages/Auth/Login.tsx"
import  Chat from "./pages/Auth/Chat.tsx"
// import  Header from "./components/Header.tsx"
import  AuthLayout from "./pages/Auth/AuthLayout.tsx"
import './css/global.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/chat" element={<Chat />} />

    </Routes>
  </BrowserRouter>
)
