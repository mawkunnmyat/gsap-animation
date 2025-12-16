// ============================================================================
// CONFIGURATION
// ============================================================================

// Debug mode: Set to true to show ScrollTrigger markers for debugging
// Markers show start/end points and progress of scroll animations
const DEBUG_MODE = false;

// ============================================================================
// GSAP & PLUGINS SETUP
// ============================================================================

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

// ============================================================================
// GLOBAL CUSTOM EASING
// ============================================================================

// Custom ease for punchy, high-end reveal animations
// Creates a heavy, impactful feel with quick start and smooth finish
const heavyEase = CustomEase.create("custom", "M0,0 C0.1,0.5 0.1,1 1,1");

// ============================================================================
// SMOOTH SCROLL SETUP (LENIS)
// ============================================================================

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Get smooth scroll elements
const smoothWrapper = document.getElementById('smooth-wrapper');
const smoothContent = document.getElementById('smooth-content');

// Sync Lenis with GSAP ScrollTrigger
// This ensures ScrollTrigger calculations stay accurate with smooth scrolling
lenis.on('scroll', ScrollTrigger.update);

// Lenis scroll animation loop
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ============================================================================
// HERO SECTION - ZOOM-THROUGH ANIMATION
// ============================================================================

/**
 * Initializes the hero section zoom-through interaction
 * 
 * ZOOM-THROUGH EFFECT:
 * - Hero section is pinned to viewport during scroll
 * - Central zoom element scales from 1 to 30 (massive expansion)
 * - Hero text fades out simultaneously (opacity 1 to 0)
 * - Creates "flying through" sensation into next section
 * 
 * PINNING:
 * - pin: true keeps hero section fixed during scroll
 * - Next section is revealed underneath as zoom expands
 * - pinSpacing: false prevents extra spacing (optional)
 * 
 * SCRUB:
 * - scrub: 1 adds 1 second of lag for ultra-smooth feel
 * - Animation tied directly to scroll position
 * - Creates cinematic, controlled zoom effect
 * 
 * MASKING:
 * - Central element uses circular mask (border-radius + overflow)
 * - Video/image is masked by the circular container
 * - As scale increases, mask reveals more content
 */
function initHero() {
    const heroSection = document.getElementById('hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroZoomContainer = document.querySelector('.hero-zoom-container');
    
    if (!heroSection || !heroTitle || !heroZoomContainer) {
        console.warn('Hero elements not found');
        return;
    }
    
    // Initial entrance animation for text (optional - can be removed if not needed)
    // Split text into lines and characters using SplitType
    const splitText = new SplitType(heroTitle, {
        types: 'lines,chars',
        tagName: 'span'
    });
    
    // Ensure line containers have overflow hidden for mask effect
    if (splitText.lines) {
        splitText.lines.forEach(line => {
            line.style.overflow = 'hidden';
            line.style.display = 'inline-block';
        });
    }
    
    // Set initial state for characters
    gsap.set(splitText.chars, {
        yPercent: 100,
        rotate: 5,
        opacity: 0
    });
    
    // Initial text entrance animation
    const entranceTl = gsap.timeline({
        defaults: {
            ease: heavyEase
        }
    });
    
    entranceTl.to(splitText.chars, {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.2,
        ease: heavyEase,
        stagger: {
            amount: 0.6,
            from: 'start'
        }
    });
    
    // Zoom-through scroll animation
    const zoomTl = gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '+=200%', // Scroll distance for zoom effect (2x viewport height)
            pin: true,     // Pin hero section to viewport
            scrub: 1,      // 1 second lag for ultra-smooth feel
            markers: DEBUG_MODE,
            id: 'hero-zoom-trigger', // Unique ID to prevent conflicts
            
            onEnter: () => {
                if (DEBUG_MODE) console.log('Hero zoom-through started');
            },
            onLeave: () => {
                if (DEBUG_MODE) console.log('Hero zoom-through completed');
            },
            onEnterBack: () => {
                if (DEBUG_MODE) console.log('Scrolled back to hero');
            }
        }
    });
    
    // Scale zoom container from 1 to 30 (massive expansion)
    zoomTl.to(heroZoomContainer, {
        scale: 30,
        ease: heavyEase,
        duration: 1
    }, 0);
    
    // Simultaneously fade out hero text
    zoomTl.to(heroTitle, {
        opacity: 0,
        ease: heavyEase,
        duration: 1
    }, 0);
    
    return { entranceTl, zoomTl };
}

