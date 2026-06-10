"use client";

import ScrollLink from "@/components/ScrollLink";

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP

  return (
    <footer className="bg-text-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-coffee rounded-lg flex items-center justify-center font-bold text-lg">
                M
              </div>
              <span className="font-bold text-lg">Raíz y Mimbre</span>
            </div>
            <p className="text-gray-400 text-sm">
              Artesanía en mimbre hecha a mano con pasión y diseño premium.
            </p>
          </div>

          {/* Enlaces */}
          <div className="space-y-3">
            <h4 className="font-semibold text-coffee">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <ScrollLink
                  href="/#inicio"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Inicio
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  href="/#productos"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Productos
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  href="/#servicios"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Servicios
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  href="/#nosotros"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Nosotros
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  href="/#contacto"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Contacto
                </ScrollLink>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div className="space-y-3">
            <h4 className="font-semibold text-coffee">Información</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  Cambios y Devoluciones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <h4 className="font-semibold text-coffee">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.289-3.795 6.233-1.976 9.038 1.819 2.804 5.061 3.514 8.115 1.224.822-.613 1.357-1.290 1.75-2.051h.005c.446 1.112-.181 2.557-1.397 3.273-1.216.715-3.093.704-4.235-.125-1.144-.828-1.707-2.298-1.25-3.562.457-1.263 1.775-1.972 3.069-1.75 1.294.22 2.216 1.244 2.216 2.543 0 1.299-.917 2.323-2.216 2.543-1.294.22-2.612-.487-3.069-1.75m13.573-4.916c-.066.17-.12.36-.12.55 0 .825.67 1.495 1.495 1.495s1.495-.67 1.495-1.495-.67-1.495-1.495-1.495c-.19 0-.38.054-.55.12m0 0" />
                  </svg>
                  {whatsappPhone}
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@mimbrestore.cl"
                  className="text-gray-400 hover:text-coffee transition-colors"
                >
                  contacto@mimbrestore.cl
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-700 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Raíz y Mimbre. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-coffee transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110 2.881 1.44 1.44 0 010-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-coffee transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
