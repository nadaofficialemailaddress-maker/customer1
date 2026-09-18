// کوزه — رفتارهای رابط کاربری
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var filterBar = document.querySelector('.filters');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filterBar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      var cat = btn.dataset.filter;
      document.querySelectorAll('[data-category]').forEach(function (card) {
        var match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
      });
    });
  }

  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'پیام شما ثبت شد. طی یک روز کاری پاسخ می‌دهیم.';
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll(
    '.section-head, .card, .tile, .split-copy, .split-figure, .quote, .promo-duo .panel, .cat-tiles a, .stat'
  );
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var groupIndex = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      var idx = groupIndex.get(parent) || 0;
      groupIndex.set(parent, idx + 1);
      el.style.transitionDelay = (Math.min(idx, 5) * 0.08) + 's';
      el.setAttribute('data-revealed', 'false');
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  var cdH = document.getElementById('cd-h');
  var cdM = document.getElementById('cd-m');
  var cdS = document.getElementById('cd-s');
  if (cdH && cdM && cdS) {
    var remaining = parseInt(cdH.textContent, 10) * 3600 + parseInt(cdM.textContent, 10) * 60 + parseInt(cdS.textContent, 10);
    var toFa = function (n) { return String(n).padStart(2, '0').replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }); };
    setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      cdH.textContent = toFa(Math.floor(remaining / 3600));
      cdM.textContent = toFa(Math.floor((remaining % 3600) / 60));
      cdS.textContent = toFa(remaining % 60);
    }, 1000);
  }
});
