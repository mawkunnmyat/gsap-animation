export function initStackingCards() {
    const section = document.querySelector('#stacking-cards');
    const container = document.querySelector('.stacking-cards-container');
    const cards = document.querySelectorAll('.card');

    if (!section || cards.length === 0) return;

    // 1. Initial Setup: Place cards in center but prepared to spread
    // No rotation initially, just stacked beautifully
    gsap.set(cards, {
        xPercent: 0,
        yPercent: 100, // Start from bottom
        rotation: 0,
        scale: 0.8,
        opacity: 0
    });

    const cardCount = cards.length;

    // 2. Main Scroll Timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${cardCount * 100}%`, // Scroll distance
            pin: true,
            scrub: 1,
        }
    });

    // 3. Animation: Cards come up and spread out
    cards.forEach((card, index) => {
        // Calculate spread position based on index
        // e.g., if 3 cards: -30%, 0%, +30%
        const spreadAmount = 30; // Percentage to spread apart
        const centerOffset = (cardCount - 1) / 2;
        const xPos = (index - centerOffset) * spreadAmount;

        // Slight rotation for natural feel
        const rotationAmount = (index - centerOffset) * 5;

        tl.to(card, {
            yPercent: 0,    // Come up to center
            xPercent: xPos, // Spread horizontally
            rotation: rotationAmount, // Fan out
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, index * 0.2); // Stagger the start time slightly
    });
}