import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { useWeightStore } from '@/store/weightStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toLocalDateString, toLocalTimeString } from '@/utils/dates'

export function WeightForm({ open, onClose, editingEntry }) {
  const { addWeight, editWeight, lastRegister } = useWeightStore()

  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(toLocalDateString())
  const [time, setTime] = useState(toLocalTimeString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reset = useCallback(async () => {
    setDate(toLocalDateString())
    setTime(toLocalTimeString())
    setError('')
    if (!editingEntry) {
      try {
        const last = await lastRegister()
        setWeight(last ? String(last.weight) : '')
      } catch {
        setWeight('')
      }
    }
  }, [editingEntry, lastRegister])

  useEffect(() => {
    if (open) {
      if (editingEntry) {
        setWeight(String(editingEntry.value))
        setDate(editingEntry.date?.split('T')[0] ?? toLocalDateString())
        setTime(editingEntry.date?.split('T')[1]?.slice(0, 5) ?? toLocalTimeString())
        setError('')
      } else {
        reset()
      }
    }
  }, [open, editingEntry, reset])

  async function handleSubmit(e) {
    e.preventDefault()
    const parsed = Number(weight)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Enter a valid weight.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formattedDate = `${date}T${time}:00`
      if (editingEntry) {
        await editWeight(editingEntry.id, { value: parsed, date: formattedDate })
      } else {
        await addWeight({ value: parsed, date: formattedDate })
      }
      onClose()
    } catch {
      setError('Failed to save. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 md:flex md:items-center md:justify-center"
        onClick={onClose}
      />

      {/* Sheet: slides from bottom on mobile, centered on desktop */}
      <div
        className="fixed bottom-0 inset-x-0 z-50 rounded-t-2xl bg-white p-5 md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {editingEntry ? 'Edit entry' : 'Log weight'}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">One calm entry at a time.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Weight input */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Weight
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.0"
                required
                className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-4 pr-14 text-3xl font-mono font-semibold tabular-nums text-gray-900 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-gray-400">
                kg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              id="weight-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              id="weight-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Saving…' : editingEntry ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