// ============================================================================
// HORIZONTAL SCROLL GALLERY
// ============================================================================

/**
 * Initializes horizontal scroll gallery with pinned section and velocity-based skew
 * 
 * HORIZONTAL SCROLL:
 * - Container is 300vw wide (holds 3-4 full-screen slides)
 * - When section hits top of viewport, it's PINNED
 * - Content translates on X-axis: xPercent: -100 * (sections.length - 1)
 * - Vertical scroll pauses until horizontal scroll completes
 * 
 * PINNING:
 * - pin: true keeps section fixed during horizontal scroll
 * - end: calculated based on number of slides
 * - Vertical scroll is effectively paused during horizontal scroll
 * 
 * VELOCITY-BASED SKEW:
 * - Images get slight skewX based on scroll velocity
 * - Creates fluid, dynamic feeling during horizontal scroll
 * - Skew direction follows scroll direction
 * - Clamped to prevent excessive distortion
 * 
 * CALCULATION:
 * - xPercent: -100 * (slides.length - 1) moves content to show last slide
 * - For 4 slides: -100 * (4 - 1) = -300% (moves 3 slides to the left)
 * - Each slide is 100vw, so -300% = 3 * 100vw = 300vw total movement
 */
function initHorizontalGallery() {
    const horizontalGallery = document.getElementById('horizontal-gallery');
    const horizontalWrapper = document.querySelector('.horizontal-gallery-wrapper');
    const gallerySlides = document.querySelectorAll('.horizontal-gallery-slide');
    const galleryImages = document.querySelectorAll('.horizontal-gallery-image');
    
    if (!horizontalGallery || !horizontalWrapper || !gallerySlides.length) {
        console.warn('Horizontal gallery elements not found');
        return;
    }
    
    const slidesCount = gallerySlides.length;
    
    // Calculate end point based on number of slides
    // Each slide is 100vw, so we need (slidesCount - 1) * 100vw of scroll
    // Using viewport height as unit: end: `+=${(slidesCount - 1) * 100}vh`
    const scrollDistance = (slidesCount - 1) * 100; // in vh units
    
    // Create ScrollTrigger for horizontal scroll
    const horizontalTl = gsap.timeline({
        scrollTrigger: {
            trigger: horizontalGallery,
            start: 'top top', // Pin when section hits top of viewport
            end: `+=${scrollDistance}vh`, // Scroll distance based on number of slides
            pin: true,        // Pin the section during horizontal scroll
            scrub: 1,        // 1 second lag for smooth feel
            markers: DEBUG_MODE,
            id: 'horizontal-gallery-trigger', // Unique ID to prevent conflicts
            
            onEnter: () => {
                if (DEBUG_MODE) console.log('Horizontal gallery started - vertical scroll paused');
            },
            onLeave: () => {
                if (DEBUG_MODE) console.log('Horizontal gallery completed - vertical scroll resumed');
            },
            onEnterBack: () => {
                if (DEBUG_MODE) console.log('Scrolled back to horizontal gallery');
            }
        }
    });
    
    // Animate horizontal wrapper translation
    // xPercent: -100 * (slidesCount - 1) moves content to show last slide
    horizontalTl.to(horizontalWrapper, {
        xPercent: -100 * (slidesCount - 1),
        ease: heavyEase,
        duration: 1
    });
    
    // Velocity-based skew on images for fluid feeling
    // Track scroll velocity and apply skewX to images
    let lastVelocity = 0;
    const MAX_SKEW_X = 5; // Maximum skew in degrees
    const VELOCITY_MULTIPLIER = 0.02; // Adjust sensitivity
    
    // Use gsap.quickTo for smooth, performant skew updates
    const quickSkewX = gsap.quickTo(galleryImages, "skewX", {
        duration: 0.3,
        ease: "power1.out"
    });
    
    // Track velocity during horizontal scroll
    // Use same trigger as main animation to avoid conflicts
    ScrollTrigger.create({
        trigger: horizontalGallery,
        start: 'top top',
        end: `+=${scrollDistance}vh`,
        id: 'horizontal-gallery-velocity', // Unique ID
        onUpdate: (self) => {
            // Get scroll velocity (pixels per second)
            const velocity = self.getVelocity();
            lastVelocity = velocity;
            
            // Normalize velocity to skew value
            // Positive velocity (scrolling down) = positive skew (right tilt)
            // Negative velocity (scrolling up) = negative skew (left tilt)
            let targetSkewX = velocity * VELOCITY_MULTIPLIER;
            
            // Clamp the skew value
            targetSkewX = gsap.utils.clamp(-MAX_SKEW_X, MAX_SKEW_X, targetSkewX);
            
            // Apply skew to all images
            quickSkewX(targetSkewX);
        },
        onLeave: () => {
            // Return to neutral when horizontal scroll completes
            quickSkewX(0);
        },
        onLeaveBack: () => {
            // Return to neutral when scrolling back
            quickSkewX(0);
        }
    });
    
    return horizontalTl;
}

