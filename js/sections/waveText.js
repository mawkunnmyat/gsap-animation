export function initWaveText() {
    const section = document.querySelector('#wave-text');

    if (!section) return;

    const title = section.querySelector('.wave-title');

    // 1. Split Text
    const split = new SplitType(title, { types: 'chars' });
    const chars = split.chars;

    // 2. Setup 3D Perspective (Important!)
    gsap.set(section, { perspective: 1000 }); // Create 3D space

    // 3. Initial State (Rolled Down & Hidden)
    gsap.set(chars, {
        rotationX: 90,    // လှဲနေမယ်
        yPercent: 100,    // အောက်ရောက်နေမယ်
        opacity: 0,
        transformOrigin: "50% 50% -50px" // 3D Cylinder Axis
    });

    // 4. Main Timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%", // Scroll distance
            pin: true,
            scrub: 1.5,    // ပိုငြိမ့်သွားအောင် 1.5 ထားလိုက်မယ်
        }
    });

    // --- PHASE 1: ROLL IN (Wave Enter) ---
    tl.to(chars, {
        rotationX: 0,     // မတ်သွားမယ်
        yPercent: 0,      // နေရာမှန်ရောက်မယ်
        opacity: 1,
        duration: 1,
        stagger: {
            amount: 0.8,  // Wave ကြာချိန်
            from: "start",
            ease: "back.out(1.5)" // နည်းနည်းလေး ကန်ထွက်တဲ့ Feel
        }
    });

    // --- PHASE 2: PAUSE ---
    tl.to({}, { duration: 0.5 }); // စာဖတ်ဖို့ ခဏရပ်မယ်

    // --- PHASE 3: ROLL OUT (Wave Exit) ---
    tl.to(chars, {
        rotationX: -90,   // အပေါ်ကို လှန်သွားမယ်
        yPercent: -100,   // အပေါ်ရောက်သွားမယ်
        opacity: 0,
        duration: 1,
        stagger: {
            amount: 0.8,
            from: "start", // ဘယ်ကနေ ညာကိုပဲ Wave ထပ်ဖြစ်မယ်
            ease: "power2.in"
        }
    });
}