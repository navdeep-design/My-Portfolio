/// =====================================================
/// NAVDEEP SHARMA — PORTFOLIO SCRIPT.JS
/// Modular Vanilla JS — Zero frameworks, zero errors
/// Har section ke baad comments likhe hain (Hinglish)
/// =====================================================

'use strict';

/// =====================================================
/// CONSTANTS & STATE
/// Puri app ki state ek jagah manage hoti hai
/// =====================================================
const STATE = {
  theme: 'dark',           // current theme
  activeSection: 'hero',   // active nav section
  projectsData: [],         // JSON se loaded projects
  achievementsData: [],     // JSON se loaded achievements
  skillsData: {},           // JSON se loaded skills
  activeFilter: 'all',     // project filter
  activeSkillTab: 'programming', // skill tab
  isMenuOpen: false,        // mobile menu state
  isSearchOpen: false,      // search box state
  skillBarsAnimated: false, // skill bars sirf ek baar animate hongi
};

/// Search ke liye indexable items — sections aur projects dono
const SEARCH_INDEX = [
  { title: 'Home',         href: '#hero',         icon: '🏠' },
  { title: 'About',        href: '#about',        icon: '👤' },
  { title: 'Skills',       href: '#skills',       icon: '⚡' },
  { title: 'Projects',     href: '#projects',     icon: '🚀' },
  { title: 'Achievements', href: '#achievements', icon: '🏆' },
  { title: 'Journey',      href: '#journey',      icon: '🗺️' },
  { title: 'Contact',      href: '#contact',      icon: '📬' },
];

/// Typing animation ke liye words list
const TYPING_WORDS = [
  'CS Student 🎓',
  'Web Developer 🌐',
  'C/C++ Programmer ⚙️',
  'DSA Enthusiast 🌲',
  'Problem Solver 💡',
  'Open Source Fan 🐙',
];

/// =====================================================
/// UTILITY FUNCTIONS
/// Chhoti chhoti helper functions jo baar baar use hongi
/// =====================================================

/// DOM element select karne ka shorthand
function $(selector, context = document) {
  return context.querySelector(selector);
}

function $$(selector, context = document) {
  return [...context.querySelectorAll(selector)];
}

