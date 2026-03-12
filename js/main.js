/* ============================================
   GRIT BUILDERS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a non-dropdown link is clicked
        navMenu.querySelectorAll('.nav__link').forEach(link => {
            if (!link.closest('.nav__dropdown') || link.closest('.nav__dropdown-menu')) {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('open');
                    document.body.style.overflow = '';
                });
            }
        });
    }

    // --- Mobile dropdown toggle ---
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector(':scope > .nav__link');
        if (trigger && window.innerWidth <= 768) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('open');
            });
        }
    });

    // Close dropdowns on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            dropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    // --- Header scroll effect ---
    const header = document.getElementById('header');

    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- Scroll fade-in animations ---
    const fadeSelectors = [
        '.service-card', '.testimonial-card', '.stat', '.value-card',
        '.process-step', '.team-card', '.contact-info-card',
        '.project-card', '.trust-item', '.about-trust__card',
        '.process-detail__step', '.feature-item', '.credibility-bar__item',
        '.showcase-card', '.service-landing-card',
        '.featured-card', '.review-card', '.service-area-card', '.blog-card'
    ];
    const fadeElements = document.querySelectorAll(fadeSelectors.join(', '));

    fadeElements.forEach(el => el.classList.add('fade-in'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // --- Animated stat counters ---
    const statNumbers = document.querySelectorAll('.stat__number[data-target]');

    if (statNumbers.length && 'IntersectionObserver' in window) {
        const countUp = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 2000;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => statsObserver.observe(el));
    }

    // --- Project category filters ---
    const filterButtons = document.querySelectorAll('.filter__btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Contact form handling ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.style.display = 'none';
            formSuccess.hidden = false;
        });
    }

    // --- Before/After Image Slider ---
    const sliders = document.querySelectorAll('[data-before-after-slider]');

    sliders.forEach(slider => {
        const container = slider.querySelector('.before-after-slider__container');
        const beforeClip = slider.querySelector('.before-after-slider__before-clip');
        const beforeImg = slider.querySelector('.before-after-slider__image--before');
        const handle = slider.querySelector('.before-after-slider__handle');

        if (!container || !beforeClip || !handle) return;

        let isDragging = false;
        let sliderPosition = 50;

        function setPosition(percent) {
            percent = Math.max(2, Math.min(98, percent));
            sliderPosition = percent;
            beforeClip.style.width = percent + '%';
            handle.style.left = percent + '%';
            if (beforeImg) {
                beforeImg.style.width = container.offsetWidth + 'px';
            }
            handle.setAttribute('aria-valuenow', Math.round(percent));
        }

        function getPercent(e) {
            const rect = container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            return ((clientX - rect.left) / rect.width) * 100;
        }

        function onStart(e) {
            isDragging = true;
            slider.classList.add('before-after-slider--active');
            e.preventDefault();
            setPosition(getPercent(e));
        }

        function onMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            requestAnimationFrame(() => setPosition(getPercent(e)));
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;
            slider.classList.remove('before-after-slider--active');
        }

        container.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        container.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);

        handle.setAttribute('tabindex', '0');
        handle.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(sliderPosition - 2); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(sliderPosition + 2); }
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => setPosition(sliderPosition), 100);
        });

        setPosition(50);
    });
});
