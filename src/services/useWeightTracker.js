import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/services/useAuth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const useWeightStore = defineStore('weightStore', () => {
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
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', user.value.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching weights:', error);
      throw error;
    }

    weights.value = data || [];
  };

  const addWeight = async ({ value, date }) => {
    await userReady;
    const { data, error } = await supabase.from('weights').insert([
      { user_id: user.value.id, weight: value, date }
    ]).select();

    if (error) {
      console.error('Error adding weight:', error);
      throw error;
    }

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
    await supabase.from('goals').insert([
      {
        user_id: user.value.id,
        starting_weight: startingWeight,
        target_weight: targetWeight,
        steps
      }
    ]);
    await fetchGoals();
  };

  const editWeight = async (id, { value, date }) => {
    await userReady;
    await supabase
      .from('weights')
      .update({ weight: value, date })
      .eq('id', id)
      .eq('user_id', user.value.id);
    await fetchWeights();
  };

  const deleteWeight = async (id) => {
    await userReady;
    await supabase
      .from('weights')
      .delete()
      .eq('id', id)
      .eq('user_id', user.value.id);
    await fetchWeights();
  };

  const lastRegister = async () => {
    await userReady;
    const { data } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', user.value.id)
      .order('date', { ascending: false })
      .limit(1)
      .single();
    return data;
  };

  const fetchWeightsByRange = async (range) => {
    await userReady;

    const endDate = new Date();
    let startDate = new Date();

    if (range === '1w') startDate.setDate(endDate.getDate() - 7);
    else if (range === '1m') startDate.setMonth(endDate.getMonth() - 1);
    else if (range === '1y') startDate.setFullYear(endDate.getFullYear() - 1);

    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', user.value.id)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching weights by range:', error);
      throw error;
    }

    return data || [];
  };


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
    lastRegister
  };
});
