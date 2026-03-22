/* shimmer init */
document.addEventListener('DOMContentLoaded', () => {
  const g = document.querySelectorAll('[data-shimmer="group"]'),
    s = document.querySelectorAll('[data-shimmer]:not([data-shimmer="group"]):not([data-shimmer^="1"]):not([data-shimmer^="2"]):not([data-shimmer^="3"]):not([data-shimmer^="4"]):not([data-shimmer^="5"]):not([data-shimmer^="6"]):not([data-shimmer^="7"]):not([data-shimmer^="8"]):not([data-shimmer^="9"])'),
    d = 3.5,
    st = 0.15;

  const gT = (el) =>
    Array.from(el.querySelectorAll('*')).filter(
      (c) =>
        c.childNodes.length &&
        Array.from(c.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()) &&
        !c.closest('.nav-link')
    );

  s.forEach((c) => {
    if (c.closest('.nav-link')) return;
    const els = gT(c);
    const arrow = c.querySelector('.caret-right');
    if (!els.length) return;
    els.forEach((el) => window.YokaiShimmer.setup(el));
    if (arrow) window.YokaiShimmer.setupArrow(arrow);
    c.addEventListener('mouseenter', () => {
      const tl = gsap.timeline();
      els.forEach((el, i) => {
        tl.add(window.YokaiShimmer.play(el, d), i * st);
      });
      if (arrow) tl.add(window.YokaiShimmer.playArrow(arrow, d), els.length * st + 0.15);
    });
  });

  g.forEach((gr) => {
    if (gr.closest('.nav-link')) return;
    const els = Array.from(gr.querySelectorAll('[data-shimmer]'))
      .filter((el) => el.dataset.shimmer !== 'group' && !el.closest('.nav-link'))
      .sort((a, b) => a.dataset.shimmer - b.dataset.shimmer);
    const arrow = gr.querySelector('.caret-right');
    if (!els.length) return;
    els.forEach((el) => window.YokaiShimmer.setup(el));
    if (arrow) window.YokaiShimmer.setupArrow(arrow);
    gr.addEventListener('mouseenter', () => {
      const tl = gsap.timeline();
      els.forEach((el, i) => {
        tl.add(window.YokaiShimmer.play(el, d), i * st);
      });
      if (arrow) tl.add(window.YokaiShimmer.playArrow(arrow, d), els.length * st + 0.15);
    });
  });
});
