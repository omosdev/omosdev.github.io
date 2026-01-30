# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the static website for "Open Minds Open Source" (OMOS), a podcast featuring interviews with creators of famous open source projects by Indian developers. The site is hosted on GitHub Pages at `omos.dev` and serves as a landing page for the podcast.

## Architecture

**Project Type:** Static website (no build process required)
**Hosting:** GitHub Pages with custom domain
**Frontend:** Pure HTML5/CSS3/JavaScript with IBM Plex Mono typography

### Key Files
- `index.html` - Home page with blog feed from micro.blog JSON API
- `about.html` - Static About page with podcast information
- `contact.html` - Static Contact page with social media links
- `main.js` - Theme management and blog feed fetching functionality
- `styles.css` - Complete design system with CSS custom properties for theming
- `omos-logo.jpg` - Podcast logo (200x200px)
- `CNAME` - Custom domain configuration for `omos.dev`

### Layout Structure
- **Home page**: Frosted glass navbar, blog feed from micro.blog JSON, footer
- **About/Contact pages**: Shared navbar/footer with static content
- **Theming**: Light ("Paper") and dark ("Deep Space") modes with CSS custom properties
- **Typography**: IBM Plex Mono throughout with generous line-height
- **Responsive**: Mobile-first design with single breakpoint at 768px

## Development Workflow

### Making Changes
Since this is a static site, changes are deployed immediately when pushed to the `main` branch:

```bash
# Make your changes to HTML/CSS files
git add .
git commit -m "Description of changes"
git push origin main
```

### Testing Locally
No build process is required. Simply open `index.html` in a browser to test changes:

```bash
# Serve locally with Python (optional)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

**Note**: Blog feed requires CORS support, so local testing should use a local server (not file:// URLs).

### Social Media Preview Testing
The site includes comprehensive Open Graph and Twitter Card meta tags. After making changes to metadata, test social sharing previews:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator

## Content Guidelines

### SEO Metadata
The site includes optimized meta tags for:
- Search engines (title, description, keywords)
- Social sharing (Open Graph for Facebook/LinkedIn)
- Twitter Cards for rich previews

Each page includes appropriate meta tags for SEO and social sharing.

### Navigation & Social Links
- **Primary navigation**: Home, About, Twitter, YouTube (in navbar)
- **Footer navigation**: Home, About, Contact
- **Contact page**: Twitter, YouTube, Instagram links
- Current social handles: @omosdev on all platforms

### Theme System
The site supports light/dark themes:
- **Default**: Detects OS preference (`prefers-color-scheme`)
- **Toggle**: Button in navbar switches between themes
- **Persistence**: Theme choice saved in `localStorage`
- **CSS**: Custom properties in `:root` and `[data-theme="dark"]`

## Blog Feed

The home page dynamically loads blog posts from a JSON feed:
- **Primary feed**: `https://omos.micro.blog/feed.json`
- **Fallback feed**: `https://accidentallyoldschool.com/feed.json` (for development)
- **Format**: JSON Feed v1.1 specification
- **Rendering**: Posts show date, title (linked), summary, and tags
- **Error handling**: Graceful fallback for network issues

## Responsive Design

The CSS uses a mobile-first approach with a single breakpoint at 768px:
- **Desktop**: Horizontal navbar, side-by-side footer layout
- **Mobile**: Vertical navbar, stacked footer layout

## Domain Configuration

The site uses a custom domain `omos.dev` configured via the `CNAME` file. Do not modify this file unless changing the domain.

## File Structure Notes

This is intentionally a minimal static site with no dependencies, build tools, or frameworks. Keep changes simple and avoid introducing unnecessary complexity.