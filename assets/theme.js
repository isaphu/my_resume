// Theme: persistent across pages using localStorage
// Applies saved theme and wires the toggle. Works with #themeToggle or #theme-button.
// If the button contains <i> with Remix Icon, it swaps ri-moon-line/ri-sun-line.

(function initThemeEarlyMirror(){
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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

function findToggleBtn(){
  return document.getElementById('themeToggle') || document.getElementById('theme-button');
}

function updateToggleUI(){
  var btn = findToggleBtn();
  if (!btn) return;

  var isDark = currentTheme() === 'dark';
  btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');

  // If there is an icon element inside, prefer swapping icon classes
  var iconEl = btn.querySelector('i');
  if (iconEl) {
    iconEl.classList.remove('ri-moon-line','ri-sun-line');
    iconEl.classList.add(isDark ? 'ri-sun-line' : 'ri-moon-line'); // show the opposite action
  } else {
    // Fallback: text emoji
    btn.textContent = isDark ? '🌜' : '🌞';
  }

  btn.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
}

window.addEventListener('DOMContentLoaded', function(){
  updateToggleUI();
  var btn = findToggleBtn();
  if (btn) {
    btn.addEventListener('click', function(){
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }
});

// Keep multiple tabs/windows in sync
window.addEventListener('storage', function(e){
  if (e.key === 'theme' && e.newValue) applyTheme(e.newValue);
});
