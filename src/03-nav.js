/* nav */
document.addEventListener('DOMContentLoaded', () => {
  const n = document.querySelectorAll('.nav-link'),
    s = document.querySelectorAll('[data-bg]'),
    logo = document.querySelector('.yokai--nav-logo'),
    stickyNav = document.querySelector('.sticky-nav'),
    footerImg = document.querySelector('.footer--bg-wrapper');
  if (!n.length || !s.length) return;

  const wh = 'rgb(245,239,225)',
    bl = 'rgb(31,29,33)',
    whShimmer = 'rgba(245,239,225,0.8)',
    blShimmer = 'rgba(31,29,33,0.8)';
  let sc = [],
    navY = [],
    logoY = 0,
    navHidden = false;
  const last = new Map();

  const cS = () => {
    sc = Array.from(s)
      .map((sec) => ({
        bg: sec.getAttribute('data-bg'),
        top: sec.offsetTop,
        bottom: sec.offsetTop + sec.offsetHeight,
      }))
      .sort((a, b) => a.top - b.top);
    if (logo) {
      const r = logo.getBoundingClientRect();
      logoY = r.top + r.height / 2;
    }
    navY = Array.from(n).map((l) => {
      const r = l.getBoundingClientRect();
      return r.top + r.height / 2;
    });
  };

  const gB = (y) => {
    const len = sc.length;
    if (len === 0) return null;
    if (y < sc[0].top) return sc[0].bg;
    if (y >= sc[len - 1].bottom) return sc[len - 1].bg;
    for (let i = 0; i < len; i++) {
      if (y >= sc[i].top && y < sc[i].bottom) return sc[i].bg;
      if (y < sc[i].top) return sc[i - 1].bg;
    }
    return sc[len - 1].bg;
  };

  const uE = (el, bg) => {
    if (!bg) bg = last.get(el);
    if (!bg || last.get(el) === bg) return;
    last.set(el, bg);
    const nc = bg === 'light' ? 'is-dark' : 'is-light',
      oc = bg === 'light' ? 'is-light' : 'is-dark';
    el.classList.remove(oc);
    el.classList.add(nc);
    const te = el.querySelector?.('.small-text');
    if (te) {
      const bc = nc === 'is-light' ? wh : bl;
      const sc = nc === 'is-light' ? blShimmer : whShimmer;
      te._baseColor = bc;
      te._shimmerColor = sc;
      te.style.color = bc;
      const overlay = te.querySelector('.shimmer-overlay');
      if (overlay) overlay.style.color = sc;
    }
  };

  const uN = () => {
    const sy = window.scrollY;
    if (logo) uE(logo, gB(sy + logoY));
    for (let i = 0; i < n.length; i++) uE(n[i], gB(sy + navY[i]));
    if (stickyNav && footerImg) {
      const rect = footerImg.getBoundingClientRect();
      const shouldHide = rect.bottom <= window.innerHeight;
      if (shouldHide && !navHidden) {
        navHidden = true;
        gsap.to(stickyNav, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            stickyNav.style.pointerEvents = 'none';
          },
        });
      } else if (!shouldHide && navHidden) {
        navHidden = false;
        stickyNav.style.pointerEvents = '';
        gsap.to(stickyNav, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      }
    }
  };

  n.forEach((l) => {
    const te = l.querySelector('.small-text');
    if (te) window.YokaiShimmer.setup(te);
    l.addEventListener('mouseenter', () => {
      if (te) {
        gsap.timeline().add(window.YokaiShimmer.play(te, 1.2), 0);
      }
    });
  });

  cS();
  uN();
  window.addEventListener('scroll', uN, { passive: true });
  window.addEventListener('resize', () => {
    cS();
    uN();
  });
});
