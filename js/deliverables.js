(() => {

  // ── Canvas pan ──
  const wrapper = document.getElementById('canvasWrapper');
  const board   = document.getElementById('canvasBoard');
  const INITIAL_X = 60, INITIAL_Y = 40;
  const isMobile = () => window.innerWidth <= 767;

  if (wrapper && board) {
    let dragging = false;
    let startX, startY;
    let ox = INITIAL_X, oy = INITIAL_Y;

    if (!isMobile()) {
      board.style.transform = `translate(${ox}px, ${oy}px)`;
    }

    // Don't start drag when clicking interactive elements
    const isInteractive = (el) =>
      el.closest('iframe, button, a, input, .press-card, .doc-nav, .doc-preview');

    if (!isMobile()) {
      wrapper.addEventListener('mousedown', (e) => {
        if (isInteractive(e.target)) return;
        dragging = true;
        startX = e.clientX - ox;
        startY = e.clientY - oy;
        wrapper.style.cursor = 'grabbing';
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        ox = e.clientX - startX;
        oy = e.clientY - startY;
        board.style.transform = `translate(${ox}px, ${oy}px)`;
      });

      window.addEventListener('mouseup', () => {
        if (dragging) {
          dragging = false;
          wrapper.style.cursor = 'grab';
        }
      });
    }
  }

  // ── Browser iframe scale-to-fit ──
  const scaleWebsiteIframe = () => {
    const content = document.querySelector('.browser-content');
    const iframe  = content && content.querySelector('iframe');
    if (!content || !iframe) return;
    const w     = content.offsetWidth || (window.innerWidth - 48);
    const scale = w / 1280;
    iframe.style.transform       = `scale(${scale})`;
    iframe.style.transformOrigin = 'top left';
    content.style.height         = Math.round(900 * scale) + 'px';
  };

  scaleWebsiteIframe();
  window.addEventListener('resize', scaleWebsiteIframe);

  // ── Email: scale to full static height ──
  const emailIframe = document.getElementById('emailIframe');
  const emailInner  = document.getElementById('emailScaleInner');
  const emailOuter  = emailInner && emailInner.parentElement;
  const SOURCE_WIDTH = 600; // email template natural width

  if (emailIframe && emailInner && emailOuter) {
    const applyEmailScale = () => {
      // Read actual container width so mobile scales correctly
      const displayW = emailOuter.offsetWidth || 300;
      const scale    = displayW / SOURCE_WIDTH;

      const setDimensions = (fullH) => {
        const scaledH = Math.round(fullH * scale);
        // On mobile let the full email show (page scroll); on desktop cap height
        const displayH = scaledH;
        emailIframe.style.width    = SOURCE_WIDTH + 'px';
        emailIframe.style.height   = fullH + 'px';
        emailInner.style.transform = `scale(${scale})`;
        emailInner.style.width     = SOURCE_WIDTH + 'px';
        emailInner.style.transformOrigin = 'top left';
        emailOuter.style.height = displayH + 'px';
      };

      try {
        const doc = emailIframe.contentDocument || emailIframe.contentWindow.document;
        const fullH = doc.documentElement.scrollHeight || doc.body.scrollHeight;
        if (!fullH) return;
        setDimensions(fullH);
      } catch (e) {
        setDimensions(1800);
      }
    };

    emailIframe.addEventListener('load', applyEmailScale);
    window.addEventListener('resize', applyEmailScale);
    if (emailIframe.contentDocument && emailIframe.contentDocument.readyState === 'complete') {
      applyEmailScale();
    }
  }

  // ── Browser iframe: dismiss interact hint on first hover/click ──
  const browserContent = document.querySelector('.browser-content');
  if (browserContent) {
    const dismiss = () => browserContent.classList.add('hinted');
    browserContent.addEventListener('mouseenter', dismiss, { once: true });
    browserContent.addEventListener('click', dismiss, { once: true });
  }

  // ── SMS phones: hide scroll hint once user swipes ──
  const smsPhones     = document.getElementById('smsPhones');
  const smsScrollHint = document.getElementById('smsScrollHint');
  if (smsPhones && smsScrollHint) {
    smsPhones.addEventListener('scroll', () => {
      smsPhones.classList.add('scrolled');
    }, { once: true });
  }

  // ── Brand Strategy doc page flip ──
  const docPages   = document.querySelectorAll('.doc-page');
  const docPrev    = document.querySelector('.doc-prev');
  const docNext    = document.querySelector('.doc-next');
  const docCounter = document.querySelector('.doc-counter');
  let currentDoc   = 0;

  const showDocPage = (idx) => {
    docPages.forEach((p, i) => p.classList.toggle('active', i === idx));
    if (docCounter) docCounter.textContent = `${idx + 1} / ${docPages.length}`;
    if (docPrev) docPrev.disabled = idx === 0;
    if (docNext) docNext.disabled = idx === docPages.length - 1;
  };

  if (docPages.length) {
    showDocPage(0);
    if (docPrev) docPrev.addEventListener('click', () => { if (currentDoc > 0) showDocPage(--currentDoc); });
    if (docNext) docNext.addEventListener('click', () => { if (currentDoc < docPages.length - 1) showDocPage(++currentDoc); });
  }

  // ── Press modal ──
  const pressCards = document.querySelectorAll('.press-card');
  const modal      = document.querySelector('.press-modal-overlay');
  const modalClose = document.querySelector('.press-modal-close');
  const modalBody  = document.querySelector('.press-modal-body');

  pressCards.forEach(card => {
    card.addEventListener('click', () => {
      if (modalBody) {
        modalBody.innerHTML = `
          <p class="press-publication">${card.dataset.pub}</p>
          <h2>${card.dataset.headline}</h2>
          ${card.dataset.body.split('||').map(p => `<p>${p.trim()}</p>`).join('')}
        `;
      }
      if (modal) modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

})();
