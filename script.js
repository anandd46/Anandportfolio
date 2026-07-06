/* ==========================================================================
   ANAND D — PORTFOLIO SCRIPT
   ========================================================================== */
(() => {
  'use strict';

  const GITHUB_USER = 'anandd46';
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     LOADER
  ------------------------------------------------------------------ */
  function initLoader() {
    const loader = $('#loader');
    const pctEl = $('#loaderPct');
    const ring = $('#loaderRing');
    let pct = 0;
    const total = 163.4;
    const iv = setInterval(() => {
      pct += Math.random() * 18 + 6;
      if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.add('loaded');
          startEntranceReveals();
        }, 280);
      }
      pctEl.textContent = Math.floor(pct) + '%';
      ring.style.strokeDashoffset = total - (total * pct / 100);
    }, 140);

    // hard fallback
    setTimeout(() => loader && loader.classList.add('hidden'), 3500);
  }

  function startEntranceReveals() {
    $$('.hero .reveal-up, .hero .reveal-scale').forEach(el => el.classList.add('in-view'));
  }

  /* ------------------------------------------------------------------
     CUSTOM CURSOR
  ------------------------------------------------------------------ */
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();
    const hoverables = 'a, button, input, textarea, select, .orbit-item, .filter-chip, [data-hover]';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) ring.classList.add('hovered');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) ring.classList.remove('hovered');
    });
  }

  /* ------------------------------------------------------------------
     PARTICLE CANVAS
  ------------------------------------------------------------------ */
  function initParticles() {
    const canvas = $('#particleCanvas');
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function makeParticles() {
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(56,189,248,0.5)';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!prefersReducedMotion) requestAnimationFrame(tick);
    }
    resize(); makeParticles();
    if (!prefersReducedMotion) tick(); else tick();
    window.addEventListener('resize', () => { resize(); makeParticles(); });
  }

  /* ------------------------------------------------------------------
     SPOTLIGHT
  ------------------------------------------------------------------ */
  function initSpotlight() {
    const spot = $('#spotlight');
    window.addEventListener('mousemove', e => {
      spot.style.left = e.clientX + 'px';
      spot.style.top = e.clientY + 'px';
    });
  }

  /* ------------------------------------------------------------------
     SCROLL PROGRESS + NAVBAR HIDE + SCROLLSPY + BACK TO TOP
  ------------------------------------------------------------------ */
  function initScrollUX() {
    const bar = $('#scrollBar');
    const navbar = $('#navbar');
    const backTop = $('#backToTop');
    const links = $$('.nav-link');
    const sections = links.map(l => document.getElementById(l.dataset.section)).filter(Boolean);
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

      if (y > lastY && y > 140) navbar.classList.add('nav-hidden');
      else navbar.classList.remove('nav-hidden');
      lastY = y;

      backTop.classList.toggle('show', y > 600);

      let current = sections[0];
      const probe = y + window.innerHeight * 0.3;
      sections.forEach(sec => { if (sec.offsetTop <= probe) current = sec; });
      links.forEach(l => l.classList.toggle('active', current && l.dataset.section === current.id));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ------------------------------------------------------------------
     MOBILE NAV
  ------------------------------------------------------------------ */
  function initMobileNav() {
    const burger = $('#navBurger');
    const links = $('#navLinks');
    burger.addEventListener('click', () => links.classList.toggle('open'));
    $$('.nav-link').forEach(l => l.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ------------------------------------------------------------------
     REVEAL ON SCROLL
  ------------------------------------------------------------------ */
  function initReveals() {
    const els = $$('.reveal-up, .reveal-scale');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------------
     TYPING TEXT
  ------------------------------------------------------------------ */
  function initTyping() {
    const el = $('#typingText');
    const words = ['intelligent software.', 'AI-powered products.', 'clean, usable interfaces.', 'tools people return to.'];
    let wi = 0, ci = 0, deleting = false;

    function tick() {
      const word = words[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  }

  /* ------------------------------------------------------------------
     TECH ORBIT
  ------------------------------------------------------------------ */
  function initOrbit() {
    const wrap = $('#orbitWrap');
    const tooltip = $('#orbitTooltip');
    const techs = [
      { n: 'Py',  name: 'Python',        ring: 1, desc: 'Primary language for ML, scripting & backend logic.' },
      { n: 'ML',  name: 'Machine Learning', ring: 1, desc: 'Model building, evaluation and applied prediction tasks.' },
      { n: 'JS',  name: 'JavaScript',    ring: 1, desc: 'Interactive, dependency-free front-end engineering.' },
      { n: 'NLP', name: 'NLP',           ring: 2, desc: 'Intent detection & language understanding for chatbots.' },
      { n: 'Git', name: 'Git',           ring: 2, desc: 'Version control across every project in this portfolio.' },
      { n: 'Mgo', name: 'MongoDB',       ring: 2, desc: 'Document storage for flexible full-stack apps.' },
      { n: 'Rct', name: 'React',         ring: 2, desc: 'Component-based UI work for larger apps.' },
      { n: 'LLM', name: 'LLMs',          ring: 3, desc: 'Building on Gemini & other LLM APIs for real tools.' },
      { n: 'Skl', name: 'Scikit-learn',  ring: 3, desc: 'Classical ML pipelines: classification & regression.' },
      { n: 'Pd',  name: 'Pandas',        ring: 3, desc: 'Data wrangling for every ML project in this portfolio.' },
      { n: 'C#',  name: 'C#',            ring: 3, desc: 'Desktop & full-stack app development.' },
    ];
    const ringRadius = { 1: 110, 2: 160, 3: 210 };
    const ringCounts = { 1: 0, 2: 0, 3: 0 };
    techs.forEach(t => ringCounts[t.ring]++);
    const ringIndex = { 1: 0, 2: 0, 3: 0 };

    techs.forEach(t => {
      const idx = ringIndex[t.ring]++;
      const count = ringCounts[t.ring];
      const angle = (idx / count) * 360 + (t.ring * 22);
      const rad = ringRadius[t.ring];
      const item = document.createElement('div');
      item.className = 'orbit-item';
      item.textContent = t.n;
      item.style.setProperty('--angle', angle + 'deg');
      const rEl = angle * Math.PI / 180;
      const cx = 210 + rad * Math.cos(rEl);
      const cy = 210 + rad * Math.sin(rEl);
      item.style.left = cx + 'px';
      item.style.top = cy + 'px';

      item.addEventListener('mouseenter', () => {
        tooltip.innerHTML = `<b>${t.name}</b> — ${t.desc}`;
        tooltip.classList.add('show');
      });
      item.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
      item.addEventListener('touchstart', () => {
        tooltip.innerHTML = `<b>${t.name}</b> — ${t.desc}`;
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 2200);
      }, { passive: true });

      wrap.appendChild(item);
    });
  }

  /* ------------------------------------------------------------------
     COUNTERS
  ------------------------------------------------------------------ */
  function animateCounter(el, target, duration = 1400) {
    const start = performance.now();
    const from = 0;
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const nums = $$('[data-target]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target || '0', 10);
          if (target > 0) animateCounter(el, target);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------------
     SKILL BARS + RINGS
  ------------------------------------------------------------------ */
  function initSkillBars() {
    const bars = $$('.bar-fill');
    const rings = $$('.ring-fg');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.classList.contains('bar-fill')) {
          el.style.width = el.dataset.pct + '%';
        } else {
          const pct = parseFloat(el.dataset.pct);
          el.style.strokeDashoffset = 100 - pct;
        }
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    bars.forEach(b => io.observe(b));
    rings.forEach(r => io.observe(r));
  }

  /* ------------------------------------------------------------------
     SKILL CARD SPOTLIGHT (mouse tracking)
  ------------------------------------------------------------------ */
  function initCardTilt() {
    $$('.skill-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
    });
  }

  /* ------------------------------------------------------------------
     PROJECT FILTERS + EXPAND
  ------------------------------------------------------------------ */
  function initProjects() {
    const chips = $$('#projectFilters .filter-chip');
    const cards = $$('.project-card');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const f = chip.dataset.filter;
        cards.forEach(card => {
          card.classList.toggle('filtered-out', f !== 'all' && card.dataset.cat !== f);
        });
      });
    });

    $$('.project-expand').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const willOpen = !target.classList.contains('open');
        target.classList.toggle('open', willOpen);
        btn.classList.toggle('open', willOpen);
        btn.firstChild.textContent = willOpen ? 'Hide ' : 'Details ';
      });
    });
  }

  /* ------------------------------------------------------------------
     CERT FILTERS
  ------------------------------------------------------------------ */
  function initCertFilters() {
    const chips = $$('.cert-filters .filter-chip');
    const cards = $$('.cert-card');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const f = chip.dataset.cf;
        cards.forEach(card => card.classList.toggle('filtered-out', f !== 'all' && card.dataset.cf !== f));
      });
    });
  }

  /* ------------------------------------------------------------------
     GITHUB LIVE API
  ------------------------------------------------------------------ */
  let reposCache = [];

  async function initGithub() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API unavailable');
      const user = await userRes.json();
      const repos = await reposRes.json();
      reposCache = Array.isArray(repos) ? repos.filter(r => !r.fork) : [];

      renderGithubProfile(user);
      renderRepos(reposCache);
      renderDashboardStats(user, reposCache);
      renderContributionApprox(reposCache);
    } catch (err) {
      $('#repoGrid').innerHTML = `<p style="color:var(--text-3);grid-column:1/-1;">Live GitHub data couldn't be loaded right now — visit the profile directly: <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener" style="color:var(--cyan)">github.com/${GITHUB_USER}</a></p>`;
      $('#contribNote').textContent = 'Contribution data unavailable right now — check the live GitHub profile.';
    }
  }

  function renderGithubProfile(user) {
    if (user.avatar_url) $('#ghAvatar').src = user.avatar_url;
    $('#ghName').textContent = user.name || user.login;
    $('#ghBio').textContent = user.bio || 'AI & Data Science student · building with Python and ML';
    $('#ghFollowers').textContent = `${user.followers ?? 0} followers`;
    $('#ghFollowing').textContent = `${user.following ?? 0} following`;
    $('#ghPublicRepos').textContent = `${user.public_repos ?? 0} repos`;
  }

  function renderRepos(repos) {
    sortAndRenderRepos(repos, 'updated');
  }

  function sortAndRenderRepos(repos, sortBy) {
    const grid = $('#repoGrid');
    const q = ($('#repoSearch').value || '').toLowerCase();
    let list = repos.filter(r => r.name.toLowerCase().includes(q));

    if (sortBy === 'stars') list = list.sort((a, b) => b.stargazers_count - a.stargazers_count);
    else if (sortBy === 'name') list = list.sort((a, b) => a.name.localeCompare(b.name));
    else list = list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (!list.length) {
      grid.innerHTML = `<p style="color:var(--text-3);grid-column:1/-1;">No repositories match that search.</p>`;
      return;
    }

    grid.innerHTML = list.slice(0, 9).map(r => `
      <div class="repo-card">
        <div class="repo-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.08.78 2.17v3.22c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
          ${escapeHtml(r.name)}
        </div>
        <p class="repo-desc">${escapeHtml(r.description || 'No description provided.')}</p>
        <div class="repo-meta">
          ${r.language ? `<span><span class="repo-lang-dot"></span>${escapeHtml(r.language)}</span>` : ''}
          <span>★ ${r.stargazers_count}</span>
          <span>⑂ ${r.forks_count}</span>
        </div>
        <a href="${r.html_url}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="align-self:flex-start;">View Repo ↗</a>
      </div>
    `).join('');
  }

  function initRepoToolbar() {
    $('#repoSearch').addEventListener('input', () => sortAndRenderRepos(reposCache, $('#repoSort').value));
    $('#repoSort').addEventListener('change', () => sortAndRenderRepos(reposCache, $('#repoSort').value));
  }

  function renderDashboardStats(user, repos) {
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const setTarget = (id, val) => { const el = document.getElementById(id); if (el) el.dataset.target = val; };
    setTarget('repoCountStat', user.public_repos ?? repos.length);
    setTarget('dashRepos', user.public_repos ?? repos.length);
    setTarget('dashStars', totalStars);
    setTarget('dashFollowers', user.followers ?? 0);
    // re-trigger counters for late-populated targets
    ['repoCountStat', 'dashRepos', 'dashStars', 'dashFollowers'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(el, parseInt(el.dataset.target, 10));
            io.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  function renderContributionApprox(repos) {
    const graph = $('#contribGraph');
    const weeks = 26;
    const cells = [];
    // Build an approximate recency-weighted activity view from repo updated_at dates (no auth-free contributions endpoint exists)
    const dayActivity = new Array(weeks * 7).fill(0);
    repos.forEach(r => {
      const d = new Date(r.pushed_at || r.updated_at);
      const daysAgo = Math.floor((Date.now() - d) / 86400000);
      if (daysAgo >= 0 && daysAgo < weeks * 7) {
        dayActivity[weeks * 7 - 1 - daysAgo] += 1;
      }
    });
    for (let i = 0; i < weeks * 7; i++) {
      const v = dayActivity[i];
      const lvl = v === 0 ? 0 : v === 1 ? 2 : v >= 2 ? 4 : 1;
      cells.push(`<div class="contrib-cell l${lvl}"></div>`);
    }
    graph.innerHTML = cells.join('');
    $('#contribNote').textContent = `Approximate recent push activity across ${repos.length} public repositories (based on last-updated dates — GitHub's full contribution calendar requires auth and isn't available via the public REST API).`;
  }

  /* ------------------------------------------------------------------
     TERMINAL
  ------------------------------------------------------------------ */
  function initTerminal() {
    const body = $('#terminalBody');
    const input = $('#terminalInput');
    const box = $('#terminalBox');

    const commands = {
      help: () => `Available commands:\n  whoami     — quick bio\n  skills     — tech stack\n  projects   — featured work\n  resume     — download resume\n  contact    — contact details\n  github     — open GitHub profile\n  linkedin   — open LinkedIn profile\n  clear      — clear the screen`,
      whoami: () => `Anand D — MCA (AI & Data Science) student at Amrita Vishwa Vidyapeetham, Mysuru.\nBuilding AI-driven tools and full-stack web apps.`,
      skills: () => `Programming: Python, Java, C, C#\nAI/ML: Machine Learning, NLP, Scikit-learn, Pandas, NumPy, LLMs\nWeb: HTML, CSS, JavaScript, React\nDatabases: MySQL, MongoDB\nTools: Git, GitHub, VS Code, Figma`,
      projects: () => `1. AI Chatbot for Smart Communities\n2. GuruCode AI — Smart Coding Mentor\n3. Web-Based Expense Tracker\n4. Personal Portfolio Website\nScroll to the Projects section for details.`,
      resume: () => { triggerResumeDownload(); return 'Downloading resume…'; },
      contact: () => `Email: anandrl120@gmail.com\nPhone: +91 6374200753\nLocation: Mysuru, Karnataka, India`,
      github: () => { window.open('https://github.com/anandd46', '_blank'); return 'Opening github.com/anandd46 …'; },
      linkedin: () => { window.open('https://www.linkedin.com/in/anand-d-574768290', '_blank'); return 'Opening LinkedIn profile …'; },
      clear: () => { body.innerHTML = ''; return null; }
    };

    function printLine(text, isCmd) {
      const line = document.createElement('div');
      line.className = 'term-line' + (isCmd ? ' term-cmd-echo' : '');
      line.textContent = text;
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    }

    box.addEventListener('click', () => input.focus());

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const raw = input.value.trim();
      if (!raw) return;
      printLine(raw, true);
      const cmd = raw.toLowerCase();
      if (commands[cmd]) {
        const out = commands[cmd]();
        if (out) printLine(out);
      } else {
        printLine(`command not found: ${raw} — type "help" for a list of commands.`);
      }
      input.value = '';
    });
  }

  /* ------------------------------------------------------------------
     CONTACT FORM (client-side validation + mailto handoff)
  ------------------------------------------------------------------ */
  function initContactForm() {
    const form = $('#contactForm');
    const note = $('#formNote');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      ['cName', 'cEmail', 'cSubject', 'cMessage'].forEach(id => {
        const field = document.getElementById(id);
        const wrap = field.closest('.form-field');
        let ok = field.value.trim().length > 0;
        if (id === 'cEmail') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        wrap.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) { note.style.color = '#F87171'; note.textContent = 'Please fix the highlighted fields.'; return; }

      const name = $('#cName').value.trim();
      const email = $('#cEmail').value.trim();
      const subject = $('#cSubject').value.trim();
      const message = $('#cMessage').value.trim();
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:anandrl120@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      note.style.color = '#34D399';
      note.textContent = 'Opening your email client to send this message…';
    });

    ['cName', 'cEmail', 'cSubject', 'cMessage'].forEach(id => {
      document.getElementById(id).addEventListener('input', function () {
        this.closest('.form-field').classList.remove('invalid');
      });
    });
  }

  /* ------------------------------------------------------------------
     THEME TOGGLE
  ------------------------------------------------------------------ */
  function initTheme() {
    const btn = $('#themeBtn');
    const icon = $('#themeIcon');
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    updateIcon();

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      if (next === 'dark') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', next);
      updateIcon();
    });

    function updateIcon() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      icon.innerHTML = isLight
        ? '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  /* ------------------------------------------------------------------
     RESUME DOWNLOAD COUNTER
  ------------------------------------------------------------------ */
  function triggerResumeDownload() {
    const link = document.createElement('a');
    link.href = 'assets/resume/Anand_D_Resume.pdf';
    link.download = 'Anand_D_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    bumpResumeCount();
  }

  function bumpResumeCount() {
    let count = parseInt(localStorage.getItem('resume-downloads') || '0', 10) + 1;
    localStorage.setItem('resume-downloads', count);
    const el = $('#resumeDlCount');
    if (el) { el.dataset.target = count; animateCounter(el, count, 500); }
  }

  function initResumeCounter() {
    const count = parseInt(localStorage.getItem('resume-downloads') || '0', 10);
    const el = $('#resumeDlCount');
    if (el) el.dataset.target = count;
    $$('#navResumeBtn, #heroResumeBtn').forEach(a => a.addEventListener('click', () => bumpResumeCount()));
  }

  /* ------------------------------------------------------------------
     VISITOR COUNTER (local, illustrative)
  ------------------------------------------------------------------ */
  function initVisitorCounter() {
    let count = parseInt(localStorage.getItem('visit-count') || '0', 10) + 1;
    localStorage.setItem('visit-count', count);
    $('#visitorCount').textContent = `Visit #${count}`;
  }

  /* ------------------------------------------------------------------
     ASK ABOUT ME WIDGET (rule-based, no backend)
  ------------------------------------------------------------------ */
  function initAskWidget() {
    const toggle = $('#askToggle');
    const panel = $('#askPanel');
    const closeBtn = $('#askClose');
    const body = $('#askBody');
    const input = $('#askInput');
    const send = $('#askSend');
    const suggestions = $$('#askSuggestions button');

    const kb = [
      { k: ['skill', 'tech', 'stack', 'know'], a: 'Anand works with Python, Java, C#, JavaScript, and ML tools like Scikit-learn, Pandas and NLP libraries — plus HTML/CSS/React on the front end.' },
      { k: ['project', 'built', 'made'], a: 'His main projects: an AI chatbot for campus queries, GuruCode AI (a coding mentor), a C#/MySQL expense tracker, and this portfolio.' },
      { k: ['contact', 'email', 'reach', 'hire'], a: 'You can reach him at anandrl120@gmail.com or +91 6374200753 — or just use the contact form below.' },
      { k: ['education', 'study', 'college', 'degree'], a: "He's pursuing an MCA in AI & Data Science at Amrita Vishwa Vidyapeetham, Mysuru (CGPA 7.04/10), after a BCA at the same university." },
      { k: ['work', 'do', 'about'], a: 'Anand is an AI & Data Science student who builds practical ML-powered tools and full-stack web apps — not just notebooks.' },
      { k: ['certif', 'course'], a: 'Certifications include Dynamic Programming (AlgoUniversity), Python (Kaggle), a JPMorgan Quantitative Research simulation, Full Stack Dev (MyCaptain), and a Java Bootcamp (LetsUpgrade).' },
      { k: ['available', 'job', 'internship'], a: "Yes — he's currently open to internships and junior AI/software engineering roles." },
      { k: ['github'], a: 'His GitHub is github.com/anandd46 — the Live GitHub section on this page pulls his repos in real time.' },
      { k: ['linkedin'], a: 'Connect with him on LinkedIn: linkedin.com/in/anand-d-574768290' }
    ];

    function respond(text) {
      const lower = text.toLowerCase();
      const hit = kb.find(entry => entry.k.some(k => lower.includes(k)));
      return hit ? hit.a : "I'm a simple rule-based assistant, so I might've missed that — try asking about his skills, projects, education, or how to contact him.";
    }

    function addMsg(text, who) {
      const div = document.createElement('div');
      div.className = `ask-msg ${who}`;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function handleSend(text) {
      if (!text.trim()) return;
      addMsg(text, 'user');
      setTimeout(() => addMsg(respond(text), 'bot'), 350);
      input.value = '';
    }

    toggle.addEventListener('click', () => panel.classList.toggle('open'));
    closeBtn.addEventListener('click', () => panel.classList.remove('open'));
    send.addEventListener('click', () => handleSend(input.value));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(input.value); });
    suggestions.forEach(btn => btn.addEventListener('click', () => handleSend(btn.textContent)));
  }

  /* ------------------------------------------------------------------
     COMMAND PALETTE
  ------------------------------------------------------------------ */
  function initCommandPalette() {
    const overlay = $('#cmdkOverlay');
    const input = $('#cmdkInput');
    const list = $('#cmdkList');
    const openBtn = $('#cmdkBtn');

    const actions = [
      { label: 'Go to Home', hint: 'section', run: () => scrollToId('home') },
      { label: 'Go to About', hint: 'section', run: () => scrollToId('about') },
      { label: 'Go to Skills', hint: 'section', run: () => scrollToId('skills') },
      { label: 'Go to Projects', hint: 'section', run: () => scrollToId('projects') },
      { label: 'Go to GitHub Activity', hint: 'section', run: () => scrollToId('github') },
      { label: 'Go to Certifications', hint: 'section', run: () => scrollToId('certifications') },
      { label: 'Go to Contact', hint: 'section', run: () => scrollToId('contact') },
      { label: 'Download Resume', hint: 'action', run: () => triggerResumeDownload() },
      { label: 'Open GitHub Profile', hint: 'link', run: () => window.open('https://github.com/anandd46', '_blank') },
      { label: 'Open LinkedIn Profile', hint: 'link', run: () => window.open('https://www.linkedin.com/in/anand-d-574768290', '_blank') },
      { label: 'Switch Theme', hint: 'toggle', run: () => $('#themeBtn').click() },
      { label: 'Email Anand', hint: 'action', run: () => window.location.href = 'mailto:anandrl120@gmail.com' },
    ];

    function scrollToId(id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }

    let filtered = actions;
    let activeIndex = 0;

    function render() {
      list.innerHTML = filtered.map((a, i) => `<div class="cmdk-item ${i === activeIndex ? 'active' : ''}" data-i="${i}">${a.label}<span class="hint">${a.hint}</span></div>`).join('') || `<div class="cmdk-item">No matching commands</div>`;
    }

    function open() {
      overlay.classList.add('open');
      input.value = '';
      filtered = actions;
      activeIndex = 0;
      render();
      setTimeout(() => input.focus(), 50);
    }
    function close() { overlay.classList.remove('open'); }

    openBtn.addEventListener('click', open);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      filtered = actions.filter(a => a.label.toLowerCase().includes(q));
      activeIndex = 0;
      render();
    });

    list.addEventListener('click', e => {
      const item = e.target.closest('.cmdk-item');
      if (!item || item.dataset.i === undefined) return;
      filtered[parseInt(item.dataset.i, 10)].run();
      close();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        overlay.classList.contains('open') ? close() : open();
        return;
      }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        open();
        return;
      }
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
      if (e.key === 'Enter' && filtered[activeIndex]) { filtered[activeIndex].run(); close(); }
    });
  }

  /* ------------------------------------------------------------------
     LAST UPDATED
  ------------------------------------------------------------------ */
  function initLastUpdated() {
    const el = $('#lastUpdated');
    if (el) el.textContent = 'Last updated ' + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  /* ------------------------------------------------------------------
     HELPERS
  ------------------------------------------------------------------ */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------
     INIT
  ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initParticles();
    initSpotlight();
    initScrollUX();
    initMobileNav();
    initReveals();
    initTyping();
    initOrbit();
    initCounters();
    initSkillBars();
    initCardTilt();
    initProjects();
    initCertFilters();
    initGithub();
    initRepoToolbar();
    initTerminal();
    initContactForm();
    initTheme();
    initResumeCounter();
    initVisitorCounter();
    initAskWidget();
    initCommandPalette();
    initLastUpdated();
  });
})();
