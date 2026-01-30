(function () {
  // --- Theme Management ---
  const THEME_KEY = 'omos-theme';
  const toggle = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (toggle) toggle.textContent = theme === 'dark' ? 'light' : 'dark';
  }

  setTheme(getPreferredTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Blog Feed ---
  const FEED_URL = 'https://omos.micro.blog/feed.json';
  // Fallback for development when OMOS feed is empty
  const FALLBACK_FEED_URL = 'https://accidentallyoldschool.com/feed.json';
  const feedContainer = document.getElementById('feed');

  function formatDate(dateString) {
    const date = new Date(dateString);
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', opts);
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + '...';
  }

  function renderPosts(items) {
    if (!feedContainer) return;

    if (!items || items.length === 0) {
      feedContainer.innerHTML = '<div class="feed__empty">No posts yet. Check back soon.</div>';
      return;
    }

    feedContainer.innerHTML = items.map(function (item) {
      const title = item.title || truncate(stripHtml(item.content_html), 80);
      const summary = item.summary || truncate(stripHtml(item.content_html), 200);
      const date = formatDate(item.date_published);
      const tags = (item.tags || []).map(function (t) {
        return '<span class="tag">' + t + '</span>';
      }).join(' ');

      return '<article class="post-card">' +
        '<div class="post-card__date micro">' + date + (tags ? ' &middot; ' + tags : '') + '</div>' +
        '<a href="' + item.url + '" class="post-card__title" target="_blank" rel="noopener">' + title + '</a>' +
        '<p class="post-card__summary">' + summary + '</p>' +
        '</article>';
    }).join('');
  }

  async function fetchFeed() {
    if (!feedContainer) return;

    try {
      let response = await fetch(FEED_URL);
      let data = await response.json();

      // If primary feed is empty, try fallback
      if (!data.items || data.items.length === 0) {
        response = await fetch(FALLBACK_FEED_URL);
        data = await response.json();
      }

      renderPosts(data.items);
    } catch (err) {
      feedContainer.innerHTML = '<div class="feed__empty">Unable to load posts.</div>';
    }
  }

  fetchFeed();
})();