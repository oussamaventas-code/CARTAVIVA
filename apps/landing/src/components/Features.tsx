import {
  UtensilsCrossed,
  QrCode,
  Languages,
  Palette,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Editor de carta visual',
    description:
      'Organiza categorías y platos arrastrando y soltando. Cambios en tiempo real, sin esperar a la próxima impresión.',
  },
  {
    icon: QrCode,
    title: 'QR por mesa',
    description:
      'Genera un código QR único para cada mesa y descárgalo listo para imprimir. Sigue cuántas veces se escanea cada uno.',
  },
  {
    icon: Languages,
    title: 'Multi-idioma',
    description:
      'Traduce cada plato a los idiomas que necesites. Tus clientes ven la carta en su propio idioma automáticamente.',
  },
  {
    icon: Palette,
    title: 'Marca personalizada',
    description:
      'Ajusta colores, tipografía y bordes para que la carta digital tenga la identidad visual de tu restaurante.',
  },
  {
    icon: ShieldCheck,
    title: 'Alérgenos claros',
    description:
      'Marca los 14 alérgenos de la normativa europea en cada plato para que tus clientes coman con confianza.',
  },
  {
    icon: BarChart3,
    title: 'Analíticas de la carta',
    description:
      'Descubre qué platos y categorías se ven más, cuántos escaneos recibe cada mesa y en qué franjas horarias.',
  },
];

export function Features() {
  return (
    <section id="caracteristicas" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Todo lo que necesita tu carta digital
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Una sola herramienta para gestionar, traducir y analizar la carta
            de tu restaurante.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
