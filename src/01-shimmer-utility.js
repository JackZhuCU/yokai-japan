/* shimmer utility */
window.YokaiShimmer = (() => {
  const lightShimmer = 'rgba(245,239,225,0.8)',
    darkShimmer = 'rgba(31,29,33,0.8)',
    arrowLightShimmer = 'rgb(180,175,165)',
    arrowDarkShimmer = 'rgb(70,68,72)';

  const isLight = (c) => {
    const m = c.match(/\d+/g);
    if (!m) return false;
    return (parseInt(m[0]) * 299 + parseInt(m[1]) * 587 + parseInt(m[2]) * 114) / 1000 > 150;
  };

  const setup = (el, oc = null) => {
    const bc = oc || getComputedStyle(el).color;
    const sc = isLight(bc) ? darkShimmer : lightShimmer;
    el._baseColor = bc;
    el._shimmerColor = sc;
    el.style.position = 'relative';
    el.style.color = bc;
    let overlay = el.querySelector('.shimmer-overlay');
    if (!overlay) {
      overlay = document.createElement('span');
      overlay.className = 'shimmer-overlay';
      overlay.textContent = el.textContent;
      overlay.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;color:${sc};pointer-events:none;white-space:nowrap;mask-image:linear-gradient(90deg,transparent 0%,transparent 10%,black 50%,transparent 90%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,transparent 10%,black 50%,transparent 90%,transparent 100%);mask-size:150% 100%;-webkit-mask-size:150% 100%;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;`;
      el.appendChild(overlay);
    }
    overlay.style.maskPosition = '250% 0';
    overlay.style.webkitMaskPosition = '250% 0';
  };

  const setupArrow = (el) => {
    if (!el._arrowBaseColor) {
      el._arrowBaseColor = getComputedStyle(el).color;
      el._arrowShimmerColor = isLight(el._arrowBaseColor) ? arrowDarkShimmer : arrowLightShimmer;
    }
  };

  const transition = (el, fc, tc, dur = 0.3) => {
    el.style.color = tc;
    const overlay = el.querySelector('.shimmer-overlay');
    if (overlay) {
      const sc = isLight(tc) ? darkShimmer : lightShimmer;
      overlay.style.color = sc;
      el._baseColor = tc;
      el._shimmerColor = sc;
    }
  };

  const play = (el, dur = 5) => {
    const overlay = el.querySelector('.shimmer-overlay');
    if (!overlay) return gsap.timeline();
    const tl = gsap.timeline();
    tl.fromTo(overlay, { maskPosition: '250% 0', webkitMaskPosition: '250% 0' }, { maskPosition: '50% 0', webkitMaskPosition: '50% 0', duration: 0.2, ease: 'power2.in' });
    tl.to(overlay, { maskPosition: '0% 0', webkitMaskPosition: '0% 0', duration: 0.2, ease: 'none' });
    tl.to(overlay, { maskPosition: '-150% 0', webkitMaskPosition: '-150% 0', duration: dur, ease: 'power4.out' });
    return tl;
  };

  const playArrow = (el, dur = 3.5) => {
    setupArrow(el);
    gsap.killTweensOf(el);
    el.style.color = el._arrowBaseColor;
    const tl = gsap.timeline();
    tl.to(el, { color: el._arrowShimmerColor, duration: 0.3, ease: 'power2.out' });
    tl.to(el, { color: el._arrowBaseColor, duration: dur, ease: 'power4.out' });
    return tl;
  };

  return { setup, setupArrow, play, playArrow, transition, isLight };
})();
