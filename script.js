// Kooze — interface behaviour
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- mobile nav ---
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // --- category filter, animated ---
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
            card.style.animation = 'riseIn 0.55s var(--ease) ' + Math.min(shown, 6) * 0.045 + 's both';
          }
          shown += 1;
        } else {
          card.setAttribute('data-filtered', 'out');
          window.setTimeout(function () {
            if (card.getAttribute('data-filtered') === 'out') card.hidden = true;
          }, reduceMotion ? 0 : 280);
        }
      });
    });
  }

  // --- contact form ---
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'Message sent. We reply within one working day.';
    });
  }

  // --- scroll reveal ---
  var revealEls = document.querySelectorAll(
    '.section-head, .card, .cat-card, .split-copy, .split-figure, .quote-block, .panel, .trust .item, .footer-col, .stat'
  );
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var groups = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      var idx = groups.get(parent) || 0;
      groups.set(parent, idx + 1);
      el.style.transitionDelay = Math.min(idx, 5) * 0.07 + 's';
      el.setAttribute('data-revealed', 'false');
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', 'true');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // --- add to cart: toast + counter bump ---
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  var toastTimer;

  function flash(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  document.addEventListener('click', function (e) {
    var addBtn = e.target.closest('.quick-add');
    if (!addBtn) return;
    e.preventDefault();

    var cartBtn = document.querySelector('.icon-btn[aria-label="Cart"]');
    var count = cartBtn && cartBtn.querySelector('.cart-count');
    if (count) {
      count.textContent = String((parseInt(count.textContent, 10) || 0) + 1);
      cartBtn.classList.remove('bump');
      void cartBtn.offsetWidth;
      cartBtn.classList.add('bump');
    }

    var card = addBtn.closest('.card');
    var name = card && card.querySelector('h3');
    flash(name ? name.textContent + ' added to cart' : 'Added to cart');
  });

  // --- wishlist ---
  document.addEventListener('click', function (e) {
    var wish = e.target.closest('.wish');
    if (!wish) return;
    e.preventDefault();
    flash('Saved to your wishlist');
  });

  // --- newsletter ---
  document.querySelectorAll('.newsletter form').forEach(function (nf) {
    nf.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = nf.querySelector('input');
      if (input && input.value.trim()) {
        flash('You are on the list. See you at the next firing.');
        input.value = '';
      } else {
        flash('Add your email first.');
      }
    });
  });

  // --- soft page transition ---
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
      window.setTimeout(function () { window.location.href = link.href; }, 300);
    });

    window.addEventListener('pageshow', function () { veil.classList.remove('active'); });
  }

  // --- countdown ---
  var cdH = document.getElementById('cd-h');
  var cdM = document.getElementById('cd-m');
  var cdS = document.getElementById('cd-s');
  if (cdH && cdM && cdS) {
    var remaining =
      parseInt(cdH.textContent, 10) * 3600 + parseInt(cdM.textContent, 10) * 60 + parseInt(cdS.textContent, 10);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var secUnit = cdS.parentElement;
    window.setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      cdH.textContent = pad(Math.floor(remaining / 3600));
      cdM.textContent = pad(Math.floor((remaining % 3600) / 60));
      cdS.textContent = pad(remaining % 60);
      if (secUnit && !reduceMotion) {
        secUnit.classList.remove('tick');
        void secUnit.offsetWidth;
        secUnit.classList.add('tick');
      }
    }, 1000);
  }
});