// ============================================================================
// STACKING CARDS EFFECT
// ============================================================================

/**
 * Initializes stacking cards effect with pinned container
 * 
 * STACKING CARDS EFFECT:
 * - Container is pinned to viewport during scroll
 * - Each card slides up from bottom and sticks to top
 * - New card covers the previous card as it enters
 * - Previous cards scale down (0.95) and darken (brightness 0.8)
 * - Creates satisfying "deck of cards" 3D depth effect
 * 
 * PINNING:
 * - pin: true keeps container fixed during scroll
 * - Vertical scroll pauses until all cards have stacked
 * - Each card gets its own scroll segment
 * 
 * ANIMATION SEQUENCE:
 * - Card 1: Starts at bottom, slides up and sticks to top
 * - Card 2: Slides up from bottom, covers Card 1
 * - Card 1: Scales down and darkens as Card 2 enters
 * - Card 3: Slides up, covers Card 2
 * - Card 2: Scales down and darkens
 * - And so on...
 * 
 * 3D DEPTH EFFECT:
 * - Scale: 0.95 creates subtle size reduction (depth perception)
 * - Brightness: 0.8 darkens previous cards (shadow effect)
 * - Combined creates realistic stacking/overlapping feel
 */
function initStackingCards() {
    const stackingCards = document.getElementById('stacking-cards');
    const cards = document.querySelectorAll('.card');
    
    if (!stackingCards || !cards.length) {
        console.warn('Stacking cards elements not found');
        return;
    }
    
    const cardsCount = cards.length;
    
    // Calculate scroll distance: each card needs its own segment
    // Total scroll = cardsCount * viewport height
    const scrollDistance = cardsCount * 100; // in vh units
    
    // Set initial positions: all cards start at bottom (below viewport)
    // Z-index: Later cards (higher index) should be on top
    cards.forEach((card, index) => {
        // Set CSS z-index directly for proper stacking context
        card.style.zIndex = cardsCount - index;
        
        gsap.set(card, {
            y: '100vh', // Start below viewport
            scale: 1,
            filter: 'brightness(1)'
        });
    });
    
    // Create master timeline for stacking animation
    const stackingTl = gsap.timeline({
        scrollTrigger: {
            trigger: stackingCards,
            start: 'top top',
            end: `+=${scrollDistance}vh`,
            pin: true,
            scrub: 1, // Smooth scrubbing
            markers: DEBUG_MODE,
            id: 'stacking-cards-trigger', // Unique ID to prevent conflicts
            
            onEnter: () => {
                if (DEBUG_MODE) console.log('Stacking cards started');
            },
            onLeave: () => {
                if (DEBUG_MODE) console.log('Stacking cards completed');
            },
            onEnterBack: () => {
                if (DEBUG_MODE) console.log('Scrolled back to stacking cards');
            }
        }
    });
    
    // Animate each card
    cards.forEach((card, index) => {
        const progressStart = index / cardsCount;
        const progressEnd = (index + 1) / cardsCount;
        
        // Card slides up from bottom to center (sticky position)
        stackingTl.to(card, {
            y: 0, // Move to center (sticky position)
            ease: heavyEase,
            duration: 1 / cardsCount // Each card gets equal scroll time
        }, progressStart);
        
        // Previous cards scale down and darken as new card enters
        if (index > 0) {
            // Animate all previous cards
            for (let prevIndex = 0; prevIndex < index; prevIndex++) {
                const prevCard = cards[prevIndex];
                
                // Scale down and darken previous cards
                stackingTl.to(prevCard, {
                    scale: 0.95,
                    filter: 'brightness(0.8)',
                    ease: heavyEase,
                    duration: 1 / cardsCount
                }, progressStart);
            }
        }
    });
    
    return stackingTl;
}

