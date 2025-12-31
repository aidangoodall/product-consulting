/**
 * Scroll-based Blur Effect
 * Progressively reveals the hero image as the user scrolls
 * Metaphor: Bringing clarity from complexity
 */

(function () {
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
    const wordTransformEl = document.getElementById('word-transform');

    if (!heroImage) {
        console.warn('Hero image element not found');
        return;
    }

    // Text Scramble State
    let scrambleFx;
    let isScrambled = false;
    const initialText = 'from complexity';
    const targetText = 'to clarity';

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

        return function () {
            const context = this;
            const args = arguments;

            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    if ((Date.now() - lastRan) >= delay) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, delay - (Date.now() - lastRan));
            }
        };
    }

    /**
     * Text Scramble Effect
     */
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Initialize Text Scramble
    if (wordTransformEl) {
        scrambleFx = new TextScramble(wordTransformEl);
    }

    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Create throttled version of update function
    const throttledUpdate = throttle(updateBlurEffect, CONFIG.throttleDelay);

    // Set initial blur on page load
    updateBlurEffect();

    // Listen for scroll events
    window.addEventListener('scroll', throttledUpdate, { passive: true });

    // Update on resize (in case scroll position changes)
    window.addEventListener('resize', throttledUpdate, { passive: true });

    // Trigger text scramble after 1 second delay
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (scrambleFx && !isScrambled) {
                isScrambled = true;
                scrambleFx.setText(targetText);
            }
        }, 1000);
    });

    // Optional: Add smooth scroll behavior to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Active Section Tracking for Side Navigation
    const navLinks = document.querySelectorAll('.side-nav-menu a[data-section]');
    const sections = document.querySelectorAll('section[id]');

    if (navLinks.length > 0 && sections.length > 0) {
        // Create Intersection Observer for section tracking
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Trigger when section is in middle of viewport
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');

                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));

                    // Add active class to matching nav link
                    const activeLink = document.querySelector(`.side-nav-menu a[data-section="${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Contact Section Interactivity
    const emailBtn = document.getElementById('emailBtn');
    const emailDropdown = document.getElementById('emailDropdown');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const openEmailBtn = document.getElementById('openEmailBtn');

    // Obfuscated Email Configuration
    // Split the email to prevent scraping: 'aidan' + '@' + 'aidangoodall.com' (example)
    // TODO: Update these values with your actual email parts
    const EMAIL_CONFIG = {
        user: 'aidangoodall7',
        domain: 'gmail.com'
    };

    const getEmail = () => `${EMAIL_CONFIG.user}@${EMAIL_CONFIG.domain}`;

    // Email Dropdown Toggle
    if (emailBtn && emailDropdown) {
        emailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            emailDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!emailBtn.contains(e.target) && !emailDropdown.contains(e.target)) {
                emailDropdown.classList.remove('active');
            }
        });
    }

    // Copy Email to Clipboard
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                const email = getEmail();
                await navigator.clipboard.writeText(email);

                // Visual feedback
                const originalText = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i data-lucide="check"></i> Copied!';
                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalText;
                    if (window.lucide) window.lucide.createIcons();
                }, 2000);
            } catch (err) {
                console.error('Failed to copy email:', err);
            }
        });
    }

    // Open Email Client
    if (openEmailBtn) {
        openEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = getEmail();
            const subject = encodeURIComponent('Product Consulting Enquiry');
            window.location.href = `mailto:${email}?subject=${subject}`;
        });
    }


})();
