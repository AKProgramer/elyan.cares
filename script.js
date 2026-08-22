document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const siteHeader = document.getElementById('top');

  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));
  }

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  const msgToggle = document.getElementById('msgToggle');
  const msgPanel = document.getElementById('msgPanel');
  const msgClose = document.getElementById('msgClose');
  const msgForm = document.getElementById('msgForm');

  const closeMsgPanel = () => {
    msgPanel.classList.remove('open');
    msgToggle.setAttribute('aria-expanded', 'false');
  };

  msgToggle.addEventListener('click', () => {
    const isOpen = msgPanel.classList.toggle('open');
    msgToggle.setAttribute('aria-expanded', isOpen);
  });

  msgClose.addEventListener('click', closeMsgPanel);

  const msgSend = document.querySelector('.msg-send');
  const msgStatus = document.getElementById('msgStatus');

  msgForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('msgName').value.trim();
    const message = document.getElementById('msgText').value.trim();

    msgSend.disabled = true;
    msgSend.textContent = 'Sending…';
    msgStatus.textContent = '';
    msgStatus.className = 'msg-status';

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');

      msgStatus.textContent = 'Thanks! Your message has been sent.';
      msgStatus.classList.add('msg-status-ok');
      msgForm.reset();
      setTimeout(closeMsgPanel, 1500);
    } catch (err) {
      msgStatus.textContent = 'Something went wrong. Please try again or WhatsApp us.';
      msgStatus.classList.add('msg-status-error');
    } finally {
      msgSend.disabled = false;
      msgSend.textContent = 'Send';
    }
  });
});
