export function initSmoothScroll() {
    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.5, // Slower duration for more "weight"
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    // Sync Lenis scroll with GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis update to GSAP's animation ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Turn off GSAP's lag smoothing to prevent stuttering with Lenis
    gsap.ticker.lagSmoothing(0);
}