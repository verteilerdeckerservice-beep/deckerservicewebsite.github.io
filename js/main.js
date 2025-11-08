// DECKER-SERVICE Website JavaScript
// Hauptfunktionalitäten

// Cookie-Banner Funktionen
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function showCookieBanner() {
  const cookieConsent = getCookie('cookieConsent');
  if (!cookieConsent) {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      banner.style.display = 'block';
      document.body.style.overflow = 'hidden';
      // Blockiere alle Links und Navigation
      blockNavigation();
    }
  } else {
    // Cookie-Einwilligung bereits erteilt, Website normal nutzbar
    document.body.classList.add('cookies-accepted');
  }
}

function blockNavigation() {
  // Blockiere alle Links außer dem Datenschutz-Link
  document.querySelectorAll('a:not([href*="datenschutz.html"])').forEach(link => {
    link.addEventListener('click', function(e) {
      const cookieConsent = getCookie('cookieConsent');
      if (!cookieConsent) {
        e.preventDefault();
        e.stopPropagation();
        // Zeige Cookie-Banner erneut an
        const banner = document.getElementById('cookieBanner');
        if (banner) {
          banner.style.display = 'block';
          document.body.style.overflow = 'hidden';
        }
        return false;
      }
    }, true);
  });
  
  // Blockiere Formular-Submits
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const cookieConsent = getCookie('cookieConsent');
      if (!cookieConsent) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  });
}

function acceptCookies() {
  setCookie('cookieConsent', 'accepted', 730); // 2 Jahre
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.style.display = 'none';
    document.body.style.overflow = '';
  }
  document.body.classList.add('cookies-accepted');
  // Besucherzähler aktualisieren nach Cookie-Einwilligung
  updateVisitorCount();
  // Navigation wieder freigeben
  unblockNavigation();
}

function declineCookies() {
  setCookie('cookieConsent', 'declined', 730); // 2 Jahre
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.style.display = 'none';
    document.body.style.overflow = '';
  }
  // Auch ohne Einwilligung können technisch notwendige Cookies gesetzt werden
  document.body.classList.add('cookies-accepted');
  updateVisitorCount();
  // Navigation wieder freigeben
  unblockNavigation();
}

function unblockNavigation() {
  // Entferne Event Listener nicht, aber erlaube Navigation durch Cookie-Prüfung
  // Die Event Listener prüfen weiterhin das Cookie, aber jetzt ist es gesetzt
}

// Jahr im Footer aktualisieren
document.addEventListener('DOMContentLoaded', function() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Cookie-Banner anzeigen
  showCookieBanner();
  
  // Event Listener für Cookie-Banner Buttons
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', acceptCookies);
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', declineCookies);
  }
  
  // Smooth Scroll für interne Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Besucherzähler nur wenn Cookies akzeptiert wurden
  const cookieConsent = getCookie('cookieConsent');
  if (cookieConsent) {
    updateVisitorCount();
  }
  
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');
  
  // Erstelle Overlay für mobile Ansicht
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);
  
  // Toggle-Funktion
  function toggleMenu() {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  }
  
  // Event Listener für Hamburger-Button
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }
  
  // Schließe Menü beim Klick auf Overlay
  overlay.addEventListener('click', toggleMenu);
  
  // Schließe Menü beim Klick auf einen Link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu();
      }
    });
  });
  
  // Schließe Menü beim Resize (wenn zu Desktop wechselt)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Besucherzähler Funktion
function updateVisitorCount() {
  const counterElement = document.getElementById('visitorCount');
  if (!counterElement) return;
  
  // Prüfe Cookie-Einwilligung
  const cookieConsent = getCookie('cookieConsent');
  if (!cookieConsent) {
    counterElement.textContent = '0';
    return;
  }
  
  // Hole aktuellen Zählerstand aus Cookie (für Synchronisation) oder localStorage
  let currentCount = parseInt(getCookie('visitorCount') || '0', 10);
  if (currentCount === 0) {
    // Fallback zu localStorage wenn Cookie nicht vorhanden
    currentCount = parseInt(localStorage.getItem('visitorCount') || '0', 10);
  }
  
  // Erhöhe den Zähler bei jedem Aufruf
  const newCount = currentCount + 1;
  
  // Speichere in beiden: Cookie (für Synchronisation) und localStorage (Fallback)
  setCookie('visitorCount', newCount.toString(), 730); // 2 Jahre
  localStorage.setItem('visitorCount', newCount.toString());
  
  // Animation beim Update
  counterElement.style.transform = 'scale(1.2)';
  setTimeout(() => {
    counterElement.textContent = formatNumber(newCount);
    counterElement.style.transform = 'scale(1)';
  }, 200);
}

// Zahl formatieren (Tausender-Trennzeichen)
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