/// Toast notification dikhane ka function
/// type: 'success' | 'error' | 'info'
function showToast(message, type = 'success', duration = 3500) {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span aria-hidden="true">${icons[type]}</span> ${message}`;
  toast.setAttribute('role', 'status');
  container.appendChild(toast);

  /// Auto remove after duration
  const removeToast = () => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 350);
  };
  setTimeout(removeToast, duration);
  toast.addEventListener('click', removeToast); // Click pe bhi hata do
}

/// =====================================================
/// LOADING SCREEN
/// Page load hote hi fade out hoga
/// Future: add lottie animation ya progress tracking
/// =====================================================
function initLoadingScreen() {
  const screen = $('#loading-screen');
  if (!screen) return;

  /// Minimum 1.8s dikhao taki animation complete ho
  const minTime = new Promise(res => setTimeout(res, 1800));
  const domReady = new Promise(res => {
    if (document.readyState === 'complete') res();
    else window.addEventListener('load', res);
  });

  Promise.all([minTime, domReady]).then(() => {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
    /// Scroll reveal start karo loading ke baad
    revealOnScroll();
  });

  document.body.style.overflow = 'hidden';
}

/// =====================================================
/// PARTICLE BACKGROUND
/// Canvas pe floating dots render karta hai
/// Mouse movement se bhi react karta hai
/// Future: speed, count, color sab configurable banana
/// =====================================================
function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;

  /// Canvas size set karo window ke equal
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /// Ek particle ka blueprint
  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      /// Random colors: purple, cyan, blue
      color: ['139,92,246', '6,182,212', '59,130,246'][Math.floor(Math.random()*3)],
    };
  }

  function initParticleArray() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  /// Animation loop — requestAnimationFrame se smooth hai
  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      /// Move karo
      p.x += p.vx;
      p.y += p.vy;

      /// Boundary bounce — edges se reflect hoga
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      /// Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });

    /// Nearby particles ke beech line draw karo (connection effect)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  initParticleArray();
  animate();
  window.addEventListener('resize', () => { resize(); });
}

/// =====================================================
/// CUSTOM CURSOR
/// Mouse move pe dot aur ring follow karte hain
/// Hover pe ring badi ho jaati hai
/// =====================================================
function initCursor() {
  /// Mobile pe cursor disable hai (CSS se)
  if (window.innerWidth <= 768) return;

  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  /// Mouse position track karo
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  /// Ring ko smooth follow karna — lerp se
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /// Hover pe ring badi kar do (interactive elements pe)
  const hoverTargets = 'a, button, .skill-card, .project-card, .filter-btn, .skill-tab';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovering');
  });

  /// Page se bahar jane pe cursor hide kar do
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/// =====================================================
/// SCROLL PROGRESS BAR
/// Scroll percentage se top bar ki width change hoti hai
/// =====================================================
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/// =====================================================
/// NAVBAR — Scroll, Active Section, Back to Top
/// Navbar scroll pe glassmorphism le leti hai
/// Active section highlight hota rehta hai
/// =====================================================
function initNavbar() {
  const navbar  = $('#navbar');
  const backBtn = $('#back-to-top');
  const links   = $$('.nav-link');
  const sections = $$('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    /// Scrolled class add karo navbar pe
    navbar.classList.toggle('scrolled', scrollY > 50);

    /// Back to top button dikhao/chhupao
    if (backBtn) {
      if (scrollY > 400) {
        backBtn.hidden = false;
      } else {
        backBtn.hidden = true;
      }
    }

    /// Active section detect karo (viewport center method)
    const viewportMid = scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (viewportMid >= top && viewportMid < bottom) {
        const id = section.id;
        if (STATE.activeSection !== id) {
          STATE.activeSection = id;
          links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
        }
      }
    });
  }, { passive: true });

  /// Back to top click
  backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /// Smooth scroll for all nav links
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    closeMenu();
  });
}

/// =====================================================
/// MOBILE MENU — Hamburger toggle
/// Open/close mobile nav aur aria attributes update
/// =====================================================
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    STATE.isMenuOpen = !STATE.isMenuOpen;
    hamburger.classList.toggle('open', STATE.isMenuOpen);
    mobileNav.classList.toggle('open', STATE.isMenuOpen);
    hamburger.setAttribute('aria-expanded', STATE.isMenuOpen);
    mobileNav.setAttribute('aria-hidden', !STATE.isMenuOpen);
  });

  /// Mobile nav links click pe close kar do
  $$('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));
}

function closeMenu() {
  STATE.isMenuOpen = false;
  $('#hamburger')?.classList.remove('open');
  $('#mobile-nav')?.classList.remove('open');
  $('#hamburger')?.setAttribute('aria-expanded', 'false');
  $('#mobile-nav')?.setAttribute('aria-hidden', 'true');
}

/// =====================================================
/// DARK / LIGHT MODE TOGGLE
/// localStorage me save hota hai preference
/// CSS variables automatically swap ho jaate hain
/// =====================================================
function initThemeToggle() {
  const btn  = $('#theme-toggle');
  const icon = btn?.querySelector('.theme-icon');
  if (!btn) return;

  /// Saved theme load karo
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const newTheme = STATE.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info', 2000);
  });

  function applyTheme(theme) {
    STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/// =====================================================
/// SEARCH BAR
/// Sections aur projects dono me search hoga
/// Results click pe smooth scroll karta hai
/// =====================================================
function initSearch() {
  const toggle   = $('#search-toggle');
  const box      = $('#search-box');
  const input    = $('#search-input');
  const results  = $('#search-results');
  if (!toggle || !box) return;

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    STATE.isSearchOpen = !STATE.isSearchOpen;
    box.classList.toggle('open', STATE.isSearchOpen);
    toggle.setAttribute('aria-expanded', STATE.isSearchOpen);
    if (STATE.isSearchOpen) { input.focus(); renderSearchResults(''); }
  });

  input.addEventListener('input', () => renderSearchResults(input.value.trim()));
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
  });

  /// Outside click pe close karo
  document.addEventListener('click', e => {
    if (!e.target.closest('#search-wrap')) closeSearch();
  });

  function closeSearch() {
    STATE.isSearchOpen = false;
    box.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    input.value = '';
    results.innerHTML = '';
  }

  function renderSearchResults(query) {
    const q = query.toLowerCase();
    /// Sections + projects dono search karo
    const combined = [
      ...SEARCH_INDEX,
      ...STATE.projectsData.map(p => ({
        title: p.title,
        href: '#projects',
        icon: '🚀',
        sub: p.technologies.join(', '),
      })),
    ];

    const filtered = q
      ? combined.filter(item =>
          item.title.toLowerCase().includes(q) ||
          (item.sub && item.sub.toLowerCase().includes(q))
        )
      : combined.slice(0, 7); /// Default — top 7 items show karo

    if (filtered.length === 0) {
      results.innerHTML = `<p class="search-no-result">No results for "${query}"</p>`;
      return;
    }

    results.innerHTML = filtered.slice(0, 8).map(item => `
      <a href="${item.href}" class="search-result-item" role="option">
        <span aria-hidden="true">${item.icon}</span>
        <span>${item.title}</span>
        ${item.sub ? `<span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto">${item.sub.split(',')[0]}</span>` : ''}
      </a>
    `).join('');

    /// Result links pe click karo toh search band ho
    $$('.search-result-item', results).forEach(el => {
      el.addEventListener('click', () => closeSearch());
    });
  }
}

/// =====================================================
/// TYPING ANIMATION
/// TYPING_WORDS array me se ek ek character type hota hai
/// Backspace effect bhi hai
/// =====================================================
function initTypingAnimation() {
  const el = $('#typed-text');
  if (!el) return;

  let wordIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const word = TYPING_WORDS[wordIdx];
    const display = isDeleting
      ? word.substring(0, charIdx - 1)
      : word.substring(0, charIdx + 1);

    el.textContent = display;
    charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === word.length) {
      /// Word complete hua — thodo ruko phir delete karo
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      /// Delete complete — next word pe jao
      isDeleting = false;
      wordIdx = (wordIdx + 1) % TYPING_WORDS.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  type();
}

/// =====================================================
/// REVEAL ON SCROLL (IntersectionObserver)
/// Elements viewport me aate hi animate honge
/// CSS classes toggle hoti hain
/// =====================================================
function initScrollReveal() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Sirf ek baar animate karo
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/// Baad me add hone wale elements ke liye bhi reveal lagao
function revealOnScroll() {
  setTimeout(initScrollReveal, 100);
}

/// =====================================================
/// COUNTER ANIMATION (About Section goals)
/// Data-target attribute se target number liya jaata hai
/// =====================================================
function initCounters() {
  const counters = $$('.goal-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 30);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/// =====================================================
/// DATA LOADING — JSON files se fetch karta hai
/// Error handling bhi hai — agar file mile nahi
/// =====================================================
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    return await res.json();
  } catch (err) {
    console.warn(`[Portfolio] Could not load ${path}:`, err.message);
    return null;
  }
}

async function loadAllData() {
  /// Parallel load karo performance ke liye
  const [projects, achievements, skills] = await Promise.all([
    loadJSON('projects.json'),
    loadJSON('achievements.json'),
    loadJSON('skills.json'),
  ]);

  if (projects)      { STATE.projectsData = projects; }
  if (achievements)  { STATE.achievementsData = achievements; }
  if (skills)        { STATE.skillsData = skills; }
}

/// =====================================================
/// SKILLS SECTION
/// Tab switch pe skill cards re-render hote hain
/// Bar animation IntersectionObserver se hoti hai
/// =====================================================
function initSkills() {
  const tabs = $$('.skill-tab');
  const grid = $('#skills-grid');
  if (!grid) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      STATE.activeSkillTab = tab.dataset.category;
      STATE.skillBarsAnimated = false;
      renderSkills(STATE.activeSkillTab);
    });
  });

  renderSkills('programming');
}

function renderSkills(category) {
  const grid = $('#skills-grid');
  if (!grid) return;

  const data = STATE.skillsData[category];

  if (!data || data.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚡</div><p>No skills found in this category.</p></div>`;
    return;
  }

  grid.innerHTML = data.map((skill, i) => `
    <div class="skill-card" style="animation-delay:${i * 0.07}s; --skill-color:${skill.color}; --skill-glow: 0 0 20px ${skill.color}33">
      <div class="skill-icon" aria-hidden="true">${skill.icon}</div>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-bar-wrap" role="progressbar" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100" aria-label="${skill.name} proficiency ${skill.level}%">
        <div class="skill-bar-fill" data-level="${skill.level}" style="background:${skill.color}"></div>
      </div>
      <div class="skill-level-text">${skill.level}%</div>
    </div>
  `).join('');

  /// Bars animate karo — IntersectionObserver ke saath
  animateSkillBars();
  revealOnScroll();
}

