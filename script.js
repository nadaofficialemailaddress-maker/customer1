// کوزه — رفتارهای رابط کاربری
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // --- انیمیشن فیلتر محصولات ---
  var filterBar = document.querySelector('.filters');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filterBar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      var cat = btn.dataset.filter;
      var shown = 0;
      document.querySelectorAll('[data-category]').forEach(function (card) {
        var match = cat === 'all' || card.dataset.category === cat;
        if (match) {
          card.hidden = false;
          card.removeAttribute('data-filtered');
          if (!reduceMotion) {
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = 'riseIn 0.6s var(--ease) ' + Math.min(shown, 5) * 0.05 + 's both';
          }
          shown += 1;
        } else {
          card.setAttribute('data-filtered', 'out');
          window.setTimeout(function () {
            if (card.getAttribute('data-filtered') === 'out') card.hidden = true;
          }, reduceMotion ? 0 : 300);
        }
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

  // --- ظاهر شدن تدریجی هنگام اسکرول ---
  var revealEls = document.querySelectorAll(
    '.section-head, .card, .tile, .split-copy, .split-figure, .quote, .promo-duo .panel, .cat-tiles a, .stat, .trust-row .item, .footer-col'
  );
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var groupIndex = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      var idx = groupIndex.get(parent) || 0;
      groupIndex.set(parent, idx + 1);
      el.style.transitionDelay = Math.min(idx, 5) * 0.08 + 's';
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

  // --- افزودن به سبد: پیام و تکان آیکون ---
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  var toastTimer;

  document.addEventListener('click', function (e) {
    var addBtn = e.target.closest('.quick-add');
    if (!addBtn) return;
    e.preventDefault();

    var cartBtn = document.querySelector('.icon-btn[aria-label="سبد خرید"]');
    var count = cartBtn && cartBtn.querySelector('.cart-count');
    if (count) {
      var faDigits = '۰۱۲۳۴۵۶۷۸۹';
      var current = String(count.textContent).replace(/[۰-۹]/g, function (d) { return faDigits.indexOf(d); });
      var next = (parseInt(current, 10) || 0) + 1;
      count.textContent = String(next).replace(/[0-9]/g, function (d) { return faDigits[d]; });
      cartBtn.classList.remove('bump');
      void cartBtn.offsetWidth;
      cartBtn.classList.add('bump');
    }

    var card = addBtn.closest('.card');
    var name = card && card.querySelector('h3');
    toast.textContent = name ? name.textContent + ' به سبد اضافه شد' : 'به سبد اضافه شد';
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
  });

  // --- گذار نرم بین صفحه‌ها ---
  if (!reduceMotion) {
    var veil = document.createElement('div');
    veil.className = 'page-veil';
    document.body.appendChild(veil);

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/i.test(href)) return;
      if (link.origin && link.origin !== window.location.origin) return;

      e.preventDefault();
      veil.classList.add('active');
      window.setTimeout(function () { window.location.href = link.href; }, 320);
    });

    // برگشت با دکمه‌ی back نباید صفحه را پشت پرده جا بگذارد
    window.addEventListener('pageshow', function () { veil.classList.remove('active'); });
  }

  // --- شمارش معکوس ---
  var cdH = document.getElementById('cd-h');
  var cdM = document.getElementById('cd-m');
  var cdS = document.getElementById('cd-s');
  if (cdH && cdM && cdS) {
    var remaining =
      parseInt(cdH.textContent, 10) * 3600 + parseInt(cdM.textContent, 10) * 60 + parseInt(cdS.textContent, 10);
    var toFa = function (n) {
      return String(n).padStart(2, '0').replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
    };
    var secUnit = cdS.parentElement;
    setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      cdH.textContent = toFa(Math.floor(remaining / 3600));
      cdM.textContent = toFa(Math.floor((remaining % 3600) / 60));
      cdS.textContent = toFa(remaining % 60);
      if (secUnit && !reduceMotion) {
        secUnit.classList.remove('tick');
        void secUnit.offsetWidth;
        secUnit.classList.add('tick');
      }
    }, 1000);
  }
});
