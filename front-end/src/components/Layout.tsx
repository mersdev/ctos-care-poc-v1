import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar, { navItems } from "./Navbar";
import { Link } from "react-router-dom";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-40"
        >
          <div className="p-4 space-y-4 mt-16">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-4 text-gray-800 hover:text-primary hover:bg-gray-100 p-2 rounded-md"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

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
