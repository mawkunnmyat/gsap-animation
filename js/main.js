import { initSmoothScroll } from './utils/smoothScroll.js';
import { initHero } from './sections/hero.js';
import { initHorizontalGallery } from './sections/horizontal.js';
import { initTextReveal } from './sections/textReveal.js'; // New Import
import { initStackingCards } from './sections/stacking.js';
import { initKineticText } from './sections/kinetic.js';
import { initFooterReveal } from './sections/footer.js';

gsap.registerPlugin(ScrollTrigger, CustomEase);
window.heavyEase = CustomEase.create("heavy", "M0,0 C0.1,0.5 0.1,1 1,1");

const initApp = () => {
    initSmoothScroll();

    let ctx = gsap.context(() => {
        initHero();
        initHorizontalGallery();
        initTextReveal();
        initStackingCards();
        initKineticText();
        initFooterReveal();
    });

    document.body.classList.add('loaded');
};

window.addEventListener('load', () => {
    initApp();
    ScrollTrigger.refresh();
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});