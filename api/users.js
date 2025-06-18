// api/users.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ users: data.users });
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) return res.status(500).json({ error });
    return res.status(200).json({ user: data.user });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID requerido' });

    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) return res.status(500).json({ error });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
