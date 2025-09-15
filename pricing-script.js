// Pricing Comparison Page JavaScript
// Simplified version without SPA functionality

// Theme System Variables
let currentTheme = 'light';
let baseTheme = 'light';
let customColors = null;

// Theme Functions
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
        baseTheme = theme;
        if (customColors) {
            setTheme('custom');
        } else {
            setTheme(theme);
        }
    }
    
    // Close menu
    const menu = document.getElementById('theme-menu');
    if (menu) {
        menu.classList.remove('show');
    }
}

function setTheme(theme) {
    currentTheme = theme;

    if (theme === 'custom') {
        document.documentElement.setAttribute('data-theme', baseTheme);
        if (customColors) {
            applyCustomColors(customColors);
        }
    } else {
        document.documentElement.setAttribute('data-theme', theme);
        customColors = null;
        clearCustomColors();
    }

    // Save theme state
    localStorage.setItem('theme', theme);
    localStorage.setItem('baseTheme', baseTheme);
    if (customColors) {
        localStorage.setItem('customColors', JSON.stringify(customColors));
    } else {
        localStorage.removeItem('customColors');
    }

    updateThemeToggleIcon();
}

function applyCustomColors(colors) {
    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);

    if (primaryRgb && secondaryRgb) {
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
        document.documentElement.style.setProperty('--hero-bg', `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`);
    }
}

function clearCustomColors() {
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
    icons.forEach(icon => icon.style.display = 'none');

    if (currentTheme === 'custom') {
        icons[2].style.display = 'block'; // Palette icon
    } else if (baseTheme === 'dark') {
        icons[1].style.display = 'block'; // Moon icon
    } else {
        icons[0].style.display = 'block'; // Sun icon
    }
}

// Custom Theme Modal Functions
function openThemeModal() {
    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Load current custom colors or defaults
        if (customColors) {
            document.getElementById('primary-color').value = customColors.primary;
            document.getElementById('secondary-color').value = customColors.secondary;
        } else {
            // Set defaults based on current base theme
            const defaults = baseTheme === 'dark' 
                ? { primary: '#3b82f6', secondary: '#8b5cf6' }
                : { primary: '#2563eb', secondary: '#7c3aed' };
            
            document.getElementById('primary-color').value = defaults.primary;
            document.getElementById('secondary-color').value = defaults.secondary;
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
    
    customColors = { primary: primaryColor, secondary: secondaryColor };
    
    // Apply colors directly to document
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);
    
    if (primaryRgb && secondaryRgb) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
        document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
        document.documentElement.style.setProperty('--hero-bg', `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`);
    }
    
    // Save to localStorage
    localStorage.setItem('customColors', JSON.stringify(customColors));
    localStorage.setItem('theme', 'custom');
    localStorage.setItem('baseTheme', baseTheme);
    
    currentTheme = 'custom';
    document.documentElement.setAttribute('data-theme', baseTheme);
    
    updateThemeToggleIcon();
    closeThemeModal();
}

function resetCustomTheme() {
    const defaults = baseTheme === 'dark' 
        ? { primary: '#3b82f6', secondary: '#8b5cf6' }
        : { primary: '#2563eb', secondary: '#7c3aed' };
    
    document.getElementById('primary-color').value = defaults.primary;
    document.getElementById('secondary-color').value = defaults.secondary;
    updateCustomTheme();
}

// Utility Functions
function hexToRgb(hex) {
    if (!hex) return null;
    
    // Handle RGB strings
    if (hex.startsWith('rgb(')) {
        const matches = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (matches) {
            return {
                r: parseInt(matches[1]),
                g: parseInt(matches[2]),
                b: parseInt(matches[3])
            };
        }
    }
    
    // Handle hex colors
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
}));

// Close modal and theme menu when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('theme-modal');
    const themeMenu = document.getElementById('theme-menu');
    
    if (event.target === modal) {
        closeThemeModal();
    }
    
    if (themeMenu && !event.target.closest('.theme-selector')) {
        themeMenu.classList.remove('show');
    }
}

// Initialize theme system on page load
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

    // Console welcome message
    console.log('🚀 Welcome to Juan Contreras - Pricing Comparison Page!');
    console.log('Built with:');
    console.log('• HTML5 & CSS3');
    console.log('• Vanilla JavaScript');
    console.log('• Modern Design Principles');
    console.log('• Responsive Layout');
    console.log('• Advanced Theme System');
    console.log('Ready to build amazing websites? Let\'s talk!');
});

// Performance logging
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
    }, 0);
});
