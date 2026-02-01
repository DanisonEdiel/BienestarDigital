"use client";

import { motion } from "motion/react";
import { Activity, Brain, Shield, Clock, BarChart, Smile, Zap, Lock, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Activity className="w-6 h-6 text-white" />,
    title: "Monitoreo en Tiempo Real",
    description: "Detectamos patrones de uso compulsivo al instante mediante análisis de velocidad de scroll y taps.",
    gradient: "from-blue-500 to-cyan-400",
    delay: 0,
  },
  {
    icon: <Smile className="w-6 h-6 text-white" />,
    title: "Bienestar Emocional",
    description: "Correlaciona tu estado de ánimo con tu actividad digital para identificar detonantes de ansiedad.",
    gradient: "from-orange-500 to-amber-400",
    delay: 0.1,
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    title: "Modo Monje",
    description: "Bloqueo estricto de aplicaciones distractoras cuando necesitas concentración absoluta.",
    gradient: "from-green-500 to-emerald-400",
    delay: 0.2,
  },
  {
    icon: <Brain className="w-6 h-6 text-white" />,
    title: "Insights con IA",
    description: "Recibe recomendaciones personalizadas basadas en tu comportamiento y psicología conductual.",
    gradient: "from-purple-500 to-violet-400",
    delay: 0.3,
  },
  {
    icon: <Clock className="w-6 h-6 text-white" />,
    title: "Límites Inteligentes",
    description: "Alertas sutiles y progresivas antes de que pierdas la noción del tiempo en redes sociales.",
    gradient: "from-pink-500 to-rose-400",
    delay: 0.4,
  },
  {
    icon: <BarChart className="w-6 h-6 text-white" />,
    title: "Dashboard Detallado",
    description: "Visualiza tu progreso con métricas claras: tiempo en pantalla, desbloqueos y tendencias.",
    gradient: "from-indigo-500 to-blue-600",
    delay: 0.5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20
    }
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-gray-50/50 dark:bg-[#0F1115]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-primary tracking-wider uppercase mb-3">Características</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Todo lo que necesitas para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">bienestar digital</span>
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              MindPause combina tecnología avanzada y psicología para ayudarte a construir hábitos saludables sin fricción.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white dark:bg-[#1B1E24] p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                 {/* Decorative background icon */}
                 <div className="transform scale-150 text-current dark:text-white">
                   {feature.icon}
                 </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
