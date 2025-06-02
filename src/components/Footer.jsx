
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Malawi Explorer</h3>
            <p className="text-gray-300 mb-4">
              Discover the rich history and beautiful places of Malawi, the Warm Heart of Africa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-300 hover:text-primary transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link to="/places" className="text-gray-300 hover:text-primary transition-colors">
                  Places
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Lilongwe, Malawi</p>
            <p className="text-gray-300 mb-2">info@malawiexplorer.com</p>
            <p className="text-gray-300">+265 123 456 789</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center">
            Made with <Heart size={16} className="mx-1 text-red-500" /> for Malawi
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Malawi Explorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
