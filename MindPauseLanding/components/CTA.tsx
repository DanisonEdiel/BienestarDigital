"use client";

import { motion } from "motion/react";
import { Apple, Smartphone } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#0F1115]">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            ¿Listo para recuperar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">tu tiempo?</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Únete a la comunidad de MindPause y empieza a construir una relación más saludable con tu tecnología hoy mismo.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="group relative overflow-hidden px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <Apple className="w-6 h-6 z-10" />
                <span className="z-10">App Store</span>
             </motion.button>
             
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="group relative overflow-hidden px-8 py-4 bg-transparent border border-white/20 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-all backdrop-blur-sm"
             >
                <Smartphone className="w-6 h-6" />
                <span>Google Play</span>
             </motion.button>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            Prueba gratuita de 14 días. Sin tarjeta de crédito requerida.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
