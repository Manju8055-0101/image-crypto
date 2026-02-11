import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Particles from '../common/Particles'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      <Particles particleCount={80} />
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
