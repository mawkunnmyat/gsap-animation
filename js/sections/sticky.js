export function initSticky() {
    const section = document.querySelector('#sticky-process');

    if (!section) return;

    // Elements
    const images = section.querySelectorAll('.process-img');
    const texts = section.querySelectorAll('.process-step');

    // 1. Setup Layout
    // Right side pinned, Left side scrolls
    // We don't need complex pinning logic for the section itself if we use CSS sticky or GSAP pin
    // Here we use GSAP Pin for absolute control

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: ".sticky-right", // Pin the image container
        pinSpacing: false // Allow text to scroll past
    });

    // 2. Animate Each Step
    texts.forEach((text, i) => {
        const img = images[i];

        if (i === 0) {
            gsap.set(img, { clipPath: "inset(0% 0% 0% 0%)", zIndex: 1 }); // First image visible
            gsap.set(text, { opacity: 1 });
        } else {
            gsap.set(img, { clipPath: "inset(100% 0% 0% 0%)", zIndex: i + 1 }); // Others hidden at bottom
            gsap.set(text, { opacity: 0.3 });
        }

        // Create Trigger for each text block
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: text,
                start: "top center", // When text hits center screen
                end: "bottom center",
                scrub: true,
                toggleActions: "play reverse play reverse"
            }
        });

        // Image Reveal (Curtain Effect from Bottom)
        if (i > 0) {
            tl.to(img, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1,
                ease: "none"
            }, 0);
        }

        // Text Highlight
        tl.to(text, {
            opacity: 1,
            color: "#fff",
            duration: 0.5
        }, 0);

        // Previous Text Dim
        if (i > 0) {
            tl.to(texts[i - 1], {
                opacity: 0.3,
                color: "#666",
                duration: 0.5
            }, 0);
        }
    });
}