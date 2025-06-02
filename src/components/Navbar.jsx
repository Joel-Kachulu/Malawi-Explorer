
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'History', path: '/history' },
    { name: 'Places', path: '/places' },
  ];

  const navVariants = {
    open: { opacity: 1, height: 'auto', transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
    closed: { opacity: 0, height: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const itemVariants = {
    open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
    closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } },
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img-replace src="/logo-malawi.png" alt="Malawi Explorer Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-primary">Malawi Explorer</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors duration-300 hover:text-primary ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground/70'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-6 w-6 text-foreground/70 hover:text-primary" /> : <Sun className="h-6 w-6 text-foreground/70 hover:text-primary" />}
            </Button>
          </div>

          <div className="md:hidden flex items-center">
             <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-6 w-6 text-foreground/70 hover:text-primary" /> : <Sun className="h-6 w-6 text-foreground/70 hover:text-primary" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isOpen ? <X className="h-7 w-7 text-primary" /> : <Menu className="h-7 w-7 text-foreground/70" />}
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        variants={navVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="md:hidden overflow-hidden bg-background/95 shadow-lg"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <motion.div variants={itemVariants} key={item.name}>
              <NavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-primary/10 hover:text-primary ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-foreground/80'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
