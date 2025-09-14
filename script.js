// SPA Section Management
function showSection(sectionId) {
    console.log('Switching to section:', sectionId);
    console.log('Current theme before switch:', currentTheme);
    console.log('Document data-theme before switch:', document.documentElement.getAttribute('data-theme'));
    
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
    
    console.log('Document data-theme after switch:', document.documentElement.getAttribute('data-theme'));
    console.log('Navbar background after switch:', window.getComputedStyle(document.querySelector('.navbar')).backgroundColor);

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
    const savedBaseTheme = localStorage.getItem('baseTheme') || 'light';
    const savedCustomColors = localStorage.getItem('customColors');

    // Set base theme
    baseTheme = savedBaseTheme;

    if (savedTheme === 'custom' && savedCustomColors) {
        // Restore custom colors
        customColors = JSON.parse(savedCustomColors);
        setTheme('custom');
    } else {
        // Set base theme
        setTheme(savedTheme);
    }

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
let baseTheme = 'light'; // 'light' or 'dark'
let customColors = null; // { primary: '#color', secondary: '#color' }

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
        // Set base theme (light or dark) but preserve custom colors if they exist
        baseTheme = theme;
        if (customColors) {
            // Keep custom colors and apply them to new base theme
            setTheme('custom');
        } else {
            // No custom colors, just set base theme
            setTheme(theme);
        }
    }
    // Close the menu
    const menu = document.getElementById('theme-menu');
    if (menu) {
        menu.classList.remove('show');
    }
}

function setTheme(theme) {
    currentTheme = theme;
    console.log('Setting theme:', theme, 'Base theme:', baseTheme);

    if (theme === 'custom') {
        // Apply custom colors to current base theme
        document.documentElement.setAttribute('data-theme', baseTheme);
        if (customColors) {
            applyCustomColors(customColors);
        }
    } else {
        // Set base theme and clear custom colors
        document.documentElement.setAttribute('data-theme', theme);
        customColors = null;
        // Clear any custom color overrides
        clearCustomColors();
    }

    console.log('Document data-theme attribute:', document.documentElement.getAttribute('data-theme'));
    console.log('Navbar background computed style:', window.getComputedStyle(document.querySelector('.navbar')).backgroundColor);

    // Save theme state
    localStorage.setItem('theme', theme);
    localStorage.setItem('baseTheme', baseTheme);
    if (customColors) {
        localStorage.setItem('customColors', JSON.stringify(customColors));
    } else {
        localStorage.removeItem('customColors');
    }

    // Update theme toggle button icon
    updateThemeToggleIcon();
}

function applyCustomColors(colors) {
    // Apply custom accent colors while keeping base theme
    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);

    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    document.documentElement.style.setProperty('--hero-bg', `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`);
}

function clearCustomColors() {
    // Remove custom color overrides to return to base theme colors
    document.documentElement.style.removeProperty('--primary-color');
    document.documentElement.style.removeProperty('--primary-color-rgb');
    document.documentElement.style.removeProperty('--secondary-color');
    document.documentElement.style.removeProperty('--secondary-color-rgb');
    document.documentElement.style.removeProperty('--hero-bg');
}

function updateThemeToggleIcon() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icons = toggle.querySelectorAll('i');
    let themeIndex;

    if (currentTheme === 'custom') {
        themeIndex = 2; // Palette icon for custom colors
    } else {
        themeIndex = baseTheme === 'light' ? 0 : 1; // Sun or moon based on base theme
    }

    icons.forEach((icon, index) => {
        icon.style.opacity = index === themeIndex ? '1' : '0';
    });
}

function openThemeModal() {
    const menu = document.getElementById('theme-menu');
    if (menu) {
        menu.classList.remove('show');
    }

    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.style.display = 'block';
        // Load current custom colors if they exist
        if (customColors) {
            document.getElementById('primary-color').value = customColors.primary;
            document.getElementById('secondary-color').value = customColors.secondary;
        } else {
            // Use default colors based on current base theme
            const defaultColors = baseTheme === 'dark'
                ? { primary: '#3b82f6', secondary: '#8b5cf6' }
                : { primary: '#2563eb', secondary: '#7c3aed' };
            document.getElementById('primary-color').value = defaultColors.primary;
            document.getElementById('secondary-color').value = defaultColors.secondary;
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

    console.log('Applying custom colors:', primaryColor, secondaryColor);
    console.log('Base theme:', baseTheme);

    // Store custom colors
    customColors = {
        primary: primaryColor,
        secondary: secondaryColor
    };

    // Apply custom colors to current base theme
    applyCustomColors(customColors);

    // Set theme to custom
    currentTheme = 'custom';
    document.documentElement.setAttribute('data-theme', baseTheme);

    // Save theme state
    localStorage.setItem('theme', 'custom');
    localStorage.setItem('baseTheme', baseTheme);
    localStorage.setItem('customColors', JSON.stringify(customColors));

    // Update UI
    updateThemeToggleIcon();
    closeThemeModal();

    console.log('Custom colors applied successfully');
}

function resetCustomTheme() {
    document.getElementById('primary-color').value = '#2563eb';
    document.getElementById('secondary-color').value = '#7c3aed';
    updateCustomTheme();
}

// Utility functions for color calculations
function getContrastColor(color) {
    let rgb;

    // Handle both hex and RGB color formats
    if (color.startsWith('rgb(')) {
        // Parse RGB string like "rgb(255, 255, 255)"
        const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (matches) {
            rgb = {
                r: parseInt(matches[1]),
                g: parseInt(matches[2]),
                b: parseInt(matches[3])
            };
        }
    } else {
        // Handle hex color
        rgb = hexToRgb(color);
    }

    if (!rgb) {
        console.error('Invalid color format:', color);
        return '#1f2937'; // Default to dark text
    }

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#1f2937' : '#f9fafb';
}

function getBackgroundColor(primary, secondary) {
    const primaryRgb = hexToRgb(primary);
    const secondaryRgb = hexToRgb(secondary);

    if (!primaryRgb || !secondaryRgb) {
        console.error('Invalid hex colors:', primary, secondary);
        return '#ffffff'; // Default to white background
    }

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
