import Link from 'next/link';
import { Camera, Heart, Layers, Search, Mail } from 'lucide-react';
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="group flex items-center gap-2 text-2xl font-bold tracking-tight transition-all duration-300"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Camera className="relative h-6 w-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Smart
                </span>
                <span className="text-white/90">Scan</span>
                <span className="text-indigo-400">Price</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Smart price comparison tool to help you find the best deals across the web.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <Link 
                href="#" 
                className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <FaGithub size={18} />
              </Link>
              <Link 
                href="#" 
                className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={18} />
              </Link>
              <Link 
                href="#" 
                className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <FaInstagram size={18} />
              </Link>
              <Link 
                href="#" 
                className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <Mail size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Search
                </Link>
              </li>
              <li>
                <Link 
                  href="/favorites" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-white/50 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Stay Updated */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Subscribe to get the latest updates and deals.
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
              />
              <button className="group relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Subscribe
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:scale-105 transition-transform duration-300"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} SmartScanPrice. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="#" 
              className="text-white/30 hover:text-indigo-400 transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link 
              href="#" 
              className="text-white/30 hover:text-indigo-400 transition-colors duration-300"
            >
              Terms
            </Link>
            <Link 
              href="#" 
              className="text-white/30 hover:text-indigo-400 transition-colors duration-300"
            >
              Cookies
            </Link>
            <span className="text-white/20 flex items-center gap-2">
              <Heart size={14} className="text-red-500/50 animate-pulse" />
              Made with love
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}