import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./Navbar";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="pt-[4.5rem] min-h-screen bg-gray-50">
        <div className="max-w-[2000px] mx-auto p-8">
          <div className="bg-transparents rounded-lg ">
            <Outlet />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
