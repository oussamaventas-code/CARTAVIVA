export function CTA() {
  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Moderniza la carta de tu restaurante hoy
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Únete a los restaurantes que ya han dejado atrás las cartas de
          papel.
        </p>
        <a
          href="#precios"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500"
        >
          Empieza gratis
        </a>
      </div>
    </section>
  );
}
