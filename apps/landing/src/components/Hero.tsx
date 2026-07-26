import { motion } from 'framer-motion';
import { QrCode, Star } from 'lucide-react';

const dishes = [
  { name: 'Ensalada César', price: '8,50 €', tag: 'Vegetariano' },
  { name: 'Risotto de setas', price: '13,90 €', tag: 'Sin gluten' },
  { name: 'Tarta de queso', price: '5,20 €', tag: 'Popular' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-slate-900 to-slate-900" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            Cartas digitales con código QR
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            La carta de tu restaurante,{' '}
            <span className="text-blue-400">siempre actualizada</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-400">
            Crea y edita tu carta en minutos, genera códigos QR por mesa y deja
            que tus clientes la vean en su móvil en varios idiomas, sin
            imprimir nada nunca más.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#precios"
              className="rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500"
            >
              Empieza gratis
            </a>
            <a
              href="#como-funciona"
              className="rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
              Ver cómo funciona
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Sin tarjeta de crédito · Configuración en menos de 10 minutos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="rounded-3xl border border-slate-700 bg-slate-800/60 p-3 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Restaurante
                  </p>
                  <p className="font-bold text-slate-900">La Buena Mesa</p>
                </div>
                <QrCode className="h-9 w-9 text-slate-300" />
              </div>

              <ul className="mt-4 space-y-3">
                {dishes.map((dish) => (
                  <li
                    key={dish.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {dish.name}
                      </p>
                      <p className="text-xs text-slate-500">{dish.tag}</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {dish.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="absolute -right-4 -top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-lg">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-900">4,9</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
