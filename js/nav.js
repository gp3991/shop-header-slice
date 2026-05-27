/**
 * Mobile navigation — drawer (hamburger) control.
 * One state-setter keeps everything in sync: the .is-open class, the ARIA
 * attributes, the backdrop and the background-scroll lock.
 * Closes on: ESC, backdrop click, link click, resize to tablet width.
 */
(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('mobile-drawer');
  var backdrop = document.querySelector('.drawer-backdrop');

  if (!burger || !drawer || !backdrop) {
    return;
  }

  function isOpen() {
    return drawer.classList.contains('is-open');
  }

  // Single source of truth for the open/closed state.
  // returnFocus=false skips moving focus back to the hamburger (used when a
  // link click already sends focus elsewhere).
  function setOpen(open, returnFocus) {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', !open);
    backdrop.hidden = !open;
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    document.body.classList.toggle('is-drawer-open', open);

    if (open) {
      // The panel slides in from visibility:hidden and isn't focusable until that
      // transition ends, so move focus into it once the animation finishes. We focus
      // the panel itself (tabindex="-1") rather than the first link, so opening by tap
      // doesn't paint a "selected"-looking focus ring on a menu item.
      drawer.addEventListener('transitionend', function () {
        if (!isOpen()) {
          return; // closed again before the open animation finished
        }
        drawer.focus();
      }, { once: true });
    } else if (returnFocus !== false) {
      burger.focus();
    }
  }

  // --- Events ---
  burger.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  backdrop.addEventListener('click', function () {
    setOpen(false);
  });

  // Close button (X) inside the drawer
  var closeBtn = drawer.querySelector('.drawer__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      setOpen(false);
    });
  }

  // Click a link inside the drawer -> close (focus follows the link target).
  drawer.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      setOpen(false, false);
    }
  });

  // ESC closes.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
    }
  });

  // Lightweight focus trap: keep Tab cycling inside the open drawer.
  drawer.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab' || !isOpen()) {
      return;
    }
    var focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!focusables.length) {
      return;
    }
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    var active = document.activeElement;

    // Shift+Tab from the first control — or from the panel itself, which holds focus
    // right after opening — wraps to the last; Tab from the last wraps to the first.
    if (event.shiftKey && (active === first || active === drawer)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Close when the viewport reaches tablet width — the drawer no longer exists.
  window.matchMedia('(min-width: 768px)').addEventListener('change', function (event) {
    if (event.matches && isOpen()) {
      setOpen(false, false);
    }
  });
})();

/**
 * Sticky header — add a soft shadow once the page scrolls under the bar.
 * The pinning itself is pure CSS (position: sticky); this only toggles the lift.
 */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  if (!header) {
    return;
  }

  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 4);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // honour an initial scroll position (e.g. on reload)
})();
