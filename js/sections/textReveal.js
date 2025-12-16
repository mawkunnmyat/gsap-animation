export function initTextReveal() {
    const section = document.querySelector('#manifesto');
    const text = document.querySelector('.manifesto-text');

    if (!section || !text) return;

    // Split text into words
    const split = new SplitType(text, { types: 'words' });

    // Set initial dimmed state
    gsap.set(split.words, {
        opacity: 0.2,
        willChange: "opacity"
    });

    // Animate opacity on scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top", // Pin immediately
            end: "+=150%",    // Adjust reading duration
            pin: true,
            scrub: 0.5,
        }
    });

    tl.to(split.words, {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        duration: 1
    });
}