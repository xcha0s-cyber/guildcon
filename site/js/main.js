// Simple JavaScript for Guild Con site

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Guild Con 2025 - Hackers Guild Pittsburgh');

    // Burger Menu Toggle
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!burgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Future: Add countdown timer to conference date
function startCountdown(targetDate) {
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const distance = target - now;

        if (distance < 0) {
            clearInterval(countdown);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        // Update countdown display if element exists
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.innerHTML = `${days}d ${hours}h ${minutes}m`;
        }
    }, 60000); // Update every minute
}

// Uncomment to enable countdown
// startCountdown('2025-11-22');