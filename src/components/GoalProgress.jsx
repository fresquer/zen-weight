import { useGoalProgress } from '@/hooks/useGoalProgress'
import { Card } from '@/components/ui/Card'

export function GoalProgress() {
  const {
    currentWeight,
    goalWeightStep,
    stepsCompleted,
    totalSteps,
    stepCompletionPercentage,
  } = useGoalProgress()

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Goal</p>
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {stepsCompleted}/{totalSteps} steps
        </span>
      </div>

      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400">Next milestone</p>
          <p className="mt-0.5 font-mono text-2xl font-semibold tabular-nums text-gray-900">
            {goalWeightStep !== null ? goalWeightStep.toFixed(1) : '—'}
            <span className="ml-1 text-sm font-normal text-gray-400">kg</span>
          </p>
        </div>
        <p className="font-mono text-xl font-semibold tabular-nums text-lime-600">
          {stepCompletionPercentage.toFixed(0)}%
        </p>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-lime-500 transition-all duration-500"
          style={{ width: `${stepCompletionPercentage}%` }}
        />
      </div>

      {currentWeight !== null && (
        <p className="mt-3 text-xs text-gray-400">
          Current:{' '}
          <span className="font-mono font-medium text-gray-700">
            {currentWeight.toFixed(2)} kg
          </span>
        </p>
      )}
    </Card>
  )
}
