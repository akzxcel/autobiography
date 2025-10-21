// -----------------------------
// script.js (drop into your project)
// -----------------------------

/* ---------- MUTE / UNMUTE ---------- */
/*
  Usage in HTML:
  - recommended: <button class="mute-btn" onclick="toggleMute(this)">Unmute</button>
  - legacy (keeps working): <button class="mute-btn" onclick="toggleMute('video3')">Unmute</button>
*/
function toggleMute(arg) {
  let video, button;

  if (typeof arg === 'string') {
    // user passed a video id
    video = document.getElementById(arg);
    // if the button is inside overlay, try to find it (not guaranteed)
    button = document.querySelector(`.mute-btn[data-for="${arg}"]`);
  } else if (arg instanceof Element) {
    // user passed the button element (recommended)
    button = arg;
    // find the closest card/overlay/container then the video inside it
    const card = button.closest('.project-card') || button.closest('.project-overlay') || button.parentElement;
    if (card) video = card.querySelector('video') || document.getElementById(button.dataset.for);
  }

  // If we still don't have a video, try a fallback: find a video inside same parent
  if (!video && button) {
    const parent = button.parentElement || document;
    video = parent.querySelector('video');
  }

  if (!video) {
    console.warn('toggleMute: video element not found for', arg);
    return;
  }

  // Toggle mute and update button text
  if (video.muted) {
    video.muted = false;
    if (button) button.textContent = 'Mute';
  } else {
    video.muted = true;
    if (button) button.textContent = 'Unmute';
  }
}

/* Optional: if you want all mute buttons to initialize correct text on load */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mute-btn').forEach(btn => {
    // If the button has data-for attribute, use it to set initial state
    const vidId = btn.getAttribute('data-for');
    let vid = null;
    if (vidId) vid = document.getElementById(vidId);
    if (!vid) {
      // fallback: find a nearby video
      const parent = btn.closest('.project-card') || btn.parentElement;
      if (parent) vid = parent.querySelector('video');
    }
    if (vid) {
      btn.textContent = vid.muted ? 'Unmute' : 'Mute';
    }
  });
});

/* ---------- PROGRESS BARS ANIMATION ---------- */
/*
  Requirements for HTML:
  - Prefer: <div class="bar html" data-width="80%"></div>
  - If you used inline style (older file): <div class="bar html" style="width: 80%;"></div>
  The script supports both.
*/

const skillBars = document.querySelectorAll('.bar');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;

      // Determine target width:
      // Priority: data-width attribute -> inline style width -> fallback 0%
      let targetWidth = bar.dataset.width || '';

      if (!targetWidth) {
        const styleAttr = bar.getAttribute('style') || '';
        const match = styleAttr.match(/width\s*:\s*([\d.]+%)/);
        if (match && match[1]) targetWidth = match[1];
      }

      // final fallback
      if (!targetWidth) targetWidth = '0%';

      // Reset to 0 first to ensure animation plays
      bar.style.width = '0';

      // Force reflow to ensure the transition triggers in some browsers
      // (reads layout property to flush)
      void bar.offsetWidth;

      // Apply target width to trigger the CSS transition
      bar.style.width = targetWidth;

      // Unobserve so animation runs only once
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.45 });

// Initialize each bar: ensure width is 0 and keep the original target in dataset if not present
skillBars.forEach(bar => {
  // if dataset missing but inline style present, store it
  if (!bar.dataset.width) {
    const styleAttr = bar.getAttribute('style') || '';
    const match = styleAttr.match(/width\s*:\s*([\d.]+%)/);
    if (match && match[1]) {
      bar.dataset.width = match[1];
    }
  }

  // Start visually from 0
  bar.style.width = '0';

  // Observe for intersection to animate
  skillObserver.observe(bar);
});

/* ---------- SCROLL PROGRESS INDICATOR (optional) ---------- */
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  const prog = document.getElementById('scroll-progress');
  if (prog) prog.style.width = scrollProgress + '%';
});
