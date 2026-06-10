/* Theme init — runs BEFORE CSS to prevent FOUC.
   Include as inline <script> in <head> before stylesheet, OR <script src> with no defer. */
(function () {
  try {
    var stored = localStorage.getItem('ml_portal_theme');
    var theme = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
