(function(){
  const cfg = window.appConfig && window.appConfig.supabase ? window.appConfig.supabase : null;

  const state = {
    ready: false,
    client: null,
    session: null,
    profile: null,
    initError: null
  };

  function createClient(){
    if (!cfg || !cfg.url || !cfg.anonKey) {
      state.initError = 'Supabase project URL and anon key are not configured.';
      console.warn('E-Leaf: Supabase configuration missing.', state.initError);
      return null;
    }

    try {
      return window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } catch (error) {
      state.initError = error && error.message ? error.message : 'Supabase client creation failed.';
      console.error('E-Leaf: unable to create Supabase client', error);
      return null;
    }
  }

  function setStateFromSession(session){
    state.session = session || null;
    state.ready = !!state.client;
  }

  async function fetchProfile(userId){
    if (!state.client || !userId) return null;

    try {
      const { data, error } = await state.client.from('profiles').select('*').eq('id', userId).maybeSingle();

      if (error) {
        const shouldSilence = error.code === 'PGRST205' || error.code === '42P01' || /does not exist|not found/i.test(error.message || '');
        if (!shouldSilence) {
          console.warn('E-Leaf: unable to fetch profile', error);
        }
        state.profile = null;
        return null;
      }

      state.profile = data || null;
      return data;
    } catch (error) {
      const shouldSilence = error && (error.code === 'PGRST205' || error.code === '42P01' || /does not exist|not found/i.test(error.message || ''));
      if (!shouldSilence) {
        console.warn('E-Leaf: profile lookup failed', error);
      }
      state.profile = null;
      return null;
    }
  }

  async function getSession(){
    if (!state.client) return null;

    try {
      const { data, error } = await state.client.auth.getSession();
      if (error) {
        console.warn('E-Leaf: getSession failed', error);
        return null;
      }

      setStateFromSession(data.session);
      if (data.session && data.session.user) {
        await fetchProfile(data.session.user.id);
      }

      return data.session;
    } catch (error) {
      console.warn('E-Leaf: getSession error', error);
      return null;
    }
  }

  async function signUp({ email, password, fullName }){
    if (!state.client) {
      return {
        data: null,
        error: { message: state.initError || 'Supabase is not configured.' }
      };
    }

    try {
      const { data, error } = await state.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || ''
          }
        }
      });

      if (error) {
        return { data, error };
      }

      if (data?.user?.id) {
        await fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signIn({ email, password }){
    if (!state.client) {
      return {
        data: null,
        error: { message: state.initError || 'Supabase is not configured.' }
      };
    }

    try {
      const { data, error } = await state.client.auth.signInWithPassword({ email, password });
      if (error) {
        return { data, error };
      }

      if (data?.session?.user?.id) {
        await fetchProfile(data.session.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signOut(){
    if (!state.client) {
      return { error: { message: state.initError || 'Supabase is not configured.' } };
    }

    try {
      const { error } = await state.client.auth.signOut();
      state.session = null;
      state.profile = null;
      return { error };
    } catch (error) {
      return { error };
    }
  }

  async function getProfile(userId){
    return fetchProfile(userId);
  }

  function listenForAuthChanges(callback){
    if (!state.client) return () => {};

    const { data: subscription } = state.client.auth.onAuthStateChange((event, session) => {
      setStateFromSession(session || null);
      callback && callback(event, session || null);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }

  state.client = createClient();
  state.ready = !!state.client;

  if (state.client) {
    getSession();
  }

  window.ELeafSupabase = {
    ready: state.ready,
    initError: state.initError,
    client: state.client,
    getSession,
    signUp,
    signIn,
    signOut,
    getProfile,
    listenForAuthChanges
  };
})();
