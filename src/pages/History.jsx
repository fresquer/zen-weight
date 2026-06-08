import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useWeightStore } from '@/store/weightStore'
import { WeightList } from '@/components/WeightList'
import { Card } from '@/components/ui/Card'

export function History() {
  const { fetchWeights } = useWeightStore()
  const { openEdit } = useOutletContext()

  useEffect(() => { fetchWeights() }, [fetchWeights])

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">History</h2>
        <p className="text-xs text-gray-400">All your entries, latest first.</p>
      </div>
      <Card className="px-0 py-0 overflow-hidden">
        <div className="px-5 py-1">
          <WeightList onEdit={openEdit} />
        </div>
      </Card>
    </div>
  )
}
