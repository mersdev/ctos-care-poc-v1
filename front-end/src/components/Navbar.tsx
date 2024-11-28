import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  Bell,
  CreditCard,
  CheckSquare,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const { toast } = useToast();

  const navItems = [
    {
      title: "Financial Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Credit Report",
      href: "/credit-report",
      icon: CreditCard,
    },
    {
      title: "Todo List",
      href: "/todo",
      icon: CheckSquare,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Button
                variant="ghost"
                className="inline-flex items-center p-2 text-sm rounded-lg lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <Link to="/" className="flex items-center">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary">
                  CTOS Care
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex lg:items-center lg:ml-6 lg:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  toast({
                    title: "No new notifications",
                  })
                }
              >
                <Bell className="h-5 w-5" />
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link to="/profile">
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem>
                      Data Consent
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-xl font-semibold text-primary">
                  CTOS Care
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              <nav className="p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                      location.pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
