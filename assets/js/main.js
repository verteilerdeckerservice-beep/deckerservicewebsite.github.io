// DECKER-SERVICE-DIENSTLEISTUNGEN — Website JavaScript

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function showCookieBanner() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPage === 'index.html' || currentPage === '' || currentPage === '/';
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  if (!isHomePage) {
    banner.style.display = 'none';
    return;
  }

  const consent = getCookie('cookieConsent');
  banner.style.display = consent ? 'none' : 'block';
}

function acceptCookies() {
  setCookie('cookieConsent', 'accepted', 730);
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.style.display = 'none';
  updateVisitorCount();
}

function declineCookies() {
  setCookie('cookieConsent', 'declined', 730);
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.style.display = 'none';
}

function updateVisitorCount() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  if (!getCookie('cookieConsent')) { el.textContent = '0'; return; }

  let count = parseInt(getCookie('visitorCount') || localStorage.getItem('visitorCount') || '0', 10);
  count += 1;
  setCookie('visitorCount', String(count), 730);
  localStorage.setItem('visitorCount', String(count));

  el.style.transform = 'scale(1.2)';
  setTimeout(() => {
    el.textContent = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    el.style.transform = 'scale(1)';
  }, 150);
}

document.addEventListener('DOMContentLoaded', function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  showCookieBanner();
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');
  if (acceptBtn) acceptBtn.addEventListener('click', acceptCookies);
  if (declineBtn) declineBtn.addEventListener('click', declineCookies);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (getCookie('cookieConsent')) updateVisitorCount();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => { if (window.innerWidth <= 768) toggleMenu(); });
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
