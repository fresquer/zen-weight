import { ref, watch } from 'vue'
import { useAuth } from './useAuth'
import { supabase } from './supabaseClient'

const settings = ref({})

export function useUserSettings() {
  const { user, checkSession } = useAuth()

  const requireUser = async () => {
    if (!user.value) await checkSession()
    if (!user.value) throw new Error('Not authenticated')
    return user.value
  }

  const fetchSettings = async () => {
    const currentUser = await requireUser()

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (error) throw error

    settings.value = data || {}
    return settings.value
  }

  watch(user, async (newUser) => {
    if (newUser) {
      await fetchSettings()
    } else {
      settings.value = {}
    }
  })

  const updateSettings = async (newSettings) => {
    const currentUser = await requireUser()

    const { error } = await supabase
      .from('settings')
      .upsert({ user_id: currentUser.id, ...newSettings }, { onConflict: 'user_id' })

    if (error) throw error

    await fetchSettings()
  }

  return {
    settings,
    fetchSettings,
    updateSettings,
  }
}
