import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import  Login from "./pages/Auth/Login.tsx"
import  AuthLayout from "./pages/Auth/AuthLayout.tsx"


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

    </Routes>
  </BrowserRouter>
)
