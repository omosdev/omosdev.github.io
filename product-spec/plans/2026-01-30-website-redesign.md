# OMOS Website Redesign - Implementation Plan

## Overview

Redesign the OMOS (Open Minds Open Source) website from a simple placeholder into a full "Engineered Minimalism" site. The home page displays blog posts fetched client-side from a micro.blog JSON feed. The site includes About and Contact static pages, top/bottom navigation, and light/dark mode theming. No build tools — pure HTML/CSS/JS on GitHub Pages.

## Current State Analysis

- Single `index.html` with a two-column yellow-bar layout, logo, description, and social icons
- `styles.css` with minimal flexbox styling
- No JavaScript, no routing, no theming
- Hosted on GitHub Pages at `omos.dev` via CNAME
- Micro.blog feed at `https://omos.micro.blog/feed.json` exists but is empty; using `https://accidentallyoldschool.com/feed.json` as development data source

## Desired End State

A three-page static site with:
- **Home** (`index.html`): Frosted glass navbar, blog feed from micro.blog JSON feed, footer
- **About** (`about.html`): Static content page with shared nav/footer
- **Contact** (`contact.html`): Static content page with shared nav/footer
- **Light/Dark mode** toggle persisted via `localStorage`, with OS-preference detection as default
- **Responsive design**: Mobile-first, single breakpoint at 768px
- **Typography**: IBM Plex Mono throughout, generous line-height
- **Color system**: CSS custom properties for light ("Paper") and dark ("Deep Space") themes

### Verification:
- Open `index.html` locally — blog posts load from the JSON feed, navbar and footer render, theme toggle works
- All three pages share consistent nav/footer
- Switching themes persists across page loads
- Mobile layout stacks correctly at ≤768px
- WCAG AA contrast passes in both themes

## What We're NOT Doing

- Podcast player / audio playback (future phase)
- Project directory / open source cards (future phase)
- Build tools, bundlers, or frameworks
- Server-side rendering or static site generators
- Contact form backend (Contact page will show email/social links only)
- Search functionality
- Blog post detail pages (posts link back to micro.blog)

## Implementation Approach

Since all three pages share the same navbar, footer, and styling, we'll:
1. Build a shared CSS design system with custom properties for theming
2. Create the HTML structure for `index.html` first with all shared components
3. Write a small JS module for feed fetching and theme toggling
4. Duplicate the shared nav/footer into `about.html` and `contact.html`

All CSS will live in a single `styles.css`. All JS will live in a single `main.js`.

---

## Phase 1: Design System Foundation (CSS)

### Overview
Replace `styles.css` entirely with the new design system: CSS custom properties for colors, typography scale, component styles, and responsive breakpoints.

### Changes Required:

#### 1. `styles.css` — Complete rewrite

**CSS Custom Properties (Light/Dark):**
```css
:root {
  /* Light Mode ("Paper") */
  --canvas: #FAFAFA;
  --surface: #FFFFFF;
  --text-primary: #171717;
  --text-secondary: #737373;
  --border: #E5E5E5;
  --brand: #4F46E5;
  --success: #14B8A6;
  --warning: #F59E0B;
  --error: #F43F5E;

  /* Typography */
  --font-mono: 'IBM Plex Mono', monospace;
  --line-height-body: 1.7;
  --letter-spacing-micro: 0.05em;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Radius */
  --radius: 3px;

  /* Widths */
  --content-max-width: 720px;
  --page-max-width: 1080px;
}

[data-theme="dark"] {
  --canvas: #0F1115;
  --surface: #161A21;
  --text-primary: #EDEDED;
  --text-secondary: #A1A1AA;
  --border: #27272A;
  --brand: #818CF8;
}
```

**Typography:**
```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html { font-size: 16px; }

body {
  font-family: var(--font-mono);
  font-weight: 400;
  line-height: var(--line-height-body);
  color: var(--text-primary);
  background-color: var(--canvas);
  -webkit-font-smoothing: antialiased;
}

h1 { font-size: 1.75rem; font-weight: 300; }
h2 { font-size: 1.25rem; font-weight: 500; }
h3 { font-size: 1rem; font-weight: 500; }

.micro {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-micro);
  color: var(--text-secondary);
}
```

**Navbar (frosted glass):**
```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: color-mix(in srgb, var(--canvas) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  max-width: 100%;
}

.navbar__logo {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
}

.navbar__links {
  display: flex;
  gap: var(--space-lg);
  list-style: none;
}

.navbar__links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius);
  transition: background-color 0.15s, color 0.15s;
}

.navbar__links a:hover,
.navbar__links a.active {
  color: var(--text-primary);
  background-color: var(--border);
}
```

