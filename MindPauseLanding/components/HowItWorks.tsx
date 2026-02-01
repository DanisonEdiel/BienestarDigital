"use client";

import { motion } from "motion/react";
import { Download, UserPlus, Settings, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: <Download className="w-6 h-6 text-white" />,
    title: "Descarga la App",
    description: "Disponible en iOS y Android. La instalación es rápida y gratuita.",
    color: "bg-blue-500",
  },
  {
    icon: <UserPlus className="w-6 h-6 text-white" />,
    title: "Crea tu Perfil",
    description: "Configura tus metas de bienestar y personaliza tu experiencia.",
    color: "bg-purple-500",
  },
  {
    icon: <Settings className="w-6 h-6 text-white" />,
    title: "Configura Límites",
    description: "Define qué apps quieres monitorear y establece tus horarios de enfoque.",
    color: "bg-pink-500",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    title: "Recupera tu Tiempo",
    description: "Deja que MindPause gestione las distracciones mientras tú te enfocas en lo importante.",
    color: "bg-green-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-[#0F1115] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-primary tracking-wider uppercase mb-3">Cómo Funciona</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Tu camino hacia el <span className="text-primary">bienestar digital</span>
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Cuatro simples pasos para retomar el control de tu atención y tu vida.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 ring-8 ring-white dark:ring-[#0F1115]`}>
                  {step.icon}
                </div>
                
                <div className="bg-gray-50 dark:bg-[#1B1E24] p-6 rounded-2xl border border-gray-100 dark:border-white/5 w-full hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute top-0 right-1/2 translate-x-10 -translate-y-2 w-8 h-8 bg-white dark:bg-[#1B1E24] border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center font-bold text-sm text-gray-500 shadow-sm">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
