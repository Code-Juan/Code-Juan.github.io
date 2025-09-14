// SPA Section Management
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll("section").forEach((section) => {
        section.classList.remove("active");
    });

    // Hide home section for audience-specific sections
    const homeSection = document.getElementById("home");
    if (sectionId === "game-dev" || sectionId === "web-services" || sectionId === "contact") {
        if (homeSection) {
            homeSection.style.display = "none";
        }
    } else {
        // Show home section for other sections
        if (homeSection) {
            homeSection.style.display = "block";
        }
    }

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Update navigation based on context
    updateNavigation(sectionId);

    // Handle scrolling
    if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (selectedSection) {
        // Scroll to section heading with proper navigation offset
        const sectionHeading = selectedSection.querySelector("h2, .hero-title");
        if (sectionHeading) {
            const navHeight = document.querySelector(".navbar").offsetHeight;
            const headingPosition = sectionHeading.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: headingPosition - navHeight - 30, // Extra 30px for better spacing
                behavior: "smooth"
            });
        } else {
            // If no heading found, scroll to top of section
            const sectionTop = selectedSection.getBoundingClientRect().top + window.scrollY;
            const navHeight = document.querySelector(".navbar").offsetHeight;
            window.scrollTo({
                top: sectionTop - navHeight - 20,
                behavior: "smooth"
            });
        }
    }
}

