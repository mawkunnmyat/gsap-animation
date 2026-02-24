export function initHoverList() {
    const section = document.querySelector('#hover-list');
    if (!section) return;

    const items = section.querySelectorAll('.h-item');
    const revealImg = section.querySelector('.h-reveal-img');

    // Move image with mouse
    const moveImg = (e) => {
        // Offset relative to section
        // Or simply use fixed/absolute positioning logic
        gsap.to(revealImg, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    section.addEventListener('mousemove', moveImg);

    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            revealImg.style.backgroundImage = `url(${imgSrc})`;

            gsap.to(revealImg, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(item, { x: 20, color: "#fff", opacity: 1, duration: 0.3 });
            gsap.to(items, { opacity: 0.3, duration: 0.3, overwrite: true }); // Dim others
            gsap.to(item, { opacity: 1, overwrite: true });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(revealImg, { scale: 0, opacity: 0, duration: 0.3 });
            gsap.to(item, { x: 0, color: "#888", duration: 0.3 });
            gsap.to(items, { opacity: 1, duration: 0.3 }); // Reset dim
        });
    });
}