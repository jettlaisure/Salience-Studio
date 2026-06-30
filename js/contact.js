(() => {
  const form = document.querySelector('form[name="discovery-call"]');
  if (!form) return;

  const CALENDLY_URL = '[INSERT CALENDLY URL]';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
    } catch (_) {
      // Netlify will still capture on the server — proceed to Calendly
    }

    if (CALENDLY_URL && CALENDLY_URL !== '[INSERT CALENDLY URL]') {
      window.location.href = CALENDLY_URL;
    } else {
      const formEl = document.querySelector('.contact-form-inner');
      const success = document.querySelector('.form-success');
      if (formEl) formEl.style.display = 'none';
      if (success) success.classList.add('show');
    }
  });

  // Accordion for FAQ (if present on page)
  const details = document.querySelectorAll('.faq-category details, .faq-list details');
  details.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        details.forEach(other => {
          if (other !== d && other.open) other.open = false;
        });
      }
    });
  });
})();
