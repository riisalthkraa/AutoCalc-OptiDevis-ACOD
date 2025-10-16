// AutoCalc OptiDevis - Script principal

document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile (Bootstrap gère déjà, mais ajout pour custom)
    const navToggle = document.querySelector('.navbar-toggler');
    const navMenu = document.querySelector('.navbar-collapse');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Carousel de screenshots (Bootstrap gère)
    // Animations au scroll (simple fade-in)
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });

    document.querySelectorAll('.feature-card, .testimonial-card, .stat-item').forEach(item => {
        item.style.opacity = '0';
        item.classList.add('transition-all');
        observer.observe(item);
    });

    // Form submission simulation for contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message envoyé ! (Simulation)');
            contactForm.reset();
        });
    }
});

// CSS for animation
const style = document.createElement('style');
style.innerHTML = `
.animate-fade-in {
    animation: fadeIn 0.6s ease forwards;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);