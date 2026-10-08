document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const setHeaderState = () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    mobileMenu?.classList.toggle('open', opening);
    document.body.classList.toggle('menu-open', opening);
  });

  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1050) closeMenu(); });

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal:not(.is-visible)');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  const dialog = document.querySelector('[data-lightbox-dialog]');
  const dialogImg = dialog?.querySelector('img');
  const dialogCaption = dialog?.querySelector('figcaption');
  const closeButton = dialog?.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImg || typeof dialog.showModal !== 'function') return;
      dialogImg.src = button.dataset.lightbox || '';
      dialogImg.alt = button.querySelector('img')?.alt || 'Apex Protocol portfolio image';
      if (dialogCaption) dialogCaption.textContent = button.dataset.caption || '';
      dialog.showModal();
    });
  });

  closeButton?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Apex Protocol inquiry — ${data.get('service') || 'General'}`;
    const body = [
      `Hello Apex Protocol,`,
      ``,
      `My name is ${data.get('name') || ''}.`,
      `Phone: ${data.get('phone') || 'Not provided'}`,
      `Email: ${data.get('email') || ''}`,
      `Service: ${data.get('service') || ''}`,
      ``,
      `${data.get('message') || ''}`
    ].join('\n');
    window.location.href = `mailto:apexprotocol20@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
