"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full z-50 top-0 left-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary dark:text-white">
              MindPause
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#features" className="hover:text-primary transition-colors duration-300">Características</Link>
              <Link href="#how-it-works" className="hover:text-primary transition-colors duration-300">Cómo funciona</Link>
              <Link href="#download" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full transition-colors duration-300">
                Descargar App
              </Link>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-background-light dark:bg-background-dark"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#features" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Características</Link>
            <Link href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Cómo funciona</Link>
            <Link href="#download" className="block w-full text-center bg-primary text-white px-3 py-2 rounded-md text-base font-medium">Descargar App</Link>
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary flex items-center gap-2"
              >
                {mounted && (theme === "dark" ? <><Sun size={20} /> Modo Claro</> : <><Moon size={20} /> Modo Oscuro</>)}
              </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
