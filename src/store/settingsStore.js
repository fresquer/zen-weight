import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './authStore'

function getUser() {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('Not authenticated')
  return user
}

export const useSettingsStore = create((set) => ({
  settings: {},
  loading: false,

  async fetchSettings() {
    const user = getUser()
    set({ loading: true })
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) throw error
    set({ settings: data ?? {}, loading: false })
  },

  async updateSettings(newSettings) {
    const user = getUser()
    const { error } = await supabase
      .from('settings')
      .upsert({ user_id: user.id, ...newSettings }, { onConflict: 'user_id' })
    if (error) throw error
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    set({ settings: data ?? {} })
  },
}))
