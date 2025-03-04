import { ref, watch } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './useAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);
export function useUserSettings() {
  const { user } = useAuth(); // Get user from useAuth
  const settings = ref({});

  // 🔹 Fetch settings when user is available
  const fetchSettings = async () => {
    if (!user.value) return;

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.value.id)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      return;
    }

    settings.value = data || {}; // Avoid undefined in bindings
  };

  // 🔹 Watch for changes in `user` and fetch settings when it becomes available
  watch(user, async (newUser) => {
    if (newUser) {
      await fetchSettings();
    }
  });

  // 🔹 Update user settings
  const updateSettings = async (newSettings) => {
    if (!user.value) return;

    const { error } = await supabase
      .from('settings')
      .update(newSettings)
      .eq('user_id', user.value.id);

    if (error) {
      console.error('Error updating settings:', error);
      return;
    }

    await fetchSettings(); // Refresh settings after update
  };

  return {
    settings,
    fetchSettings,
    updateSettings,
  };
}
