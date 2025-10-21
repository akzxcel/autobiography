// Progress bar animation when visible
const skillBars = document.querySelectorAll('.bar');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.dataset.width;
      bar.style.width = targetWidth;
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
  bar.style.width = '0'; // Start from 0 width
  skillObserver.observe(bar);
});

