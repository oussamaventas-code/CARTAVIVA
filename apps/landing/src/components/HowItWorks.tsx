const steps = [
  {
    number: '01',
    title: 'Crea tu carta',
    description:
      'Añade categorías y platos con fotos, precios, alérgenos y traducciones desde el panel de administración.',
  },
  {
    number: '02',
    title: 'Genera tus códigos QR',
    description:
      'Crea un QR por mesa en segundos y descárgalo listo para imprimir o pegar en tu local.',
  },
  {
    number: '03',
    title: 'Tus clientes escanean',
    description:
      'Cada cliente ve la carta al instante en su móvil, en su idioma, siempre con los precios actualizados.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Cómo funciona
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            De cero a tu carta digital funcionando en menos de 10 minutos.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <span className="text-5xl font-bold text-blue-100">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
