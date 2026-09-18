// کوزه — بارگذاری محصولات از Supabase
(function () {
  var SUPABASE_URL = 'https://xqxbaczqvolniqyvxlpl.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_bfvz06RVT91PsHmvzWTqEA_zU8EhXc0';

  var FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  function toFaDigits(str) {
    return String(str).replace(/[0-9]/g, function (d) { return FA_DIGITS[d]; });
  }
  function formatToman(n) {
    return toFaDigits(Number(n).toLocaleString('en-US')) + ' تومان';
  }

  var WISHLIST_SVG = '<svg width="15" height="14" viewBox="0 0 15 14" fill="none"><path d="M7.5 13C7.5 13 1 9 1 4.8C1 2.7 2.6 1 4.6 1C5.8 1 6.8 1.6 7.5 2.5C8.2 1.6 9.2 1 10.4 1C12.4 1 14 2.7 14 4.8C14 9 7.5 13 7.5 13Z" stroke="currentColor" stroke-width="1.2"/></svg>';

  function renderCard(p) {
    var priceHtml = p.compare_at_price
      ? '<div class="price-row-sm"><span class="price">' + formatToman(p.price) + '</span><span class="price-strike">' + toFaDigits(Number(p.compare_at_price).toLocaleString('en-US')) + '</span></div>'
      : '<span class="price">' + formatToman(p.price) + '</span>';
    var badgeHtml = p.badge
      ? '<span class="badge-tag' + (p.badge.indexOf('٪') > -1 ? ' sale' : '') + '">' + p.badge + '</span>'
      : '';
    return (
      '<div class="card" data-category="' + p.category + '">' +
        badgeHtml +
        '<button class="wishlist-btn" aria-label="افزودن به علاقه‌مندی‌ها">' + WISHLIST_SVG + '</button>' +
        '<figure>' +
          '<img src="' + p.image_path + '" alt="' + p.name + '" loading="lazy">' +
          '<button class="quick-add">افزودن به سبد</button>' +
        '</figure>' +
        '<span class="cat">' + p.category_label + '</span>' +
        '<h3>' + p.name + '</h3>' +
        '<div class="rating"><span class="stars">★★★★★</span>(' + toFaDigits(p.rating_count) + ')</div>' +
        priceHtml +
      '</div>'
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('product-grid');
    if (!grid || typeof window.supabase === 'undefined') return;

    var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    client
      .from('products')
      .select('*')
      .order('sort_order')
      .then(function (res) {
        if (res.error || !res.data || !res.data.length) {
          grid.innerHTML = '<p style="padding: 40px; color: var(--ink-soft);">در حال حاضر محصولی برای نمایش نیست.</p>';
          return;
        }
        grid.innerHTML = res.data.map(renderCard).join('');
      })
      .catch(function () {
        grid.innerHTML = '<p style="padding: 40px; color: var(--ink-soft);">مشکلی در بارگذاری فروشگاه پیش آمد. لطفاً صفحه را دوباره بارگذاری کنید.</p>';
      });
  });
})();
