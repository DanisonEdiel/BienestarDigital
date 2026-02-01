"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    content: "Desde que uso MindPause, mi productividad ha aumentado un 40%. La función de 'Modo Monje' es exactamente lo que necesitaba para estudiar sin distracciones.",
    author: "Sofía Rodríguez",
    role: "Estudiante de Medicina",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5,
  },
  {
    content: "Lo que más me gusta es que no te hace sentir culpable. Te ayuda a entender tus hábitos y a mejorarlos poco a poco. La interfaz es hermosa.",
    author: "Carlos Méndez",
    role: "Diseñador UX/UI",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5,
  },
  {
    content: "Increíble cómo una app tan sencilla puede tener tanto impacto en mi bienestar mental. Duermo mejor desde que controlo mi uso nocturno.",
    author: "Ana García",
    role: "Arquitecta",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50/50 dark:bg-[#0F1115]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-primary tracking-wider uppercase mb-3">Testimonios</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Lo que dicen nuestros <span className="text-primary">usuarios</span>
            </h3>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-[#1B1E24] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
