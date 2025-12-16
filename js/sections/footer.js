export function initFooterReveal() {
    const section = document.querySelector('#section-4');
    const video = document.querySelector('.text-mask-video');
    const title = document.querySelector('.text-mask-title');
    if (!section) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section, start: "top center", end: "center center", scrub: 1,
        }
    });

    tl.to("body", { backgroundColor: "#ffffff", color: "#000000", duration: 1, ease: "power2.inOut" }, 0);
    tl.to(video, { opacity: 1, duration: 1, ease: "power2.out" }, 0);
    tl.to(title, {
        onUpdate: function () {
            const progress = this.progress();
            if (progress > 0.5) {
                title.style.mixBlendMode = "screen";
                title.style.color = "#ffffff";
                title.style.webkitTextStroke = "0px";
            } else {
                title.style.mixBlendMode = "normal";
                title.style.color = "transparent";
                title.style.webkitTextStroke = "2px rgba(255,255,255,0.5)";
                if (progress > 0.1) title.style.webkitTextStroke = "2px rgba(0,0,0,1)";
            }
        }
    }, 0);
}