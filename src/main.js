// Main JavaScript Controller for Kishorekumar K.T Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // 1. IntersectionObserver for Smooth Scroll-Triggered Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve once revealed for performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12, // Reveal when 12% of element is in view
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 2. Active Sticky Navbar Link Highlighting on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      if (navLinksContainer.style.display === 'flex') {
        navLinksContainer.style.display = 'none';
      } else {
        navLinksContainer.style.display = 'flex';
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = '100%';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.width = '100%';
        navLinksContainer.style.background = '#ffffff';
        navLinksContainer.style.padding = '1.5rem';
        navLinksContainer.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      }
    });
  }

  // 4. Contact Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending Message...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = '✓ Message Sent!';
          submitBtn.style.background = '#10b981';
          contactForm.reset();

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3500);
        }, 1000);
      }
    });
  }
});
