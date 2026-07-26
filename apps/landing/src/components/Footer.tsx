const columns = [
  {
    title: 'Producto',
    links: ['Características', 'Precios', 'Cómo funciona'],
  },
  {
    title: 'Empresa',
    links: ['Sobre nosotros', 'Contacto'],
  },
  {
    title: 'Legal',
    links: ['Privacidad', 'Términos', 'Cookies'],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <span className="text-xl font-bold tracking-wider text-slate-900">
              Carta<span className="text-blue-500">Viva</span>
            </span>
            <p className="mt-3 text-sm text-slate-500">
              Cartas digitales con código QR para restaurantes.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-slate-900">
                {column.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-900"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} CartaViva. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
