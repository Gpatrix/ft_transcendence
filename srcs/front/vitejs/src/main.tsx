import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Router } from "react-router";
import './css/global.css'

import { AuthProvider } from './AuthProvider.tsx';
import  Login from "./pages/Auth/Login.tsx"
import Register from './pages/Auth/Register.tsx';
import ForgottenPassword from './pages/Auth/ForgottenPassword.tsx';
import  AuthLayout from "./pages/Auth/AuthLayout.tsx"
import { CookiesProvider } from 'react-cookie';
import NewPassword from './pages/Auth/NewPassword.tsx';
import ProfileBackground from './pages/Profile/ProfileBackground.tsx';
import MyProfile from './pages/Profile/me/MyProfile.tsx';
import OthersProfile from './pages/Profile/others/OthersProfile.tsx';
import  Chat from "./pages/Auth/Chat.tsx"
import  App from "./App"



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
            <Route path="/profile" element={<MyProfile />}/>
            <Route path="/profile/:id" element={<OthersProfile />}/>
          </Route>
          
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/test" element={<App />} /> */}

        </Routes>
      </AuthProvider>
      </CookiesProvider>


    </BrowserRouter>
)
