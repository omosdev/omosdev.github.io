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

  // --- Mobile Navigation ---
  const hamburgerBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('navbar-links');

  function toggleMobileMenu() {
    const isOpen = navLinks.classList.contains('active');

    navLinks.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', !isOpen);
  }

  function closeMobileMenu() {
    navLinks.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on a link
    navLinks.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        closeMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  // --- Blog Feed ---
  const FEED_URL = 'https://omos.micro.blog/feed.json';
  const feedContainer = document.getElementById('feed');

  function formatDate(dateString) {
    const date = new Date(dateString);
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', opts);
  }


  function renderPosts(items) {
    if (!feedContainer) return;

    if (!items || items.length === 0) {
      feedContainer.innerHTML = '<div class="feed__empty">No posts yet. Check back soon.</div>';
      return;
    }

    feedContainer.innerHTML = items.map(function (item) {
      const title = item.title || 'Untitled';
      const date = formatDate(item.date_published);
      const tags = (item.tags || []).map(function (t) {
        return '<span class="tag">' + t + '</span>';
      }).join(' ');

      // Use the full HTML content as provided by the feed
      const content = item.content_html || '';

      return '<article class="post-card">' +
        '<div class="post-card__date micro">' + date + (tags ? ' &middot; ' + tags : '') + '</div>' +
        '<a href="' + item.url + '" class="post-card__title" target="_blank" rel="noopener">' + title + '</a>' +
        '<div class="post-card__content">' + content + '</div>' +
        '</article>';
    }).join('');
  }

  async function fetchFeed() {
    if (!feedContainer) return;

    try {
      let response = await fetch(FEED_URL);
      let data = await response.json();

      renderPosts(data.items);
    } catch (err) {
      feedContainer.innerHTML = '<div class="feed__empty">Unable to load posts.</div>';
    }
  }

  fetchFeed();
})();