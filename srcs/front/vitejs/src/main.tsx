import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './css/global.css'

import  Login from "./pages/Auth/Login.tsx"
import Register from './pages/Auth/Register.tsx';
import ForgottenPassword from './pages/Auth/ForgottenPassword.tsx';
import  AuthLayout from "./pages/Auth/AuthLayout.tsx"
import GoogleRedirect from './pages/Auth/GoogleRedirect.tsx';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgottenPassword />} />
          <Route path='/google-redirect' element={<GoogleRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CookiesProvider>
)
