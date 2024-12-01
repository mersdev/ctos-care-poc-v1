import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  ListTodo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/dashboard',
    },
    {
      label: 'Credit Report',
      icon: <CreditCard className="h-4 w-4" />,
      path: '/credit-report',
    },
    {
      label: 'Chat',
      icon: <MessageSquare className="h-4 w-4" />,
      path: '/chat',
    },
    {
      label: 'Todo',
      icon: <ListTodo className="h-4 w-4" />,
      path: '/todo',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-16 left-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-200 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="px-4 py-6">
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
