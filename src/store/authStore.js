import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isReady: false,

  _setSession(session) {
    set({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      isReady: true,
    })
  },

  async init() {
    const { data } = await supabase.auth.getSession()
    get()._setSession(data.session)

    supabase.auth.onAuthStateChange((_event, session) => {
      get()._setSession(session)
    })
  },

  async login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async register(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  },

  async resetPasswordEmail(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  },

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  },
}))