**Blog post cards:**
```css
.feed {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}

.post-card {
  border-bottom: 1px solid var(--border);
  padding: var(--space-xl) 0;
}

.post-card:last-child {
  border-bottom: none;
}

.post-card__title {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
}

.post-card__title:hover {
  color: var(--brand);
}

.post-card__date {
  /* uses .micro class */
  margin-bottom: var(--space-sm);
}

.post-card__summary {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: var(--space-sm);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Footer:**
```css
.footer {
  border-top: 1px solid var(--border);
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--page-max-width);
  margin: 0 auto;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.footer__links {
  display: flex;
  gap: var(--space-lg);
  list-style: none;
}

.footer__links a {
  color: var(--text-secondary);
  text-decoration: none;
}

.footer__links a:hover {
  color: var(--text-primary);
}
```

**Theme toggle button:**
```css
.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-xs) var(--space-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}
```

**Links:**
```css
a {
  color: var(--brand);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

**Loading/empty states:**
```css
.feed__loading,
.feed__empty {
  text-align: center;
  padding: var(--space-3xl) var(--space-lg);
  color: var(--text-secondary);
  font-size: 0.875rem;
}
```

**Responsive:**
```css
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md);
  }

  .footer {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }

  .feed {
    padding: var(--space-lg) var(--space-md);
  }
}
```

**Utility for page content (About/Contact):**
```css
.page-content {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}

.page-content h1 {
  margin-bottom: var(--space-xl);
}

.page-content p {
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
}

.page-content p:first-of-type {
  color: var(--text-primary);
}
```

### Success Criteria:

#### Automated Verification:
- [x] `styles.css` contains all CSS custom properties for both themes
- [x] No syntax errors when loaded in browser

#### Manual Verification:
- [ ] Colors match the design spec in both light and dark mode (by toggling `data-theme="dark"` on `<html>`)
- [ ] Typography hierarchy is visually distinct (H1 light weight, H2-H3 medium)
- [ ] IBM Plex Mono renders correctly

---

## Phase 2: Home Page (`index.html`)

### Overview
Rewrite `index.html` with the new structure: navbar, blog feed area, footer. Include IBM Plex Mono font from Google Fonts. Add theme detection and toggle.

### Changes Required:

#### 1. `index.html` — Complete rewrite

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OMOS — Open Minds Open Source</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">

  <!-- SEO -->
  <meta name="description" content="Open Minds Open Source — The best place for open source information. Podcast, blog, and community for developers.">
  <meta name="keywords" content="open source, developers, podcast, blog, community, Indian developers">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://omos.dev/">
  <meta property="og:title" content="OMOS — Open Minds Open Source">
  <meta property="og:description" content="The best place for open source information. Podcast, blog, and community for developers.">
  <meta property="og:image" content="https://omos.dev/omos-logo.jpg">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary">
  <meta property="twitter:url" content="https://omos.dev/">
  <meta property="twitter:title" content="OMOS — Open Minds Open Source">
  <meta property="twitter:description" content="The best place for open source information.">
  <meta property="twitter:image" content="https://omos.dev/omos-logo.jpg">
</head>
<body>
  <nav class="navbar">
    <a href="/" class="navbar__logo">OMOS</a>
    <ul class="navbar__links">
      <li><a href="/" class="active">Home</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="https://twitter.com/omosdev" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://www.youtube.com/@omosdev" target="_blank" rel="noopener">YouTube</a></li>
      <li><button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">light</button></li>
    </ul>
  </nav>

  <main class="feed" id="feed">
    <div class="feed__loading">Loading posts...</div>
  </main>

  <footer class="footer">
    <span>&copy; 2026 OMOS</span>
    <ul class="footer__links">
      <li><a href="/">Home</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/contact.html">Contact</a></li>
    </ul>
  </footer>

  <script src="main.js"></script>
</body>
</html>
```

### Success Criteria:

#### Automated Verification:
- [x] Valid HTML5 structure
- [x] All meta tags present
- [x] IBM Plex Mono font loads from Google Fonts

#### Manual Verification:
- [ ] Navbar renders with frosted glass effect
- [ ] "Home" link shows active state
- [ ] Footer displays copyright and links
- [ ] Layout is responsive at ≤768px

---

## Phase 3: JavaScript (`main.js`)

### Overview
Create `main.js` with two responsibilities: theme management (detect OS preference, toggle, persist) and blog feed fetching/rendering.

### Changes Required:

#### 1. `main.js` — New file

```javascript
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
```

**Tag styling (add to `styles.css`):**
```css
.tag {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-micro);
  background-color: color-mix(in srgb, var(--brand) 10%, transparent);
  color: var(--brand);
  padding: 2px 6px;
  border-radius: var(--radius);
}
```

### Success Criteria:

#### Automated Verification:
- [x] `main.js` has no syntax errors (can be checked via browser console)
- [x] Theme toggle function sets `data-theme` attribute on `<html>`

#### Manual Verification:
- [ ] Blog posts load and display on the home page (from fallback feed while OMOS feed is empty)
- [ ] Each post shows date, title (linked), and summary
- [ ] Theme toggle switches between light and dark modes
- [ ] Theme preference persists on page reload
- [ ] OS dark mode preference is detected on first visit
- [ ] Tags render as styled pills when present
- [ ] Loading state shows while feed is fetching
- [ ] Error state shows gracefully if fetch fails

**Implementation Note**: After completing this phase and verifying the home page works end-to-end, pause for manual confirmation before proceeding.

---

## Phase 4: Static Pages (About & Contact)

### Overview
Create `about.html` and `contact.html` with the same navbar/footer structure. These are simple content pages.

### Changes Required:

#### 1. `about.html` — New file

Same `<head>` structure as `index.html` (with page-specific title/meta).

Body structure:
```html
<body>
  <!-- Same navbar, with "About" link having class="active" -->
  <nav class="navbar">...</nav>

  <main class="page-content">
    <h1>About</h1>
    <p>"Open Minds Open Source" is a podcast that features interviews with the creators of some of the most famous open source projects created by Indians.</p>
    <p>The podcast focuses on telling the stories of these Indian developers and how they went about creating projects that are now used by a large number of developers across the globe.</p>
    <p>The interviews provide a behind-the-scenes look at the development process, challenges faced, and the impact of these projects on the tech industry. The podcast also explores the motivations and inspirations behind the creation of these projects.</p>
    <p>OMOS is expanding to become the best place for open source information — covering projects, communities, and the people behind them.</p>
  </main>

  <!-- Same footer -->
  <footer class="footer">...</footer>
  <script src="main.js"></script>
