/**
 * Scroll-based Blur Effect
 * Progressively reveals the hero image as the user scrolls
 * Metaphor: Bringing clarity from complexity
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        maxBlur: 25,              // Maximum blur in pixels
        minBlur: 0,               // Minimum blur in pixels
        scrollRange: 800,         // Scroll distance (px) to go from max to min blur
        throttleDelay: 10         // Throttle delay for scroll event (ms)
    };

    // Cache DOM elements
    const heroImage = document.getElementById('heroImage');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (!heroImage) {
        console.warn('Hero image element not found');
        return;
    }

    /**
     * Calculate blur amount based on scroll position
     * @param {number} scrollY - Current scroll position
     * @returns {number} - Blur value in pixels
     */
    function calculateBlur(scrollY) {
        // Linear interpolation from maxBlur to minBlur
        const progress = Math.min(scrollY / CONFIG.scrollRange, 1);
        const blur = CONFIG.maxBlur - (progress * (CONFIG.maxBlur - CONFIG.minBlur));
        return Math.max(blur, CONFIG.minBlur);
    }

    /**
     * Update the blur effect on the hero image
     */
    function updateBlurEffect() {
        const scrollY = window.scrollY || window.pageYOffset;
        const blurAmount = calculateBlur(scrollY);

        // Calculate clarity percentage (inverse of blur)
        const clarityPercent = Math.round(((CONFIG.maxBlur - blurAmount) / CONFIG.maxBlur) * 100);

        // Apply blur filter
        heroImage.style.filter = `blur(${blurAmount}px)`;

        // Hide scroll indicator after scrolling starts
        if (scrollIndicator) {
            if (scrollY > 50) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }

        // Optional: Dispatch custom event with clarity progress
        // You can listen to this event to update a progress indicator
        window.dispatchEvent(new CustomEvent('clarityProgress', {
            detail: {
                blur: blurAmount,
                clarity: clarityPercent,
                scrollY: scrollY
            }
        }));
    }

    /**
     * Throttle function to limit execution rate
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} - Throttled function
     */
    function throttle(func, delay) {
        let timeoutId;
        let lastRan;

        return function() {
            const context = this;
            const args = arguments;

            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    if ((Date.now() - lastRan) >= delay) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, delay - (Date.now() - lastRan));
            }
        };
    }

    // Create throttled version of update function
    const throttledUpdate = throttle(updateBlurEffect, CONFIG.throttleDelay);

    // Set initial blur on page load
    updateBlurEffect();

    // Listen for scroll events
    window.addEventListener('scroll', throttledUpdate, { passive: true });

    // Update on resize (in case scroll position changes)
    window.addEventListener('resize', throttledUpdate, { passive: true });

    // Optional: Add smooth scroll behavior to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /**
     * Optional: Replace the embedded SVG with a custom image
     * Uncomment and modify this function to use your own image
     */
    /*
    function setCustomHeroImage(imageUrl) {
        heroImage.style.backgroundImage = `url('${imageUrl}')`;
    }

    // Example usage:
    // setCustomHeroImage('path/to/your/data-visualization-image.jpg');
    */

})();
