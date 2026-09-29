/**
 * NovaTech — Modern Landing Page Logic
 * Pure Vanilla JavaScript (Clean, Semantic, Modular)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastClose = document.getElementById('toastClose');
  const backToTop = document.getElementById('backToTop');
  const metricNumbers = document.querySelectorAll('.metric-number');
  const sections = document.querySelectorAll('section[id]');
  const featureCards = document.querySelectorAll('.feature-card');

  /* ----------------------------------------------------------
     1. Theme Switcher (Dark / Light Mode)
     ---------------------------------------------------------- */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('novatech-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('novatech-theme', newTheme);
  };

  initTheme();
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  /* ----------------------------------------------------------
     2. Navbar Sticky & Scroll Background Blur
     ---------------------------------------------------------- */
  const handleScrollNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  /* ----------------------------------------------------------
     3. Mobile Navigation Menu Toggle
     ---------------------------------------------------------- */
  const toggleMobileMenu = () => {
    const isActive = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', String(isActive));
  };

  const closeMobileMenu = () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(event.target) &&
        !hamburger.contains(event.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      hideToast();
    }
  });

  /* ----------------------------------------------------------
     4. Active Navigation Link on Scroll (IntersectionObserver)
     ---------------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* ----------------------------------------------------------
     5. Back to Top Button
     ---------------------------------------------------------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ----------------------------------------------------------
     6. Metric Numbers Animation
     ---------------------------------------------------------- */
  let metricsAnimated = false;
  const animateMetrics = () => {
    metricNumbers.forEach(element => {
      const target = parseFloat(element.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing function (easeOutQuad)
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentVal = target * ease;

        element.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          element.textContent = isDecimal ? target.toFixed(1) : target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateMetrics();
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    heroObserver.observe(heroSection);
  }

  /* ----------------------------------------------------------
     7. Interactive Card Hover Glow Movement
     ---------------------------------------------------------- */
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ----------------------------------------------------------
     8. Toast Notifications
     ---------------------------------------------------------- */
  let toastTimer = null;
  const showToast = (title, message) => {
    if (!toastNotification) return;

    if (title) {
      const titleElem = toastNotification.querySelector('.toast-title');
      if (titleElem) titleElem.textContent = title;
    }
    if (message) {
      const bodyElem = toastNotification.querySelector('.toast-body');
      if (bodyElem) bodyElem.textContent = message;
    }

    toastNotification.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hideToast();
    }, 4500);
  };

  const hideToast = () => {
    if (toastNotification) {
      toastNotification.classList.remove('show');
    }
  };

  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }

  /* ----------------------------------------------------------
     9. Contact Form Validation & Submission
     ---------------------------------------------------------- */
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('has-error');
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        messageInput.parentElement.classList.remove('has-error');
      }

      if (!isValid) return;

      // Simulate network request
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();

        showToast(
          'შეტყობინება წარმატებით გაიგზავნა!',
          'გმადლობთ დაინტერესებისთვის. ჩვენი წარმომადგენელი უახლოეს დროში დაგიკავშირდებათ.'
        );
      }, 1200);
    });

    // Real-time error removal on input
    ['userName', 'userEmail', 'userMessage'].forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (input) {
        input.addEventListener('input', () => {
          if (input.value.trim()) {
            input.parentElement.classList.remove('has-error');
          }
        });
      }
    });
  }
});
