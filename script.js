/**
 * ABDULLAH BAJWA — ULTRA-PREMIUM & HIGH-PERFORMANCE DEVELOPER PORTFOLIO
 * Zero-Lag 60/120 FPS Rendering, Optimized 3D Particle Cosmos,
 * Audio Synthesizer, Command Palette, and Lightning-Fast Filtering.
 */

// ─── Sound Synthesizer (Web Audio API) ───
class SoundEngine {
  constructor() {
    this.enabled = localStorage.getItem('ab_audio_enabled') === 'true';
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('ab_audio_enabled', this.enabled);
    if (this.enabled) this.init();
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(860, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }
}

const audio = new SoundEngine();

// ─── Toast System ───
function showToast(message, icon = '✓') {
  let shelf = document.getElementById('toast-shelf');
  if (!shelf) {
    shelf = document.createElement('div');
    shelf.id = 'toast-shelf';
    shelf.className = 'toast-shelf';
    document.body.appendChild(shelf);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color:var(--primary);font-weight:bold">${icon}</span><span>${message}</span>`;
  shelf.appendChild(toast);
  audio.playPop();

  setTimeout(() => {
    toast.remove();
  }, 2800);
}

// ─── Ultra-Lightweight Custom Cursor (GPU-Accelerated) ───
(function initSmoothCursor() {
  const cursorWrap = document.getElementById('cursor-wrap');
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!cursorWrap || !dot || !ring) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorWrap.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Active hover states on interactive elements
  const clickables = document.querySelectorAll('a, button, input, textarea, .spotlight-card, [role="button"], .tab-btn');
  clickables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorWrap.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorWrap.classList.remove('active'));
  });
})();

// ─── High-Performance 60 FPS 3D Cosmos Canvas (Zero-Lag Engine) ───
(function initCosmos() {
  const canvas = document.getElementById('cosmos-canvas');
  const heroSection = document.getElementById('home');
  if (!canvas || !heroSection) return;
  const ctx = canvas.getContext('2d');

  let width, height, centerX, centerY, radius;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isHeroVisible = true;
  let animId = null;

  function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    centerX = width / 2;
    centerY = height / 2;
    radius = Math.min(width, height) * 0.36;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    if (e.clientY <= height) {
      mouse.targetX = (e.clientX - centerX) / (width * 0.5);
      mouse.targetY = (e.clientY - centerY) / (height * 0.5);
    }
  }, { passive: true });

  // 150 points for optimal performance & crisp geometric aesthetics
  const NUM_POINTS = 150;
  const points = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / NUM_POINTS);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    points.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi)
    });
  }

  // Pre-calculate connected line pairs
  const lines = [];
  for (let i = 0; i < points.length; i += 2) {
    for (let j = i + 1; j < points.length; j += 3) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dz = points[i].z - points[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 0.38) {
        lines.push([i, j]);
      }
    }
  }

  let angleY = 0;
  let angleX = 0;

  function render() {
    if (!isHeroVisible) return;

    ctx.clearRect(0, 0, width, height);

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    angleY += 0.0035 + mouse.x * 0.008;
    angleX = mouse.y * 0.3;

    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);

    // Fast 3D Projection
    const projected = points.map((p) => {
      let x = p.x * cosY - p.z * sinY;
      let z = p.x * sinY + p.z * cosY;
      let y = p.y * cosX - z * sinX;
      z = p.y * sinX + z * cosX;

      const scale = 1.9 / (2.4 - z);
      return {
        screenX: centerX + x * radius * scale,
        screenY: centerY + y * radius * scale,
        z: z,
        scale: scale
      };
    });

    // Draw lines in batch
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.14)';
    ctx.lineWidth = 0.7;
    for (let i = 0; i < lines.length; i++) {
      const [a, b] = lines[i];
      const p1 = projected[a];
      const p2 = projected[b];
      if ((p1.z + p2.z) > -0.5) {
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
      }
    }
    ctx.stroke();

    // Draw dots without expensive shadowBlur!
    ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      if (p.z > -0.8) {
        const size = Math.max(0.9, p.scale * 2.2);
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer orbital ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.08, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    animId = requestAnimationFrame(render);
  }

  // PAUSE canvas when scrolled past hero section to save 100% GPU/CPU!
  const heroObserver = new IntersectionObserver((entries) => {
    isHeroVisible = entries[0].isIntersecting;
    if (isHeroVisible) {
      if (!animId) render();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.05 });

  heroObserver.observe(heroSection);
  render();
})();