// ============================================================================
// SECTION 4 - BACKGROUND TRANSITION & TEXT MASK
// ============================================================================

/**
 * Initializes background color transition and text mask video reveal
 * 
 * BACKGROUND TRANSITION:
 * - Body background animates from dark (#000) to light (#fff)
 * - Smooth color transition as section enters viewport
 * - Creates high-contrast finale effect
 * 
 * TEXT MASK EFFECT:
 * - Huge text ('THE END') acts as a mask
 * - Video plays inside text strokes using background-clip: text
 * - Video reveals as user scrolls (opacity animation)
 * - Creates dramatic, high-contrast finale
 * 
 * MASKING TECHNIQUE:
 * - Uses background-clip: text for text mask effect
 * - Video positioned behind text
 * - Text color transparent, video shows through
 * - Alternative: Can use SVG mask for better browser support
 * 
 * SCROLL REVEAL:
 * - Video opacity animates from 0 to 1 on scroll
 * - Smooth reveal tied to scroll position
 * - Creates cinematic finale experience
 */
function initSection4() {
    const section4 = document.getElementById('section-4');
    const textMaskVideo = document.querySelector('.text-mask-video');
    const textMaskTitle = document.querySelector('.text-mask-title');
    
    if (!section4 || !textMaskVideo || !textMaskTitle) {
        console.warn('Section 4 elements not found');
        return;
    }
    
    // Combined timeline to avoid ScrollTrigger conflicts
    // Both animations use the same trigger but different start/end points
    const section4Tl = gsap.timeline({
        scrollTrigger: {
            trigger: section4,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            markers: DEBUG_MODE,
            id: 'section4-trigger', // Unique ID to prevent conflicts
            
            onEnter: () => {
                if (DEBUG_MODE) console.log('Section 4: Animation started');
            },
            onLeave: () => {
                if (DEBUG_MODE) console.log('Section 4: Animation completed');
            },
            onUpdate: (self) => {
                // Update text blend mode as video becomes visible
                const progress = self.progress;
                if (progress > 0.3) {
                    // When video starts showing, change text to use mix-blend-mode
                    textMaskTitle.style.mixBlendMode = 'screen';
                    textMaskTitle.style.background = 'none';
                    textMaskTitle.style.webkitTextFillColor = '#fff';
                    textMaskTitle.style.color = '#fff';
                } else {
                    // Reset to initial state
                    textMaskTitle.style.mixBlendMode = 'normal';
                    textMaskTitle.style.background = 'linear-gradient(45deg, #fff, #fff)';
                    textMaskTitle.style.webkitBackgroundClip = 'text';
                    textMaskTitle.style.backgroundClip = 'text';
                    textMaskTitle.style.webkitTextFillColor = 'transparent';
                    textMaskTitle.style.color = 'transparent';
                }
            }
        }
    });
    
    // Background color transition (happens in first half of scroll)
    section4Tl.to('body', {
        backgroundColor: '#fff',
        ease: heavyEase,
        duration: 0.5 // First 50% of scroll
    }, 0);
    
    // Reveal video inside text mask (happens throughout scroll)
    section4Tl.to(textMaskVideo, {
        opacity: 1,
        ease: heavyEase,
        duration: 1 // Full scroll duration
    }, 0);
    
    // Ensure text stays visible
    section4Tl.to(textMaskTitle, {
        opacity: 1,
        ease: heavyEase,
        duration: 1
    }, 0);
    
    return { bgTl, videoTl };
}

