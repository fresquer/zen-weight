import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './authStore'

function getUser() {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('Not authenticated')
  return user
}

export const useWeightStore = create((set, get) => ({
  weights: [],
  loading: false,

  async fetchWeights() {
    const user = getUser()
    set({ loading: true })
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    if (error) throw error
    set({ weights: data ?? [], loading: false })
  },

  async fetchWeightsByRange(range) {
    const user = getUser()
    const end = new Date()
    const start = new Date()
    if (range === '1w') start.setDate(end.getDate() - 7)
    else if (range === '1m') start.setMonth(end.getMonth() - 1)
    else if (range === '1y') start.setFullYear(end.getFullYear() - 1)

    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', start.toISOString())
      .order('date', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async addWeight({ value, date, note }) {
    const user = getUser()
    const { error } = await supabase
      .from('weights')
      .insert([{ user_id: user.id, weight: value, date, note: note || null }])
    if (error) throw error
    await get().fetchWeights()
  },

  async editWeight(id, { value, date, note }) {
    const user = getUser()
    const { error } = await supabase
      .from('weights')
      .update({ weight: value, date, note: note || null })
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) throw error
    await get().fetchWeights()
  },

  async deleteWeight(id) {
    const user = getUser()
    const { error } = await supabase
      .from('weights')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) throw error
    await get().fetchWeights()
  },

  async lastRegister() {
    const user = getUser()
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error
    return data
  },
}))
