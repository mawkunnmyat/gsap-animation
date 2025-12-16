import { initSmoothScroll } from './utils/smoothScroll.js';
import { initHero } from './sections/hero.js';
import { initHorizontalGallery } from './sections/horizontal.js';
import { initStackingCards } from './sections/stacking.js';
import { initFooterReveal } from './sections/footer.js';

// Register GSAP Plugins Globally
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Define Global Custom Ease (The "Secret Sauce")
window.heavyEase = CustomEase.create("heavy", "M0,0 C0.1,0.5 0.1,1 1,1");

const initApp = () => {
    // 1. Initialize Lenis (Smooth Scroll)
    initSmoothScroll();

    // 2. Initialize Sections within GSAP Context
    // This allows for easy cleanup if we were using a framework like React
    let ctx = gsap.context(() => {
        initHero();
        initHorizontalGallery();
        initStackingCards();
        initFooterReveal();
    });

    // 3. Reveal Body
    document.body.classList.add('loaded');
};

// Wait for all assets (images/videos) to load to ensure ScrollTrigger calculates positions correctly
window.addEventListener('load', () => {
    initApp();
    ScrollTrigger.refresh();
});

// Refresh triggers on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});