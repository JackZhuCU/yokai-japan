/* store tabs */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[data-store-tab]'),
    indicator = document.querySelector('.store-tab-indicator'),
    panels = document.querySelectorAll('[data-store-content]');
  if (!tabs.length || !indicator || !panels.length) return;

  let active = 0,
    animating = false;

  tabs[0].classList.add('is-active');
  panels[0].classList.add('is-active');
  gsap.set(indicator, { x: '0%' });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const i = parseInt(tab.dataset.storeTab);
      if (i === active || animating) return;
      animating = true;

      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      gsap.to(indicator, { x: `${i * 100}%`, duration: 0.8, ease: 'expo.out' });

      gsap.to(panels[active], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          panels[active].classList.remove('is-active');
          panels[i].classList.add('is-active');
          gsap.fromTo(panels[i], { opacity: 0 }, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              animating = false;
              active = i;
            },
          });
        },
      });
    });
  });
});
