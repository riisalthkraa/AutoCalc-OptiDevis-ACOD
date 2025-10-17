// AutoCalc OptiDevis - Site Web PRO
// Animations subtiles et professionnelles pour vitrine ERP

document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    initMobileNav();

    // Carousel de screenshots
    initCarousel();

    // Animations au scroll (subtiles et professionnelles)
    initScrollAnimations();

    // Compteurs animés (progressifs et doux)
    initCounters();

    // Navbar intelligente
    initSmartNavbar();

    // Smooth interactions
    initSmoothInteractions();
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

// Carousel professionnel avec transitions douces
function initCarousel() {
    const items = document.querySelectorAll('.screenshot-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (items.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;

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
        if (isAnimating || index === currentIndex) return;
        isAnimating = true;

        // Transition très douce
        items[currentIndex].style.opacity = '0';
        items[currentIndex].style.transform = 'translateX(-20px)';
        dots[currentIndex].classList.remove('active');

        setTimeout(() => {
            items[currentIndex].classList.remove('active');
            currentIndex = index;
            items[currentIndex].classList.add('active');

            setTimeout(() => {
                items[currentIndex].style.opacity = '1';
                items[currentIndex].style.transform = 'translateX(0)';
                dots[currentIndex].classList.add('active');
                isAnimating = false;
            }, 50);
        }, 400);
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

    // Auto-play doux
    setInterval(() => {
        const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
        goToSlide(newIndex);
    }, 6000);
}

// Animations au scroll TRÈS subtiles et professionnelles
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Transition très douce sans flash
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Feature cards - apparition subtile
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        card.style.transition = `opacity 0.8s ease-out ${index * 0.08}s, transform 0.8s ease-out ${index * 0.08}s`;
        observer.observe(card);
    });

    // Témoignages - glissement très doux
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        card.style.transition = `opacity 0.9s ease-out ${index * 0.1}s, transform 0.9s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });

    // Stats - fade in progressif
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(8px)';
        stat.style.transition = `opacity 1s ease-out ${index * 0.12}s, transform 1s ease-out ${index * 0.12}s`;
        observer.observe(stat);
    });
}

// Compteurs animés progressifs
function initCounters() {
    const counterElements = document.querySelectorAll('.stat-item h3');

    const observerOptions = {
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                setTimeout(() => animateCounter(entry.target), 200);
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

    const duration = 1800; // Plus lent = plus professionnel
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        // Easing function pour ralentir à la fin
        const progress = step / steps;
        const easing = 1 - Math.pow(1 - progress, 3); // Ease out cubic
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

// Navbar intelligente et professionnelle
function initSmartNavbar() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    navbar.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Effet de glassmorphism au scroll
        if (currentScroll > 80) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.backgroundColor = 'white';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }

        // Cache la navbar au scroll down (au-delà de 400px)
        if (currentScroll > lastScroll && currentScroll > 400) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Interactions douces et professionnelles
function initSmoothInteractions() {
    // Hover effects subtils sur les feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
            this.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Hover subtil sur les stats
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach(stat => {
        stat.style.transition = 'all 0.35s ease-out';

        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Buttons avec effet de lift professionnel
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
        btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Images avec zoom très subtil
    const screenshots = document.querySelectorAll('.screenshot-item img');
    screenshots.forEach(img => {
        img.style.transition = 'all 0.5s ease-out';

        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Testimonials avec effet professionnel
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach(card => {
        card.style.transition = 'all 0.35s ease-out';

        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
            this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = '';
        });
    });
}

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition - 80; // Offset pour navbar
            const duration = 800;
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);

                // Easing function
                const ease = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    });
});

// Ajout de styles CSS professionnels
const style = document.createElement('style');
style.textContent = `
    /* Transitions globales douces */
    * {
        scroll-behavior: auto; /* Désactiver le scroll-behavior natif pour notre custom */
    }

    /* Amélioration du carousel */
    .screenshot-item {
        transition: opacity 0.4s ease-out, transform 0.4s ease-out;
    }

    /* Effet subtil sur les cards */
    .feature-card, .testimonial-card, .stat-item {
        will-change: transform;
    }

    /* Boutons professionnels */
    .btn {
        will-change: transform, box-shadow;
    }

    /* Navbar fluide */
    .navbar {
        will-change: transform, background-color;
    }

    /* Désactiver les animations trop rapides sur mobile */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* Performance optimization */
    .screenshot-item img,
    .feature-card,
    .stat-item,
    .testimonial-card {
        transform: translateZ(0);
        backface-visibility: hidden;
    }
`;
document.head.appendChild(style);

// Préchargement des images pour éviter les flash
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
});

// Performance: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
