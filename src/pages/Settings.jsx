import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useWeightStore } from '@/store/weightStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fromDisplay, toDisplay } from '@/utils/weight'
import { exportWeightsCSV } from '@/utils/export'

const strategies = [
  { value: 'last_weight', label: 'Last entry', description: 'Use the most recent weigh-in.' },
  { value: 'moving_average', label: '7-day average', description: 'Smooth out daily noise.' },
  { value: 'lowest_weight', label: 'Lowest weight', description: 'Track your personal best.' },
]

function SavedChip({ visible }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-center gap-1.5 rounded-full bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg">
        <Check size={11} strokeWidth={2.5} />
        Saved
      </div>
    </div>
  )
}

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
  const [savedVisible, setSavedVisible] = useState(false)

  const loaded = useRef(false)
  const debounceTimer = useRef(null)
  const chipTimer = useRef(null)
  const stateRef = useRef({})

  useEffect(() => {
    fetchSettings()
    fetchWeights()
  }, [fetchSettings, fetchWeights])

  useEffect(() => {
    if (!settings || loaded.current) return
    const u = settings.unit ?? 'kg'
    setUnit(u)
    setStartingWeight(
      settings.starting_weight != null
        ? String(toDisplay(Number(settings.starting_weight), u).toFixed(1))
        : '',
    )
    setTargetWeight(
      settings.target_weight != null
        ? String(toDisplay(Number(settings.target_weight), u).toFixed(1))
        : '',
    )
    setGoalSegments(String(settings.goal_segments ?? 5))
    setStrategy(settings.tracking_strategy ?? 'last_weight')
    setShowWeeklySummary(settings.show_weekly_summary ?? true)
    setShowTrend(settings.show_trend ?? true)
    setShowGoal(settings.show_goal ?? true)
    loaded.current = true
  }, [settings])

  // Keep a ref in sync so the save function always reads latest values
  useEffect(() => {
    stateRef.current = {
      startingWeight, targetWeight, goalSegments,
      strategy, unit, showWeeklySummary, showTrend, showGoal,
    }
  })

  const doSave = useCallback(async () => {
    const s = stateRef.current
    try {
      await updateSettings({
        starting_weight: s.startingWeight ? fromDisplay(Number(s.startingWeight), s.unit) : null,
        target_weight: s.targetWeight ? fromDisplay(Number(s.targetWeight), s.unit) : null,
        goal_segments: Number(s.goalSegments) || 5,
        tracking_strategy: s.strategy,
        unit: s.unit,
        show_weekly_summary: s.showWeeklySummary,
        show_trend: s.showTrend,
        show_goal: s.showGoal,
      })
      clearTimeout(chipTimer.current)
      setSavedVisible(true)
      chipTimer.current = setTimeout(() => setSavedVisible(false), 2000)
    } catch {
      /* no-op */
    }
  }, [updateSettings])

  function saveNow() {
    clearTimeout(debounceTimer.current)
    doSave()
  }

  function saveDebounced() {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(doSave, 800)
  }

  function handleUnitChange(newUnit) {
    if (startingWeight) {
      const kg = fromDisplay(Number(startingWeight), unit)
      setStartingWeight(toDisplay(kg, newUnit).toFixed(1))
    }
    if (targetWeight) {
      const kg = fromDisplay(Number(targetWeight), unit)
      setTargetWeight(toDisplay(kg, newUnit).toFixed(1))
    }
    setUnit(newUnit)
    // save after state flushes
    setTimeout(saveNow, 0)
  }

  function handleStrategy(val) {
    setStrategy(val)
    setTimeout(saveNow, 0)
  }

  function handleToggle(setter) {
    setter((v) => {
      setTimeout(saveNow, 0)
      return !v
    })
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
                onChange={() => handleStrategy(s.value)}
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Unit</p>
        <div className="flex rounded-lg border border-gray-200 p-0.5">
          {['kg', 'lbs'].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => handleUnitChange(u)}
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Goal</p>
        <div className="space-y-3">
          <Input
            label={`Starting weight (${unit})`}
            id="starting-weight"
            type="number"
            step="0.1"
            min="0"
            placeholder={unit === 'lbs' ? 'e.g. 187.0' : 'e.g. 85.0'}
            value={startingWeight}
            onChange={(e) => { setStartingWeight(e.target.value); saveDebounced() }}
          />
          <Input
            label={`Target weight (${unit})`}
            id="target-weight"
            type="number"
            step="0.1"
            min="0"
            placeholder={unit === 'lbs' ? 'e.g. 154.0' : 'e.g. 70.0'}
            value={targetWeight}
            onChange={(e) => { setTargetWeight(e.target.value); saveDebounced() }}
          />
          <Input
            label="Steps"
            id="goal-segments"
            type="number"
            min="1"
            max="20"
            placeholder="5"
            value={goalSegments}
            onChange={(e) => { setGoalSegments(e.target.value); saveDebounced() }}
          />
        </div>
      </Card>

      {/* Dashboard visibility */}
      <Card>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Dashboard
        </p>
        <div className="space-y-3">
          {[
            { label: 'Goal progress', value: showGoal, setter: setShowGoal },
            { label: 'Weekly summary', value: showWeeklySummary, setter: setShowWeeklySummary },
            { label: 'Trend projection', value: showTrend, setter: setShowTrend },
          ].map(({ label, value, setter }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => handleToggle(setter)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  value ? 'bg-lime-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Data</p>
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

      <SavedChip visible={savedVisible} />
    </div>
  )
}