function animateSkillBars() {
  const bars = $$('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.dataset.level;
        setTimeout(() => { bar.style.width = level + '%'; }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

/// =====================================================
/// PROJECTS SECTION
/// JSON data se cards render hote hain
/// Filter buttons se category-wise filter hota hai
/// =====================================================
function initProjects() {
  const grid       = $('#projects-grid');
  const filterBtns = $$('.filter-btn');
  if (!grid) return;

  /// Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.activeFilter = btn.dataset.filter;
      renderProjects(STATE.activeFilter);
    });
  });

  renderProjects('all');
}

function renderProjects(filter) {
  const grid    = $('#projects-grid');
  const loading = $('#projects-loading');
  if (!grid) return;

  if (loading) loading.remove();

  const filtered = filter === 'all'
    ? STATE.projectsData
    : STATE.projectsData.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No projects found for this filter. More coming soon!</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => `
    <article class="project-card" style="animation-delay:${i * 0.08}s" data-id="${p.id}" aria-label="${p.title} project card">
      <div class="project-card-top">
        <h3 class="project-title">${escapeHTML(p.title)}</h3>
        <span class="status-badge ${p.status}" aria-label="Status: ${p.statusLabel}">${p.statusLabel}</span>
      </div>
      <p class="project-desc">${escapeHTML(p.description)}</p>
      <div class="project-tech" aria-label="Technologies used">
        ${p.technologies.map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`).join('')}
      </div>
      <div class="project-actions">
        <button class="project-btn project-btn-details" onclick="openProjectModal(${p.id})" aria-label="View details for ${p.title}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Details
        </button>
        <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-btn" aria-label="View ${p.title} on GitHub">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
          GitHub
        </a>
        ${p.live && p.live !== '#' ? `
          <a href="${p.live}" target="_blank" rel="noopener noreferrer" class="project-btn" aria-label="View live demo of ${p.title}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Live
          </a>` : ''}
      </div>
    </article>
  `).join('');

  revealOnScroll();
}

/// Project modal kholo — details dikhao
window.openProjectModal = function(id) {
  const project = STATE.projectsData.find(p => p.id === id);
  if (!project) return;

  const overlay = $('#modal-overlay');
  const content = $('#modal-content');
  if (!overlay || !content) return;

  content.innerHTML = `
    <span class="status-badge ${project.status}" style="margin-bottom:12px;display:inline-block">${project.statusLabel} · ${project.year}</span>
    <h2 id="modal-title">${escapeHTML(project.title)}</h2>
    <p>${escapeHTML(project.longDescription)}</p>
    <div class="project-tech" style="margin-bottom:24px" aria-label="Technologies">
      ${project.technologies.map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`).join('')}
    </div>
    <div class="project-actions">
      <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size:0.85rem;padding:8px 16px" aria-label="View on GitHub">GitHub</a>
      ${project.live && project.live !== '#' ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.85rem;padding:8px 16px" aria-label="Live Demo">Live Demo</a>` : ''}
    </div>
  `;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlay.querySelector('#modal-close')?.focus();
};

function closeModal() {
  const overlay = $('#modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initModal() {
  $('#modal-close')?.addEventListener('click', closeModal);
  $('#modal-overlay')?.addEventListener('click', e => {
    if (e.target === $('#modal-overlay')) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/// =====================================================
/// ACHIEVEMENTS TIMELINE
/// JSON se data load hoga aur timeline render hoga
/// Alternating left-right layout hai
/// =====================================================
function renderAchievements() {
  const timeline = $('#achievements-timeline');
  if (!timeline) return;

  const data = STATE.achievementsData;

  if (!data || data.length === 0) {
    timeline.innerHTML = `<div class="empty-state"><div class="empty-icon">🏆</div><p>Achievements loading...</p></div>`;
    return;
  }

  timeline.innerHTML = data.map((item, i) => `
    <div class="timeline-item ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}" role="listitem">
      <div class="timeline-dot" aria-hidden="true">${item.badge}</div>
      <div class="glass-card timeline-card">
        <span class="timeline-year">${item.year}</span>
        <h3 class="timeline-title">${escapeHTML(item.title)}</h3>
        <p class="timeline-desc">${escapeHTML(item.description)}</p>
      </div>
    </div>
  `).join('');

  revealOnScroll();
}

/// =====================================================
/// CONTACT FORM — Validation + Submit
/// localStorage me draft save hota hai
/// =====================================================
function initContactForm() {
  const form      = $('#contact-form');
  const clearBtn  = $('#form-clear');
  const copyEmail = $('#copy-email');

  if (!form) return;

  /// Copy email to clipboard
  copyEmail?.addEventListener('click', () => {
    navigator.clipboard.writeText('navdeep@example.com')
      .then(() => showToast('Email copied to clipboard!', 'success'))
      .catch(() => showToast('Could not copy email', 'error'));
  });

  /// Clear form
  clearBtn?.addEventListener('click', () => {
    form.reset();
    clearErrors();
    showToast('Form cleared!', 'info', 2000);
  });

  /// Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    /// Simulate sending (no backend — just show success)
    const btn = $('#form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    setTimeout(() => {
      showToast('Message sent successfully! I\'ll get back to you soon. 😊', 'success', 4000);
      form.reset();
      clearErrors();
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send Message`;
    }, 1500);
  });

  function validateForm() {
    clearErrors();
    let valid = true;

    const name    = $('#contact-name');
    const email   = $('#contact-email');
    const message = $('#contact-message');

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'name-error', 'Please enter your full name (min. 2 characters)');
      valid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      showError(email, 'email-error', 'Please enter a valid email address');
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, 'message-error', 'Message must be at least 10 characters');
      valid = false;
    }

    return valid;
  }

  function showError(input, errorId, msg) {
    input.classList.add('error');
    const errEl = $(`#${errorId}`);
    if (errEl) errEl.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearErrors() {
    $$('.form-group input, .form-group textarea').forEach(el => {
      el.classList.remove('error');
      el.removeAttribute('aria-invalid');
    });
    $$('.field-error').forEach(el => el.textContent = '');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/// =====================================================
/// FOOTER — Auto year update
/// =====================================================
function initFooter() {
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/// =====================================================
/// KEYBOARD NAVIGATION
/// Tab key se navigation accessible hai
/// Escape key modals aur menus close karta hai
/// =====================================================
function initKeyboard() {
  document.addEventListener('keydown', e => {
    /// Escape pe search aur modal close karo
    if (e.key === 'Escape') {
      const searchBox = $('#search-box');
      if (searchBox?.classList.contains('open')) {
        $('#search-toggle')?.click();
        return;
      }
      const modal = $('#modal-overlay');
      if (modal?.classList.contains('open')) {
        closeModal();
        return;
      }
      if (STATE.isMenuOpen) closeMenu();
    }
  });
}

/// =====================================================
/// XSS PROTECTION — User-controlled data ko escape karo
/// JSON se HTML directly inject nahi karna chahiye
/// =====================================================
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/// =====================================================
/// MAIN INIT FUNCTION
/// Sab kuch yahan orchestrate hota hai
/// DOMContentLoaded ke baad run hoga
/// =====================================================
async function init() {
  try {
    /// Loading screen pehle start karo
    initLoadingScreen();

    /// Background effects
    initParticles();
    initCursor();
    initScrollProgress();

    /// UI components
    initNavbar();
    initMobileMenu();
    initThemeToggle();
    initSearch();
    initTypingAnimation();
    initModal();
    initFooter();
    initKeyboard();

    /// Data load karo phir sections render karo
    await loadAllData();

    /// Data-dependent sections
    initSkills();
    initProjects();
    renderAchievements();

    /// Counter aur scroll animations
    initCounters();
    initScrollReveal();

    console.log('[Portfolio] ✅ Navdeep Sharma Portfolio loaded successfully!');
  } catch (err) {
    console.error('[Portfolio] ❌ Initialization error:', err);
    showToast('Something went wrong loading the portfolio. Please refresh.', 'error', 5000);
  }
}

/// =====================================================
/// START — DOM ready hote hi sab shuru hoga
/// =====================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); /// Already loaded hai
}