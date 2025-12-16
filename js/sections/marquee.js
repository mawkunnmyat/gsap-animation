export function initMarquee() {
    const section = document.querySelector('#marquee-section');
    if (!section) return;

    const track = section.querySelector('.marquee-track');
    const items = section.querySelectorAll('.marquee-item');

    // 1. Clone items for seamless loop
    // (CSS will handle the basic movement, GSAP controls speed)

    // 2. Velocity Control
    let baseSpeed = 10;
    let currentSpeed = baseSpeed;

    // Create a horizontal loop manually for full control
    // Or use a simpler TimeScale approach on a GSAP tween

    // Simple Approach: Animate xPercent from 0 to -50 (assuming duplicated content)
    const loop = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
    });

    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            const timeScale = 1 + (velocity / 50); // Increase speed based on scroll

            gsap.to(loop, {
                timeScale: timeScale,
                duration: 0.5,
                overwrite: true
            });
        }
    });
}