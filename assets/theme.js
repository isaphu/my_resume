// Theme: persistent across pages using localStorage
// 1) Early inline snippet in each HTML <head> applies the saved theme BEFORE CSS loads (prevents flash)
// 2) This file wires the toggle and persists the choice until user changes it

(function initThemeEarlyMirror(){
  // This mirrors the inline head script logic so SPA-like navigations or script reloads are consistent
  try {
    var t = localStorage.getItem('theme');
    if (!t) { t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    if (t === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
  } catch(_) {}
})();

function applyTheme(next){
  if (next === 'dark') {
    document.documentElement.setAttribute('data-theme','dark');
    localStorage.setItem('theme','dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme','light');
  }
  updateToggleUI();
}

function currentTheme(){
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function updateToggleUI(){
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  var isDark = currentTheme() === 'dark';
  btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  // Optional: show the active icon/text
  btn.textContent = isDark ? '🌜' : '🌞';
  btn.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
}

window.addEventListener('DOMContentLoaded', function(){
  updateToggleUI();
  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', function(){
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }
});

// Keep multiple tabs/windows in sync
window.addEventListener('storage', function(e){
  if (e.key === 'theme' && e.newValue) {
    applyTheme(e.newValue);
  }
});
