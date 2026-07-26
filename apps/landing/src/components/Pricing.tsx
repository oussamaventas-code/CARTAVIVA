import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Gratis',
    price: '0 €',
    period: '/mes',
    description: 'Para probar CartaViva en un solo restaurante.',
    features: [
      '1 carta digital',
      'Hasta 20 platos',
      '2 códigos QR',
      '1 idioma',
    ],
    cta: 'Empieza gratis',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '19 €',
    period: '/mes',
    description: 'Para restaurantes que quieren la carta al completo.',
    features: [
      'Carta y platos ilimitados',
      'Códigos QR ilimitados',
      'Idiomas ilimitados',
      'Marca personalizada',
      'Analíticas de la carta',
    ],
    cta: 'Probar 14 días gratis',
    highlighted: true,
  },
  {
    name: 'Negocio',
    price: '49 €',
    period: '/mes',
    description: 'Para grupos con varios restaurantes o locales.',
    features: [
      'Todo lo de Pro',
      'Varios restaurantes',
      'Roles y permisos de equipo',
      'Soporte prioritario',
    ],
    cta: 'Hablar con ventas',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="precios" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Precios simples, sin sorpresas
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Elige el plan que se ajuste al tamaño de tu restaurante. Cambia o
            cancela cuando quieras.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? 'border-blue-600 shadow-xl ring-1 ring-blue-600'
                  : 'border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-block w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Más popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-8 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