// ============================================================================
// VELOCITY-BASED SKEW EFFECT
// ============================================================================

/**
 * Initializes velocity-based skew effect on the main content container
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Uses gsap.quickTo() for maximum performance (batched updates, no tween overhead)
 * - Updates run on ScrollTrigger's onUpdate (already optimized for scroll)
 * - Clamped values prevent excessive transforms that could break interaction
 * 
 * LIQUID MOTION:
 * - Velocity is smoothed/interpolated for fluid feel
 * - Skew direction follows scroll direction (down = positive, up = negative)
 * - Returns to neutral (0) when scrolling stops
 * 
 * VELOCITY CALCULATION:
 * - ScrollTrigger.getVelocity() returns pixels per second
 * - We normalize this to a reasonable skew range (-10 to 10 degrees)
 * - Velocity is clamped to prevent extreme values
 */
function initSkewEffect() {
    if (!smoothContent) {
        console.warn('Smooth content wrapper not found');
        return;
    }
    
    // Configuration
    const MAX_SKEW = 10; // Maximum skew in degrees
    const VELOCITY_MULTIPLIER = 0.01; // Adjust sensitivity (lower = less sensitive)
    const SMOOTHING = 0.15; // Smoothing factor for liquid feel (0-1, lower = smoother)
    
    // Current target skew value (what we're animating towards)
    let targetSkew = 0;
    
    // Current actual skew value (what's currently applied)
    let currentSkew = 0;
    
    // Use gsap.quickTo for maximum performance
    // quickTo batches updates and uses optimized rendering
    const quickSkew = gsap.quickTo(smoothContent, "skewY", {
        duration: SMOOTHING,
        ease: heavyEase
    });
    
    // Create ScrollTrigger to track scroll velocity
    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        id: 'skew-velocity-trigger', // Unique ID to prevent conflicts
        onUpdate: (self) => {
            // Get scroll velocity (pixels per second)
            // Positive = scrolling down, Negative = scrolling up
            const velocity = self.getVelocity();
            
            // Normalize velocity to skew value
            // Multiply by negative to match scroll direction (down scroll = positive skew)
            targetSkew = -velocity * VELOCITY_MULTIPLIER;
            
            // Clamp the target skew value
            targetSkew = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, targetSkew);
            
            // Apply the skew using quickTo (handles smoothing internally)
            quickSkew(targetSkew);
        },
        onLeave: () => {
            // Return to neutral when scrolled past end
            quickSkew(0);
        },
        onLeaveBack: () => {
            // Return to neutral when scrolled past start
            quickSkew(0);
        }
    });
    
    // Alternative approach using gsap.ticker for even smoother updates
    // Uncomment this and comment out the quickTo approach above if you prefer
    /*
    let targetSkew = 0;
    let currentSkew = 0;
    const SMOOTHING_SPEED = 0.15; // How fast to interpolate (0-1)
    
    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = self.getVelocity();
            targetSkew = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, -velocity * VELOCITY_MULTIPLIER);
        }
    });
    
    // Update skew on every frame using ticker
    gsap.ticker.add(() => {
        // Smooth interpolation for liquid feel
        currentSkew += (targetSkew - currentSkew) * SMOOTHING_SPEED;
        
        // Apply transform directly (most performant)
        gsap.set(smoothContent, {
            skewY: currentSkew
        });
    });
    */
}

// ============================================================================
// SELECTED WORKS SECTION - CINEMA-STYLE REVEAL
// ============================================================================

