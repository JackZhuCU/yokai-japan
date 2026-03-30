/* mob-nav */
document.addEventListener('DOMContentLoaded', () => {
  const m = document.querySelector('[data-mob-menu]'),
    c = document.querySelector('.mob--nav-container'),
    l = document.querySelectorAll('.mob-nav-link'),
    s = document.querySelectorAll('[data-bg]'),
    ml = c?.querySelector('.nav--logo-wrapper.mobile');
  if (!m || !c) return;
  const lines = m.querySelectorAll('div');
  if (lines.length < 2) return;
  const BD = 0.7, PD = 0.15, CD = 0.6, ST = 0.07, BTN = 0.8, EI = 'expo.out', BE = 'circ.inOut';
  let isOpen = false, isAnim = false, openTl = null, sc = [], mY = 0, lastBg = null;
  const wipe = { v: 100 };
  const setWipe = () => { c.style.clipPath = 'inset(' + wipe.v + '% 0 0 0)'; };
  gsap.set(c, { opacity: 1, visibility: 'visible', pointerEvents: 'none' });
  setWipe();
  gsap.set(l, { opacity: 0, y: 20 });
  if (ml) gsap.set(ml, { opacity: 0, y: 20 });
  const calc = () => {
    sc = Array.from(s).map(x => ({ bg: x.getAttribute('data-bg'), top: x.offsetTop, bottom: x.offsetTop + x.offsetHeight })).sort((a, b) => a.top - b.top);
    const r = m.getBoundingClientRect();
    mY = r.top + r.height / 2;
  };
  const gB = y => {
    const n = sc.length;
    if (n === 0) return null;
    if (y < sc[0].top) return sc[0].bg;
    if (y >= sc[n - 1].bottom) return sc[n - 1].bg;
    for (let i = 0; i < n; i++) {
      if (y >= sc[i].top && y < sc[i].bottom) return sc[i].bg;
      if (y < sc[i].top) return sc[i - 1].bg;
    }
    return sc[n - 1].bg;
  };
  const uC = () => {
    if (isOpen || isAnim) return;
    const bg = gB(window.scrollY + mY);
    if (!bg || bg === lastBg) return;
    lastBg = bg;
    m.classList.remove(bg === 'light' ? 'is-light' : 'is-dark');
    m.classList.add(bg === 'light' ? 'is-dark' : 'is-light');
  };
  const doScroll = tg => {
    if (window.SScroll) window.SScroll.start();
    const ease = x => x < 0.5 ? 4 * x * x * x : (1 - Math.pow(-2 * x + 2, 3) / 2);
    const dist = Math.abs((tg === 0 ? 0 : tg.getBoundingClientRect().top + window.scrollY) - window.scrollY);
    const dur = Math.min(Math.max(0.6 + Math.sqrt(dist) / 50, 0.6), 1.8);
    SScroll.scrollTo(tg, { duration: dur, easing: ease });
  };
  const openMenu = () => {
    if (isAnim || isOpen) return;
    isAnim = true;
    if (window.SScroll) window.SScroll.stop();
    m.classList.add('is-active');
    openTl = gsap.timeline({ onComplete: () => { isAnim = false; isOpen = true; openTl = null; } });
    c.style.pointerEvents = 'auto';
    openTl.to(wipe, { v: 0, duration: BD, ease: BE, onUpdate: setWipe }, 0);
    const cS = BD * 0.4;
    if (ml) openTl.to(ml, { opacity: 1, y: 0, duration: CD, ease: EI }, cS);
    l.forEach((lk, i) => {
      const op = lk.classList.contains('is-active') ? 1 : 0.5;
      openTl.to(lk, { opacity: op, y: 0, duration: CD, ease: EI }, cS + (i + (ml ? 1 : 0)) * ST);
    });
  };
  const closeMenu = st => {
    if (openTl) { openTl.kill(); openTl = null; }
    isAnim = true; isOpen = false;
    m.classList.remove('is-active');
    lastBg = null;
    uC();
    if (st === 0 || st) { doScroll(st); }
    const tl = gsap.timeline({
      onComplete: () => {
        isAnim = false; isOpen = false;
        wipe.v = 100; setWipe(); c.style.pointerEvents = 'none';
        gsap.set(l, { opacity: 0, y: 20 });
        if (ml) gsap.set(ml, { opacity: 0, y: 20 });
        if (!(st === 0 || st) && window.SScroll) window.SScroll.start();
      }
    });
    var lArr = Array.from(l).reverse();
    if (ml) lArr.push(ml);
    lArr.forEach((lk, i) => {
      tl.to(lk, { opacity: 0, y: -20, duration: CD, ease: EI }, i * ST);
    });
    var cw = { v: 0 };
    tl.to(cw, { v: 100, duration: BD, ease: BE, onUpdate: () => { c.style.clipPath = 'inset(0 0 ' + cw.v + '% 0)'; } }, 0);
  };
  m.addEventListener('click', () => (isOpen || openTl) ? closeMenu() : openMenu());
  const mp = { top: 'hero', concept: 'concept', products: 'product', location: 'store', news: 'news', contact: 'contact' };
  const getText = el => {
    let t = el.querySelector('.small-text')?.textContent.trim().toLowerCase();
    if (t && t.length % 2 === 0 && t.slice(0, t.length / 2) === t.slice(t.length / 2)) t = t.slice(0, t.length / 2);
    return t;
  };
  l.forEach(lk => {
    lk.addEventListener('click', e => {
      e.preventDefault();
      const t = getText(lk), id = mp[t] || t, tg = t === 'top' ? 0 : document.getElementById(id);
      (tg === 0 || tg) ? closeMenu(tg) : closeMenu();
    });
  });
  calc();
  uC();
  window.addEventListener('scroll', uC, { passive: true });
  window.addEventListener('resize', () => { calc(); uC(); });
});