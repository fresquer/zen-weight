import { onMounted, ref } from 'vue';
import { createClient } from '@supabase/supabase-js';

// 🔗 Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export function useAuth() {
  const user = ref(null);
  const isAuthenticated = ref(false);

  // 🔹 Obtener sesión activa desde Supabase
  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
      return;
    }
    if (data.session) {
      user.value = data.session.user;
      isAuthenticated.value = true;
    } else {
      user.value = null;
      isAuthenticated.value = false;
    }
  };

  // 🔹 Iniciar sesión con email
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await checkSession();
  };

  // 🔹 Cerrar sesión
  const logout = async () => {
    await supabase.auth.signOut();
    await checkSession();
  };

  // 🔹 Registrar usuario
  const registerUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    await checkSession();
  };

  // 🔹 Restaurar sesión al cargar la app
  onMounted(() => {
    checkSession();
  });

  return {
    user,
    isAuthenticated,
    login,
    logout,
    registerUser,
    checkSession,
  };
}
