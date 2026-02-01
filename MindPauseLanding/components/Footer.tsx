import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#0F1115] border-t border-gray-200 dark:border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="font-bold">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">MindPause</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Tu compañero digital para una vida más equilibrada y consciente. Recupera tu tiempo, mejora tu enfoque y vive el presente.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Producto</h4>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400">
              <li><Link href="#features" className="hover:text-primary transition-colors">Características</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary transition-colors">Cómo funciona</Link></li>
              <li><Link href="#testimonials" className="hover:text-primary transition-colors">Testimonios</Link></li>
              <li><Link href="#download" className="hover:text-primary transition-colors">Descargar</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Términos</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} MindPause Inc. Todos los derechos reservados.</p>
          
          <div className="flex gap-6 mt-6 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
