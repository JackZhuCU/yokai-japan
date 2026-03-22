/* nav active + scrollto */
document.addEventListener("DOMContentLoaded", () => {
  const dn = document.querySelectorAll('.nav-container .nav-link'),
    mn = document.querySelectorAll('.mob-nav-link');
  if (!dn.length) return;

  const d = 0.6,
    e = "power2.out";
  let cur = null,
    isSc = false;

  const mp = { top: 'hero', concept: 'concept', products: 'product', news: 'news', location: 'store', contact: 'contact' };

  const gS = (lk) => {
    let t = lk.querySelector('.small-text')?.textContent.trim().toLowerCase();
    if (t && t.length % 2 === 0 && t.slice(0, t.length / 2) === t.slice(t.length / 2)) t = t.slice(0, t.length / 2);
    return mp[t] || t;
  };

  const all = [...dn, ...mn];

  const setAct = (id) => {
    if (id === cur) return;
    cur = id;
    all.forEach((lk) => {
      const s = gS(lk),
        ic = lk.querySelector('.nav--active-icon');
      if (!ic) return;
      if (s === id) {
        lk.classList.add('is-active');
        gsap.fromTo(ic, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(100% at 50% 50%)', duration: d, ease: e });
      } else {
        lk.classList.remove('is-active');
        gsap.to(ic, { clipPath: 'circle(0% at 50% 50%)', duration: d, ease: e });
      }
    });
  };

  const sIds = Object.values(mp);

  const chk = () => {
    const vh = window.innerHeight;
    let act = sIds[0];
    for (const id of sIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= vh * 0.4) act = id;
    }
    setAct(act);
  };

  const wt = setInterval(() => {
    if (typeof SScroll !== "undefined") {
      clearInterval(wt);
      SScroll.on('scroll', chk);
      chk();
    }
  }, 50);

  dn.forEach((lk) => {
    lk.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (isSc) return;
      isSc = true;
      const s = gS(lk),
        ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
        tg = s === 'hero' ? 0 : document.getElementById(s);
      if (tg === 0 || tg) {
        const dist = Math.abs((tg === 0 ? 0 : tg.getBoundingClientRect().top + window.scrollY) - window.scrollY);
        const dur = Math.min(Math.max(0.6 + Math.sqrt(dist) / 50, 0.6), 1.8);
        SScroll.scrollTo(tg, { duration: dur, easing: ease });
        setTimeout(() => {
          isSc = false;
        }, dur * 1000 + 100);
      } else {
        isSc = false;
      }
    });
  });
});
