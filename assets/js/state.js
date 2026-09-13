window.state = {
  currentRole: 'leaf',
  canTeach: false,
  authPath: 'leaf',
  currentScreen: 'home',
  growthProgress: {
    learned: false,
    shared: false,
    helped: false
  },
  ui: {
    toastTimer: null,
    mobileLockTimer: null,
    mobileNavTouchStartX: null
  },
  data: {
    notes: [],
    classes: [],
    questions: [],
    leaderboard: [],
    trees: [],
    students: [],
    quickNotes: {
      leaf: [],
      tree: []
    }
  }
};

window.setState = function (patch) {
  Object.assign(window.state, patch);
};

window.updateGrowthProgress = function (nextProgress) {
  window.state.growthProgress = { ...window.state.growthProgress, ...nextProgress };
};
