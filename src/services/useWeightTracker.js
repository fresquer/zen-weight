import { ref, watch } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './useAuth';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export function useWeight() {
  const { user } = useAuth();
  const weights = ref([]);
  const goals = ref(null);

  let resolveUserReady;
  const userReady = new Promise((resolve) => {
    resolveUserReady = resolve;
  });

  watch(user, (newUser) => {
    if (newUser) resolveUserReady();
  });

  const fetchWeights = async () => {
    await userReady;
    const { data } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', user.value.id)
      .order('date', { ascending: false });
    weights.value = data || [];
  };

  const addWeight = async ({ value, date }) => {
    await userReady;
    await supabase.from('weights').insert([{ user_id: user.value.id, weight: value, date }]);
    await fetchWeights();
  };

  const fetchGoals = async () => {
    await userReady;
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.value.id)
      .single();
    goals.value = data || null;
  };

  const setGoal = async (startingWeight, targetWeight, steps = 5) => {
    await userReady;
    await supabase
      .from('goals')
      .insert([{ user_id: user.value.id, starting_weight: startingWeight, target_weight: targetWeight, steps }]);
    await fetchGoals();
  };

  return {
    weights,
    goals,
    fetchWeights,
    addWeight,
    fetchGoals,
    setGoal,
  };
}
