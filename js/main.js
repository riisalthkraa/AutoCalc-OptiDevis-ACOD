// AutoCalc OptiDevis - Site Web
// Effets simples et élégants

document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    initMobileNav();

    // Carousel de screenshots
    initCarousel();

    // Animations simples au scroll
    initScrollAnimations();

    // Compteurs animés progressifs (on garde celui-ci)
    initCounters();

    // Navbar avec ombre au scroll
    initNavbar();

    // Effets hover simples
    initHoverEffects();
});

// Navigation mobile
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Carousel simple
function initCarousel() {
    const items = document.querySelectorAll('.screenshot-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (items.length === 0) return;

    let currentIndex = 0;

    // Créer les dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        items[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = index;

        items[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            goToSlide(newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
            goToSlide(newIndex);
        });
    }

    // Auto-play
    setInterval(() => {
        const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
        goToSlide(newIndex);
    }, 5000);
}

// Animations SIMPLES au scroll - fade in seulement
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer tous les éléments
    const elements = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item, .pricing-card');
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Compteurs animés progressifs (GARDÉ)
function initCounters() {
    const counterElements = document.querySelectorAll('.stat-item h3');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counterElements.forEach(element => {
        observer.observe(element);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseFloat(text.replace(/[^0-9.]/g, ''));

    if (isNaN(number)) return;

    const duration = 1500;
    const steps = 50;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easing = 1 - Math.pow(1 - progress, 3);
        current = number * easing;

        if (step >= steps) {
            element.textContent = text;
            clearInterval(timer);
        } else {
            if (text.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else if (text.includes('/')) {
                const parts = text.split('/');
                element.textContent = Math.floor(current) + '/' + parts[1];
            } else {
                element.textContent = Math.floor(current);
            }
        }
    }, duration / steps);
}

// Navbar simple avec ombre au scroll
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }
    });
}

// Effets hover simples
function initHoverEffects() {
    // Cards légèrement soulevées au hover
    const cards = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Boutons avec effet simple
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Styles CSS simples
const style = document.createElement('style');
style.textContent = `
    /* Fade in simple au scroll */
    .feature-card,
    .testimonial-card,
    .stat-item,
    .pricing-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .feature-card.visible,
    .testimonial-card.visible,
    .stat-item.visible,
    .pricing-card.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Transitions douces sur les cards */
    .feature-card,
    .testimonial-card,
    .pricing-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.6s ease;
    }

    /* Transitions douces sur les boutons */
    .btn-primary,
    .btn-secondary {
        transition: transform 0.2s ease;
    }

    /* Navbar avec transition */
    .navbar {
        transition: box-shadow 0.3s ease;
    }

    /* Carousel simple */
    .screenshot-item {
        transition: opacity 0.3s ease;
    }

    .screenshot-item.active {
        opacity: 1;
    }

    /* Performance */
    .feature-card,
    .testimonial-card,
    .stat-item {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(style);
