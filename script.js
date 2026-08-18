/* =============================================
   Birthday Card for Neha - Interactive Script (13 Pages)
   Features:
   1. Ultra-Smooth 60fps LERP 3D Parallax Card Tilt physics
   2. Interactive Crossing Panda strolling across the screen
   3. Interactive Peeking Corner Panda Mascot with custom sweet messages for Neha
   4. Canvas 3D Floating Lily Petals & Sparkle Engine
   5. Web Audio API Romantic Chime Music Synthesizer
   ============================================= */

(function () {
  'use strict';

  // ---------- State ----------
  let currentPage = 0;
  const totalPages = 13;
  let isTransitioning = false;
  let audioContext = null;
  let isMusicPlaying = false;
  let musicInterval = null;

  // ---------- DOM References ----------
  const cardContainer = document.querySelector('.card-container');
  const card = document.getElementById('birthdayCard');
  const pages = document.querySelectorAll('.page');
  const pageIndicator = document.getElementById('pageIndicator');
  const navLeft = document.getElementById('navLeft');
  const navRight = document.getElementById('navRight');
  const musicBtn = document.getElementById('musicToggleBtn');
  const peekingPanda = document.getElementById('peekingPanda');
  const peekingSpeech = document.getElementById('peekingSpeech');

  // ---------- Generate 13 Navigation Dots ----------
  function initDots() {
    pageIndicator.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-page-index', i);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const dir = i > currentPage ? 'forward' : 'backward';
        goToPage(i, dir);
      });
      pageIndicator.appendChild(dot);
    }
  }

  // ---------- Page Navigation ----------
  function goToPage(index, direction) {
    if (isTransitioning || index === currentPage) return;
    if (index < 0 || index >= totalPages) return;

    isTransitioning = true;

    const dots = pageIndicator.querySelectorAll('.dot');
    const currentEl = pages[currentPage];
    const nextEl = pages[index];

    const exitClass = direction === 'forward' ? 'exit-left' : 'exit-right';

    if (direction === 'forward') {
      nextEl.style.transform = 'translateX(70px) scale(0.95) rotateY(10deg)';
    } else {
      nextEl.style.transform = 'translateX(-70px) scale(0.95) rotateY(-10deg)';
    }
    nextEl.style.opacity = '0';
    nextEl.style.visibility = 'visible';

    void nextEl.offsetWidth; // Force reflow

    currentEl.classList.remove('active');
    currentEl.classList.add(exitClass);

    nextEl.style.transform = '';
    nextEl.style.opacity = '';
    nextEl.classList.add('active');

    if (dots[currentPage]) dots[currentPage].classList.remove('active');
    if (dots[index]) dots[index].classList.add('active');

    if (index === 1 || index === 12) {
      launchConfetti();
    }
    if ([1, 2, 3, 5, 7, 10, 11, 12].includes(index)) {
      spawnPageLilyPetals(nextEl);
    }

    currentPage = index;

    setTimeout(() => {
      currentEl.classList.remove(exitClass);
      isTransitioning = false;
    }, 700);
  }

  function goForward() {
    if (currentPage === totalPages - 1) {
      goToPage(0, 'forward');
    } else {
      goToPage(currentPage + 1, 'forward');
    }
  }

  function goBack() {
    if (currentPage === 0) return;
    goToPage(currentPage - 1, 'backward');
  }

  // ---------- Ultra-Smooth LERP 3D Card Parallax Physics ----------
  function init3DTiltLERP() {
    if (!cardContainer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;

    function updateBounds() {
      return cardContainer.getBoundingClientRect();
    }

    let bounds = updateBounds();
    window.addEventListener('resize', () => { bounds = updateBounds(); });

    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX - (bounds.left + bounds.width / 2);
      const mouseY = e.clientY - (bounds.top + bounds.height / 2);

      // Max rotation 14 deg
      targetX = (mouseY / (window.innerHeight / 2)) * -14;
      targetY = (mouseX / (window.innerWidth / 2)) * 14;
      isHovered = true;
    });

    cardContainer.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      isHovered = false;
    });

    // 60fps Smooth LERP animation loop
    function renderTilt() {
      // Linear Interpolation factor (0.08 = ultra silky smooth inertia)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const scale = isHovered ? 1.025 : 1.0;
      cardContainer.style.transform = `perspective(1200px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) scale(${scale})`;

      requestAnimationFrame(renderTilt);
    }

    renderTilt();
  }

  // ---------- Crossing Panda Mascot ----------
  function initCrossingPanda() {
    function spawnCrossingPanda() {
      const pandaEl = document.createElement('div');
      pandaEl.className = 'crossing-panda-container';
      pandaEl.innerHTML = `
        <span class="crossing-panda-balloon">🎈💖</span>
        <svg class="crossing-panda-svg" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="55" rx="28" ry="22" fill="#FFFFFF" />
          <ellipse cx="50" cy="57" rx="18" ry="14" fill="#F0F0F0" />
          <ellipse cx="25" cy="50" rx="8" ry="14" fill="#2A2A38" transform="rotate(-20,25,50)" />
          <ellipse cx="75" cy="50" rx="8" ry="14" fill="#2A2A38" transform="rotate(20,75,50)" />
          <ellipse cx="38" cy="72" rx="9" ry="6" fill="#2A2A38" />
          <ellipse cx="62" cy="72" rx="9" ry="6" fill="#2A2A38" />
          <circle cx="50" cy="35" r="24" fill="#FFFFFF" />
          <circle cx="28" cy="18" r="10" fill="#2A2A38" />
          <circle cx="72" cy="18" r="10" fill="#2A2A38" />
          <ellipse cx="38" cy="33" rx="8" ry="7" fill="#2A2A38" />
          <ellipse cx="62" cy="33" rx="8" ry="7" fill="#2A2A38" />
          <circle cx="38" cy="33" r="3" fill="#fff" />
          <circle cx="62" cy="33" r="3" fill="#fff" />
          <circle cx="32" cy="40" r="4.5" fill="#FF9EAA" opacity="0.65" />
          <circle cx="68" cy="40" r="4.5" fill="#FF9EAA" opacity="0.65" />
          <ellipse cx="50" cy="38" rx="3.5" ry="2.5" fill="#2A2A38" />
          <path d="M 43 42 Q 50 48 57 42" stroke="#555" fill="none" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <span class="crossing-panda-balloon">🌸</span>
      `;

      document.body.appendChild(pandaEl);

      let pos = -120;
      const endPos = window.innerWidth + 120;

      const walkInterval = setInterval(() => {
        pos += 2.2;
        pandaEl.style.left = pos + 'px';
        if (pos >= endPos) {
          clearInterval(walkInterval);
          pandaEl.remove();
        }
      }, 30);

      pandaEl.addEventListener('click', (e) => {
        e.stopPropagation();
        spawnTouchSparkle(e.clientX, e.clientY);
        launchConfetti();
        if (audioContext && isMusicPlaying) playSoftChime(880);
      });
    }

    // Spawn first crossing panda after 3 seconds, then every 16 seconds
    setTimeout(spawnCrossingPanda, 3000);
    setInterval(spawnCrossingPanda, 16000);
  }

  // ---------- Corner Peeking Panda Mascot ----------
  function initPeekingPanda() {
    if (!peekingPanda || !peekingSpeech) return;

    const messages = [
      "I Love You Neha! 💖",
      "Happy Birthday Princess! 👑",
      "Nu Na Prapancham! 🌌",
      "Forever & Always Yours! 🌸",
      "You look so pretty! ✨",
      "You're the best Neha! 🧸",
      "Sweetest Birthday Wishes! 🎂"
    ];
    let msgIdx = 0;

    peekingPanda.addEventListener('click', (e) => {
      e.stopPropagation();
      msgIdx = (msgIdx + 1) % messages.length;
      peekingSpeech.textContent = messages[msgIdx];

      // Jump animation
      peekingPanda.style.transform = 'translateY(-25px) scale(1.15)';
      spawnTouchSparkle(e.clientX, e.clientY);

      setTimeout(() => {
        peekingPanda.style.transform = '';
      }, 400);

      playSoftChime(659.25);
    });
  }

  // ---------- Touch & Event Controls ----------
  function initEvents() {
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

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
        if (dx < 0) goForward();
        else goBack();
      }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (Math.random() < 0.12) spawnTouchSparkle(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (Math.random() < 0.2) {
        const touch = e.touches[0];
        spawnTouchSparkle(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    // Interactive Panda SVG clicks inside Card
    document.body.addEventListener('click', (e) => {
      const isPandaOrLily = e.target.closest('svg') || e.target.closest('.interactive-tap');
      if (isPandaOrLily && !e.target.closest('.music-toggle-btn') && !e.target.closest('.nav-zone')) {
        spawnTouchSparkle(e.clientX, e.clientY);
        playSoftChime(523.25);
      }
    });
  }

  function createRipple(e, container) {
    const ripple = document.createElement('div');
    ripple.classList.add('tap-ripple');
    const rect = container.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || rect.width / 2) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || rect.height / 2) - rect.top;
    ripple.style.left = x - 25 + 'px';
    ripple.style.top = y - 25 + 'px';
    ripple.style.width = '50px';
    ripple.style.height = '50px';
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  function spawnTouchSparkle(x, y) {
    const icons = ['🌸', '✨', '💖', '🤍', '⭐', '💮', '👑'];
    const el = document.createElement('span');
    el.className = 'touch-sparkle';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = (x - 10) + 'px';
    el.style.top = (y - 10) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  // ---------- Audio Player (Custom MP3 + Web Audio Synth Fallback) ----------
  const bgAudio = document.getElementById('bgAudio');
  const audioFileInput = document.getElementById('audioFileInput');
  let useMp3 = false;

  function initMusicSynth() {
    if (!musicBtn) return;

    // Handle custom MP3 file upload
    if (audioFileInput) {
      audioFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          bgAudio.src = fileUrl;
          useMp3 = true;
          startMusic();
        }
      });
    }

    // Double click button to open custom file picker
    musicBtn.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (audioFileInput) audioFileInput.click();
    });

    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isMusicPlaying) {
        startMusic();
      } else {
        stopMusic();
      }
    });
  }

  function startMusic() {
    // Attempt MP3 playback first
    if (bgAudio && bgAudio.src) {
      bgAudio.play().then(() => {
        useMp3 = true;
        musicBtn.classList.add('playing');
        musicBtn.querySelector('.btn-text').textContent = 'Music: ON 🎵';
        isMusicPlaying = true;
      }).catch(() => {
        // Fallback to Web Audio synth if MP3 fails
        useMp3 = false;
        startRomanticMelody();
        musicBtn.classList.add('playing');
        musicBtn.querySelector('.btn-text').textContent = 'Music: ON 🎵';
        isMusicPlaying = true;
      });
    } else {
      useMp3 = false;
      startRomanticMelody();
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.btn-text').textContent = 'Music: ON 🎵';
      isMusicPlaying = true;
    }
  }

  function stopMusic() {
    if (useMp3 && bgAudio) {
      bgAudio.pause();
    }
    stopRomanticMelody();
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('.btn-text').textContent = 'Play Music 🎶';
    isMusicPlaying = false;
  }

  function playSoftChime(freq = 523.25) {
    try {
      if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
      }
      if (audioContext.state === 'suspended') audioContext.resume();

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 1.2);
    } catch (err) {}
  }

  function startRomanticMelody() {
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') audioContext.resume();

    const notes = [
      261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99,
      440.00, 349.23, 293.66, 329.63, 392.00, 523.25, 659.25
    ];
    let noteIndex = 0;

    musicInterval = setInterval(() => {
      const freq = notes[noteIndex % notes.length];
      playSoftChime(freq);
      if (Math.random() < 0.4) {
        playSoftChime(freq * 1.5);
      }
      noteIndex++;
    }, 450);
  }

  function stopRomanticMelody() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  // ---------- Canvas 3D Floating Lily Petals Particle Engine ----------
  function initParticleCanvas() {
    const canvas = document.getElementById('bg-particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 50;

    class LilyParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.z = Math.random() * 0.85 + 0.15;
        this.size = (12 + Math.random() * 15) * this.z;
        this.speedY = (0.6 + Math.random() * 0.85) * this.z;
        this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.55;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.025;
        this.opacity = (0.35 + Math.random() * 0.5) * this.z;
        this.type = Math.random() < 0.65 ? 'petal' : (Math.random() < 0.85 ? 'heart' : 'star');
      }

      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.6 + this.speedX;
        this.rotation += this.rotSpeed;

        if (this.y < -30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'petal') {
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.bezierCurveTo(this.size * 0.65, -this.size * 0.4, this.size * 0.65, this.size * 0.4, 0, this.size);
          ctx.bezierCurveTo(-this.size * 0.65, this.size * 0.4, -this.size * 0.65, -this.size * 0.4, 0, -this.size);
          const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.65, '#f8bbd0');
          grad.addColorStop(1, '#ec407a');
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (this.type === 'heart') {
          ctx.fillStyle = '#ff4081';
          ctx.font = `${this.size * 1.2}px sans-serif`;
          ctx.fillText('💕', -this.size * 0.5, this.size * 0.5);
        } else {
          ctx.fillStyle = '#ffd54f';
          ctx.font = `${this.size * 1.1}px sans-serif`;
          ctx.fillText('✨', -this.size * 0.5, this.size * 0.5);
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new LilyParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  // ---------- Celebratory Effects ----------
  function launchConfetti() {
    let container = document.getElementById('confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confetti-container';
      document.body.appendChild(container);
    }

    const colors = ['#E91E63', '#FF4081', '#FFD54F', '#81C784', '#64B5F6', '#BA68C8', '#FFFDF0'];

    for (let i = 0; i < 95; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.8 + 's';
      piece.style.animationDuration = (2.2 + Math.random() * 2.2) + 's';

      if (Math.random() < 0.5) piece.style.borderRadius = '50%';
      piece.style.width = (7 + Math.random() * 8) + 'px';
      piece.style.height = (8 + Math.random() * 10) + 'px';

      container.appendChild(piece);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 4800);
  }

  function spawnPageLilyPetals(pageEl) {
    const symbols = ['🌸', '💮', '💖', '✨', '🤍', '🌺'];
    for (let i = 0; i < 7; i++) {
      const petal = document.createElement('span');
      petal.className = 'bg-heart';
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.left = (10 + Math.random() * 80) + '%';
      petal.style.fontSize = (14 + Math.random() * 12) + 'px';
      petal.style.animationDuration = (3.5 + Math.random() * 3.5) + 's';
      petal.style.animationDelay = (Math.random() * 1.5) + 's';
      pageEl.appendChild(petal);
      setTimeout(() => petal.remove(), 7000);
    }
  }

  // ---------- Initialize ----------
  function init() {
    initDots();
    init3DTiltLERP();
    initCrossingPanda();
    initPeekingPanda();
    initEvents();
    initParticleCanvas();
    initMusicSynth();

    pages[0].classList.add('active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
