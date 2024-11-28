import React, { useState } from 'react'
import { Toaster } from "@/components/ui/toaster"
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="pt-[4.5rem] min-h-screen bg-gray-50">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}

export default Layout