/**
 * Initializes cinema-style image reveal effect for Selected Works section
 * 
 * CINEMA REVEAL EFFECT:
 * - Starts with image hidden using clip-path: inset(50% 0 50% 0) (thin horizontal line)
 * - As user scrolls, clip-path animates to inset(0% 0 0% 0) (full reveal)
 * - Simultaneously scales image from 1.5 down to 1.0 (zoom-out effect)
 * - Creates depth sensation and "entering the image" feeling
 * 
 * CLIP-PATH EXPLANATION:
 * - inset(top right bottom left) - defines visible area
 * - inset(50% 0 50% 0) = 50% hidden from top, 50% hidden from bottom (thin line)
 * - inset(0% 0 0% 0) = fully visible (no clipping)
 * 
 * SCALE EFFECT:
 * - Starts at 1.5 (zoomed in, creating depth)
 * - Animates to 1.0 (normal size)
 * - Combined with clip-path creates cinematic reveal
 * 
 * PERFORMANCE:
 * - Uses scrub: true for scroll-tied animation
 * - will-change properties set in CSS for GPU acceleration
 * - Transform and clip-path are both GPU-accelerated properties
 * 
 * IMPORTANT: This function must run AFTER images are loaded to prevent
 * incorrect start/end position calculations due to layout shifts.
 */
function initSelectedWorks() {
    const selectedWorksItems = document.querySelectorAll('.selected-works-item');
    
    if (!selectedWorksItems.length) {
        console.warn('Selected works items not found');
        return;
    }
    
    // Refresh ScrollTrigger to recalculate positions after images load
    ScrollTrigger.refresh();
    
    selectedWorksItems.forEach((item, index) => {
        const imageWrapper = item.querySelector('.selected-works-image-wrapper');
        const image = item.querySelector('.selected-works-image');
        
        if (!imageWrapper || !image) return;
        
        // Create timeline for simultaneous clip-path and scale animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top bottom', // Animation starts when item enters viewport
                end: 'center center', // Animation completes when item reaches center
                scrub: true,          // Animation tied directly to scroll position
                markers: DEBUG_MODE,  // Show debug markers if DEBUG_MODE is true
                
                // Optional: Add callbacks for debugging
                onEnter: () => {
                    if (DEBUG_MODE) console.log(`Selected Work ${index + 1}: Reveal started`);
                },
                onEnterBack: () => {
                    if (DEBUG_MODE) console.log(`Selected Work ${index + 1}: Scrolled back into view`);
                }
            }
        });
        
        // Animate clip-path from inset(50% 0 50% 0) to inset(0% 0 0% 0)
        // This creates the cinema-style reveal effect
        tl.to(imageWrapper, {
            clipPath: 'inset(0% 0 0% 0)',
            ease: heavyEase,
            duration: 1
        }, 0); // Start at time 0
        
        // Simultaneously animate scale from 1.5 to 1.0
        // This creates the zoom-out depth effect
        tl.to(image, {
            scale: 1.0,
            ease: heavyEase,
            duration: 1
        }, 0); // Start at time 0 (simultaneous with clip-path)
    });
}

// ============================================================================
// KINETIC TYPOGRAPHY MARQUEE
// ============================================================================

