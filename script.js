// ===== GLOBAL VARIABLES =====
let isLoading = false;
let scrollTimeout;

// ===== DOM ELEMENTS =====
const navbar = document.querySelector('.navbar');
const backToTopBtn = document.getElementById('backToTop');
const loadingSpinner = document.getElementById('loadingSpinner');
const bookingForm = document.getElementById('bookingForm');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavbar();
    initializeScrollAnimations();
    initializeFormHandling();
    initializeBackToTop();
    initializeSmoothScrolling();
    initializeLoadingStates();
    initializeAnimationsOnScroll();
    
    // Set minimum date for travel date input
    setMinimumTravelDate();
    
    console.log('Odit International Landing Page Initialized Successfully');
}

// ===== NAVBAR FUNCTIONALITY =====
function initializeNavbar() {
    if (!navbar) return;
    
    // Handle navbar scroll effect
    window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
    
    // Handle mobile menu
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
}

function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Add staggered animation for country items
            if (entry.target.classList.contains('country-item')) {
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.animationDelay = `${delay}ms`;
            }
            
            // Add staggered animation for service cards
            if (entry.target.classList.contains('service-card')) {
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target.parentNode) * 200;
                entry.target.style.animationDelay = `${delay}ms`;
            }
        }
    });
}

// ===== FORM HANDLING =====
function initializeFormHandling() {
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation
    const formInputs = bookingForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Auto-format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Set minimum date for travel date
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        const today = new Date();
        const minDate = new Date(today.setDate(today.getDate() + 7)); // Minimum 7 days from now
        travelDateInput.min = minDate.toISOString().split('T')[0];
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    // Validate form
    if (!validateForm()) {
        showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
        return;
    }
    
    // Show loading state
    showLoading(true);
    
    // Collect form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate API call
    setTimeout(() => {
        submitFormData(data);
    }, 2000);
}

function submitFormData(data) {
    try {
        // Prepare data for submission
        const submissionData = {
            ...data,
            timestamp: new Date().toISOString(),
            source: 'landing_page',
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        };
        
        console.log('Form submitted:', submissionData);
        
        // Here you would typically send data to your server
        // fetch('/api/submit-booking', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(submissionData)
        // });
        
        // Simulate successful submission
        showLoading(false);
        showSuccessMessage();
        resetForm();
        
        // Track conversion (Google Analytics, Facebook Pixel, etc.)
        trackConversion('booking_submitted', submissionData);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showLoading(false);
        showNotification('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.', 'error');
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = bookingForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'هذا الحقل مطلوب';
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'يرجى إدخال عنوان بريد إلكتروني صحيح';
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'يرجى إدخال رقم هاتف صحيح';
            isValid = false;
        }
    }
    
    // Date validation
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 7);
        
        if (selectedDate < minDate) {
            errorMessage = 'يجب أن يكون تاريخ السفر خلال أسبوع على الأقل من الآن';
            isValid = false;
        }
    }
    
    // Show error if validation failed
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('971')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+971' + value.substring(1);
    } else if (value.length > 0 && !value.startsWith('+')) {
        value = '+971' + value;
    }
    
    e.target.value = value;
}

function setMinimumTravelDate() {
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 7); // Minimum 7 days from now
        travelDateInput.min = today.toISOString().split('T')[0];
    }
}

// ===== LOADING STATES =====
function initializeLoadingStates() {
    // Hide loading spinner on page load
    showLoading(false);
}

function showLoading(show) {
    isLoading = show;
    
    if (loadingSpinner) {
        if (show) {
            loadingSpinner.classList.add('show');
        } else {
            loadingSpinner.classList.remove('show');
        }
    }
    
    // Disable/enable form during loading
    if (bookingForm) {
        const formElements = bookingForm.querySelectorAll('input, select, textarea, button');
        formElements.forEach(element => {
            element.disabled = show;
        });
    }
}

// ===== BACK TO TOP FUNCTIONALITY =====
function initializeBackToTop() {
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', throttle(handleBackToTopVisibility, 100));
    backToTopBtn.addEventListener('click', scrollToTop);
}

function handleBackToTopVisibility() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
}

function handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== ANIMATIONS ON SCROLL =====
function initializeAnimationsOnScroll() {
    // Add animation classes to elements as they come into view
    const animationElements = document.querySelectorAll('.hero-title, .hero-buttons, .contact-info');
    
    animationElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-family: 'Cairo', sans-serif;
        direction: rtl;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#00B894',
        'error': '#E17055',
        'warning': '#FDCB6E',
        'info': '#74B9FF'
    };
    return colors[type] || '#74B9FF';
}

function showSuccessMessage() {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>تم إرسال طلبك بنجاح!</h3>
            <p>شكراً لك، سنتواصل معك خلال 12 ساعة لتأكيد موعدك.</p>
            <div class="success-actions">
                <button onclick="this.closest('.success-modal').remove()" class="btn btn-primary">
                    ممتاز
                </button>
                <a href="https://wa.me/971544785539" class="btn btn-outline-primary" target="_blank">
                    <i class="fab fa-whatsapp me-2"></i>
                    تواصل عبر واتساب
                </a>
            </div>
        </div>
        <div class="success-modal-overlay" onclick="this.parentElement.remove()"></div>
    `;
    
    // Add styles
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(successModal);
}

function resetForm() {
    if (bookingForm) {
        bookingForm.reset();
        
        // Clear any error states
        const errorElements = bookingForm.querySelectorAll('.is-invalid, .invalid-feedback');
        errorElements.forEach(element => {
            if (element.classList.contains('invalid-feedback')) {
                element.remove();
            } else {
                element.classList.remove('is-invalid');
            }
        });
        
        // Reset minimum date
        setMinimumTravelDate();
    }
}

// ===== ANALYTICS & TRACKING =====
function trackConversion(eventName, data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'form',
            event_label: 'booking_form',
            value: 1,
            custom_parameters: data
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Schengen Visa Booking',
            content_category: 'visa_services',
            value: 1,
            currency: 'AED'
        });
    }
    
    // Custom tracking
    console.log('Conversion tracked:', eventName, data);
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== COUNTRY FLAGS LOADING =====
function optimizeCountryFlags() {
    const countryFlags = document.querySelectorAll('.country-flag img');
    
    countryFlags.forEach(img => {
        img.loading = 'lazy';
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik00MCAyMEM0Ni42Mjc0IDIwIDUyIDI1LjM3MjYgNTIgMzJDNTIgMzguNjI3NCA0Ni42Mjc0IDQ0IDQwIDQ0QzMzLjM3MjYgNDQgMjggMzguNjI3NCAyOCAzMkMyOCAyNS4zNzI2IDMzLjM3MjYgMjAgNDAgMjBaIiBmaWxsPSIjRDFEMUQxIi8+Cjwvc3ZnPgo=';
        });
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function initializePerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Optimize country flags
    optimizeCountryFlags();
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Add ARIA labels where needed
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Ensure form labels are properly associated
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label) {
                const labelText = input.getAttribute('placeholder') || input.getAttribute('aria-label');
                if (labelText) {
                    input.setAttribute('aria-label', labelText);
                }
            }
        }
    });
    
    // Add keyboard navigation for custom elements
    const customButtons = document.querySelectorAll('.whatsapp-float, .back-to-top');
    customButtons.forEach(button => {
        button.setAttribute('tabindex', '0');
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Log error to analytics or error reporting service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Log error to analytics or error reporting service
});

// ===== INITIALIZATION CALLS =====
document.addEventListener('DOMContentLoaded', function() {
    initializePerformanceOptimizations();
    initializeAccessibility();
});

// ===== ADD REQUIRED CSS FOR NOTIFICATIONS =====
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-right: auto;
    }
    
    .success-modal {
        font-family: 'Cairo', sans-serif;
        direction: rtl;
    }
    
    .success-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
    }
    
    .success-modal-content {
        background: white;
        padding: 3rem;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }
    
    .success-icon {
        font-size: 4rem;
        color: #00B894;
        margin-bottom: 1rem;
    }
    
    .success-modal-content h3 {
        color: #2D3436;
        margin-bottom: 1rem;
    }
    
    .success-modal-content p {
        color: #6C757D;
        margin-bottom: 2rem;
        line-height: 1.6;
    }
    
    .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .success-actions .btn {
        min-width: 120px;
    }
`;

document.head.appendChild(notificationStyles);