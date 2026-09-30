(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Header: scroll state, mobile menu, outside click, active link
  var hdr = $('#hdr'), burger = $('#burger'), nav = $('#nav');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 30); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  if (burger && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !e.target.closest('.hdr-bar')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 1300px)').addEventListener('change', function () { setMenu(false); });
  }

  // In-page scroll-spy (only acts if the nav contains #anchor links)
  if (nav && 'IntersectionObserver' in window) {
    var links = $$('.nav-link', nav);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var target = $('.nav-link[href="#' + en.target.id + '"]', nav);
        if (!target) return;
        links.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
        target.classList.add('active'); target.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['home', 'about', 'services', 'setup', 'faq', 'contact'].forEach(function (id) {
      var s = document.getElementById(id); if (s) spy.observe(s);
    });
  }

  // Scroll reveal
  var stepsEl = $('#steps');
  var rvs = $$('.rv');
  $$('.cards, .panels, .steps, .why, .strip-in, .ccards, .faq').forEach(function (g) {
    $$('.rv', g).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.08) + 's'); });
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          if (stepsEl && en.target.closest('.steps')) stepsEl.classList.add('on');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
    if (stepsEl) stepsEl.classList.add('on');
  }

  // 3D tilt (pointer devices only)
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduce) {
    $$('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'translateY(-8px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
    var scene = $('#scene'), core = scene && $('.core', scene);
    if (scene && core) {
      scene.addEventListener('mousemove', function (e) {
        var r = scene.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        core.style.transform = 'rotateY(' + (-14 + x * 16) + 'deg) rotateX(' + (8 - y * 16) + 'deg)';
      });
      scene.addEventListener('mouseleave', function () { core.style.transform = ''; });
    }
  }

  // Business ecosystem diagram (homepage)
  var eco = $('#eco'), svg = $('#eco-svg'), coreEl = $('#eco-core');
  if (eco && svg && coreEl) {
    var items = ['Tax', 'GST', 'Compliance', 'Accounting', 'Registration', 'Trademark', 'Loans'];
    var NS = 'http://www.w3.org/2000/svg';
    items.forEach(function (name, i) {
      var a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      var x = 50 + Math.cos(a) * 40, y = 50 + Math.sin(a) * 40;
      var ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', 50); ln.setAttribute('y1', 50); ln.setAttribute('x2', x); ln.setAttribute('y2', y);
      svg.appendChild(ln);
      var n = document.createElement('button');
      n.type = 'button'; n.className = 'node'; n.textContent = name;
      n.style.left = x + '%'; n.style.top = y + '%';
      var on = function () { ln.classList.add('hl'); coreEl.classList.add('on'); };
      var off = function () { ln.classList.remove('hl'); coreEl.classList.remove('on'); };
      n.addEventListener('mouseenter', on); n.addEventListener('mouseleave', off);
      n.addEventListener('focus', on); n.addEventListener('blur', off);
      eco.appendChild(n);
    });
  }

  // FAQ accordion
  $$('.qa button').forEach(function (b) {
    b.addEventListener('click', function () {
      var qa = b.closest('.qa'), open = !qa.classList.contains('open');
      qa.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open);
    });
  });

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