</body>
```

#### 2. `contact.html` — New file

Body structure:
```html
<main class="page-content">
  <h1>Contact</h1>
  <p>Get in touch with us through any of the channels below.</p>
  <ul class="contact-list">
    <li>Twitter: <a href="https://twitter.com/omosdev">@omosdev</a></li>
    <li>YouTube: <a href="https://www.youtube.com/@omosdev">@omosdev</a></li>
    <li>Instagram: <a href="https://www.instagram.com/omosdev">@omosdev</a></li>
  </ul>
</main>
```

**Contact list styling (add to `styles.css`):**
```css
.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;
}

.contact-list li:last-child {
  border-bottom: none;
}
```

### Success Criteria:

#### Automated Verification:
- [x] `about.html` and `contact.html` exist and are valid HTML5
- [x] Both pages reference `styles.css` and `main.js`

#### Manual Verification:
- [ ] Navigation between all three pages works correctly
- [ ] Active nav link highlights correctly on each page
- [ ] Theme toggle works on all pages and persists across navigation
- [ ] Footer links work on all pages
- [ ] Responsive layout works on both pages

---

## Phase 5: Update CLAUDE.md & Cleanup

### Overview
Update the project documentation to reflect the new architecture, remove Font Awesome dependency (no longer used), and ensure everything is consistent.

### Changes Required:

#### 1. `CLAUDE.md` — Update to reflect new structure
- Update file list to include `main.js`, `about.html`, `contact.html`
- Update architecture description
- Update social links section
- Remove reference to Font Awesome CDN

#### 2. Remove Font Awesome
- The new design uses text labels instead of icon fonts, per the "thin stroke icons" philosophy. Font Awesome link is no longer needed.

### Success Criteria:

#### Automated Verification:
- [x] No references to Font Awesome CDN in any HTML file
- [x] `CLAUDE.md` references all current files

#### Manual Verification:
- [ ] All pages render without console errors
- [ ] No 404s for missing resources

---

## File Summary

| File | Action |
|------|--------|
| `styles.css` | Complete rewrite |
| `index.html` | Complete rewrite |
| `main.js` | New file |
| `about.html` | New file |
| `contact.html` | New file |
| `CLAUDE.md` | Update |
| `omos-logo.jpg` | Keep (unchanged) |
| `CNAME` | Keep (unchanged) |
| `README.md` | Keep (unchanged) |

## Testing Strategy

### Manual Testing Steps:
1. Open `index.html` in browser — verify blog posts load, navbar/footer render
2. Click theme toggle — verify light/dark switch with smooth transition
3. Refresh page — verify theme preference persists
4. Navigate to About and Contact pages — verify consistent layout
5. Resize browser to ≤768px — verify responsive stacking
6. Test in Chrome, Firefox, and Safari
7. Run Lighthouse accessibility audit — target score ≥ 90

## Performance Considerations

- IBM Plex Mono loaded with `display=swap` to prevent FOIT
- Only 3 weights loaded (300, 400, 500) to minimize font payload
- Blog feed fetched async — page renders immediately with loading state
- No external JS libraries — vanilla JavaScript only
- `backdrop-filter` for frosted glass has good browser support but may be ignored on older browsers (graceful degradation)

## References

- Design spec: Provided in task description (Engineered Minimalism)
- JSON Feed spec: https://www.jsonfeed.org/version/1.1/
- Development feed: https://accidentallyoldschool.com/feed.json
- Production feed: https://omos.micro.blog/feed.json
