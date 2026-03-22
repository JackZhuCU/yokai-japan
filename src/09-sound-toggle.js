/* sound toggle */
const toggle = document.getElementById('musicToggle');
const bars = document.querySelectorAll('.bar');
const video = document.querySelector('.hero-video video');
let isPlaying = false;
let waveformInterval = null;

function setRandomHeights() {
  bars.forEach((bar) => {
    const random = Math.random() * 0.8 + 0.2;
    const height = Math.max(4, random * 14);
    gsap.to(bar, {
      height: height,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: true,
    });
  });
}

function resetHeights() {
  bars.forEach((bar) => {
    gsap.to(bar, {
      height: 4,
      duration: 0.6,
      ease: 'expo.out',
    });
  });
}

toggle.addEventListener('click', function () {
  if (isPlaying) {
    video.muted = true;
    clearInterval(waveformInterval);
    resetHeights();
  } else {
    video.muted = false;
    waveformInterval = setInterval(setRandomHeights, 150);
  }

  isPlaying = !isPlaying;
});
