"use client";

import { motion } from "motion/react";

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary opacity-10 dark:opacity-5 -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para recuperar tu vida?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Únete a miles de personas que ya están mejorando su salud mental y productividad con MindPause.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-xl hover:opacity-90 transition-opacity">
                {/* Apple Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 3.98-1.54 1.29.08 2.8.52 3.76 1.89-3.23 1.95-2.66 6.36.98 7.72-.66 1.76-1.58 3.5-2.8 4.16zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                App Store
             </button>
             <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-xl hover:opacity-90 transition-opacity">
                {/* Google Play Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                Google Play
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
