import { initSmoothScroll } from './utils/smoothScroll.js';
import { initHero } from './sections/hero.js';
import { initTextReveal } from './sections/textReveal.js'; // Manifesto
import { initMarquee } from './sections/marquee.js'; // New
import { initHorizontalGallery } from './sections/horizontal.js';
import { initWaveText } from './sections/waveText.js';
import { initSticky } from './sections/sticky.js'; // New
import { initStackingCards } from './sections/stacking.js';
import { initKineticText } from './sections/kinetic.js';
import { initParallaxColumns } from './sections/columns.js'; // New
import { initHoverList } from './sections/hoverList.js';
import { initFooterReveal } from './sections/footer.js';

gsap.registerPlugin(ScrollTrigger, CustomEase);
window.heavyEase = CustomEase.create("heavy", "M0,0 C0.1,0.5 0.1,1 1,1");

const initApp = () => {
    initSmoothScroll();

    let ctx = gsap.context(() => {
        initHero();
        initTextReveal();
        initMarquee();
        initHorizontalGallery();
        initWaveText();
        initSticky();
        initStackingCards();
        initKineticText();
        initParallaxColumns();
        initHoverList();
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