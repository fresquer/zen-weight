import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAuth } from '@/services/useAuth'
import { supabase } from '@/services/supabaseClient'

export const useWeightStore = defineStore('weightStore', () => {
  const { user, checkSession } = useAuth()

  const weights = ref([])
  const goals = ref(null)

  watch(user, (newUser) => {
    if (!newUser) {
      weights.value = []
      goals.value = null
    }
  })

  const requireUser = async () => {
    if (!user.value) await checkSession()
    if (!user.value) throw new Error('Not authenticated')
    return user.value
  }

  const fetchWeights = async () => {
    const currentUser = await requireUser()
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching weights:', error)
      throw error
    }

    weights.value = data || []
  }

  const addWeight = async ({ value, date }) => {
    const currentUser = await requireUser()
    const { error } = await supabase
      .from('weights')
      .insert([{ user_id: currentUser.id, weight: value, date }])
      .select()

    if (error) {
      console.error('Error adding weight:', error)
      throw error
    }

    await fetchWeights()
  }

  const fetchGoals = async () => {
    const currentUser = await requireUser()
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (error) throw error

    goals.value = data || null
  }

  const setGoal = async (startingWeight, targetWeight, steps = 5) => {
    const currentUser = await requireUser()
    const { error } = await supabase.from('goals').insert([
      {
        user_id: currentUser.id,
        starting_weight: startingWeight,
        target_weight: targetWeight,
        steps,
      },
    ])

    if (error) throw error

    await fetchGoals()
  }

  const editWeight = async (id, { value, date }) => {
    const currentUser = await requireUser()
    const { error } = await supabase
      .from('weights')
      .update({ weight: value, date })
      .eq('id', id)
      .eq('user_id', currentUser.id)

    if (error) throw error

    await fetchWeights()
  }

  const deleteWeight = async (id) => {
    const currentUser = await requireUser()
    const { error } = await supabase
      .from('weights')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.id)

    if (error) throw error

    await fetchWeights()
  }

  const lastRegister = async () => {
    const currentUser = await requireUser()
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error

    return data
  }

  const fetchWeightsByRange = async (range) => {
    const currentUser = await requireUser()

    const endDate = new Date()
    const startDate = new Date()

    if (range === '1w') startDate.setDate(endDate.getDate() - 7)
    else if (range === '1m') startDate.setMonth(endDate.getMonth() - 1)
    else if (range === '1y') startDate.setFullYear(endDate.getFullYear() - 1)

    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', currentUser.id)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching weights by range:', error)
      throw error
    }

    return data || []
  }

  return {
    weights,
    goals,
    fetchWeights,
    fetchWeightsByRange,
    addWeight,
    fetchGoals,
    setGoal,
    editWeight,
    deleteWeight,
    lastRegister,
  }
})
