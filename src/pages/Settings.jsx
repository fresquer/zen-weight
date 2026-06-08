import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const strategies = [
  { value: 'last_weight', label: 'Last entry', description: 'Use the most recent weigh-in.' },
  { value: 'moving_average', label: '7-day average', description: 'Smooth out daily noise.' },
  { value: 'lowest_weight', label: 'Lowest weight', description: 'Track your personal best.' },
]

export function Settings() {
  const { logout } = useAuthStore()
  const { settings, fetchSettings, updateSettings } = useSettingsStore()
  const navigate = useNavigate()

  const [startingWeight, setStartingWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [goalSegments, setGoalSegments] = useState('5')
  const [strategy, setStrategy] = useState('last_weight')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    if (settings) {
      setStartingWeight(settings.starting_weight ?? '')
      setTargetWeight(settings.target_weight ?? '')
      setGoalSegments(settings.goal_segments ?? '5')
      setStrategy(settings.tracking_strategy ?? 'last_weight')
    }
  }, [settings])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateSettings({
        starting_weight: startingWeight ? Number(startingWeight) : null,
        target_weight: targetWeight ? Number(targetWeight) : null,
        goal_segments: Number(goalSegments) || 5,
        tracking_strategy: strategy,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      /* no-op */
    } finally {
      setSaving(false)
    }
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

        {/* Goal */}
        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Goal
          </p>
          <div className="space-y-3">
            <Input
              label="Starting weight (kg)"
              id="starting-weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 85.0"
              value={startingWeight}
              onChange={(e) => setStartingWeight(e.target.value)}
            />
            <Input
              label="Target weight (kg)"
              id="target-weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 70.0"
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

      <div className="pt-2">
        <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
