export function initFooterReveal() {
    const section = document.querySelector('#section-4');
    const video = document.querySelector('.text-mask-video');
    const title = document.querySelector('.text-mask-title');

    if (!section) return;

    // Timeline for the reveal sequence
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top center", // Start earlier
            end: "center center",
            scrub: 1,
        }
    });

    // 1. Background Color Transition (Dark to Light)
    tl.to("body", {
        backgroundColor: "#ffffff",
        color: "#000000",
        duration: 1,
        ease: "power2.inOut"
    }, 0);

    // 2. Video Opacity (Fade in)
    tl.to(video, {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, 0);

    // 3. Text Blend Mode Magic
    // We use a callback to switch blend modes for the "Transparent Text" effect
    tl.to(title, {
        onStart: () => {
            // Standard CSS stroke effect
        },
        onUpdate: function () {
            // Once we pass a threshold, make text act as window
            const progress = this.progress();
            if (progress > 0.5) {
                title.style.mixBlendMode = "screen";
                title.style.color = "#ffffff";
                title.style.webkitTextStroke = "0px";
            } else {
                title.style.mixBlendMode = "normal";
                title.style.color = "transparent";
                title.style.webkitTextStroke = "2px rgba(255,255,255,0.5)";
                // Invert stroke color since background became white
                if (progress > 0.1) title.style.webkitTextStroke = "2px rgba(0,0,0,1)";
            }
        }
    }, 0);
}