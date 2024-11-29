import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  Bell,
  CreditCard,
  MessageSquare,
  ListTodo,
  User,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sign_out } = useAuthContext();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Credit Score Update",
      message: "Your credit score has been updated",
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      title: "New Message",
      message: "You have a new message in chat",
      read: false,
      timestamp: new Date().toISOString(),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    try {
      await sign_out();
      navigate("/signin");
      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/dashboard",
    },
    {
      label: "Credit Report",
      icon: <CreditCard className="h-4 w-4" />,
      path: "/credit-report",
    },
    {
      label: "Chat",
      icon: <MessageSquare className="h-4 w-4" />,
      path: "/chat",
    },
    {
      label: "Todo",
      icon: <ListTodo className="h-4 w-4" />,
      path: "/todo",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Link
            to="/"
            className="mr-6 flex items-center space-x-2"
            aria-label="CTOS Care"
          >
            <span className="hidden font-bold sm:inline-block">CTOS Care</span>
          </Link>
          <div className="flex items-center space-x-4 md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`hidden items-center space-x-2 md:flex ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <span className="sr-only">View notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No notifications
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-2 rounded-lg ${
                            notification.read ? "bg-gray-50" : "bg-blue-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <p className="text-xs text-gray-500">{notification.message}</p>
                              <span className="text-xs text-gray-400">
                                {new Date(notification.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <span className="sr-only">Mark as read</span>
                                  <Bell className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:text-red-600"
                                onClick={() => clearNotification(notification.id)}
                              >
                                <span className="sr-only">Remove notification</span>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
