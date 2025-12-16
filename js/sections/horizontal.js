export function initHorizontalGallery() {
    const section = document.querySelector('#horizontal-gallery');

    if (!section) return;

    const wrapper = section.querySelector('.horizontal-gallery-wrapper');
    const slides = section.querySelectorAll('.horizontal-gallery-slide');
    const images = section.querySelectorAll('.horizontal-gallery-image');
    const texts = section.querySelectorAll('.horizontal-gallery-text');

    // Progress Bar Setup
    let progressBar = section.querySelector('.gallery-progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.classList.add('gallery-progress-bar');
        section.appendChild(progressBar);
    }

    const slideCount = slides.length;

    // 1. Setup Layout
    gsap.set(wrapper, { width: `${slideCount * 100}vw` });
    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

    // Function to calculate the exact scroll distance needed
    // (Total Width - Viewport Width) = Amount we need to move left
    const getScrollAmount = () => {
        return -(wrapper.scrollWidth - window.innerWidth);
    };

    // 2. Main Horizontal Scroll Timeline
    const scrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            // Making it SLOWER/SMOOTHER (Increased distance)
            end: `+=${slideCount * 150}vh`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                gsap.to(progressBar, {
                    scaleX: self.progress,
                    duration: 0.1,
                    ease: "none"
                });
            }
        }
    });

    // FIX: Use 'x' instead of 'xPercent' for accurate pixel movement
    // This stops exactly at the last slide
    scrollTl.to(wrapper, {
        x: getScrollAmount,
        ease: "none",
    });

    // 3. Creative Parallax Effects
    slides.forEach((slide, i) => {
        const img = images[i];
        const text = texts[i];

        // Image Parallax
        if (img) {
            gsap.fromTo(img,
                { xPercent: -15, scale: 1.2 },
                {
                    xPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: `+=${slideCount * 150}vh`,
                        scrub: true,
                        containerAnimation: scrollTl
                    }
                }
            );
        }

        // Text Parallax
        if (text) {
            gsap.fromTo(text,
                { x: 50, opacity: 0.5 },
                {
                    x: -50,
                    opacity: 1,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: slide,
                        containerAnimation: scrollTl,
                        start: "left center",
                        end: "right center",
                        scrub: true,
                    }
                }
            );
        }
    });

    // 4. Velocity Skew (Subtle Effect)
    const skewTo = gsap.quickTo(images, "skewX", { duration: 0.2, ease: "power3.out" });

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            let skew = self.getVelocity() / -400;
            skew = gsap.utils.clamp(-5, 5, skew);
            skewTo(skew);
        }
    });
}