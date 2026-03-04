/* ========== GRIT Builders v2 — Main JavaScript ========== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Mobile Navigation ---- */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close nav when clicking a link
        nav.querySelectorAll('.header__link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    /* ---- Header Scroll Effect ---- */
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            header.classList.toggle('header--scrolled', scrollY > 50);
            lastScroll = scrollY;
        });
    }

    /* ---- Fade-In Animations (IntersectionObserver) ---- */
    const fadeSelectors = [
        '.featured-card',
        '.review-card',
        '.service-card',
        '.service-landing-card',
        '.process-step',
        '.process-detail__step',
        '.project-card',
        '.testimonial-card',
        '.service-area-tag',
        '.city-card',
        '.feature-item',
        '.location-service-card',
        '.contact-sidebar__card',
        '.quick-contact__item',
        '.project-sidebar__card',
        '.before-after__item',
        '.credibility-bar__item'
    ];

    const fadeElements = document.querySelectorAll(fadeSelectors.join(', '));

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in--visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(el => {
            el.classList.add('fade-in');
            fadeObserver.observe(el);
        });
    }

    /* ---- Stat Counter Animation ---- */
    const stats = document.querySelectorAll('.google-reviews__score, .stat__number');

    if (stats.length > 0 && 'IntersectionObserver' in window) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent.trim();
                    const match = text.match(/^([\d.]+)(\+?)$/);
                    if (match) {
                        const target = parseFloat(match[1]);
                        const suffix = match[2];
                        const isFloat = text.includes('.');
                        const duration = 1500;
                        const start = performance.now();

                        const animate = (now) => {
                            const progress = Math.min((now - start) / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = target * eased;
                            el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
                            if (progress < 1) requestAnimationFrame(animate);
                        };

                        requestAnimationFrame(animate);
                    }
                    statObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => statObserver.observe(stat));
    }

    /* ---- Project Category Filters ---- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');

                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = '';
                        card.classList.remove('fade-in');
                        void card.offsetWidth;
                        card.classList.add('fade-in', 'fade-in--visible');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ---- Contact Form Handling ---- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Form submitted:', data);

            const submit = contactForm.querySelector('.contact-form__submit');
            if (submit) {
                submit.textContent = 'Thank You!';
                submit.disabled = true;
                submit.style.opacity = '0.7';
            }

            setTimeout(() => {
                alert('Thank you! We\'ll be in touch within one business day.');
            }, 300);
        });
    }

});
