export function initParallaxColumns() {
    const section = document.querySelector('#parallax-columns');
    if (!section) return;

    const cols = section.querySelectorAll('.p-col');

    // 1. Initial Skew Setup
    // Track velocity for skew effect
    let skewSetter = gsap.quickSetter(cols, "skewY", "deg");
    let clamp = gsap.utils.clamp(-15, 15);

    // 2. Main Scroll Animation
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5, // Smooth scrubbing
            onUpdate: (self) => {
                // Velocity Skew Effect
                const velocity = self.getVelocity() / -50;
                skewSetter(clamp(velocity));
            }
        }
    });

    // 3. Move Columns (Opposite Directions)
    // Column 1 & 3 move DOWN
    tl.to([cols[0], cols[2]], {
        yPercent: 20,
        ease: "none"
    }, 0);

    // Column 2 moves UP (Reverse)
    tl.to(cols[1], {
        yPercent: -20,
        ease: "none"
    }, 0);
}