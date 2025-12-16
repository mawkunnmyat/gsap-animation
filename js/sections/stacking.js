export function initStackingCards() {
    const section = document.querySelector('#stacking-cards');
    const cards = document.querySelectorAll('.card');

    if (!section || cards.length === 0) return;

    // 1. Set Initial States
    // Place all cards absolutely positioned in the center, but pushed down slightly
    gsap.set(cards, {
        y: window.innerHeight, // Start below screen
        scale: 1.1,
        rotate: 0
    });

    // 2. Create Stacking Logic
    // We pin the container, and manually animate each card
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${cards.length * 100}%`, // Scroll distance based on card count
            pin: true,
            scrub: 1,
        }
    });

    cards.forEach((card, index) => {
        // Animate Card Up
        tl.to(card, {
            y: 0,
            scale: 1,
            ease: window.heavyEase,
            duration: 1,
            // Add slight rotation for randomness
            rotate: (index % 2 === 0 ? -2 : 2)
        });

        // Effect on Previous Card (Depth)
        if (index > 0) {
            tl.to(cards[index - 1], {
                scale: 0.90, // Scale down previous
                filter: "brightness(0.6)", // Darken previous
                y: -50, // Move up slightly
                duration: 1
            }, "<"); // Run at same time as current card enters
        }
    });
}