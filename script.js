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

  var filterButtons = document.querySelectorAll('.filters button');
  var cards = document.querySelectorAll('[data-category]');
  if (filterButtons.length && cards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var cat = btn.dataset.filter;
        cards.forEach(function (card) {
          var match = cat === 'all' || card.dataset.category === cat;
          card.style.display = match ? '' : 'none';
        });
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
