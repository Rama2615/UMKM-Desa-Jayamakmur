/**
 * Smooth Effects Engine - UMKM Desa Jayamakmur
 * Handles scroll reveal animations, smooth anchor links, back-to-top button, and interactive physics.
 */

export function initSmoothEffects() {
    initScrollReveal();
    initBackToTop();
    initSmoothAnchors();
    initSmoothImageLoading();
}

/**
 * Automates IntersectionObserver scroll-reveal animations on key UI components
 */
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    // Direct target selectors to reveal smoothly on scroll
    const selectors = [
        '.card-umkm',
        '.feature-card',
        '.stat-card',
        '.hero-content',
        '.landing-hero-content',
        '.footer-column',
        '.footer-brand',
        '.category-card',
        '.map-sidebar',
        '.form-card',
        'main section',
        '.tentang-card',
        '.timeline-item'
    ];

    const elementsToObserve = new Set();
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (!el.classList.contains('smooth-reveal-visible')) {
                el.classList.add('smooth-reveal');
                const staggerClass = `smooth-reveal-delay-${(index % 4) + 1}`;
                el.classList.add(staggerClass);
                if (el.id === 'umkmContainer' || el.classList.contains('card-umkm') || el.closest('#umkmContainer')) {
                    el.classList.add('smooth-reveal-visible');
                } else {
                    elementsToObserve.add(el);
                }
            }
        });
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('smooth-reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elementsToObserve.forEach(el => revealObserver.observe(el));

    // Dynamic Mutation Observer for elements rendered later via JS (e.g., UMKM Grid cards)
    const container = document.getElementById('umkmContainer') || document.querySelector('main');
    if (container) {
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const cards = node.matches && node.matches('.card-umkm') ? [node] : node.querySelectorAll ? node.querySelectorAll('.card-umkm') : [];
                        cards.forEach((card, index) => {
                            card.classList.add('smooth-reveal');
                            card.classList.add(`smooth-reveal-delay-${(index % 4) + 1}`);
                            card.classList.add('smooth-reveal-visible');
                        });
                    }
                });
            });
        });
        mutationObserver.observe(container, { childList: true, subtree: true });
    }
}

/**
 * Creates and manages a floating smooth "Back to Top" button
 */
function initBackToTop() {
    if (document.getElementById('backToTopBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Kembali ke Atas');
    btn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    document.body.appendChild(btn);

    const handleScroll = () => {
        if (window.scrollY > 320) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Enables smooth scrolling for internal anchor links with sticky navbar offset
 */
function initSmoothAnchors() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href === '#' || href === '') return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
            
            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Ensures images load with a smooth fade-in effect
 */
function initSmoothImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('img-loaded');
        } else {
            img.classList.add('img-loading');
            img.addEventListener('load', () => {
                img.classList.remove('img-loading');
                img.classList.add('img-loaded');
            });
        }
    });
}

// Auto-run if imported standalone
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothEffects);
} else {
    initSmoothEffects();
}
