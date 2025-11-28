/**
 * Frontend Scaffold - Main Application JavaScript
 * 
 * This file handles:
 * - Page navigation (hash-based routing)
 * - Application initialization
 * - Backend integration hooks (placeholders)
 * - Form handling
 */

// ========================================
// Configuration
// ========================================

const APP_CONFIG = {
    // Update this with your backend API URL
    backendUrl: 'https://your-backend-api.com',
    
    // Default page
    defaultPage: 'home',
    
    // Available pages
    pages: {
        home: 'index.html',
        features: 'features.html',
        about: 'about.html',
        contact: 'contact.html'
    }
};

// ========================================
// Navigation System
// ========================================

/**
 * Navigate to a different page
 * @param {string} page - The page identifier (home, features, about, contact)
 */
function navigateTo(page) {
    if (APP_CONFIG.pages[page]) {
        window.location.hash = page;
    } else {
        console.warn(`Page "${page}" not found. Redirecting to home.`);
        window.location.hash = APP_CONFIG.defaultPage;
    }
}

/**
 * Handle hash change events for navigation
 */
function handleNavigation() {
    let hash = window.location.hash.slice(1);
    
    // Default to home if no hash
    if (!hash) {
        hash = APP_CONFIG.defaultPage;
    }
    
    // Check if page exists
    if (!APP_CONFIG.pages[hash]) {
        hash = APP_CONFIG.defaultPage;
    }
    
    // Update active navigation link
    updateActiveNavLink(hash);
    
    // Load the appropriate page
    if (window.location.pathname.includes(APP_CONFIG.pages[hash])) {
        // Already on the correct page
        return;
    } else {
        // Navigate to the correct HTML file
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(/[^/]+\.html$/, APP_CONFIG.pages[hash]);
        if (newPath !== currentPath) {
            window.location.href = newPath + window.location.hash;
        }
    }
    
    // Trigger navigation event (can be used for analytics, etc.)
    onNavigate(hash);
}

/**
 * Update active state on navigation links
 * @param {string} activePage - The currently active page
 */
function updateActiveNavLink(activePage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activePage}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========================================
// Backend Integration Hooks
// ========================================

/**
 * Placeholder for backend initialization
 * Use this to set up authentication, load user data, etc.
 */
async function onInit() {
    console.log('🚀 Application initialized');
    
    // Example: Check authentication status
    // const isAuthenticated = await checkAuthStatus();
    // if (!isAuthenticated) {
    //     navigateTo('login');
    // }
    
    // Example: Load initial data
    // const userData = await fetchFromBackend('/api/user');
    // console.log('User data:', userData);
}

/**
 * Placeholder for navigation event handling
 * Use this for analytics, logging, or page-specific setup
 * @param {string} page - The page being navigated to
 */
function onNavigate(page) {
    console.log(`📍 Navigated to: ${page}`);
    
    // Example: Send analytics event
    // sendAnalyticsEvent('page_view', { page });
    
    // Example: Load page-specific data
    // if (page === 'dashboard') {
    //     loadDashboardData();
    // }
}

/**
 * Placeholder for fetching data from your backend
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Response data
 */
async function fetchFromBackend(endpoint, options = {}) {
    const url = `${APP_CONFIG.backendUrl}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
                // Add authentication headers here
                // 'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Backend fetch error:', error);
        throw error;
    }
}

/**
 * Example: Get authentication token from storage
 * @returns {string|null} Authentication token
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Example: Set authentication token
 * @param {string} token - Authentication token
 */
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

/**
 * Example: Clear authentication token
 */
function clearAuthToken() {
    localStorage.removeItem('authToken');
}

// ========================================
// Form Handling
// ========================================

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };
    
    console.log('📧 Contact form submitted:', formData);
    
    try {
        // Example: Send to backend
        // const response = await fetchFromBackend('/api/contact', {
        //     method: 'POST',
        //     body: JSON.stringify(formData)
        // });
        
        // Simulate success
        alert('Message sent successfully! (This is a placeholder - connect to your backend)');
        form.reset();
    } catch (error) {
        alert('Failed to send message. Please try again.');
        console.error('Form submission error:', error);
    }
}

// ========================================
// Utility Functions
// ========================================

/**
 * Format a date string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Debounce function for limiting function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Event Listeners
// ========================================

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Frontend Scaffold loaded');
    
    // Initialize application
    onInit();
    
    // Handle initial navigation
    handleNavigation();
    
    // Set up contact form handler if on contact page
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
});

// Handle hash changes for navigation
window.addEventListener('hashchange', handleNavigation);

// ========================================
// Export functions for global access
// ========================================

// Make functions available globally
window.navigateTo = navigateTo;
window.fetchFromBackend = fetchFromBackend;
window.getAuthToken = getAuthToken;
window.setAuthToken = setAuthToken;
window.clearAuthToken = clearAuthToken;

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateTo,
        fetchFromBackend,
        getAuthToken,
        setAuthToken,
        clearAuthToken,
        onInit,
        onNavigate
    };
}
