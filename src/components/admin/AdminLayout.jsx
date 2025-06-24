
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { LayoutDashboard, FileText, BarChart2, Settings, LogOut, ChevronDown, Menu, Sun, Moon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/contexts/ThemeContext';


const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Content', icon: FileText, path: '/admin/content' },
    { name: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };
  
  const navItemVariants = {
    open: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    closed: { opacity: 0, x: -20, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <>
      <motion.div
        variants={sidebarVariants}
        initial={false} 
        animate={isOpen ? "open" : "closed"}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white transform md:relative md:translate-x-0 md:block ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}
        style={{ transition: 'transform 0.3s ease-in-out' }}
      >
        <div className="p-6 flex flex-col h-full">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 mb-10">
            <img-replace src="https://example.com/logo_malawi_admin_dark.png" alt="Malawi Admin Logo" className="h-10 w-auto rounded-full bg-white p-1" />
            <span className="text-2xl font-semibold text-white">Admin Panel</span>
          </Link>
          
          <motion.nav variants={navItemVariants} className="flex-grow">
            {navItems.map((item) => (
              <motion.div key={item.name} variants={itemVariants}>
                <NavLink
                  to={item.path}
                  onClick={window.innerWidth < 768 ? toggleSidebar : undefined}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${isActive ? 'bg-green-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
          
          <motion.div variants={itemVariants} className="mt-auto">
            <Link to="/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
               <ExternalLink className="h-5 w-5" />
              <span>View Public Site</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar}></div>}
    </>
  );
};

const Header = ({ toggleSidebar, user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      localStorage.removeItem('adminUser');
       const logoutEvent = new CustomEvent('adminAuthChanged', { detail: { session: null } });
       window.dispatchEvent(logoutEvent);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      navigate('/admin/login');
    }
  };

  const getInitials = (email) => {
    if (!email) return 'A';
    const parts = email.split('@')[0];
    return parts.substring(0, 2).toUpperCase();
  }

  return (
    <header className="bg-card shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" onClick={toggleSidebar} className="md:hidden mr-2 text-foreground/70">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground hidden md:block">Tech Explorer Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground/70" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center space-x-2 p-1 rounded-full">
                  <Avatar className="h-9 w-9">
                     <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || 'Admin'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium text-foreground">
                    {user?.email || 'Admin User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-700/20 dark:focus:text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};


const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // Open by default on larger screens
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
      }
    };
    fetchUser();
    
    const handleAuthChange = (event) => {
      setCurrentUser(event.detail.session?.user || null);
    };
    window.addEventListener('adminAuthChanged', handleAuthChange);

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('adminAuthChanged', handleAuthChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} user={currentUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
