import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import ResourceManager from '@/components/demo/ResourceManager'
import { Button } from '@/components/ui/Button'

function DemoPage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme, setTheme } = useUIStore()

  return (
    <section className="container flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 border border-border rounded-lg bg-surface shadow-sm">
        <div>
          <p className="m-0 mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
            Demo de estado global
          </p>
          <h2 className="m-0 text-2xl font-bold">Sandbox</h2>
        </div>
        <div role="group" aria-label="Controles de demo" className="flex flex-wrap gap-3">
          <Button
            type="button"
            aria-pressed={theme === 'dark'}
            aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            variant="secondary"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Tema: {theme}
          </Button>
          {isAuthenticated && (
            <Button type="button" variant="secondary" onClick={logout}>
              Salir — {user?.name ?? user?.email}
            </Button>
          )}
        </div>
      </header>

      <ResourceManager />
    </section>
  )
}

export default DemoPage
