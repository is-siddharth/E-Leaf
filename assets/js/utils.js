window.ELeafUtils = {
  $: function (id) {
    return document.getElementById(id);
  },

  on: function (id, evt, handler, options = {}) {
    const el = window.ELeafUtils.$(id);
    if (!el) {
      console.warn(`E-Leaf: missing element #${id}`);
      return;
    }
    el.addEventListener(evt, function (e) {
      try {
        handler(e, el);
      } catch (err) {
        console.error(`E-Leaf handler error on #${id}`, err);
      }
    }, options);
  },

  showToast: function (message) {
    const toast = window.ELeafUtils.$('toast');
    if (!toast) return;
    const text = window.ELeafUtils.$('toastText');
    if (text) text.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  },

  escapeHtml: function (input) {
    return String(input ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  debounce: function (fn, delay = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
};

window.$ = window.ELeafUtils.$;
window.on = window.ELeafUtils.on;
window.showToast = window.ELeafUtils.showToast;
window.escapeHtml = window.ELeafUtils.escapeHtml;
window.debounce = window.ELeafUtils.debounce;
