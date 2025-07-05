import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Malawi Explorer Tech</h3>
            <p className="text-gray-300 mb-4">
              Your premier source for tech news, innovations, and digital trends in Malawi and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/MalawiExplorerTech" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/MalawiExplorerTech" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com/MalawiExplorerTech" className="text-gray-300 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://linkedin.com/company/MalawiExplorerTech" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:tech@malawiexplorer.com" className="text-gray-300 hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Tech Sections</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-300 hover:text-primary transition-colors">
                  Tech Evolution
                </Link>
              </li>
              <li>
                <Link to="/places" className="text-gray-300 hover:text-primary transition-colors">
                  Startups & Hubs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">
                  Tech Events
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
            <p className="text-gray-300 mb-2">Malawi Tech Explorer</p>
            <p className="text-gray-300 mb-2">hello.explorer@gmail.com</p>
            <p className="text-gray-300">+265 986 446 152</p>
            <p className="text-gray-300 mt-4 text-sm">
              Submit your startup or tech story: pitches.explorer@gmail.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center">
            Built with <Heart size={16} className="mx-1 text-red-500" /> for Malawi's Tech
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Malawi Tech Explorer. All rights reserved.
          </p>
          <p className="mt-2 text-sm">
            Covering Malawi's digital transformation since {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;