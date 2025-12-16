export function initHorizontalGallery() {
    const section = document.querySelector('#horizontal-gallery');
    const wrapper = document.querySelector('.horizontal-gallery-wrapper');
    const slides = document.querySelectorAll('.horizontal-gallery-slide');
    const images = document.querySelectorAll('.horizontal-gallery-image');

    if (!section || slides.length === 0) return;

    const slideCount = slides.length;

    // 1. Dynamic Width Calculation
    // Ensure wrapper is wide enough for all slides
    gsap.set(wrapper, { width: `${slideCount * 100}vw` });

    // 2. Main Horizontal Scroll
    const scrollTween = gsap.to(wrapper, {
        xPercent: -100 * (slideCount - 1),
        ease: "none",
        scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            // Scroll amount = number of slides * viewport height
            end: `+=${slideCount * 100}vh`,
            invalidateOnRefresh: true,
        }
    });

    // 3. Image Parallax (Inside the frames)
    // As we scroll horizontally, move images inside their containers
    slides.forEach((slide, i) => {
        const img = images[i];
        gsap.to(img, {
            xPercent: 15, // Move image slightly inside frame
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: `+=${slideCount * 100}vh`,
                scrub: true,
                containerAnimation: scrollTween // Hook into horizontal tween
            }
        });
    });

    // 4. Velocity Skew (The "Jelly" Effect)
    // Using quickTo for performance
    const skewTo = gsap.quickTo(images, "skewX", { duration: 0.1, ease: "power3" });

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            // Get velocity, divide to make it subtle, clamp to avoid breaking
            let skew = self.getVelocity() / -300;
            skew = gsap.utils.clamp(-10, 10, skew);
            skewTo(skew);
        }
    });
}