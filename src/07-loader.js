/* loader */
(function () {
  document.documentElement.classList.add('is-loading');
  document.body.classList.add('is-loading');

  var CONFIG = {
    fonts: ['ibm-plex-sans-jp', 'Optima'],
    testString: 'BESbwy',
    textFadeIn: 0.3,
    sweepDuration: 2.5,
    sweepEase: 'circ.inOut',
    fadeOutDuration: 1.2,
    fadeOutEase: 'power2.inOut',
    videoZoomDuration: 6,
    videoZoomEase: 'circ.out',
    revealDelay: 0.1,
    pollInterval: 20,
    maxPollTime: 5000,
  };

  var state = { video: false, sweep: false };
  var loader = document.querySelector('.yokai-loader');
  var loaderText = document.querySelector('.yokai-loader__text');
  var loaderTextRevealed = document.querySelector('.yokai-loader__text-revealed');
  var heroContent = document.querySelector('.hero-section .hero--content-container');
  var heroVideo = document.querySelector('.hero-video video');
  var revealedContent = loaderTextRevealed
    ? loaderTextRevealed.querySelector('.hero--content-container')
    : null;
  if (!loader || !heroContent) return;
  if (heroVideo) gsap.set(heroVideo, { scale: 1.3 });

  function checkFadeOut() {
    if (state.video && state.sweep) fadeOut();
  }

  function fadeOut() {
    gsap.to(loader, {
      opacity: 0,
      duration: CONFIG.fadeOutDuration,
      ease: CONFIG.fadeOutEase,
      onComplete: function () {
        loader.style.display = 'none';
        document.documentElement.classList.remove('is-loading');
        document.body.classList.remove('is-loading');
      },
    });
    if (heroVideo) gsap.to(heroVideo, { scale: 1, duration: CONFIG.videoZoomDuration, ease: CONFIG.videoZoomEase });
  }

  function runSweep() {
    if (!revealedContent) {
      state.sweep = true;
      checkFadeOut();
      return;
    }
    gsap.fromTo(
      revealedContent,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: CONFIG.sweepDuration,
        ease: CONFIG.sweepEase,
        onComplete: function () {
          state.sweep = true;
          checkFadeOut();
        },
      }
    );
  }

  function onFontsReady() {
    loaderText.style.display = 'block';
    loaderText.style.opacity = '0';
    gsap.to(loaderText, {
      opacity: 1,
      duration: CONFIG.textFadeIn,
      delay: CONFIG.revealDelay,
      ease: 'power2.out',
      onComplete: runSweep,
    });
  }

  function createTestElement() {
    var el = document.createElement('span');
    el.style.cssText =
      'position:absolute;visibility:hidden;font-size:300px;white-space:nowrap;pointer-events:none;top:-9999px;left:-9999px;font-family:monospace;';
    el.textContent = CONFIG.testString;
    document.body.appendChild(el);
    return el;
  }

  function waitForFont(fontFamily) {
    return new Promise(function (resolve) {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('1em ' + fontFamily).catch(function () {});
      }
      var testEl = createTestElement();
      var fallbackWidth = testEl.offsetWidth;
      testEl.style.fontFamily = fontFamily + ',monospace';
      var startTime = Date.now();
      function poll() {
        var currentWidth = testEl.offsetWidth;
        if (currentWidth !== fallbackWidth) {
          testEl.remove();
          resolve(true);
          return;
        }
        if (Date.now() - startTime > CONFIG.maxPollTime) {
          testEl.remove();
          resolve(false);
          return;
        }
        setTimeout(poll, CONFIG.pollInterval);
      }
      poll();
    });
  }

  function waitForAllFonts() {
    Promise.all(
      CONFIG.fonts.map(function (f) {
        return waitForFont(f);
      })
    ).then(onFontsReady);
  }

  if (!heroVideo) {
    state.video = true;
  } else if (heroVideo.readyState >= 3) {
    state.video = true;
  } else
    heroVideo.addEventListener(
      'canplay',
      function () {
        state.video = true;
        checkFadeOut();
      },
      { once: true }
    );

  waitForAllFonts();
})();
