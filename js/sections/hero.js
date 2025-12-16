export function initHero() {
    const section = document.querySelector('#hero');
    const title = document.querySelector('.hero-title');
    const zoomContainer = document.querySelector('.hero-zoom-container');

    if (!section) return;

    // 1. Split Text
    const split = new SplitType(title, { types: 'lines,chars' });

    // 2. Initial Entrance Animation
    const tlIn = gsap.timeline({ delay: 0.5 });

    tlIn.from(split.chars, {
        yPercent: 120,
        rotate: 10,
        opacity: 0,
        duration: 1.5,
        ease: window.heavyEase,
        stagger: 0.05
    });

    // 3. Scroll Interaction (Zoom Through)
    const tlScroll = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%", // Long scroll distance for effect
            pin: true,
            scrub: 1, // Add lag for weight
        }
    });

    // Scale the video/mask up massively
    tlScroll.to(zoomContainer, {
        scale: 40,
        ease: "power2.inOut"
    }, 0);

    // Fade out text and scale it up slightly
    tlScroll.to(title, {
        opacity: 0,
        scale: 1.5,
        ease: "power2.in"
    }, 0);
}