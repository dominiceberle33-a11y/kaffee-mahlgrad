'use client'

import { useRef, useState, useTransition } from 'react'
import { addCoffee, updateCoffee } from '@/app/actions/coffee'
import { Coffee } from '@/lib/supabase'

type Props = {
  coffee?: Coffee
  onDone?: () => void
}

export default function CoffeeForm({ coffee, onDone }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!coffee

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        if (isEdit && coffee) {
          await updateCoffee(coffee.id, formData)
        } else {
          await addCoffee(formData)
          formRef.current?.reset()
        }
        onDone?.()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Fehler beim Speichern')
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Kaffee Name *
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={coffee?.name}
            placeholder="z.B. Ethiopia Yirgacheffe"
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Rösterei
          </label>
          <input
            name="roaster"
            type="text"
            defaultValue={coffee?.roaster ?? ''}
            placeholder="z.B. Five Elephant"
            className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Mahlgrad *
          <span className="ml-1 text-xs font-normal text-stone-500">(1 = sehr fein, 10 = sehr grob)</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            name="mahlgrad"
            type="range"
            min="1"
            max="10"
            step="0.5"
            defaultValue={coffee?.mahlgrad ?? 5}
            className="flex-1 accent-amber-600"
            id="mahlgrad-range"
            onChange={(e) => {
              const display = document.getElementById('mahlgrad-display')
              if (display) display.textContent = e.target.value
            }}
          />
          <span
            id="mahlgrad-display"
            className="w-10 text-center font-bold text-amber-700 text-lg tabular-nums"
          >
            {coffee?.mahlgrad ?? 5}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Notizen
        </label>
        <textarea
          name="notizen"
          defaultValue={coffee?.notizen ?? ''}
          placeholder="z.B. Sehr gute Extraktion bei 9 Bar, Brühzeit 27s..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <div className="flex gap-2 justify-end">
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Abbrechen
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isPending ? 'Speichert...' : isEdit ? 'Speichern' : '+ Hinzufügen'}
        </button>
      </div>
    </form>
  )
}
