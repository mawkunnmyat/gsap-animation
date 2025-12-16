export function initFooterReveal() {
    const section = document.querySelector('#section-4');

    if (!section) return;

    const theEndTitle = section.querySelector('.final__title'); // "THE END"
    const contactTitle = section.querySelector('.footer-cta');  // "LET'S WORK TOGETHER"
    const footerContent = document.querySelector('.final__footer');

    // 1. Setup Texts (Split into chars)
    // "THE END" ကို ခွဲမယ်
    const splitEnd = new SplitType(theEndTitle, { types: 'chars' });
    // "LET'S WORK TOGETHER" ကို ခွဲမယ်
    const splitContact = new SplitType(contactTitle, { types: 'chars' });

    // 2. Initial States
    // Contact Text ကို အလယ်မှာ စုထားပြီး ဖျောက်ထားမယ် (For Explosion later)
    gsap.set(footerContent, { opacity: 1, pointerEvents: "all" }); // Ensure visible container
    gsap.set(splitContact.chars, {
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0,
        rotation: 180
    });

    // 3. Main Timeline & Velocity Tracking
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%", // Give space for the drama
            pin: true,
            scrub: 1,

            // VELOCITY MAGIC (The "Kinetic" Feel)
            onUpdate: (self) => {
                // Scroll မြန်လေ "THE END" က ပိုတုန်လေ
                const velocity = gsap.utils.clamp(-50, 50, self.getVelocity() / 50);
                const progress = self.progress;

                // Only apply jitter if we haven't switched yet (First 40% of scroll)
                if (progress < 0.4) {
                    splitEnd.chars.forEach(char => {
                        gsap.to(char, {
                            x: (Math.random() - 0.5) * velocity * 5, // Horizontal Shake
                            y: (Math.random() - 0.5) * velocity * 5, // Vertical Shake
                            rotation: (Math.random() - 0.5) * velocity * 2,
                            opacity: 1 - Math.abs(velocity / 100), // Slightly flicker
                            duration: 0.1,
                            overwrite: 'auto'
                        });
                    });
                }
            }
        }
    });

    // --- PHASE 1: THE IMPLOSION (Black Hole) ---
    // "THE END" gets sucked into the center
    tl.to(splitEnd.chars, {
        x: 0, // Move to center X (relative)
        y: 0, // Move to center Y
        scale: 0,
        rotation: 720, // Spin wildy
        opacity: 0,
        duration: 0.5,
        stagger: { amount: 0.2, from: "center" }, // Suck from outside in
        ease: "power4.in"
    });

    // Hide the container after implosion
    tl.to('.final__mask', { autoAlpha: 0, duration: 0.1 });

    // --- PHASE 2: THE EXPLOSION (Big Bang) ---
    // "LET'S WORK TOGETHER" explodes outward
    tl.to(splitContact.chars, {
        opacity: 1,
        scale: 1,
        x: 0, // Return to natural flow position
        y: 0,
        rotation: 0,
        duration: 0.8,
        stagger: { amount: 0.5, from: "center" }, // Explode from center out
        ease: "back.out(1.7)" // Bouncy impact
    }, ">-0.2"); // Overlap slightly

    // Reveal other footer links softly
    tl.from('.footer-links, .footer-copyright', {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
    }, "<0.5");
}