"use client";

import { motion } from "motion/react";
import { ArrowRight, Smartphone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Recupera el control de tu <span className="text-primary">tiempo</span> y <span className="text-primary">atención</span>.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              MindPause te ayuda a desconectar para conectar con lo que realmente importa. Monitoreo inteligente, análisis emocional y programas de desintoxicación digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
              >
                Descargar Gratis <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-text-light dark:text-white rounded-full font-semibold text-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                Ver Demo
              </motion.button>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-900" />
                ))}
              </div>
              <p>Más de 10,000 usuarios confían en MindPause</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Abstract Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
            
            {/* Phone Mockup Placeholder */}
            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20" />
              
              {/* Screen Content Simulation */}
              <div className="w-full h-full bg-background-light dark:bg-background-dark p-6 flex flex-col pt-12">
                 <div className="flex justify-between items-center mb-8">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                 </div>
                 <div className="w-2/3 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                 <div className="w-full h-40 bg-primary/10 rounded-2xl mb-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-1">84%</div>
                        <div className="text-xs text-gray-500">Riesgo de Bloqueo</div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
