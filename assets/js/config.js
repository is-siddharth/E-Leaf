window.appConfig = {
  appName: 'E-Leaf',
  version: '2.0.0',
  environment: 'development',
  features: {
    mockMode: false,
    supabaseIntegration: true
  },
  supabase: {
    url: window.__E_LEAF_SUPABASE_URL__ || 'https://wwpdallzxleldnxzdmcf.supabase.co',
    anonKey: window.__E_LEAF_SUPABASE_ANON_KEY__ || 'sb_publishable_c5oBTXO2VqGnGGcHgGX3ng_O0bJNnLA'
  }
};
