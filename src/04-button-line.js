/* button line */
document.addEventListener('DOMContentLoaded', () => {
  const t = [...document.querySelectorAll('.primary--button'), ...document.querySelectorAll('.news-row')];
  if (!t.length) return;
  const d = 0.4,
    e = 'power2.out';

  t.forEach((t) => {
    const n = t.querySelector('.btn--line-fill');
    const arrow = t.querySelector('.caret-right');
    if (!n) return;
    if (arrow) window.YokaiShimmer.setupArrow(arrow);
    let i = false,
      o = false;

    const a = () => {
      i = true;
      gsap.fromTo(n, { x: '-100%' }, {
        x: '0%', duration: d, ease: e, onComplete: () => {
          i = false;
          if (!o) r();
        },
      });
    };

    const r = () => {
      i = true;
      gsap.fromTo(n, { x: '0%' }, {
        x: '100%', duration: d, ease: e, onComplete: () => {
          i = false;
          gsap.set(n, { x: '-100%' });
          if (o) a();
        },
      });
    };

    t.addEventListener('mouseenter', () => {
      o = true;
      if (!i) a();
      if (arrow)
        gsap.delayedCall(0.4, () => {
          if (o) {
            gsap.killTweensOf(arrow);
            gsap.to(arrow, { color: arrow._arrowShimmerColor, duration: 0.3, ease: 'power2.out' });
          }
        });
    });

    t.addEventListener('mouseleave', () => {
      o = false;
      if (!i) r();
      if (arrow) {
        gsap.killTweensOf(arrow);
        gsap.to(arrow, { color: arrow._arrowBaseColor, duration: d * 2, ease: 'power4.out' });
      }
    });
  });
});
