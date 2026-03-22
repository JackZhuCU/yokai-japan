/* concept scroll */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const e = document.querySelector("._3d-scene"),
    t = document.querySelector(".concept-overlay"),
    s = document.querySelector(".heading-medium.concept"),
    a = document.querySelector("._3d-placeholder");
  if (!e || !t || !s) return;

  const o = new SplitText(s, { type: "words", wordsClass: "concept-word" }),
    r = o.words;
  gsap.set(t, { display: "flex", justifyContent: "center", alignItems: "center", opacity: 0 });
  gsap.set(s, { opacity: 0 });
  gsap.set(r, { opacity: 0, y: 20 });

  let n = false,
    i = null;

  const c = (e) => (e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2),
    p = (e) => 1 - Math.pow(1 - e, 3),
    l = (e) => (e < 38.5 ? 1 : e >= 38.5 && e <= 55.7 ? 1 - ((e - 38.5) / 17.2) * 0.5 : e > 55.7 && e < 78.8 ? 0.5 : e >= 78.8 ? 0.5 + ((e - 78.8) / 6.9) * 0.5 : 1),
    g = (e) => (e < 42.8 ? 0 : e >= 42.8 && e < 57.4 ? p((e - 42.8) / 14.6) : e >= 57.4 && e < 78.8 ? 1 : e >= 78.8 ? 1 - c((e - 78.8) / 6.9) : 0),
    d = (e) => (e < 51.4 ? 0 : e >= 51.4 && e < 61.7 ? (e - 51.4) / 10.3 : e >= 61.7 && e < 78.8 ? 1 : e >= 78.8 ? 1 - (e - 78.8) / 6.9 : 0);

  ScrollTrigger.create({
    trigger: e,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (e) => {
      const o = 100 * e.progress,
        c = d(o);
      a && gsap.set(a, { opacity: l(o) });
      gsap.to(t, { opacity: g(o), duration: 0.3, ease: "power2.out", overwrite: true });
      gsap.set(s, { opacity: c });
      o >= 51.4 && !n && ((n = true), i && i.kill(), (i = gsap.to(r, { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: "power2.out" })));
      o < 51.4 && n && ((n = false), i && i.kill(), gsap.set(r, { opacity: 0, y: 20 }));
    },
  });

  window.refreshConceptText = () => {
    o.revert();
    const e = new SplitText(s, { type: "words", wordsClass: "concept-word" });
    gsap.set(e.words, { opacity: 0, y: 20 });
    ScrollTrigger.refresh();
  };

  const revealMaskTargets = document.querySelectorAll(
    ".reveal-section .concept-kanji-wrapper, .reveal-section .concept-img, .reveal-section .concept-wrapper.flex-space"
  );
  gsap.set(revealMaskTargets, { visibility: "hidden" });
  let maskTriggered = false;

  gsap.to(".reveal-section", {
    clipPath: "inset(0% 0 0 0)",
    ease: "none",
    scrollTrigger: {
      trigger: ".reveal-wrapper",
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        if (!maskTriggered && self.progress >= 0.5) {
          maskTriggered = true;
          revealMaskTargets.forEach((el) => {
            gsap.set(el, { visibility: "visible" });
            el.setAttribute("data-reveal", "mask");
          });
          initMaskReveal();
        }
      },
    },
  });

  ScrollTrigger.create({
    trigger: ".reveal-wrapper",
    start: "top top",
    end: "bottom bottom",
    onLeave: () => gsap.set(".reveal-section", { position: "absolute", bottom: 0, top: "auto" }),
    onEnterBack: () => gsap.set(".reveal-section", { position: "fixed", top: 0, bottom: "auto", left: 0, width: "100%" }),
  });
});
