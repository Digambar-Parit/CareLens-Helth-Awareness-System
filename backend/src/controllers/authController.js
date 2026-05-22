const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * POST /api/auth/register
 * Creates a new Supabase Auth user, then inserts a profile row.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, blood_group, allergies } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    // 1. Create the auth user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }   // stored in auth.users raw_user_meta_data
      }
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User creation failed. Please try again.' });
    }

    // 2. Insert extended profile into public.users table using admin client (bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: userId,
        name,
        email,
        age: age || null,
        blood_group: blood_group || null,
        allergies: allergies || null
      }]);

    if (profileError) {
      console.error('Profile insert error:', profileError.message);
      // Auth user was created; profile failed – non-fatal for now
    }

    res.status(201).json({
      message: 'Registration successful! Please check your email to confirm your account.',
      user: {
        id: userId,
        name,
        email
      },
      // Return the access token so frontend can log in immediately (if email confirm disabled)
      session: authData.session
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * POST /api/auth/login
 * Signs user in via Supabase Auth, returns session tokens.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }

    // Fetch extended profile
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('id, name, email, age, blood_group, allergies')
      .eq('id', data.user.id)
      .single();

    res.json({
      message: 'Login successful.',
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: profile || {
        id: data.user.id,
        name: data.user.user_metadata?.name,
        email: data.user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * POST /api/auth/logout
 * Invalidates the session on Supabase side.
 */
exports.logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();
    if (token) {
      await supabase.auth.admin?.signOut(token).catch(() => {});
    }
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * POST /api/auth/refresh
 * Refreshes the session using a refresh_token.
 */
exports.refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: 'refresh_token is required.' });

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error) return res.status(401).json({ error: 'Session refresh failed.' });

    res.json({
      token: data.session.access_token,
      refresh_token: data.session.refresh_token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/auth/profile
 * Returns the logged-in user's extended profile.
 */
exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * PATCH /api/auth/profile
 * Updates the logged-in user's extended profile.
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, age, blood_group, allergies } = req.body;

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ name, age, blood_group, allergies, updated_at: new Date().toISOString() })
      .eq('id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Profile updated successfully.', user: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
