import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/NavBar'
import { NavLink, Routes, Route } from "react-router-dom";



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Главная страница</h1>} />  
      </Routes>
    </>
  )
}

export default App
