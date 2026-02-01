"use client";

import { motion } from "motion/react";
import { ArrowRight, Smartphone, Activity, BarChart2, Shield } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-highlight border border-primary/10 text-primary font-medium text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nuevo: Modo Monje IA
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
              Recupera tu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Atención</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
              MindPause no es solo un bloqueador. Es tu sistema operativo para una vida digital consciente, potenciado por inteligencia artificial.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
              >
                Empezar Gratis <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-surface text-foreground rounded-full font-semibold text-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-surface-highlight transition-all"
              >
                Ver Demo
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-surface border-2 border-background flex items-center justify-center overflow-hidden">
                     <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800`} />
                  </div>
                ))}
              </div>
              <p>+10,000 usuarios activos</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            className="relative flex justify-center lg:justify-end perspective-1000"
          >
            {/* Phone Mockup */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[320px] h-[640px] bg-[#121212] rounded-[3rem] border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden"
              style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            >
               {/* Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#2a2a2a] rounded-b-2xl z-20"></div>

               {/* Status Bar */}
               <div className="w-full h-12 flex justify-between items-end px-6 pb-2 text-white text-xs z-10 bg-background-dark">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-3 bg-white rounded-sm"></div>
                    <div className="w-4 h-3 bg-white rounded-sm"></div>
                  </div>
               </div>

               {/* App Content */}
               <div className="w-full h-full bg-background-dark p-6 flex flex-col font-sans text-white">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8 mt-4">
                     <div>
                       <h2 className="text-lg font-bold">Hola, Alex</h2>
                       <p className="text-gray-400 text-xs">Domingo, 14 Ene</p>
                     </div>
                     <div className="w-10 h-10 bg-surface-dark rounded-full border border-gray-700"></div>
                  </div>

                  {/* Risk Card */}
                  <div className="w-full bg-surface-dark rounded-3xl p-6 mb-6 relative overflow-hidden border border-gray-800">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Riesgo de Bloqueo</p>
                          <h3 className="text-3xl font-bold text-white mt-1">84%</h3>
                        </div>
                        <div className="p-2 bg-red-500/10 rounded-full">
                          <Activity size={20} className="text-red-500" />
                        </div>
                     </div>
                     <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "84%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-red-500" 
                        />
                     </div>
                     <p className="text-xs text-gray-500 mt-3">Alto riesgo de uso compulsivo detectado.</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-surface-dark p-4 rounded-2xl border border-gray-800">
                        <BarChart2 className="text-primary mb-2" size={20} />
                        <div className="text-xl font-bold">4h 12m</div>
                        <div className="text-xs text-gray-500">Tiempo en Pantalla</div>
                     </div>
                     <div className="bg-surface-dark p-4 rounded-2xl border border-gray-800">
                        <Shield className="text-green-500 mb-2" size={20} />
                        <div className="text-xl font-bold">98%</div>
                        <div className="text-xs text-gray-500">Salud Digital</div>
                     </div>
                  </div>

                  {/* App List */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-400">Apps más usadas</p>
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-surface-dark rounded-xl border border-gray-800">
                         <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg ${i === 1 ? 'bg-pink-500' : 'bg-black'} flex items-center justify-center text-xs`}>
                             {i === 1 ? 'IG' : 'TT'}
                           </div>
                           <div>
                             <p className="text-sm font-medium">Instagram</p>
                             <p className="text-xs text-gray-500">2h 14m</p>
                           </div>
                         </div>
                         <div className="text-xs text-red-400 font-medium">
                           Critico
                         </div>
                      </div>
                    ))}
                  </div>

               </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/4 -left-12 bg-surface p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 max-w-[180px]"
            >
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <span className="text-xs font-semibold text-foreground">Modo Monje</span>
               </div>
               <p className="text-xs text-gray-500">Notificaciones silenciadas por 2 horas.</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-1/4 -right-6 bg-surface p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-20"
            >
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    🎉
                 </div>
                 <div>
                   <p className="text-sm font-bold text-foreground">Objetivo Cumplido</p>
                   <p className="text-xs text-gray-500">-30% uso de redes</p>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
