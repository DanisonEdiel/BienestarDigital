export default function Footer() {
  return (
    <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">MindPause</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Tu compañero digital para una vida más equilibrada y consciente. Recupera tu tiempo, mejora tu enfoque.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary">Características</a></li>
              <li><a href="#" className="hover:text-primary">Precios</a></li>
              <li><a href="#" className="hover:text-primary">Testimonios</a></li>
              <li><a href="#" className="hover:text-primary">Descargar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary">Privacidad</a></li>
              <li><a href="#" className="hover:text-primary">Términos</a></li>
              <li><a href="#" className="hover:text-primary">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MindPause Inc. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social Icons placeholders */}
            <div className="w-5 h-5 bg-gray-300 rounded-full" />
            <div className="w-5 h-5 bg-gray-300 rounded-full" />
            <div className="w-5 h-5 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
