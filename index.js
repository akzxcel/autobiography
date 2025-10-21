// Scroll progress indicator
window.addEventListener('scroll', function() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById('scroll-progress').style.width = progress + '%';
});

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.bar');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const value = bar.getAttribute('data-value');
      bar.style.width = value + '%';
      observer.unobserve(bar);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
  observer.observe(bar);
});
