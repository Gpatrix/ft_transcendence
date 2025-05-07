import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Router } from "react-router";
import './css/global.css'

import  Chat from "./pages/Auth/Chat.tsx"
import  App from "./App"

import Register from './pages/Auth/Register.tsx';
import ForgottenPassword from './pages/Auth/ForgottenPassword.tsx';
import AuthLayout from "./pages/Auth/AuthLayout.tsx"

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <CookiesProvider>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgottenPassword />} />
            <Route path="/forgot-password/new-password" element={<NewPassword />} />
          </Route>

          <Route element={<ProfileBackground/>}>
            <Route path="/profile/:id" element={<MyProfile />}/>
          </Route>
          
          <Route path="/chat" element={<Chat />} />
          <Route path="/test" element={<App />} />

        </Routes>
      </AuthProvider>
      </CookiesProvider>


    </BrowserRouter>
)
