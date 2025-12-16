export function initKineticText() {
    const section = document.querySelector('#kinetic-text');

    if (!section) return;

    const text = section.querySelector('.kinetic-title');
    const images = section.querySelectorAll('.kinetic-img');

    // 1. Initial State (Scattered Images)
    // Place the images scattered across but positioned below
    gsap.set(images, {
        yPercent: 100, // Start below screen
        opacity: 0
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%", // Scroll distance (Longer = Slower)
            pin: true,
            scrub: 1,
        }
    });

    // 2. Text Animation (Outline to Solid)
    tl.to(text, {
        backgroundPosition: "0% 0%", // Reveal fill
        scale: 1.2, // Slight zoom
        ease: "none",
        duration: 2
    }, 0);

    // 3. Parallax Floating Images
    // Make each image float up at a different speed
    images.forEach((img, i) => {
        // Random speed calculations
        const speed = 150 + (i * 50); // Each image moves faster than the previous
        const rotation = (i % 2 === 0) ? 15 : -15; // Rotate left/right

        // Appear
        tl.to(img, {
            opacity: 1,
            duration: 0.5,
            ease: "power1.in"
        }, 0);

        // Move Up (Float)
        tl.to(img, {
            yPercent: -speed, // Move up way past the top
            rotation: rotation,
            ease: "none",
            duration: 2
        }, 0);
    });
}