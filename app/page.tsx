import { getCoffees } from '@/app/actions/coffee'
import CoffeeCard from '@/components/CoffeeCard'
import AddCoffeePanel from '@/components/AddCoffeePanel'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let coffees: Awaited<ReturnType<typeof getCoffees>> = []
  let dbError = false

  try {
    coffees = await getCoffees()
  } catch {
    dbError = true
  }

  return (
    <main className="min-h-screen" style={{ background: '#faf7f4' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">☕</span>
            <h1 className="text-2xl font-bold text-stone-900">Mahlgrad Tracker</h1>
          </div>
          <p className="text-stone-500 text-sm ml-12">
            Siebträger · Mahlgrade im Überblick
          </p>
        </div>

        {/* DB Error Banner */}
        {dbError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <strong>Supabase nicht verbunden.</strong> Bitte füge die Umgebungsvariablen in{' '}
            <code className="bg-red-100 px-1 rounded">.env.local</code> ein und verbinde mit deiner Supabase-Datenbank.
          </div>
        )}

        {/* Add Coffee */}
        {!dbError && (
          <div className="mb-6">
            <AddCoffeePanel />
          </div>
        )}

        {/* Coffee List */}
        {!dbError && coffees.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-3">☕</div>
            <p className="text-sm">Noch keine Kaffees eingetragen.</p>
            <p className="text-sm">Fang oben an!</p>
          </div>
        )}

        {!dbError && coffees.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-1">
              {coffees.length} {coffees.length === 1 ? 'Kaffee' : 'Kaffees'}
            </p>
            {coffees.map((coffee) => (
              <CoffeeCard key={coffee.id} coffee={coffee} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
