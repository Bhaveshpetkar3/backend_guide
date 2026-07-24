// ============================================
// BACKEND MASTERY — Main JavaScript
// ============================================

(function () {
  'use strict';

  // ---------- Theme Toggle ----------
  const THEME_KEY = 'backend-mastery-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Apply theme immediately to prevent flash
  setTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Listen for OS-level theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // ---------- Mobile Menu ----------
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const headerNav = document.querySelector('.header-nav');
    const overlay = document.getElementById('mobileOverlay');

    if (mobileToggle && headerNav) {
      mobileToggle.addEventListener('click', function () {
        headerNav.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
      });

      if (overlay) {
        overlay.addEventListener('click', function () {
          headerNav.classList.remove('mobile-open');
          overlay.classList.remove('active');
        });
      }
    }

    // ---------- Table of Contents Generation ----------
    const tocNav = document.getElementById('tocNav');
    const guideBody = document.getElementById('guideBody');

    if (tocNav && guideBody) {
      const headings = guideBody.querySelectorAll('h2, h3, h4');
      const tocItems = [];

      headings.forEach(function (heading, index) {
        // Ensure heading has an ID for anchor linking
        if (!heading.id) {
          heading.id = heading.textContent
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        }

        // Avoid duplicate IDs
        const baseId = heading.id;
        let uniqueId = baseId;
        let counter = 1;
        while (document.querySelectorAll('#' + CSS.escape(uniqueId)).length > 1) {
          uniqueId = baseId + '-' + counter;
          counter++;
        }
        heading.id = uniqueId;

        var level = heading.tagName.toLowerCase();

        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.className = 'toc-link toc-' + level;
        link.textContent = heading.textContent;
        tocNav.appendChild(link);

        tocItems.push({ element: heading, link: link });
      });

      // Active TOC tracking on scroll
      if (tocItems.length > 0) {
        var onScroll = debounce(function () {
          var scrollPos = window.scrollY + 120;
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

            // Scroll TOC to keep active item visible
            var tocSidebar = document.getElementById('tocSidebar');
            if (tocSidebar) {
              var linkTop = current.link.offsetTop;
              var sidebarHeight = tocSidebar.clientHeight;
              if (linkTop > sidebarHeight * 0.7) {
                tocSidebar.scrollTop = linkTop - sidebarHeight * 0.3;
              }
            }
          }
        }, 16);

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial call
      }
    }

    // ---------- Smooth scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', '#' + targetId);
        }
      });
    });

    // ---------- Add copy buttons to code blocks ----------
    document.querySelectorAll('.guide-body pre').forEach(function (block) {
      var wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.style.cssText = [
        'position: absolute',
        'top: 8px',
        'right: 8px',
        'padding: 4px 10px',
        'font-size: 0.72rem',
        'font-family: var(--font-sans)',
        'background: var(--bg-tertiary)',
        'color: var(--text-secondary)',
        'border: 1px solid var(--border-primary)',
        'border-radius: var(--radius-sm)',
        'cursor: pointer',
        'opacity: 0',
        'transition: opacity 0.2s'
      ].join(';');

      wrapper.appendChild(btn);

      wrapper.addEventListener('mouseenter', function () { btn.style.opacity = '1'; });
      wrapper.addEventListener('mouseleave', function () { btn.style.opacity = '0'; });

      btn.addEventListener('click', function () {
        var code = block.querySelector('code');
        var text = code ? code.textContent : block.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
      });
    });

    // ---------- Header scroll effect ----------
    var header = document.querySelector('.site-header');
    if (header) {
      var lastScroll = 0;
      window.addEventListener('scroll', debounce(function () {
        var current = window.scrollY;
        if (current > 100) {
          header.style.boxShadow = 'var(--shadow-md)';
        } else {
          header.style.boxShadow = 'none';
        }
        lastScroll = current;
      }, 16), { passive: true });
    }
  });

  // ---------- Utility ----------
  function debounce(fn, delay) {
    var timer;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(context, args); }, delay);
    };
  }
})();
