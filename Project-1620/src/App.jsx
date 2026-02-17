import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/NavBar'
import { NavLink, Routes, Route } from "react-router-dom";
import Page_main from './pages/Page_main';
import Page_login from './pages/Page_login';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Page_main />} />  
        <Route path="/login" element={<Page_login />} />  
      </Routes>
    </>
  )
}

export default App
