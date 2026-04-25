import React from "react";
import { Youtube, Facebook, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const XLogo = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2H21l-6.53 7.463L22 22h-5.828l-4.563-5.956L6.4 22H3.64l6.985-7.987L2 2h5.976l4.124 5.403L18.244 2zm-.968 18.25h1.527L7.146 3.654H5.507L17.276 20.25z" />
  </svg>
);

const FooterSec = () => {
  return (
    <footer className="bg-base-200/65 backdrop-blur-xl text-base-content py-16 px-4 border-t border-base-300/70">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 mb-12">
          
          {/* Company Info */}
          <div className="reveal-on-scroll reveal-up space-y-4">
            <Link 
              className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hover:from-green-500 hover:to-blue-600 transition-all cursor-pointer"
              to="/"
            >
              FarmXpress
            </Link>
            <p className="text-sm opacity-75 max-w-xs">
              Smart fleet operations for growing transport companies.
            </p>
          </div>

          {/* Contact Info */}
          <div className="reveal-on-scroll reveal-up" style={{ "--reveal-delay": "80ms" }}>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1 text-primary" />
                <span className="opacity-80">IIIT Una</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <span className="opacity-80">+91 80816 02254</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <a href="mailto:Admin@RuntimeTerror.com" className="opacity-80 hover:text-primary transition-colors duration-200">
                  22156@iiitu.ac.in
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="reveal-on-scroll reveal-up lg:justify-self-end lg:text-right" style={{ "--reveal-delay": "120ms" }}>
            <h4 className="text-lg font-semibold mb-6">Connect With Us</h4>
            <div className="flex space-x-4 lg:justify-end">
              <a href="https://x.com/iiituna" target="_blank" rel="noopener noreferrer" className="bg-base-300/70 backdrop-blur-sm p-3 rounded-full hover:bg-slate-900 hover:text-white transition-colors duration-300" aria-label="X (Twitter)">
                <XLogo className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/hashtag/iiituna" target="_blank" rel="noopener noreferrer" className="bg-base-300/70 backdrop-blur-sm p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/hashtag/iiituna" target="_blank" rel="noopener noreferrer" className="bg-base-300/70 backdrop-blur-sm p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="reveal-on-scroll pt-8" style={{ "--reveal-delay": "180ms" }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="opacity-60 text-sm">
              © {new Date().getFullYear()} FarmXpress Industries Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm opacity-60 hover:text-primary transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm opacity-60 hover:text-primary transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSec;
