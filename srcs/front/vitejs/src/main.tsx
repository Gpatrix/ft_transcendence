import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './css/global.css'

import  Login from "./pages/Auth/Login.tsx"
import Register from './pages/Auth/Register.tsx';
import ForgottenPassword from './pages/Auth/ForgottenPassword.tsx';
import  AuthLayout from "./pages/Auth/AuthLayout.tsx"
import { CookiesProvider } from 'react-cookie';
import NewPassword from './pages/Auth/NewPassword.tsx';
import ProfileBackground from './pages/Profile/ProfileBackground.tsx';

import MyProfile from './pages/Profile/me/MyProfile.tsx';

createRoot(document.getElementById('root')!).render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgottenPassword />} />
          <Route path="/forgot-password/new-password" element={<NewPassword />} />
        </Route>

        <Route element={<ProfileBackground/>}>
          <Route path="/profile/test" element={<MyProfile />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  </CookiesProvider>
)
