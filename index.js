/* ============================================================
   Hotel Alcázar de Luna — index.js v2
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navbar scroll ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── 2. Mobile burger ── */
  const burger = document.getElementById('burger');
  const mobNav = document.getElementById('mobNav');
  burger?.addEventListener('click', () => mobNav?.classList.toggle('open'));
  document.querySelectorAll('.ml').forEach(l => {
    l.addEventListener('click', () => mobNav?.classList.remove('open'));
  });

  /* ── 3. Booking widget (index.html y contacto.html) ── */
  const bwCI  = document.getElementById('bwCI');
  const bwCO  = document.getElementById('bwCO');
  const today = new Date().toISOString().split('T')[0];
  if (bwCI)  bwCI.min  = today;
  if (bwCO)  bwCO.min  = today;

  bwCI?.addEventListener('change', () => {
    if (!bwCO) return;
    bwCO.min = bwCI.value;
    if (bwCO.value && bwCO.value <= bwCI.value) {
      const d = new Date(bwCI.value);
      d.setDate(d.getDate() + 1);
      bwCO.value = d.toISOString().split('T')[0];
    }
  });

  document.getElementById('bwForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkin  = bwCI?.value || '';
    const checkout = bwCO?.value || '';
    const guests   = document.getElementById('bwGuests')?.value || '2';
    if (!checkin || !checkout) { alert('Por favor selecciona fechas de entrada y salida.'); return; }
    const msg = encodeURIComponent(
      `Hola, deseo hacer una reserva en Hotel Alcázar de Luna.\n` +
      `• Entrada: ${checkin}\n• Salida: ${checkout}\n• Huéspedes: ${guests}\n\nPor favor contáctenme para confirmar disponibilidad.`
    );
    window.open(`https://wa.me/527471056008?text=${msg}`, '_blank');
  });

  /* ── 4. Room tabs (index.html) ── */
  const tabs = document.querySelectorAll('.rgt');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ── 5. Leaflet map (contacto.html) ── */
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

  /* ── 6. Contact form (contacto.html) ── */
  document.getElementById('ctoForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('cfName')?.value    || '';
    const email   = document.getElementById('cfEmail')?.value   || '';
    const subject = document.getElementById('cfSubject')?.value || '';
    const msg     = document.getElementById('cfMsg')?.value     || '';
    const wa = encodeURIComponent(`Hola, mi nombre es ${name} (${email}).\nAsunto: ${subject}\n\n${msg}`);
    window.open(`https://wa.me/527471056008?text=${wa}`, '_blank');
    e.target.reset();
  });

  /* ── 7. Newsletter ── */
  document.getElementById('nlForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (btn) { btn.textContent = '¡Suscrito!'; btn.style.background = '#152338'; }
    setTimeout(() => { e.target.reset(); if (btn) { btn.textContent = 'SUSCRIBIRSE'; btn.style.background = ''; } }, 3000);
  });

  /* ── 8. Scroll fade-in ── */
  const fadeEls = document.querySelectorAll('.tst-card, .atr-card, .rgi, .nn, .aw, .val-card');
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

  /* ── 9. Año en footer ── */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

});
