/* =============================================
   Birthday Card - Interactive Script
   ============================================= */

(function () {
  'use strict';

  // ---------- State ----------
  let currentPage = 0;
  const totalPages = 7; // 0=cover, 1-6=inner pages
  let isTransitioning = false;

  // ---------- DOM References ----------
  const card = document.getElementById('birthdayCard');
  const pages = document.querySelectorAll('.page');
  const dots = document.querySelectorAll('.page-indicator .dot');
  const navLeft = document.getElementById('navLeft');
  const navRight = document.getElementById('navRight');

  // ---------- Page Navigation ----------
  function goToPage(index, direction) {
    if (isTransitioning || index === currentPage) return;
    if (index < 0 || index >= totalPages) return;

    isTransitioning = true;

    const currentEl = pages[currentPage];
    const nextEl = pages[index];

    // Determine exit direction
    const exitClass = direction === 'forward' ? 'exit-left' : 'exit-right';

    // Prepare next page entry position
    if (direction === 'forward') {
      nextEl.style.transform = 'translateX(60px) scale(0.96)';
    } else {
      nextEl.style.transform = 'translateX(-60px) scale(0.96)';
    }
    nextEl.style.opacity = '0';
    nextEl.style.visibility = 'visible';

    // Force reflow
    void nextEl.offsetWidth;

    // Animate current page out
    currentEl.classList.remove('active');
    currentEl.classList.add(exitClass);

    // Animate next page in
    nextEl.style.transform = '';
    nextEl.style.opacity = '';
    nextEl.classList.add('active');

    // Update dots
    dots[currentPage].classList.remove('active');
    dots[index].classList.remove('active');
    dots[index].classList.add('active');

    // Trigger confetti on first card open
    if (currentPage === 0 && index === 1) {
      launchConfetti();
    }

    // Spawn floating hearts on romantic pages
    if ([2, 4].includes(index)) {
      spawnPageHearts(nextEl);
    }

    currentPage = index;

    // Clean up after transition
    setTimeout(() => {
      currentEl.classList.remove(exitClass);
      isTransitioning = false;
    }, 700);
  }

  function goForward() {
    if (currentPage === totalPages - 1) {
      // Last page -> loop back to cover
      goToPage(0, 'forward');
    } else {
      goToPage(currentPage + 1, 'forward');
    }
  }

  function goBack() {
    if (currentPage === 0) return; // Can't go back from cover
    goToPage(currentPage - 1, 'backward');
  }

  // ---------- Event Listeners ----------
  navRight.addEventListener('click', (e) => {
    e.stopPropagation();
    createRipple(e, card);
    goForward();
  });

  navLeft.addEventListener('click', (e) => {
    e.stopPropagation();
    createRipple(e, card);
    goBack();
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  card.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  card.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Only handle horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      if (dx < 0) {
        goForward();
      } else {
        goBack();
      }
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      // Tap: determine side
      const rect = card.getBoundingClientRect();
      const tapX = touchEndX - rect.left;
      if (tapX > rect.width / 2) {
        goForward();
      } else {
        goBack();
      }
    }
  }, { passive: true });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goForward();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goBack();
    }
  });

  // ---------- Tap Ripple ----------
  function createRipple(e, container) {
    const ripple = document.createElement('div');
    ripple.classList.add('tap-ripple');
    const rect = container.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || rect.width / 2) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || rect.height / 2) - rect.top;
    ripple.style.left = x - 20 + 'px';
    ripple.style.top = y - 20 + 'px';
    ripple.style.width = '40px';
    ripple.style.height = '40px';
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  // ---------- Confetti ----------
  function launchConfetti() {
    let container = document.getElementById('confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confetti-container';
      document.body.appendChild(container);
    }

    const colors = [
      '#E8556D', '#FFB74D', '#81C784', '#64B5F6',
      '#BA68C8', '#FFD54F', '#FF8A65', '#4DB6AC',
      '#F06292', '#AED581'
    ];

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.8 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';

      // Random shapes
      const shapes = ['circle', 'square', 'rectangle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === 'circle') {
        piece.style.borderRadius = '50%';
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = piece.style.width;
      } else if (shape === 'rectangle') {
        piece.style.width = (4 + Math.random() * 6) + 'px';
        piece.style.height = (8 + Math.random() * 12) + 'px';
      } else {
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = piece.style.width;
      }

      container.appendChild(piece);
    }

    // Clean up confetti after animation
    setTimeout(() => {
      container.innerHTML = '';
    }, 4500);
  }

  // ---------- Floating Hearts on Page ----------
  function spawnPageHearts(pageEl) {
    const heartSymbols = ['💕', '💗', '💖', '💓', '✨'];
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('span');
      heart.className = 'bg-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = (10 + Math.random() * 80) + '%';
      heart.style.fontSize = (12 + Math.random() * 10) + 'px';
      heart.style.animationDuration = (3 + Math.random() * 3) + 's';
      heart.style.animationDelay = (Math.random() * 1.5) + 's';
      pageEl.appendChild(heart);
      setTimeout(() => heart.remove(), 6500);
    }
  }

  // ---------- Background Particles ----------
  function initBackgroundParticles() {
    const container = document.getElementById('bg-particles');

    // Floating hearts
    const heartSymbols = ['💕', '💗', '💖', '🩷', '🤍', '✨', '⭐'];
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('span');
      heart.className = 'bg-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (10 + Math.random() * 14) + 'px';
      heart.style.animationDuration = (8 + Math.random() * 12) + 's';
      heart.style.animationDelay = (Math.random() * 10) + 's';
      container.appendChild(heart);
    }

    // Twinkling stars
    for (let i = 0; i < 40; i++) {
      const star = document.createElement('div');
      star.className = 'bg-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDuration = (2 + Math.random() * 4) + 's';
      star.style.animationDelay = (Math.random() * 5) + 's';
      star.style.width = (2 + Math.random() * 3) + 'px';
      star.style.height = star.style.width;
      container.appendChild(star);
    }
  }

  // ---------- Initialize ----------
  function init() {
    initBackgroundParticles();

    // Set initial page (cover)
    pages[0].classList.add('active');
    dots[0].classList.add('active');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
