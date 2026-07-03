/* ============================================================
   Hotel Alcázar de Luna — index.js v2
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navbar scroll ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── 2. Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nl');
  const sectObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nl[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectObs.observe(s));

  /* ── 3. Mobile burger ── */
  const burger = document.getElementById('burger');
  const mobNav = document.getElementById('mobNav');
  burger?.addEventListener('click', () => {
    mobNav?.classList.toggle('open');
  });
  document.querySelectorAll('.ml').forEach(l => {
    l.addEventListener('click', () => mobNav?.classList.remove('open'));
  });

  /* ── 4. Booking widget ── */
  const checkinEl  = document.getElementById('bw-checkin');
  const checkoutEl = document.getElementById('bw-checkout');
  const today = new Date().toISOString().split('T')[0];
  if (checkinEl)  checkinEl.min  = today;
  if (checkoutEl) checkoutEl.min = today;

  checkinEl?.addEventListener('change', () => {
    if (!checkoutEl) return;
    checkoutEl.min = checkinEl.value;
    if (checkoutEl.value && checkoutEl.value <= checkinEl.value) {
      const d = new Date(checkinEl.value);
      d.setDate(d.getDate() + 1);
      checkoutEl.value = d.toISOString().split('T')[0];
    }
  });

  document.getElementById('bw-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkin  = checkinEl?.value  || '';
    const checkout = checkoutEl?.value || '';
    const guests   = document.getElementById('bw-guests')?.value || '2';
    if (!checkin || !checkout) { alert('Por favor selecciona fechas de entrada y salida.'); return; }
    const msg = encodeURIComponent(
      `Hola, deseo hacer una reserva en Hotel Alcázar de Luna.\n` +
      `• Entrada: ${checkin}\n• Salida: ${checkout}\n• Huéspedes: ${guests}\nPor favor contáctenme para confirmar disponibilidad.`
    );
    window.open(`https://wa.me/527471056008?text=${msg}`, '_blank');
  });

  /* ── 5. Room tabs ── */
  const tabs = document.querySelectorAll('.rgt');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ── 6. Leaflet map ── */
  const mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
    const lat = 17.5534, lng = -99.5009;
    const map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/">CARTO</a>', maxZoom: 19
    }).addTo(map);
    const goldIcon = L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#c9a55a;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.3);"></div>`,
      iconSize: [36, 36], iconAnchor: [18, 36]
    });
    L.marker([lat, lng], { icon: goldIcon })
      .addTo(map)
      .bindPopup('<strong>Hotel Alcázar de Luna</strong><br/>km 220+681.80, Chilpancingo, Gro.')
      .openPopup();
  }

  /* ── 7. Contact form ── */
  document.getElementById('cto-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('cf-name')?.value || '';
    const email   = document.getElementById('cf-email')?.value || '';
    const subject = document.getElementById('cf-subject')?.value || '';
    const msg     = document.getElementById('cf-msg')?.value || '';
    const wa = encodeURIComponent(`Hola, mi nombre es ${name} (${email}).\nAsunto: ${subject}\n\n${msg}`);
    window.open(`https://wa.me/527471056008?text=${wa}`, '_blank');
    e.target.reset();
  });

  /* ── 8. Newsletter form ── */
  document.getElementById('nl-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (btn) { btn.textContent = '¡Suscrito!'; btn.style.background = '#152338'; }
    setTimeout(() => { e.target.reset(); if (btn) { btn.textContent = 'Suscribirse'; btn.style.background = ''; } }, 3000);
  });

  /* ── 9. Scroll fade-in ── */
  const fadeEls = document.querySelectorAll('.tst-card, .atr-card, .rgi, .nos-nums .nn, .aw');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, i * 80);
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => {
    el.style.cssText += 'opacity:0;transform:translateY(22px);transition:opacity .55s ease,transform .55s ease;';
    fadeObs.observe(el);
  });

  /* ── 10. Year in footer ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
