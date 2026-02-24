## Immersive GSAP Landing Experience

A high-end, animation-driven landing experience built with **Vanilla HTML, CSS, and JavaScript**, powered by **GSAP**, **ScrollTrigger**, **CustomEase**, and **Lenis** for smooth scrolling.  
The project is structured in a modular way with BEM-inspired naming for maintainability and clarity.

---

### Tech Stack

- **HTML5** – Semantic, section-based layout
- **CSS3** – Modern layout and typography, BEM-style class naming
- **JavaScript (ES Modules)** – No framework, modular architecture
- **GSAP 3** – Core animation engine
  - `ScrollTrigger` – Scroll-based timelines, pinning, scrub interactions
  - `CustomEase` – Custom easing curve for punchy reveals
- **Lenis** – Smooth, inertia-like scrolling
- **SplitType** – Text splitting for advanced typography animations

---

### Project Structure

- `index.html` – Main document and section layout
- `css/style.css` – Global styles and BEM blocks:
  - `.hero` – Zoom-through hero
  - `.gallery` – Horizontal project gallery
  - `.manifesto` – Text reveal manifesto
  - `.stack` – Stacking cards / selected works
  - `.kinetic` – Kinetic typography & floating imagery
  - `.final` – Finale section with text mask and video
- `js/main.js` – Entry point, plugin registration, and section initialisation
- `js/utils/smoothScroll.js` – Lenis + ScrollTrigger sync
- `js/sections/hero.js` – Hero zoom-through interaction
- `js/sections/horizontal.js` – Horizontal gallery with parallax and progress bar
- `js/sections/textReveal.js` – Manifesto word-by-word scroll reveal
- `js/sections/marquee.js` – Kinetic marquee reacting to scroll velocity
- `js/sections/waveText.js` – 3D wave-in / wave-out text animation
- `js/sections/sticky.js` – Sticky two-column process section
- `js/sections/stacking.js` – Stacking cards / deck effect
- `js/sections/kinetic.js` – Kinetic “BEYOND LIMITS” section with parallax images
- `js/sections/footer.js` – Background transition + text mask video finale

---

### Key Interactions & Animations

- **Hero Zoom-Through (`.hero`)**
  - SplitType-powered heading reveal (`lines, chars`)
  - Pinned scroll segment with zooming circular video mask
  - Zoom container scales massively (zoom-through into the experience)

- **Horizontal Gallery (`.gallery`)**
  - Pinned horizontal scroll, driven by vertical scroll
  - Parallax images and text with `containerAnimation`
  - Progress bar synced to overall gallery scroll progress

- **Manifesto Text Reveal (`.manifesto`)**
  - Words split and revealed progressively as the section is pinned
  - Subtle, cinematic reading rhythm using `scrub`

- **Sticky Process Section (`#sticky-process`)**
  - Right column pinned; left column steps scroll vertically
  - Each step reveals a corresponding image via clip-path
  - Previous steps dimmed, active step highlighted

- **Stacking Cards (`.stack`)**
  - Cards slide up from bottom and fan out horizontally
  - Subtle rotation and scaling for 3D depth
  - Carefully layered z-index for clean overlaps

- **Kinetic Typography (`.kinetic`)**
  - Huge “BEYOND LIMITS” title with background-fill animation
  - Floating image tiles with parallax-driven motion

- **Wave Text (`#wave-text`)**
  - 3D “roll in / roll out” wave motion on characters
  - Section is pinned to emphasise the motion

- **Marquee (`#marquee-section`)**
  - Infinite horizontal text loop
  - Scroll velocity-driven speed adjustment via `timeScale`

- **Final Text Mask (`.final`)**
  - Body background transitions from dark to light
  - Giant “THE END” title acts as a mask for underlying video
  - Footer CTA and links revealed as a high-contrast finale

---

### Animation Philosophy

- **Performance First**
  - `will-change`, `transform`, `opacity`, and GPU-friendly properties only
  - Lenis + ScrollTrigger integration to keep scroll state in sync
  - Modular timelines per section to keep concerns isolated

- **BEM Naming**
  - Block-level components: `.hero`, `.gallery`, `.stack`, `.kinetic`, `.final`
  - Elements: `__title`, `__image`, `__media`, `__card`, `__mask`, etc.
  - Makes it easier to reason about styles and JS hooks per section.

---

### Getting Started (Local)

1. Serve the project with any static server, for example:

```bash
cd gasp_animation
npx serve .
```

2. Open the served URL in a modern browser (Chrome, Edge, Safari).
3. Scroll through the experience to see:
   - Hero zoom-through
   - Horizontal gallery
   - Manifesto, wave text, sticky process
   - Stacking cards and kinetic section
   - Final text mask + video finale

> Note: This project is intentionally experimental and tuned for desktop viewport first.  
> Some behaviours may be simplified on small screens.

---

### Credits

- **GSAP** & **ScrollTrigger** – GreenSock
- **Lenis** – Studio Freight
- **SplitType** – Glyphic
- Imagery & video – Placeholder content from Unsplash / demo sources

Feel free to fork and adapt this setup for your own portfolios, campaigns, and experimental landing pages.

---

### Live Demo

- **Production**: `https://gsap-animation-psi-vert.vercel.app`

### Section Overview

- **Parallax Columns** – `js/sections/columns.js`: column-based parallax scroll section.
- **Hover List** – `js/sections/hoverList.js`: interactive list with hover-driven motion.

### Development Notes

- Best experienced on modern desktop browsers with smooth scrolling enabled.
- Animations are tuned for performance; avoid heavy DOM changes while scrolling.

### Author & Contact

- **Author**: mawkunnmyat
- **Contact**: `mapoeeiphyu2017.miitinternship@gmail.com`
