# Product & Data Consultancy Website

A sophisticated, scroll-interactive website design for product and data consultancy services.

## Features

### Scroll-Based Clarity Effect
The website features a unique fixed-background scroll interaction that metaphorically represents "bringing clarity from complexity":
- The background image **stays fixed** while content scrolls over it
- The image starts at **25px blur** (complexity)
- As you scroll down, the blur gradually reduces to **0px** (clarity)
- The effect completes over 800px of scrolling
- All content sections have **semi-transparent backgrounds** allowing you to see the clarity effect through the page

This creates a powerful, immersive visual metaphor for your value proposition - visitors literally see clarity emerge as they explore your services.

## Design Elements

### Visual Design
- **Color Palette**: Deep blue-black primary with vibrant blue accents
- **Typography**: System fonts for optimal performance and readability
- **Layout**: Clean, modern sections with ample whitespace and semi-transparent backgrounds
- **Glassmorphism**: Frosted glass effect (backdrop-filter) on all content sections
- **Fixed Background**: Data visualization background stays in place while content scrolls
- **High Contrast**: Text shadows and opaque backgrounds ensure readability
- **Animations**: Subtle hover effects and smooth transitions
- **Responsive**: Fully responsive design for all device sizes

### Sections
1. **Hero** - Full-screen introduction with scroll-to-reveal effect
2. **Services** - Three-column service cards with icons
3. **Approach** - Four-step methodology display
4. **About** - Two-column layout with stats showcase
5. **Contact** - Call-to-action section
6. **Footer** - Simple footer with social links

## Customization

### 1. Replace the Hero Background Image

The design currently uses an embedded SVG data visualization. To use your own image:

**Option A: Use a URL**
In `styles.css` at line 174, replace the background-image URL:
```css
.hero-image {
    background-image: url('path/to/your/image.jpg');
}
```

**Option B: Use JavaScript**
In `script.js`, uncomment and use the `setCustomHeroImage` function at the bottom:
```javascript
setCustomHeroImage('path/to/your/data-visualization-image.jpg');
```

### Recommended Image Characteristics
- **Subject**: Data visualization, technology dashboard, growth charts, network diagrams, or abstract data patterns
- **Resolution**: At least 1920x1080px for crisp display
- **Format**: JPG or PNG
- **Style**: Should work well when blurred - avoid images with important small text
- **Color**: Works best with blues, dark backgrounds, or data-themed imagery

**Free Image Sources:**
- Unsplash (search: "data visualization", "technology", "network")
- Pexels (search: "data", "analytics", "charts")
- Custom data visualizations from tools like D3.js, Chart.js, or Flourish

### 2. Update Copy

Replace placeholder text in `index.html`:
- Line 32: Hero subtitle
- Lines 64-86: Service descriptions
- Lines 99-115: Approach steps
- Lines 128-129: About bio
- Line 162: Contact CTA

### 3. Update Contact Information

Replace placeholder links:
- Line 163: Email address
- Lines 173-175: Social media links
- Line 13: Update logo initials (currently "AG")

### 4. Customize Colors

In `styles.css`, modify the CSS variables at the top (lines 5-14):
```css
:root {
    --color-primary: #0A1929;
    --color-accent: #3B82F6;
    /* ... etc */
}
```

### 5. Adjust Scroll Effect Settings

In `script.js`, modify the CONFIG object (lines 11-15):
```javascript
const CONFIG = {
    maxBlur: 25,        // Starting blur amount
    minBlur: 0,         // Ending blur amount
    scrollRange: 800,   // Pixels to scroll for full effect
    throttleDelay: 10   // Performance tuning
};
```

### 6. Add a Clarity Progress Indicator (Optional)

The script dispatches a custom `clarityProgress` event you can use to create a visual progress indicator:

```javascript
window.addEventListener('clarityProgress', function(e) {
    console.log(`Clarity: ${e.detail.clarity}%`);
    console.log(`Blur: ${e.detail.blur}px`);
    // Update your custom progress indicator here
});
```

Example: Add a progress bar to show clarity percentage as the user scrolls.

## File Structure

```
product-consulting/
├── index.html          # Main HTML structure
├── styles.css          # All styles and responsive design
├── script.js           # Scroll blur effect logic
└── README.md          # This file
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- **CSS backdrop-filter** support required for glassmorphism effect
- **CSS filter** support for blur effect
- **position: fixed** support for static background
- Smooth scrolling support

**Note**: The glassmorphism effect (frosted glass) works best in Safari and Chrome. In browsers without backdrop-filter support, sections will have solid backgrounds instead.

## Performance

The design is optimized for performance:
- Throttled scroll events (10ms delay)
- Passive event listeners
- System fonts (no web font loading)
- Minimal JavaScript
- CSS-based animations using GPU acceleration

## Accessibility

- Semantic HTML structure
- High contrast text
- Keyboard navigation support
- Smooth scroll can be disabled via browser preferences

## Next Steps

1. **Add your copy** to all placeholder sections
2. **Select or create** a hero background image representing data/technology/growth
3. **Update** all contact information and social links
4. **Customize** colors if desired to match your brand
5. **Test** the scroll effect with your chosen image
6. **Deploy** to your hosting platform

## Tips for Maximum Impact

- Choose a hero image that looks interesting when blurred but reveals impressive detail when clear
- Keep your copy concise - let the visual design breathe
- Use real statistics in the "About" section stats cards
- Ensure your email and social links are current
- Test on mobile devices to ensure responsive design works well

---

Built with modern web standards and optimized for performance.