/**
 * Initializes kinetic typography marquee with scroll-velocity-driven acceleration
 * 
 * PERFORMANCE:
 * - Uses gsap.ticker for buttery smooth 60fps rendering
 * - Direct transform updates (no tween overhead)
 * - GPU-accelerated transforms
 * 
 * INFINITE SCROLL:
 * - Uses duplicate content for seamless loop
 * - Mod logic resets position when one copy completes
 * - No visible gap or jump
 * 
 * SCROLL VELOCITY INTERACTION:
 * - Base speed: Constant auto-scroll
 * - Velocity boost: Scroll velocity accelerates horizontal speed significantly
 * - Direction flip: Scrolling up reverses marquee direction
 * - Aggressive response: High multiplier for immediate, responsive feel
 * 
 * VELOCITY CALCULATION:
 * - ScrollTrigger.getVelocity() returns pixels per second
 * - Positive velocity = scrolling down (marquee moves right)
 * - Negative velocity = scrolling up (marquee moves left)
 * - Velocity is multiplied aggressively for responsive feel
 */
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    
    if (!marqueeContent) {
        console.warn('Marquee content not found');
        return;
    }
    
    // Configuration
    const BASE_SPEED = 0.5; // Base horizontal scroll speed (pixels per frame)
    const VELOCITY_MULTIPLIER = 0.15; // How much scroll velocity affects speed (aggressive)
    const MAX_VELOCITY_BOOST = 20; // Maximum additional speed from velocity (pixels per frame)
    
    // State
    let currentX = 0;
    let scrollVelocity = 0;
    let direction = 1; // 1 = right, -1 = left
    let marqueeWidth = 0;
    
    // Calculate marquee width (width of one text copy)
    function updateMarqueeWidth() {
        const firstText = marqueeContent.querySelector('.marquee-text');
        if (firstText) {
            marqueeWidth = firstText.offsetWidth;
        }
    }
    
    // Initial width calculation (wait for next frame to ensure text is rendered)
    requestAnimationFrame(() => {
        updateMarqueeWidth();
    });
    
    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateMarqueeWidth();
        }, 250);
    });
    
    // Track scroll velocity using ScrollTrigger
    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        id: 'marquee-velocity-trigger', // Unique ID to prevent conflicts
        onUpdate: (self) => {
            // Get scroll velocity (pixels per second)
            // Positive = scrolling down, Negative = scrolling up
            scrollVelocity = self.getVelocity();
            
            // Determine direction based on scroll
            // Scrolling down = positive velocity = marquee moves right (direction 1)
            // Scrolling up = negative velocity = marquee moves left (direction -1)
            direction = scrollVelocity >= 0 ? 1 : -1;
        }
    });
    
    // Main animation loop using gsap.ticker for 60fps
    gsap.ticker.add(() => {
        // Calculate velocity boost (aggressive response)
        // Convert velocity (px/sec) to per-frame boost
        // Divide by ~60 for approximate frames per second
        const velocityBoost = gsap.utils.clamp(
            -MAX_VELOCITY_BOOST,
            MAX_VELOCITY_BOOST,
            (scrollVelocity * VELOCITY_MULTIPLIER) / 60
        );
        
        // Calculate total speed
        // Base speed + velocity boost, multiplied by direction
        const totalSpeed = (BASE_SPEED + Math.abs(velocityBoost)) * direction;
        
        // Update position
        currentX += totalSpeed;
        
        // Mod logic for infinite scroll
        // When one copy has scrolled past, reset to create seamless loop
        if (marqueeWidth > 0) {
            if (direction === 1 && currentX >= marqueeWidth) {
                currentX = currentX % marqueeWidth;
            } else if (direction === -1 && currentX <= -marqueeWidth) {
                currentX = currentX % marqueeWidth;
            }
        }
        
        // Apply transform directly (most performant)
        gsap.set(marqueeContent, {
            x: currentX,
            force3D: true // Force GPU acceleration
        });
    });
    
    // Alternative: Using requestAnimationFrame (uncomment to use instead)
    /*
    let lastTime = performance.now();
    
    function animateMarquee(currentTime) {
        const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to 60fps
        lastTime = currentTime;
        
        // Calculate velocity boost
        const velocityBoost = gsap.utils.clamp(
            -MAX_VELOCITY_BOOST,
            MAX_VELOCITY_BOOST,
            (scrollVelocity * VELOCITY_MULTIPLIER) / 60
        );
        
        // Calculate total speed
        const totalSpeed = (BASE_SPEED + Math.abs(velocityBoost)) * direction * deltaTime;
        
        // Update position
        currentX += totalSpeed;
        
        // Mod logic for infinite scroll
        if (marqueeWidth > 0) {
            if (direction === 1 && currentX >= marqueeWidth) {
                currentX = currentX % marqueeWidth;
            } else if (direction === -1 && currentX <= -marqueeWidth) {
                currentX = currentX % marqueeWidth;
            }
        }
        
        // Apply transform
        marqueeContent.style.transform = `translate3d(${currentX}px, 0, 0)`;
        
        requestAnimationFrame(animateMarquee);
    }
    
    requestAnimationFrame(animateMarquee);
    */
}

// ============================================================================
// PROJECTS SECTION ANIMATION
// ============================================================================