// Context-aware navigation
function updateNavigation(currentSection) {
    const navLinks = document.querySelectorAll(".nav-link");

    // Reset all links
    navLinks.forEach(link => {
        link.classList.remove("active");
        link.style.display = "block";
    });

    // Keep Home button visible in all sections for better navigation
    // Removed the code that hides Home button in audience sections

    // Set active state for current section
    const activeLink = document.querySelector(`a[onclick="showSection('${currentSection}')"]`);
    if (activeLink) {
        activeLink.classList.add("active");
    }
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        const honeypot = formData.get('company_website');

        // Check honeypot (spam protection)
        if (honeypot) {
            console.log('Spam detected');
            return;
        }

        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Submit to Render endpoint
        fetch(this.action, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    showNotification('Thank you for your message! I\'ll get back to you within 24 hours with a free quote.', 'success');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('There was an error sending your message. Please try again or email me directly.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .contact-method');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'Loading...';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 10000;
    }
`;
document.head.appendChild(loadingStyles);

// Add active state styles for navigation
const activeNavStyles = document.createElement('style');
activeNavStyles.textContent = `
    .nav-link.active {
        color: #2563eb;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeNavStyles);

// Portfolio Tab Functionality - Removed since we now have separate audience-based sections

// Initialize SPA - Set home section as active by default
document.addEventListener('DOMContentLoaded', function () {
    // Initialize theme system
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Ensure home section is visible on page load
    const homeSection = document.getElementById("home");
    if (homeSection) {
        homeSection.style.display = "block";
    }

    // Set home section as active
    showSection('home');

    // Add active class to home nav link
    const homeLink = document.querySelector('a[onclick="showSection(\'home\')"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});

// Theme System
let currentTheme = 'light';

function toggleThemeMenu() {
    const menu = document.getElementById('theme-menu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

function selectTheme(theme) {
    if (theme === 'custom') {
        openThemeModal();
    } else {
        setTheme(theme);
    }
    // Close the menu
    const menu = document.getElementById('theme-menu');
    if (menu) {
        menu.classList.remove('show');
    }
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update theme toggle button icon
    updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icons = toggle.querySelectorAll('i');
    icons.forEach((icon, index) => {
        icon.style.opacity = index === themeCycle.indexOf(currentTheme) ? '1' : '0';
    });
}

function openThemeModal() {
    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.style.display = 'block';
        // Load current custom colors if they exist
        const customColors = JSON.parse(localStorage.getItem('customTheme') || '{}');
        if (customColors.primary) {
            document.getElementById('primary-color').value = customColors.primary;
        }
        if (customColors.secondary) {
            document.getElementById('secondary-color').value = customColors.secondary;
        }
        updateCustomTheme();
    }
}

function closeThemeModal() {
    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateCustomTheme() {
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;

    // Update preview
    const previewHeader = document.querySelector('.preview-header');
    const previewButton = document.querySelector('.preview-button');

    if (previewHeader) {
        previewHeader.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
    }
    if (previewButton) {
        previewButton.style.background = primaryColor;
    }
}

function applyCustomTheme() {
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;
    
    console.log('Applying custom theme:', primaryColor, secondaryColor);
    
    // Calculate text colors for accessibility
    const primaryTextColor = getContrastColor(primaryColor);
    const secondaryTextColor = getContrastColor(secondaryColor);
    const bgColor = getBackgroundColor(primaryColor, secondaryColor);
    const textColor = getContrastColor(bgColor);
    
    console.log('Calculated colors:', { bgColor, textColor });
    
    // Set custom theme variables
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--bg-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--text-light', adjustColorOpacity(textColor, 0.7));
    document.documentElement.style.setProperty('--card-bg', adjustColorLightness(bgColor, 0.05));
    document.documentElement.style.setProperty('--border-color', adjustColorLightness(bgColor, 0.1));
    document.documentElement.style.setProperty('--hero-bg', `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`);
    
    // Save custom theme
    const customTheme = { primary: primaryColor, secondary: secondaryColor };
    localStorage.setItem('customTheme', JSON.stringify(customTheme));
    
    setTheme('custom');
    closeThemeModal();
    
    console.log('Custom theme applied successfully');
}

function resetCustomTheme() {
    document.getElementById('primary-color').value = '#2563eb';
    document.getElementById('secondary-color').value = '#7c3aed';
    updateCustomTheme();
}

// Utility functions for color calculations
function getContrastColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#1f2937' : '#f9fafb';
}

function getBackgroundColor(primary, secondary) {
    const primaryRgb = hexToRgb(primary);
    const secondaryRgb = hexToRgb(secondary);

    // Create a subtle background color
    const avgR = Math.round((primaryRgb.r + secondaryRgb.r) / 2);
    const avgG = Math.round((primaryRgb.g + secondaryRgb.g) / 2);
    const avgB = Math.round((primaryRgb.b + secondaryRgb.b) / 2);

    // Make it very light for background
    return `rgb(${Math.min(255, avgR + 200)}, ${Math.min(255, avgG + 200)}, ${Math.min(255, avgB + 200)})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function adjustColorOpacity(color, opacity) {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function adjustColorLightness(hex, factor) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const newR = Math.round(rgb.r + (255 - rgb.r) * factor);
    const newG = Math.round(rgb.g + (255 - rgb.g) * factor);
    const newB = Math.round(rgb.b + (255 - rgb.b) * factor);

    return `rgb(${newR}, ${newG}, ${newB})`;
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('theme-modal');
    const themeMenu = document.getElementById('theme-menu');
    const themeSelector = document.querySelector('.theme-selector');
    
    if (event.target === modal) {
        closeThemeModal();
    }
    
    // Close theme menu when clicking outside
    if (themeMenu && !themeSelector.contains(event.target)) {
        themeMenu.classList.remove('show');
    }
}

// Console welcome message
console.log(`
🚀 Welcome to Juan Contreras - Game Programmer & Web Developer!
   
   Built with:
   • HTML5 & CSS3
   • Vanilla JavaScript
   • Modern Design Principles
   • Responsive Layout
   • Game Development Focus
   • SPA Architecture
   • Advanced Theme System
   
   Ready to build amazing games and websites? Let's talk!
`);

// Add some fun easter eggs
let clickCount = 0;
document.querySelector('.nav-logo a').addEventListener('click', (e) => {
    e.preventDefault();
    clickCount++;

    if (clickCount === 5) {
        showNotification('🎉 You found the easter egg! Thanks for exploring!', 'success');
        clickCount = 0;
    }

    // Still navigate to home
    document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
        }, 0);
    });
}
