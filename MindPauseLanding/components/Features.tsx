"use client";

import { motion } from "motion/react";
import { Activity, Brain, Shield, Clock, BarChart, Smile } from "lucide-react";

const features = [
  {
    icon: <Activity className="w-6 h-6 text-white" />,
    title: "Monitoreo de Interacciones",
    description: "Rastreo de taps, scrolls y velocidad de uso para detectar patrones compulsivos en tiempo real.",
    color: "bg-blue-500",
  },
  {
    icon: <Smile className="w-6 h-6 text-white" />,
    title: "Análisis Emocional",
    description: "Conecta tu estado de ánimo con tus hábitos digitales para entender qué te genera estrés o ansiedad.",
    color: "bg-orange-500",
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    title: "Programas de Desintoxicación",
    description: "Retos guiados como el 'Modo Monje' para reducir drásticamente tu dependencia digital.",
    color: "bg-green-500",
  },
  {
    icon: <Brain className="w-6 h-6 text-white" />,
    title: "Insights Inteligentes",
    description: "Recomendaciones personalizadas basadas en tu comportamiento real y psicología conductual.",
    color: "bg-purple-500",
  },
  {
    icon: <Clock className="w-6 h-6 text-white" />,
    title: "Control de Tiempo",
    description: "Establece límites saludables y recibe alertas sutiles antes de que sea demasiado tarde.",
    color: "bg-pink-500",
  },
  {
    icon: <BarChart className="w-6 h-6 text-white" />,
    title: "Estadísticas Detalladas",
    description: "Visualiza tu progreso diario y semanal con gráficas claras y fáciles de entender.",
    color: "bg-indigo-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para tu bienestar digital</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            MindPause no es solo un bloqueador de apps. Es un sistema integral diseñado para crear hábitos saludables a largo plazo.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-md`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