/**
 * Initializes ScrollTrigger animations for the projects section
 * 
 * MARKERS EXPLANATION:
 * When DEBUG_MODE is true, ScrollTrigger shows visual markers:
 * - Green line: Animation START point (when trigger element reaches this position)
 * - Red line: Animation END point (when trigger element reaches this position)
 * - Progress indicator: Shows current scroll progress (0 to 1)
 * 
 * START/END VALUES:
 * - 'top bottom': Trigger element's top edge meets viewport's bottom edge
 * - 'bottom top': Trigger element's bottom edge meets viewport's top edge
 * - 'top center': Trigger element's top edge meets viewport's center
 * 
 * SCRUB:
 * - scrub: true ties animation directly to scroll position
 * - scrub: 1 adds 1 second of lag for smoother feel (optional)
 * - scrub: false would make animation play once when triggered
 * 
 * IMPORTANT: This function must run AFTER images are loaded to prevent
 * incorrect start/end position calculations due to layout shifts.
 */
function initProjects() {
    const projectImages = document.querySelectorAll('.project-image');
    
    if (!projectImages.length) {
        console.warn('Project images not found');
        return;
    }
    
    // Refresh ScrollTrigger to recalculate positions after images load
    ScrollTrigger.refresh();
    
    projectImages.forEach((image, index) => {
        const projectItem = image.closest('.project-item');
        
        if (!projectItem) return;
        
        // Scale effect: image scales from 1.3 to 1 as it enters viewport
        gsap.fromTo(
            image,
            {
                scale: 1.3
            },
            {
                scale: 1,
                ease: heavyEase, // Custom ease for punchy reveal feel
                scrollTrigger: {
                    trigger: projectItem,
                    start: 'top bottom', // Animation starts when top of item hits bottom of viewport
                    end: 'bottom top',   // Animation ends when bottom of item hits top of viewport
                    scrub: true,         // Animation tied directly to scroll position
                    markers: DEBUG_MODE, // Show debug markers if DEBUG_MODE is true
                    
                    // Optional: Add callbacks for debugging
                    onEnter: () => {
                        if (DEBUG_MODE) console.log(`Project ${index + 1}: Animation started`);
                    },
                    onLeave: () => {
                        if (DEBUG_MODE) console.log(`Project ${index + 1}: Animation completed`);
                    },
                    onEnterBack: () => {
                        if (DEBUG_MODE) console.log(`Project ${index + 1}: Scrolled back into view`);
                    },
                    onLeaveBack: () => {
                        if (DEBUG_MODE) console.log(`Project ${index + 1}: Scrolled past`);
                    }
                }
            }
        );
    });
    
    // Alternative: Parallax effect (uncomment to use instead of scale effect)
    /*
    projectImages.forEach((image, index) => {
        const projectItem = image.closest('.project-item');
        
        if (!projectItem) return;
        
        gsap.to(image, {
            yPercent: -30, // Move image up 30% faster than scroll
            ease: 'none',
            scrollTrigger: {
                trigger: projectItem,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                markers: DEBUG_MODE
            }
        });
    });
    */
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Main initialization function
 * Handles proper loading sequence for different sections
 */
function init() {
    // Hero animation can run on DOMContentLoaded (no images to wait for)
    initHero();
    
    // Skew effect can initialize immediately (no dependencies)
    initSkewEffect();
    
    // Marquee can initialize immediately (no dependencies)
    initMarquee();
    
    // Image-heavy sections must wait for window load to ensure images are loaded
    // This prevents incorrect ScrollTrigger start/end calculations
    // caused by layout shifts when images load
    if (document.readyState === 'complete') {
        // Images already loaded
        initHorizontalGallery();
        initStackingCards();
        initSection4();
        initSelectedWorks();
        initProjects();
    } else {
        // Wait for all images and resources to load
        window.addEventListener('load', () => {
            initHorizontalGallery();
            initStackingCards();
            initSection4();
            initSelectedWorks();
            initProjects();
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already ready
    init();
}

// ============================================================================
// UTILITY: Refresh ScrollTrigger on window resize
// ============================================================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
