import { Pencil, Trash2 } from 'lucide-react'
import { useWeightStore } from '@/store/weightStore'
import { useSettingsStore } from '@/store/settingsStore'
import { formatDate, getTimeFromTimestamp } from '@/utils/dates'
import { toDisplay } from '@/utils/weight'

export function WeightList({ onEdit }) {
  const { weights, deleteWeight } = useWeightStore()
  const unit = useSettingsStore((s) => s.settings?.unit ?? 'kg')

  async function handleDelete(id) {
    if (!window.confirm('Delete this entry?')) return
    try {
      await deleteWeight(id)
    } catch {
      /* no-op */
    }
  }

  if (!weights.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-gray-400">No entries yet.</p>
        <p className="mt-1 text-xs text-gray-300">Tap + to log your first weight.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {weights.map((w) => (
        <div key={w.id} className="flex items-center justify-between gap-3 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{formatDate(w.date)}</p>
            <p className="text-xs text-gray-400">{getTimeFromTimestamp(w.date)}</p>
            {w.note && (
              <p className="mt-0.5 truncate text-xs text-gray-400 italic">{w.note}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-semibold tabular-nums text-gray-900">
              {toDisplay(Number(w.weight), unit).toFixed(1)}
              <span className="ml-1 text-xs font-normal text-gray-400">{unit}</span>
            </span>
            <button
              onClick={() => onEdit({ id: w.id, value: w.weight, date: w.date, note: w.note })}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => handleDelete(w.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
