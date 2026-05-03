// ── Year ──────────────────────────────────
document.getElementById('yr').textContent = new Date().getFullYear();

// ── Dark mode ─────────────────────────────
const html   = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const sun    = document.getElementById('icon-sun');
const moon   = document.getElementById('icon-moon');

function applyTheme(dark) {
  html.classList.toggle('dark', dark);
  toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  toggle.setAttribute('aria-pressed', String(dark));
  sun.classList.toggle('hidden', !dark);
  moon.classList.toggle('hidden', dark);
}

const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(stored === 'dark' || (!stored && prefersDark));

toggle.addEventListener('click', () => {
  const dark = !html.classList.contains('dark');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  applyTheme(dark);
});

// Keep in sync if user changes OS theme while on the page
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches);
});

// ── Mobile menu ───────────────────────────
const mobBtn   = document.getElementById('mob-btn');
const mobMenu  = document.getElementById('mob-menu');
const icBurger = document.getElementById('ic-burger');
const icClose  = document.getElementById('ic-close');

function closeMobileMenu() {
  mobMenu.classList.add('hidden');
  mobBtn.setAttribute('aria-expanded', 'false');
  mobBtn.setAttribute('aria-label', 'Open menu');
  icBurger.classList.remove('hidden');
  icClose.classList.add('hidden');
}

mobBtn.addEventListener('click', () => {
  const isOpen = !mobMenu.classList.contains('hidden');
  if (isOpen) {
    closeMobileMenu();
  } else {
    mobMenu.classList.remove('hidden');
    mobBtn.setAttribute('aria-expanded', 'true');
    mobBtn.setAttribute('aria-label', 'Close menu');
    icBurger.classList.add('hidden');
    icClose.classList.remove('hidden');
  }
});

// Close on link click or outside click
mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
document.addEventListener('click', e => {
  if (!mobMenu.classList.contains('hidden') && !mobMenu.contains(e.target) && !mobBtn.contains(e.target)) {
    closeMobileMenu();
  }
});

// ── Contact form ──────────────────────────
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const submitLbl  = document.getElementById('submit-label');
const spinner    = document.getElementById('submit-spinner');
const msgSuccess = document.getElementById('msg-success');
const msgError   = document.getElementById('msg-error');

const FIELDS = ['f-name', 'f-email', 'f-subject', 'f-message'];

function showFieldError(id, msg) {
  const input = document.getElementById(id);
  const err   = document.getElementById('err-' + id.slice(2));
  input.setAttribute('aria-invalid', 'true');
  input.classList.add('border-red-400', 'dark:border-red-600');
  err.textContent = msg;
  err.classList.remove('hidden');
}

function clearFieldError(id) {
  const input = document.getElementById(id);
  const err   = document.getElementById('err-' + id.slice(2));
  input.removeAttribute('aria-invalid');
  input.classList.remove('border-red-400', 'dark:border-red-600');
  err.classList.add('hidden');
}

function showBanner(el) {
  el.classList.remove('hidden');
  el.classList.add('flex');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideBanner(el) {
  el.classList.add('hidden');
  el.classList.remove('flex');
}

function validate(data) {
  let ok = true;

  if (!data.name.trim()) {
    showFieldError('f-name', 'Please enter your full name.'); ok = false;
  }
  if (!data.email.trim()) {
    showFieldError('f-email', 'Please enter your email address.'); ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showFieldError('f-email', 'Please enter a valid email address.'); ok = false;
  }
  if (!data.subject.trim()) {
    showFieldError('f-subject', 'Please enter a subject.'); ok = false;
  }
  if (!data.message.trim()) {
    showFieldError('f-message', 'Please enter a message.'); ok = false;
  } else if (data.message.trim().length < 10) {
    showFieldError('f-message', 'Message must be at least 10 characters.'); ok = false;
  }

  return ok;
}

// Clear error on blur once the user has corrected the field
FIELDS.forEach(id => {
  document.getElementById(id).addEventListener('blur', () => clearFieldError(id));
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  FIELDS.forEach(clearFieldError);
  hideBanner(msgSuccess);
  hideBanner(msgError);

  const data = {
    name:    document.getElementById('f-name').value,
    email:   document.getElementById('f-email').value,
    subject: document.getElementById('f-subject').value,
    message: document.getElementById('f-message').value,
  };

  if (!validate(data)) {
    const first = form.querySelector('[aria-invalid="true"]');
    if (first) first.focus();
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitLbl.textContent = 'Sending…';
  spinner.classList.remove('hidden');

  try {
    // Replace YOUR_FORM_ID with your Formspree form ID (formspree.io — free tier)
    const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      form.reset();
      showBanner(msgSuccess);
    } else {
      throw new Error('non-ok response');
    }
  } catch {
    showBanner(msgError);
  } finally {
    submitBtn.disabled = false;
    submitLbl.textContent = 'Send message';
    spinner.classList.add('hidden');
  }
});