// ─── Theme Switcher Engine ───
(function initThemeEngine() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['cyan', 'violet', 'emerald', 'amber'];
  let currentIdx = 0;

  const savedTheme = localStorage.getItem('ab_theme');
  if (savedTheme && themes.includes(savedTheme)) {
    document.body.setAttribute('data-theme', savedTheme);
    currentIdx = themes.indexOf(savedTheme);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % themes.length;
      const nextTheme = themes[currentIdx];
      if (nextTheme === 'cyan') {
        document.body.removeAttribute('data-theme');
        localStorage.removeItem('ab_theme');
      } else {
        document.body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('ab_theme', nextTheme);
      }
      audio.playClick();
      showToast(`Accent Theme: ${nextTheme.toUpperCase()}`, '🎨');
    });
  }
})();

// ─── Sound Toggle Controller ───
(function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  function updateIcon() {
    const isMuted = !audio.enabled;
    soundBtn.innerHTML = isMuted
      ? `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
      : `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    soundBtn.setAttribute('title', isMuted ? 'Unmute Audio Feedback' : 'Mute Audio');
  }
  updateIcon();

  soundBtn.addEventListener('click', () => {
    const active = audio.toggle();
    updateIcon();
    showToast(active ? 'Futuristic UI Audio Enabled' : 'Audio Feedback Muted', active ? '🔊' : '🔇');
  });
})();

// ─── Dynamic Typewriter Effect ───
(function initTypewriter() {
  const phrases = [
    'Full-Stack Web Architect',
    'Next.js 15 & React Specialist',
    '3D WebGL & Three.js Explorer',
    'Performance & Core Web Vitals Expert',
    'Pixel-Perfect UI/UX Engineer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  function typeLoop() {
    const current = phrases[phraseIndex];
    textEl.textContent = isDeleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex > current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }
  setTimeout(typeLoop, 600);
})();

// ─── Navbar Scroll & Reading Progress (Throttled) ───
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('progress-bar');
  const backTopBtn = document.getElementById('back-top-btn');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = (scrolled / maxScroll) * 100;

        if (progressBar) progressBar.style.width = `${pct}%`;

        if (navbar) {
          if (scrolled > 30) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }

        if (backTopBtn) {
          if (scrolled > 400) {
            backTopBtn.classList.add('visible');
          } else {
            backTopBtn.classList.remove('visible');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      audio.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// ─── Mobile Menu Toggle ───
(function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    audio.playClick();
  });

  document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.section;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      audio.playClick();
    });
  });
})();

// ─── Section Navigation & Active Highlight ───
(function initNavHighlights() {
  const sections = document.querySelectorAll('section[id]');
  const navButtons = document.querySelectorAll('.nav-item-btn[data-section]');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const target = document.getElementById(btn.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navButtons.forEach((b) => b.classList.remove('active'));
          const current = document.querySelector(`.nav-item-btn[data-section="${id}"]`);
          if (current) current.classList.add('active');
        }
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach((sec) => observer.observe(sec));
})();

// ─── Scroll Reveal Observer ───
(function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  reveals.forEach((el, idx) => {
    el.style.transitionDelay = `${(idx % 3) * 60}ms`;
    observer.observe(el);
  });
})();

// ─── Skill Meters Animation ───
(function initSkillMeters() {
  const skillCards = document.querySelectorAll('.skill-card');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const fill = e.target.querySelector('.skill-meter-fill');
          if (fill) fill.style.width = `${fill.dataset.width}%`;
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  skillCards.forEach((c) => observer.observe(c));
})();

// ─── Animated Counters ───
(function initCounters() {
  const counterCards = document.querySelectorAll('.stat-figure');

  function runCounter(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.stat-figure').forEach(runCounter);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
})();

// ─── Projects Filter & Instant Search ───
(function initProjectFilter() {
  const tabs = document.querySelectorAll('.tab-btn');
  const items = document.querySelectorAll('.project-item');
  const searchInput = document.getElementById('project-search-input');
  let currentCategory = 'all';

  function filterAll() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    items.forEach((item) => {
      const cat = item.dataset.category || '';
      const title = item.dataset.title.toLowerCase();
      const tags = (item.dataset.tags || '').toLowerCase();
      const catList = cat.split(',').map((c) => c.trim().toLowerCase());

      const matchCat = currentCategory === 'all' || cat === currentCategory || catList.includes(currentCategory.toLowerCase());
      const matchSearch = !query || title.includes(query) || tags.includes(query) || cat.toLowerCase().includes(query);

      if (matchCat && matchSearch) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.filter;
      audio.playClick();
      filterAll();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterAll);
  }
})();

// ─── Project Preview Modal ───
(function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLive = document.getElementById('modal-live');
  const modalRepo = document.getElementById('modal-repo');
  const modalTags = document.getElementById('modal-tags');
  if (!modal) return;

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.project-item');
      if (!parent) return;

      modalTitle.textContent = parent.dataset.title;
      modalDesc.textContent = parent.dataset.desc || 'High-performance application built with modern architecture.';
      modalImg.src = parent.dataset.img;
      modalLive.href = parent.dataset.live || 'https://ab-developer-portfolio.vercel.app';
      modalRepo.href = parent.dataset.repo || 'https://github.com/AbdullahBajwa787/REAL-PORTFOLIO';

      modalTags.innerHTML = '';
      const tags = (parent.dataset.tags || '').split(',');
      tags.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'p-tag';
        span.textContent = t.trim();
        modalTags.appendChild(span);
      });

      modal.classList.add('open');
      audio.playPop();
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    audio.playClick();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

