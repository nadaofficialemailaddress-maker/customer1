// Kooze — catalog loaded from Supabase
(function () {
  var SUPABASE_URL = 'https://xqxbaczqvolniqyvxlpl.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_bfvz06RVT91PsHmvzWTqEA_zU8EhXc0';

  var WISH_SVG =
    '<svg width="15" height="14" viewBox="0 0 15 14" fill="none"><path d="M7.5 13S1 9 1 4.8A3.8 3.8 0 0 1 4.6 1c1.2 0 2.2.6 2.9 1.5C8.2 1.6 9.2 1 10.4 1A3.8 3.8 0 0 1 14 4.8C14 9 7.5 13 7.5 13Z" stroke="currentColor" stroke-width="1.3"/></svg>';

  function money(n) {
    return Number(n).toLocaleString('en-US') + ' Toman';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderCard(p) {
    var name = escapeHtml(p.name);
    var price = p.compare_at_price
      ? '<span class="price">' + money(p.price) + '</span><span class="was">' + Number(p.compare_at_price).toLocaleString('en-US') + '</span>'
      : '<span class="price">' + money(p.price) + '</span>';
    var badge = p.badge
      ? '<span class="badge' + (/%|sale|off/i.test(p.badge) ? ' sale' : '') + '">' + escapeHtml(p.badge) + '</span>'
      : '';

    return (
      '<article class="card" data-category="' + escapeHtml(p.category) + '">' +
        badge +
        '<button class="wish" aria-label="Add to wishlist">' + WISH_SVG + '</button>' +
        '<figure>' +
          '<img src="' + escapeHtml(p.image_path) + '" alt="' + name + '" width="700" height="700" loading="lazy" decoding="async">' +
          '<button class="quick-add">Add to cart</button>' +
        '</figure>' +
        '<div class="body">' +
          '<span class="cat">' + escapeHtml(p.category_label) + '</span>' +
          '<h3>' + name + '</h3>' +
          '<div class="rating"><span class="stars">★★★★★</span>' + p.rating_count + ' reviews</div>' +
          '<div class="price-row">' + price + '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function skeletons(count) {
    var one =
      '<div class="skeleton">' +
        '<div class="sk sk-img"></div>' +
        '<div class="sk sk-a"></div>' +
        '<div class="sk sk-b"></div>' +
        '<div class="sk sk-c"></div>' +
      '</div>';
    return new Array(count + 1).join(one);
  }

  function message(grid, text) {
    grid.innerHTML =
      '<p style="grid-column: 1 / -1; padding: 40px 0; color: var(--ink-soft);">' + text + '</p>';
  }

  function paint(grid, rows) {
    grid.innerHTML = rows.map(renderCard).join('');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    grid.querySelectorAll('.card').forEach(function (card, i) {
      card.classList.add('product-enter');
      card.style.animationDelay = Math.min(i, 8) * 0.06 + 's';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = skeletons(8);

    if (typeof window.supabase === 'undefined') {
      message(grid, 'The shop could not load right now. Please refresh the page.');
      return;
    }

    window.supabase
      .createClient(SUPABASE_URL, SUPABASE_KEY)
      .from('products')
      .select('*')
      .order('sort_order')
      .then(function (res) {
        if (res.error || !res.data || !res.data.length) {
          message(grid, 'Nothing is in stock at the moment. Check back after the next firing.');
          return;
        }
        paint(grid, res.data);
      })
      .catch(function () {
        message(grid, 'The shop could not load right now. Please refresh the page.');
      });
  });
})();
