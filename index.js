document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Burger ── */
  document.getElementById('burger')?.addEventListener('click', () => {
    document.getElementById('mobNav')?.classList.toggle('open');
  });
  document.querySelectorAll('.ml').forEach(l =>
    l.addEventListener('click', () => document.getElementById('mobNav')?.classList.remove('open'))
  );

  /* ── Booking bar (index + contacto) ── */
  const bwCI = document.getElementById('bwCI');
  const bwCO = document.getElementById('bwCO');
  const today = new Date().toISOString().split('T')[0];
  if (bwCI) bwCI.min = today;
  if (bwCO) bwCO.min = today;

  /* Update display values when dates change */
  function fmt(d) {
    if (!d) return 'Seleccionar fecha';
    const [y,m,day] = d.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${day} ${months[parseInt(m)-1]} ${y}`;
  }
  bwCI?.addEventListener('change', () => {
    const el = document.getElementById('bfCIVal');
    if (el) el.textContent = fmt(bwCI.value);
    if (!bwCO) return;
    bwCO.min = bwCI.value;
    if (bwCO.value && bwCO.value <= bwCI.value) {
      const d = new Date(bwCI.value); d.setDate(d.getDate()+1);
      bwCO.value = d.toISOString().split('T')[0];
      const el2 = document.getElementById('bfCOVal');
      if (el2) el2.textContent = fmt(bwCO.value);
    }
    updateNights();
  });
  bwCO?.addEventListener('change', () => {
    const el = document.getElementById('bfCOVal');
    if (el) el.textContent = fmt(bwCO.value);
    updateNights();
  });
  function updateNights() {
    const el = document.getElementById('bfNights');
    if (!el || !bwCI?.value || !bwCO?.value) return;
    const n = Math.round((new Date(bwCO.value) - new Date(bwCI.value)) / 86400000);
    el.textContent = n > 0 ? `${n} noche${n>1?'s':''}` : '—';
  }

  document.getElementById('bwForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const ci   = bwCI?.value || '';
    const co   = bwCO?.value || '';
    const g    = document.getElementById('bwGuests')?.value || '2';
    const room = document.getElementById('bwRoom')?.value || '';
    if (!ci || !co) { alert('Por favor selecciona fechas de llegada y salida.'); return; }
    const nights = bwCI?.value && bwCO?.value
      ? Math.round((new Date(bwCO.value) - new Date(bwCI.value)) / 86400000)
      : '';
    const msg = encodeURIComponent(
      `Hola, deseo hacer una reservación en Hotel Alcázar de Luna.\n\n` +
      `• Habitación: ${room}\n` +
      `• Llegada: ${ci}\n` +
      `• Salida: ${co}\n` +
      `• Noches: ${nights}\n` +
      `• Huéspedes: ${g}\n\n` +
      `Por favor confirmen disponibilidad y precio. ¡Gracias!`
    );
    window.open(`https://wa.me/527471056008?text=${msg}`, '_blank');
  });

  /* ── Leaflet map (contacto) ── */
  const mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
    const map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([17.5534, -99.5009], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO', maxZoom: 19
    }).addTo(map);
    L.divIcon({className:''});
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#c9a55a;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.3)"></div>`,
      iconSize: [36,36], iconAnchor: [18,36]
    });
    L.marker([17.5534,-99.5009], {icon}).addTo(map)
      .bindPopup('<strong>Hotel Alcázar de Luna</strong><br/>km 220+681.80, Chilpancingo').openPopup();
  }

  /* ── Contact form ── */
  document.getElementById('ctoForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cfName')?.value || '';
    const email = document.getElementById('cfEmail')?.value || '';
    const subj = document.getElementById('cfSubject')?.value || '';
    const msg = document.getElementById('cfMsg')?.value || '';
    const wa = encodeURIComponent(`Hola, soy ${name} (${email}).\nAsunto: ${subj}\n\n${msg}`);
    window.open(`https://wa.me/527471056008?text=${wa}`, '_blank');
    e.target.reset();
  });

  /* ── Newsletter ── */
  document.getElementById('nlForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (btn) { btn.textContent = '¡Suscrito! ✓'; btn.style.background = '#152338'; }
    setTimeout(() => { e.target.reset(); if (btn) { btn.textContent = 'Suscribirse'; btn.style.background = ''; }}, 3500);
  });

  /* ── Scroll reveal system (data-reveal) ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('is-revealed'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ── Legacy fade-in for cards without data-reveal (inner pages) ── */
  const legacyEls = document.querySelectorAll('.val-card, .nn');
  const legacyObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }, i*80);
        legacyObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  legacyEls.forEach(el => {
    if (!el.hasAttribute('data-reveal')) {
      el.style.cssText += 'opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease';
      legacyObs.observe(el);
    }
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Año footer ── */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
});
