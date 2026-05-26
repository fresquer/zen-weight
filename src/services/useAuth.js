import { ref } from 'vue'
import { supabase } from './supabaseClient'

const user = ref(null)
const isAuthenticated = ref(false)
const isAuthReady = ref(false)

let sessionPromise = null
let authListener = null

const setSession = (session) => {
  user.value = session?.user || null
  isAuthenticated.value = Boolean(session?.user)
}

const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error

  setSession(data.session)
  isAuthReady.value = true
  return data.session
}

const initAuth = () => {
  if (!sessionPromise) {
    sessionPromise = checkSession()

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      isAuthReady.value = true
    })

    authListener = data.subscription
  }

  return sessionPromise
}

export function useAuth() {
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await checkSession()
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await checkSession()
  }

  const registerUser = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    await checkSession()
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  return {
    user,
    isAuthenticated,
    isAuthReady,
    authListener,
    initAuth,
    login,
    logout,
    registerUser,
    resetPassword,
    updatePassword,
    checkSession,
  }
}
