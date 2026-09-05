"use client";

import Link from 'next/link';
import { Search, Heart, User, Layers, Camera, Sparkles, Menu, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-2xl font-bold tracking-tight transition-all duration-300"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Camera className="relative h-7 w-7 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="relative">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart
            </span>
            <span className="text-white/90">Scan</span>
            <span className="text-indigo-400">Price</span>
            <Sparkles className="inline-block h-4 w-4 ml-1 text-yellow-400 animate-pulse" />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/10 backdrop-blur-sm">
          {/* <Link 
            href="/categories" 
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10"
          >
            <Layers size={16} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Categories</span>
          </Link> */}
          <Link 
            href="/favorites" 
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10"
          >
            <Heart size={16} className="group-hover:scale-110 group-hover:fill-red-500 group-hover:text-red-500 transition-all duration-300" />
            <span>Favorites</span>
          </Link>
          <Link 
            href="/shopping" 
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10"
          >
            <ShoppingBag size={16} className="group-hover:scale-110 group-hover:fill-red-500 group-hover:text-red-500 transition-all duration-300" />
            <span>Shopping</span>
          </Link>
          <Link   
            href="/about" 
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10"
          >
            <span>About</span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20">
            <Search size={18} />
            <span className="hidden lg:inline">Search...</span>
          </button>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link 
              href="/login" 
              className="group relative px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-all duration-300"
            >
              <span className="relative z-10">Sign In</span>
              <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              href="/register" 
              className="group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <Sparkles size={14} className="animate-pulse" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:scale-105 transition-transform duration-300"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
        isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col gap-2 px-4 py-6 bg-gradient-to-b from-slate-900/95 to-indigo-950/95 border-t border-white/10">
          <Link 
            href="/categories" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <Layers size={18} />
            Categories
          </Link>
          <Link 
            href="/favorites" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <Heart size={18} />
            Favorites
          </Link>
          <Link 
            href="/about" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={18} />
            About
          </Link>
          <div className="h-px bg-white/10 my-2"></div>
          <Link 
            href="/login" 
            className="flex items-center justify-center px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}