import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
<<<<<<< HEAD
import  Login from "./pages/Auth/Login.tsx"

import  Chat from "./pages/Auth/Chat.tsx"
import  App from "./App"
// import  Header from "./components/Header.tsx"

import Register from './pages/Auth/Register.tsx';

import  AuthLayout from "./pages/Auth/AuthLayout.tsx"
=======
>>>>>>> 5d1bbc7 (56 forgotten password (#66))
import './css/global.css'

import  Login from "./pages/Auth/Login.tsx"
import Register from './pages/Auth/Register.tsx';
import ForgottenPassword from './pages/Auth/ForgottenPassword.tsx';
import  AuthLayout from "./pages/Auth/AuthLayout.tsx"
import { CookiesProvider } from 'react-cookie';
import NewPassword from './pages/Auth/NewPassword.tsx';

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
        <Route path="/chat" element={<Chat />} />
        <Route path="/test" element={<App />} />
      </Routes>
    </BrowserRouter>
  </CookiesProvider>
)