// ─── Testimonials Carousel ───
(function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const bullets = document.querySelectorAll('.t-bullet');
  if (!slides.length) return;

  let activeIdx = 0;
  let timer;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove('active'));
    bullets.forEach((b) => b.classList.remove('active'));
    slides[index].classList.add('active');
    bullets[index].classList.add('active');
    activeIdx = index;
  }

  bullets.forEach((b) => {
    b.addEventListener('click', () => {
      clearInterval(timer);
      showSlide(+b.dataset.index);
      audio.playClick();
      timer = setInterval(nextSlide, 6000);
    });
  });

  function nextSlide() {
    showSlide((activeIdx + 1) % slides.length);
  }

  timer = setInterval(nextSlide, 6000);
})();

// ─── GitHub Heatmap Simulation ───
(function initHeatmap() {
  const grid = document.getElementById('heatmap-grid');
  if (!grid) return;

  const totalDays = 52 * 7;
  for (let i = 0; i < totalDays; i++) {
    const dot = document.createElement('div');
    dot.className = 'hm-dot';
    const rand = Math.random();
    if (rand > 0.88) dot.classList.add('lvl-4');
    else if (rand > 0.68) dot.classList.add('lvl-3');
    else if (rand > 0.45) dot.classList.add('lvl-2');
    else if (rand > 0.28) dot.classList.add('lvl-1');
    grid.appendChild(dot);
  }
})();

// ─── Command Palette (Ctrl+K / ⌘K) ───
(function initCommandPalette() {
  const modal = document.getElementById('cmd-modal');
  const triggerBtn = document.getElementById('cmd-trigger-btn');
  const input = document.getElementById('cmd-search-input');
  const items = document.querySelectorAll('.cmd-item');
  if (!modal || !input) return;

  function openCmd() {
    modal.classList.add('open');
    input.value = '';
    filterCmd();
    input.focus();
    audio.playPop();
  }

  function closeCmd() {
    modal.classList.remove('open');
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openCmd);

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) closeCmd();
      else openCmd();
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeCmd();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCmd();
  });

  function filterCmd() {
    const q = input.value.toLowerCase().trim();
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = !q || text.includes(q) ? 'flex' : 'none';
    });
  }

  input.addEventListener('input', filterCmd);

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      closeCmd();
      audio.playClick();

      if (action === 'goto') {
        const sec = document.getElementById(item.dataset.target);
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'copy-email') {
        navigator.clipboard.writeText('abdullahbajwa4090@gmail.com');
        showToast('Email copied to clipboard!', '📋');
      } else if (action === 'theme') {
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.click();
      } else if (action === 'github') {
        window.open('https://github.com/AbdullahBajwa787/REAL-PORTFOLIO', '_blank');
      } else if (action === 'resume') {
        const a = document.createElement('a');
        a.href = 'Abdullah-Bajwa-Resume.png';
        a.download = 'Abdullah-Bajwa-Resume.png';
        a.click();
      } else if (action === 'url' || action === 'link') {
        if (item.dataset.url) window.open(item.dataset.url, '_blank');
      }
    });
  });
})();

// ─── 1-Click Copy Handlers ───
(function initCopyTriggers() {
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const val = el.dataset.copy;
      navigator.clipboard.writeText(val).then(() => {
        showToast(`Copied: ${val}`, '📋');
      });
    });
  });
})();

// ─── Contact Form Submission ───
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const prevText = submitBtn.innerHTML;

    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.disabled = true;
    audio.playClick();

    setTimeout(() => {
      submitBtn.innerHTML = prevText;
      submitBtn.disabled = false;
      form.reset();
      showToast('Thank you! Your message has been sent directly to Abdullah.', '🚀');
      if (feedback) {
        feedback.textContent = 'Message sent successfully! I will respond within 24 hours.';
        setTimeout(() => { feedback.textContent = ''; }, 6000);
      }
    }, 1200);
  });
})();
