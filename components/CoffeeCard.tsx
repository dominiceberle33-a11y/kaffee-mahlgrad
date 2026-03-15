'use client'

import { useState, useTransition } from 'react'
import { deleteCoffee } from '@/app/actions/coffee'
import { Coffee } from '@/lib/supabase'
import CoffeeForm from './CoffeeForm'

type Props = {
  coffee: Coffee
}

export default function CoffeeCard({ coffee }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`"${coffee.name}" wirklich löschen?`)) return
    startTransition(async () => {
      await deleteCoffee(coffee.id)
    })
  }

  const mahlgradPercent = ((coffee.mahlgrad - 1) / 9) * 100

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
        <CoffeeForm coffee={coffee} onDone={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-900 text-base truncate">{coffee.name}</h3>
          {coffee.roaster && (
            <p className="text-sm text-stone-500 mt-0.5">{coffee.roaster}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
            title="Bearbeiten"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Löschen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-stone-500">Mahlgrad</span>
          <span className="text-2xl font-bold text-amber-700 tabular-nums">{coffee.mahlgrad}</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-700 rounded-full transition-all"
            style={{ width: `${mahlgradPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-400 mt-1">
          <span>fein</span>
          <span>grob</span>
        </div>
      </div>

      {coffee.notizen && (
        <p className="mt-3 text-sm text-stone-600 bg-stone-50 rounded-lg px-3 py-2 italic">
          {coffee.notizen}
        </p>
      )}

      <p className="mt-3 text-xs text-stone-400">
        Aktualisiert: {new Date(coffee.updated_at).toLocaleDateString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        })}
      </p>
    </div>
  )
}
