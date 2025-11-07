// DECKER-SERVICE Website JavaScript
// Hauptfunktionalitäten

// Jahr im Footer aktualisieren
document.addEventListener('DOMContentLoaded', function() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
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
  
  // Besucherzähler
  updateVisitorCount();
  
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
  
  // Prüfe ob bereits heute gezählt wurde
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('lastVisit');
  const currentCount = parseInt(localStorage.getItem('visitorCount') || '0', 10);
  
  // Wenn heute noch nicht gezählt wurde, erhöhe den Zähler
  if (lastVisit !== today) {
    const newCount = currentCount + 1;
    localStorage.setItem('visitorCount', newCount.toString());
    localStorage.setItem('lastVisit', today);
    
    // Animation beim Update
    counterElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
      counterElement.textContent = formatNumber(newCount);
      counterElement.style.transform = 'scale(1)';
    }, 200);
  } else {
    // Zeige aktuelle Anzahl
    counterElement.textContent = formatNumber(currentCount);
  }
}

// Zahl formatieren (Tausender-Trennzeichen)
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

