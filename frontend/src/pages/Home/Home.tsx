import heroImg from '@/assets/hero.png'

function Home() {
  return (
    <section className="container flex flex-col gap-8">
      <div className="p-10 border border-border rounded-lg bg-white/80 shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1">
            <p className="m-0 mb-3 text-xs font-bold text-primary uppercase tracking-widest">
              Base reusable
            </p>
            <h2 className="m-0 text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              Frontend con rutas, store y API listo para crecer
            </h2>
            <p className="mt-4 max-w-prose text-muted">
              Esta versión conserva la estructura original del proyecto, pero con una base limpia
              para arrancar features nuevas sin llevarse la app anterior encima.
            </p>
          </div>
          <div className="w-full lg:w-auto lg:shrink-0">
            <img
              src={heroImg}
              alt="Ilustración del stack tecnológico: React, NestJS y Tailwind CSS"
              className="w-full lg:w-72 h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="p-5 border border-border rounded-md bg-surface shadow-sm">
          <h3 className="m-0 mb-2 font-semibold">Routes</h3>
          <p className="m-0 text-muted">
            Router centralizado con layout compartido y páginas separadas.
          </p>
        </article>
        <article className="p-5 border border-border rounded-md bg-surface shadow-sm">
          <h3 className="m-0 mb-2 font-semibold">Store</h3>
          <p className="m-0 text-muted">
            Zustand para estado global ligero, persistido y fácil de extender.
          </p>
        </article>
        <article className="p-5 border border-border rounded-md bg-surface shadow-sm">
          <h3 className="m-0 mb-2 font-semibold">API</h3>
          <p className="m-0 text-muted">
            Axios + React Query para lectura, mutaciones e invalidación de caché.
          </p>
        </article>
      </div>
    </section>
  )
}

export default Home
