// ============================================
// BACKEND MASTERY — Main Script
// Inspired by weight-tracker minimalism
// ============================================

(function () {
  'use strict';

  const THEME_KEY = 'backend-mastery-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    const iconEl = document.querySelector('.theme-icon');
    if (iconEl) {
      iconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Apply theme immediately
  setTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // ---------- Table of Contents ----------
    const tocNav = document.getElementById('tocNav');
    const guideBody = document.getElementById('guideBody');

    if (tocNav && guideBody) {
      const headings = guideBody.querySelectorAll('h2, h3, h4');
      const tocItems = [];

      headings.forEach(function (heading) {
        if (!heading.id) {
          heading.id = heading.textContent
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        }

        var level = heading.tagName.toLowerCase();
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.className = 'toc-link toc-' + level;
        link.textContent = heading.textContent;
        tocNav.appendChild(link);

        tocItems.push({ element: heading, link: link });
      });

      if (tocItems.length > 0) {
        var onScroll = function () {
          var scrollPos = window.scrollY + 100;
          var current = null;

          for (var i = 0; i < tocItems.length; i++) {
            if (tocItems[i].element.offsetTop <= scrollPos) {
              current = tocItems[i];
            }
          }

          tocItems.forEach(function (item) {
            item.link.classList.remove('active');
          });

          if (current) {
            current.link.classList.add('active');
          }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }
    }

    // ---------- Code block copy buttons ----------
    document.querySelectorAll('.guide-body pre').forEach(function (block) {
      var wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = 'copy';
      btn.style.cssText = [
        'position: absolute',
        'top: 6px',
        'right: 6px',
        'padding: 2px 6px',
        'font-size: 0.68rem',
        'font-family: var(--font-mono)',
        'opacity: 0.6',
        'transition: opacity 0.15s'
      ].join(';');

      wrapper.appendChild(btn);

      wrapper.addEventListener('mouseenter', function () { btn.style.opacity = '1'; });
      wrapper.addEventListener('mouseleave', function () { btn.style.opacity = '0.6'; });

      btn.addEventListener('click', function () {
        var code = block.querySelector('code');
        var text = code ? code.textContent : block.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'copied!';
          setTimeout(function () { btn.textContent = 'copy'; }, 1500);
        });
      });
    });
  });
})();
