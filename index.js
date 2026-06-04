/* ============================================================
   Hotel Alcázar de Luna — index.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR scroll effect ── */
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── 2. Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));

  /* ── 3. Mobile drawer ── */
  const mobileToggle  = document.getElementById('mobileToggle');
  const mobileDrawer  = document.getElementById('mobileDrawer');
  const closeDrawer   = document.getElementById('closeDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer()  { mobileDrawer.classList.add('open'); drawerOverlay.classList.add('visible'); document.body.style.overflow = 'hidden'; }
  function closeDrawerFn(){ mobileDrawer.classList.remove('open'); drawerOverlay.classList.remove('visible'); document.body.style.overflow = ''; }

  mobileToggle?.addEventListener('click', openDrawer);
  closeDrawer?.addEventListener('click', closeDrawerFn);
  drawerOverlay?.addEventListener('click', closeDrawerFn);
  document.querySelectorAll('.mob-link, .mob-book-btn').forEach(l => l.addEventListener('click', closeDrawerFn));

  /* ── 4. Booking widget form ── */
  const bookingForm = document.getElementById('bookingWidgetForm');
  const checkinInput  = document.getElementById('checkin-date');
  const checkoutInput = document.getElementById('checkout-date');

  // Set min dates
  const today = new Date().toISOString().split('T')[0];
  if (checkinInput)  checkinInput.min  = today;
  if (checkoutInput) checkoutInput.min = today;

  checkinInput?.addEventListener('change', () => {
    if (checkoutInput) {
      checkoutInput.min = checkinInput.value;
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        const next = new Date(checkinInput.value);
        next.setDate(next.getDate() + 1);
        checkoutInput.value = next.toISOString().split('T')[0];
      }
    }
  });

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const room = document.getElementById('room-select')?.value || 'king';
    openBookingDrawer(room);
  });

  /* ── 5. Room card "Reservar" buttons ── */
  document.querySelectorAll('.btn-book-room').forEach(btn => {
    btn.addEventListener('click', () => {
      openBookingDrawer(btn.dataset.room || 'king');
    });
  });

  /* ── 6. Booking Drawer ── */
  const bookingDrawer        = document.getElementById('bookingDrawer');
  const bookingDrawerOverlay = document.getElementById('bookingDrawerOverlay');
  const closeBookingDrawer   = document.getElementById('closeBookingDrawer');

  const roomData = {
    premium: { name: 'Habitación Premium con Bañera', price: 160 },
    king:    { name: 'Estándar King',                 price: 120 },
    balcony: { name: 'Estándar con Balcón',           price: 130 },
  };

  function openBookingDrawer(roomId) {
    const room = roomData[roomId] || roomData.king;

    // Sync form data into drawer summary
    const checkin  = checkinInput?.value  || '';
    const checkout = checkoutInput?.value || '';
    const guests   = document.getElementById('guests-count')?.options[document.getElementById('guests-count')?.selectedIndex]?.text || '2 Adultos';

    let nights = 1;
    if (checkin && checkout) {
      const diff = (new Date(checkout) - new Date(checkin)) / 86400000;
      if (diff > 0) nights = diff;
    }

    document.getElementById('summary-room-name').textContent = room.name;
    document.getElementById('summary-checkin').textContent   = checkin  || 'Seleccionar';
    document.getElementById('summary-checkout').textContent  = checkout || 'Seleccionar';
    document.getElementById('summary-guests').textContent    = guests;
    document.getElementById('summary-nights').textContent    = nights;
    document.getElementById('summary-price-night').textContent = `$${room.price}.00 USD`;
    document.getElementById('summary-price-total').textContent = `$${room.price * nights}.00 USD`;

    bookingDrawer?.classList.add('open');
    bookingDrawerOverlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingDrawerFn() {
    bookingDrawer?.classList.remove('open');
    bookingDrawerOverlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  closeBookingDrawer?.addEventListener('click', closeBookingDrawerFn);
  bookingDrawerOverlay?.addEventListener('click', closeBookingDrawerFn);

  /* ── 7. Booking contact form submit ── */
  const bookingContactForm = document.getElementById('bookingContactForm');
  bookingContactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const roomName  = document.getElementById('summary-room-name')?.textContent;
    const total     = document.getElementById('summary-price-total')?.textContent;
    const guestName = document.getElementById('booking-name')?.value;
    const email     = document.getElementById('booking-email')?.value;
    const phone     = document.getElementById('booking-phone')?.value;

    // Populate success modal
    document.getElementById('success-total-price').textContent = total;
    document.getElementById('success-room-name').textContent   = roomName;

    // WhatsApp redirect — build pre-filled message
    const checkin  = document.getElementById('summary-checkin')?.textContent;
    const checkout = document.getElementById('summary-checkout')?.textContent;
    const msg = encodeURIComponent(
      `Hola, soy ${guestName}. Deseo confirmar mi reserva directa:\n` +
      `• Habitación: ${roomName}\n• Entrada: ${checkin}\n• Salida: ${checkout}\n` +
      `• Total estimado: ${total}\n• Email: ${email}\n• Tel: ${phone}`
    );
    document.getElementById('checkoutRealBtn').href = `https://wa.me/527471056008?text=${msg}`;

    closeBookingDrawerFn();
    const modal = document.getElementById('successBookingModal');
    modal?.classList.add('visible');
  });

  // Close success modal
  document.getElementById('closeSuccessModal')?.addEventListener('click', () => {
    document.getElementById('successBookingModal')?.classList.remove('visible');
  });

  /* ── 8. Testimonials slider ── */
  const slides   = document.querySelectorAll('.testimonial-slide');
  let current    = 0;
  let autoSlide;

  function showSlide(idx) {
    slides.forEach(s => s.classList.remove('active'));
    current = (idx + slides.length) % slides.length;
    slides[current]?.classList.add('active');
  }

  document.getElementById('sliderNextBtn')?.addEventListener('click', () => { showSlide(current + 1); resetAuto(); });
  document.getElementById('sliderPrevBtn')?.addEventListener('click', () => { showSlide(current - 1); resetAuto(); });

  function resetAuto() { clearInterval(autoSlide); autoSlide = setInterval(() => showSlide(current + 1), 6000); }
  resetAuto();

  /* ── 9. Leaflet Map ── */
  const mapEl = document.getElementById('contactMap');
  if (mapEl && typeof L !== 'undefined') {
    const lat = 17.5534, lng = -99.5009;
    const map = L.map('contactMap', { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    const goldIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:36px;height:36px;border-radius:50% 50% 50% 0;
        background:#c9a55a;transform:rotate(-45deg);
        border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.3);">
      </div>`,
      iconSize: [36, 36], iconAnchor: [18, 36]
    });

    L.marker([lat, lng], { icon: goldIcon })
      .addTo(map)
      .bindPopup('<strong>Hotel Alcázar de Luna</strong><br/>Chilpancingo, Guerrero')
      .openPopup();
  }

  /* ── 10. Fade-in on scroll ── */
  const fadeEls = document.querySelectorAll('.room-card, .highlight-item, .amenity-card, .contact-detail-item');
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
    el.style.cssText += 'opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease;';
    fadeObs.observe(el);
  });

  /* ── 11. Year in footer ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
