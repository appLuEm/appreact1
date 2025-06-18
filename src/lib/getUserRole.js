import { supabase } from './supabase';

export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error obteniendo rol:", error.message);
    return null;
  }

  return data?.rol;
}
