import { ref, watch } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './useAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);
export function useUserSettings() {
  const { user } = useAuth();
  const settings = ref({});

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

    settings.value = data || {};
  };

  watch(user, async (newUser) => {
    if (newUser) {
      await fetchSettings();
    }
  });

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

    await fetchSettings();
  };

  return {
    settings,
    fetchSettings,
    updateSettings,
  };
}
