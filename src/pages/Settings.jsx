import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useWeightStore } from '@/store/weightStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fromDisplay } from '@/utils/weight'
import { exportWeightsCSV } from '@/utils/export'

const strategies = [
  { value: 'last_weight', label: 'Last entry', description: 'Use the most recent weigh-in.' },
  { value: 'moving_average', label: '7-day average', description: 'Smooth out daily noise.' },
  { value: 'lowest_weight', label: 'Lowest weight', description: 'Track your personal best.' },
]

export function Settings() {
  const { logout } = useAuthStore()
  const { settings, fetchSettings, updateSettings } = useSettingsStore()
  const { weights, fetchWeights } = useWeightStore()
  const navigate = useNavigate()

  const [startingWeight, setStartingWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [goalSegments, setGoalSegments] = useState('5')
  const [strategy, setStrategy] = useState('last_weight')
  const [unit, setUnit] = useState('kg')
  const [showWeeklySummary, setShowWeeklySummary] = useState(true)
  const [showTrend, setShowTrend] = useState(true)
  const [showGoal, setShowGoal] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchWeights()
  }, [fetchSettings, fetchWeights])

  useEffect(() => {
    if (settings) {
      const u = settings.unit ?? 'kg'
      setUnit(u)
      setStartingWeight(
        settings.starting_weight != null
          ? String(
              u === 'lbs'
                ? (Number(settings.starting_weight) * 2.20462).toFixed(1)
                : Number(settings.starting_weight).toFixed(1),
            )
          : '',
      )
      setTargetWeight(
        settings.target_weight != null
          ? String(
              u === 'lbs'
                ? (Number(settings.target_weight) * 2.20462).toFixed(1)
                : Number(settings.target_weight).toFixed(1),
            )
          : '',
      )
      setGoalSegments(settings.goal_segments ?? '5')
      setStrategy(settings.tracking_strategy ?? 'last_weight')
      setShowWeeklySummary(settings.show_weekly_summary ?? true)
      setShowTrend(settings.show_trend ?? true)
      setShowGoal(settings.show_goal ?? true)
    }
  }, [settings])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateSettings({
        starting_weight: startingWeight ? fromDisplay(Number(startingWeight), unit) : null,
        target_weight: targetWeight ? fromDisplay(Number(targetWeight), unit) : null,
        goal_segments: Number(goalSegments) || 5,
        tracking_strategy: strategy,
        unit,
        show_weekly_summary: showWeeklySummary,
        show_trend: showTrend,
        show_goal: showGoal,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      /* no-op */
    } finally {
      setSaving(false)
    }
  }

  function handleExport() {
    exportWeightsCSV(weights, unit)
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-xs text-gray-400">Tune your tracking.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Tracking strategy */}
        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Current weight method
          </p>
          <div className="space-y-2">
            {strategies.map((s) => (
              <label
                key={s.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                  strategy === s.value
                    ? 'border-lime-300 bg-lime-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value={s.value}
                  checked={strategy === s.value}
                  onChange={() => setStrategy(s.value)}
                  className="mt-0.5 accent-lime-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.description}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Unit */}
        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Unit
          </p>
          <div className="flex rounded-lg border border-gray-200 p-0.5">
            {['kg', 'lbs'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  unit === u ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </Card>

        {/* Goal */}
        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Goal
          </p>
          <div className="space-y-3">
            <Input
              label={`Starting weight (${unit})`}
              id="starting-weight"
              type="number"
              step="0.1"
              min="0"
              placeholder={unit === 'lbs' ? 'e.g. 187.0' : 'e.g. 85.0'}
              value={startingWeight}
              onChange={(e) => setStartingWeight(e.target.value)}
            />
            <Input
              label={`Target weight (${unit})`}
              id="target-weight"
              type="number"
              step="0.1"
              min="0"
              placeholder={unit === 'lbs' ? 'e.g. 154.0' : 'e.g. 70.0'}
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
            />
            <Input
              label="Steps"
              id="goal-segments"
              type="number"
              min="1"
              max="20"
              placeholder="5"
              value={goalSegments}
              onChange={(e) => setGoalSegments(e.target.value)}
            />
          </div>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saved ? 'Saved' : saving ? 'Saving…' : 'Save settings'}
        </Button>
      </form>

      {/* Dashboard visibility */}
      <Card>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Dashboard
        </p>
        <div className="space-y-3">
          {[
            { label: 'Goal progress', value: showGoal, set: setShowGoal },
            { label: 'Weekly summary', value: showWeeklySummary, set: setShowWeeklySummary },
            { label: 'Trend projection', value: showTrend, set: setShowTrend },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => set((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  value ? 'bg-lime-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    value ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Export */}
      <Card>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Data
        </p>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={handleExport}
          disabled={!weights.length}
        >
          Export data (CSV)
        </Button>
      </Card>

      <div className="pt-2">
        <Button
          variant="ghost"
          className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          Sign out
        </Button>
      </div>
    </div>
  )
}
