// AutoCalc OptiDevis - Site Web
// Script principal pour l'interactivité

document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    initMobileNav();

    // Carousel de screenshots
    initCarousel();

    // Animations au scroll
    initScrollAnimations();

    // Compteurs animés pour les stats
    initCounters();

    // Effet de typing pour le hero
    initTypingEffect();

    // Particules d'arrière-plan
    initParticles();

    // Effet parallaxe
    initParallax();
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

        // Fermer le menu au clic sur un lien
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Carousel de screenshots avec transitions fluides
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

    // Fonction pour aller à une slide avec animation
    function goToSlide(index) {
        items[currentIndex].classList.remove('active');
        items[currentIndex].style.opacity = '0';
        items[currentIndex].style.transform = 'scale(0.9)';
        dots[currentIndex].classList.remove('active');

        currentIndex = index;

        setTimeout(() => {
            items[currentIndex].classList.add('active');
            items[currentIndex].style.opacity = '1';
            items[currentIndex].style.transform = 'scale(1)';
            dots[currentIndex].classList.add('active');
        }, 300);
    }

    // Bouton précédent
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            goToSlide(newIndex);
        });
    }

    // Bouton suivant
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

// Animations au scroll avec effets variés
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observer les cartes de fonctionnalités
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observer les témoignages
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
        observer.observe(card);
    });

    // Observer les stats avec effet de scale
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'scale(0.8)';
        stat.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(stat);
    });

    // Observer les sections générales
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Compteurs animés pour les statistiques
function initCounters() {
    const counterElements = document.querySelectorAll('.stat-item h3, .summary-card .value');

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

    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = text;
            clearInterval(timer);
        } else {
            // Préserver le format (%, etc.)
            if (text.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else if (text.includes('/')) {
                const parts = text.split('/');
                element.textContent = Math.floor(current) + '/' + parts[1];
            } else {
                element.textContent = Math.floor(current);
            }
        }
    }, 16);
}

// Effet de typing pour le titre principal
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .highlight');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--primary-color)';

    let index = 0;

    function type() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 500);
        }
    }

    setTimeout(type, 500);
}

// Particules d'arrière-plan (version légère)
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.3';

    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    // Redimensionner le canvas
    window.addEventListener('resize', () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    });
}

// Effet parallaxe au scroll
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-image img, .screenshot-badge');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
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

// Animation du header au scroll avec effet de hide/show
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        navbar.style.backdropFilter = 'none';
        navbar.style.background = 'white';
    }

    // Hide/show navbar au scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Ajouter transition au navbar
if (navbar) {
    navbar.style.transition = 'all 0.3s ease';
}

// Effet de pulse sur les boutons CTA
const ctaButtons = document.querySelectorAll('.btn-primary');
ctaButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.6s ease-in-out';
    });
    btn.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Ajout de keyframes CSS pour animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .animated {
        animation: fadeInUp 0.6s ease-out;
    }

    .stat-item:hover {
        transform: translateY(-10px) scale(1.05);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .testimonial-card:hover {
        transform: translateX(5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

// Effet de révélation au survol des images
const screenshots = document.querySelectorAll('.screenshot-item img');
screenshots.forEach(img => {
    img.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.filter = 'brightness(1.1)';
        this.style.transition = 'all 0.3s ease';
    });
    img.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.filter = 'brightness(1)';
    });
});

// Easter egg: Konami Code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);

    if (konamiCode.join('') === konamiPattern.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}
