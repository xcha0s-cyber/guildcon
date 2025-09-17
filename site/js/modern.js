// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!burgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                burgerMenu.classList.remove('active');
            }
        });
    }

    // Add glitch effect on hover for hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.addEventListener('mouseover', () => {
            heroTitle.style.animation = 'glitch 0.3s ease-in-out infinite';
        });
        heroTitle.addEventListener('mouseout', () => {
            heroTitle.style.animation = 'glitch 2s ease-in-out infinite alternate';
        });
    }

    // Parallax effect for hero background
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // Add typing effect to tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        setTimeout(typeWriter, 500);
    }

    // Accessibility Mode Toggle
    const a11yToggle = document.getElementById('a11y-toggle');
    const announcements = document.getElementById('a11y-announcements');

    if (a11yToggle) {
        // Load saved preferences
        const savedPreferences = localStorage.getItem('a11yPreferences');
        if (savedPreferences) {
            const prefs = JSON.parse(savedPreferences);
            applyAccessibilityPreferences(prefs);
        }

        a11yToggle.addEventListener('click', () => {
            const isActive = a11yToggle.getAttribute('aria-pressed') === 'true';
            const newState = !isActive;

            // Toggle accessibility features
            const prefs = {
                highContrast: newState,
                reduceMotion: newState,
                largeText: newState,
                underlineLinks: newState,
                focusIndicators: newState
            };

            applyAccessibilityPreferences(prefs);
            localStorage.setItem('a11yPreferences', JSON.stringify(prefs));

            // Update button state
            a11yToggle.setAttribute('aria-pressed', newState.toString());

            // Announce change to screen readers
            if (announcements) {
                announcements.textContent = newState ?
                    'Accessibility mode enabled. High contrast, reduced motion, and large text are now active.' :
                    'Accessibility mode disabled. Standard viewing mode restored.';
            }
        });
    }

    function applyAccessibilityPreferences(prefs) {
        const body = document.body;

        // High Contrast
        if (prefs.highContrast) {
            body.classList.add('a11y-high-contrast');
        } else {
            body.classList.remove('a11y-high-contrast');
        }

        // Reduced Motion
        if (prefs.reduceMotion) {
            body.classList.add('a11y-reduce-motion');
            // Disable parallax and animations
            const heroBg = document.querySelector('.hero-bg img');
            if (heroBg) {
                heroBg.style.transform = 'none';
            }
        } else {
            body.classList.remove('a11y-reduce-motion');
        }

        // Large Text
        if (prefs.largeText) {
            body.classList.add('a11y-large-text');
        } else {
            body.classList.remove('a11y-large-text');
        }

        // Underline Links
        if (prefs.underlineLinks) {
            body.classList.add('a11y-underline-links');
        } else {
            body.classList.remove('a11y-underline-links');
        }

        // Enhanced Focus Indicators
        if (prefs.focusIndicators) {
            body.classList.add('a11y-focus');
        } else {
            body.classList.remove('a11y-focus');
        }

        // Update toggle button state
        if (a11yToggle) {
            a11yToggle.setAttribute('aria-pressed', prefs.highContrast ? 'true' : 'false');
        }
    }

    // Keyboard Navigation Detection
    let isTabbing = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (!isTabbing) {
                isTabbing = true;
                document.body.classList.add('keyboard-nav');
            }
        }

        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const navLinks = document.getElementById('navLinks');
            const burgerMenu = document.getElementById('burgerMenu');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                burgerMenu.classList.remove('active');
            }
        }
    });

    document.addEventListener('mousedown', () => {
        if (isTabbing) {
            isTabbing = false;
            document.body.classList.remove('keyboard-nav');
        }
    });

    // Check system preferences for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('a11y-reduce-motion');
    }
});