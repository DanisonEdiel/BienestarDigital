"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 shadow-lg shadow-black/5" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                <span className="font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                MindPause
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {["Características", "Cómo funciona", "Testimonios"].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`} 
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
              
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
              >
                {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </button>

              <Link 
                href="#download" 
                className="group relative px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Smartphone size={18} />
                <span>Descargar App</span>
              </Link>
            </div>
          </div>
          
          <div className="flex md:hidden items-center gap-4">
             <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
              >
                {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#0F1115] border-b border-gray-200 dark:border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {["Características", "Cómo funciona", "Testimonios"].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5">
                <Link 
                  href="#download" 
                  className="block w-full text-center bg-primary text-white px-4 py-3 rounded-xl text-base font-bold shadow-lg shadow-primary/25"
                  onClick={() => setIsOpen(false)}
                >
                  Descargar App
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
