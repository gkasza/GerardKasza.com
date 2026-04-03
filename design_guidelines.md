# Design Guidelines: Gerard Kasza Portfolio

## Design Approach
**Reference-Based**: Drawing from award-winning tech executive portfolios on Awwwards/Behance, combining minimalist modernism with cyberpunk aesthetics. Think Linear's precision + Stripe's restraint + cyberpunk edge.

## Core Aesthetic
- **Dark Theme Foundation**: Deep charcoal/near-black backgrounds (#0a0a0a to #1a1a1a)
- **High-Contrast Accents**: Electric blue (#00D9FF) primary, neon green (#39FF14) secondary for highlights
- **Cyberpunk Edge**: Subtle neon glows, sharp geometric elements, tech-forward feel

## Typography System
**Fonts**: Space Grotesk (headings), Inter (body) via Google Fonts
- H1: 4xl-6xl, bold, tight tracking, electric blue glow effect
- H2: 3xl-4xl, semibold
- H3: 2xl, medium
- Body: Base-lg, regular, light gray (#E0E0E0)
- Accent text: Neon green for CTAs/highlights

## Layout & Spacing
**Spacing Units**: Tailwind 4, 6, 8, 12, 16, 24 for consistent rhythm
- Section padding: py-20 desktop, py-12 mobile
- Container: max-w-7xl with px-6
- Grid gaps: gap-6 to gap-8

## Section Structure

### Hero (Full Viewport)
- Full-screen height (100vh) with centered content
- Large profile photo (circular, 200px+, subtle neon border glow)
- Name: Massive heading with gradient text effect
- Tagline: Electric blue, medium weight
- Animated down-arrow scroll indicator
- Parallax background: Subtle geometric grid pattern or abstract tech visual

### About Me
- Two-column layout (desktop): Bio text left, skills visualization right
- Animated skill bars or circular progress indicators with neon fills
- Staggered fade-in animations on scroll
- Pull quotes highlighted in neon green

### Professional Timeline
- Vertical interactive timeline with neon connector line
- Timeline nodes: Electric blue dots with glow
- Cards: Dark glass-morphism effect (backdrop-blur with subtle borders)
- Alternating left/right layout (desktop), stacked (mobile)
- Hover: Cards lift with enhanced glow

### Projects Portfolio
- Masonry or 3-column grid (desktop), single column (mobile)
- Project cards: Image overlay with gradient fade revealing title/description
- Neon border on hover
- Filter buttons: Pill-style with active neon glow state

### Skills & Expertise
- Icon grid layout: 4-6 columns
- Tech stack icons with labels
- Subtle pulse animation on hover
- Group by category with neon dividers

### Testimonials
- 2-column card layout
- Quotation marks in neon green
- Client photos (circular) with role/company
- Glass-morphism card backgrounds

### Contact Section
- Split layout: Contact form (left) + LinkedIn embed/social links (right)
- Form fields: Dark with neon borders, glow on focus
- Submit button: Electric blue with hover lift effect
- Social icons: Neon outline style

## Component Library
- **Buttons**: Dark bg, neon border, text glow. On images: blur backdrop (backdrop-blur-sm)
- **Cards**: backdrop-blur-md, border-white/10, subtle shadow
- **Links**: Underline animation in electric blue
- **Dividers**: 1px neon gradient lines between sections

## Animations (Subtle)
- Scroll-triggered fade-ins (intersection observer)
- Parallax on hero only
- Hover states: Gentle lifts (translateY -2px), glow intensification
- NO autoplay carousels or excessive motion

## Images
**Large Hero Image**: YES - Abstract tech background or geometric pattern with dark overlay
**Project Images**: Portfolio thumbnails for each project
**Profile Photo**: Professional headshot, circular crop
**Testimonial Photos**: Client headshots if available

All images: High contrast, edited to match dark theme aesthetic

## Accessibility
- White text on dark meets WCAG AA (4.5:1 minimum)
- Neon accents used sparingly for non-essential elements
- Focus states: Bright outlines (electric blue, 2px)
- Skip navigation link
- Semantic HTML throughout

## Mobile Optimization
- Stack all multi-column layouts
- Reduce heading sizes (scale from 6xl to 4xl)
- Maintain touch targets 44px minimum
- Hamburger menu with slide-in nav (neon accents)

## Performance Notes
- Lazy load portfolio images
- Optimize hero background
- Minimize animation libraries (prefer CSS transforms)
- Critical CSS inline for above-fold dark theme