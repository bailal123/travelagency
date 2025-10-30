// ===== GLOBAL VARIABLES =====
let currentStep = 1;
const totalSteps = 4;
let isSubmitting = false;
let countdownInterval;
let testimonialInterval;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
    initializeCountdown();
    initializeFAQ();
    initializeTestimonials();
    initializeForm();
    initializeScrollEffects();
    initializeFloatingElements();
    initializeSocialProof();
    setupAnalytics();
});

// ===== SOCIAL PROOF & URGENCY ELEMENTS =====
function initializeSocialProof() {
    // Live visitor counter
    initializeVisitorCounter();
    
    // Recent activity notifications
    initializeActivityNotifications();
    
    // Limited time offers
    initializeLimitedOffers();
}

function initializeVisitorCounter() {
    const visitorCounter = document.getElementById('visitorCounter');
    if (visitorCounter) {
        let baseVisitors = 1247;
        
        function updateVisitors() {
            // Simulate realistic visitor fluctuations
            const fluctuation = Math.floor(Math.random() * 20) - 10; // -10 to +10
            const currentVisitors = Math.max(1200, baseVisitors + fluctuation);
            visitorCounter.textContent = currentVisitors.toLocaleString('ar-SA');
        }
        
        updateVisitors();
        setInterval(updateVisitors, 8000); // Update every 8 seconds
    }
}

function initializeActivityNotifications() {
    const activities = [
        "أحمد من دبي حجز موعد للتو",
        "سارة من أبوظبي أكملت طلبها",
        "محمد من الشارقة يشاهد الصفحة الآن",
        "فاطمة من دبي حجزت موعد VIP",
        "خالد من أبوظبي أضاف تأمين السفر"
    ];
    
    let activityIndex = 0;
    const activityElement = document.getElementById('recentActivity');
    
    if (activityElement) {
        function showActivity() {
            activityElement.style.opacity = '0';
            activityElement.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                activityElement.textContent = activities[activityIndex];
                activityElement.style.opacity = '1';
                activityElement.style.transform = 'translateY(0)';
                
                activityIndex = (activityIndex + 1) % activities.length;
            }, 300);
        }
        
        showActivity();
        setInterval(showActivity, 12000); // Show new activity every 12 seconds
    }
}

function initializeLimitedOffers() {
    // Update available slots counter
    const slotsCounter = document.getElementById('availableSlots');
    if (slotsCounter) {
        let availableSlots = 12;
        
        function updateSlots() {
            if (availableSlots > 0) {
                availableSlots = Math.max(1, availableSlots - Math.floor(Math.random() * 2));
                slotsCounter.textContent = availableSlots;
            }
        }
        
        setInterval(updateSlots, 30000); // Decrease slots every 30 seconds
    }
}

// ===== COUNTER ANIMATIONS =====
function initializeCounters() {
    // عداد العملاء المتزايد
    const customerCounter = document.getElementById('counter');
    if (customerCounter) {
        let currentCount = 1247;
        setInterval(() => {
            currentCount += Math.floor(Math.random() * 3) + 1;
            customerCounter.textContent = currentCount.toLocaleString('ar-SA');
        }, 8000);
    }

    // عدادات الإحصائيات
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const increment = target / 50;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current).toLocaleString('ar-SA') + '+';
        } else {
            element.textContent = Math.floor(current).toLocaleString('ar-SA');
        }
    }, 30);
}

// ===== COUNTDOWN TIMER =====
function initializeCountdown() {
    const endTime = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 hours from now
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.querySelector('#hours').textContent = String(hours).padStart(2, '0');
            document.querySelector('#minutes').textContent = String(minutes).padStart(2, '0');
            document.querySelector('#seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            // Reset timer when it reaches zero
            initializeCountdown();
        }
    }
    
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ===== FAQ INTERACTIONS =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== TESTIMONIALS MANAGEMENT =====
function initializeTestimonials() {
    const testimonials = [
        {
            name: "أحمد المحمدي",
            location: "الرياض",
            text: "خدمة ممتازة وسريعة، حصلت على التأشيرة في 3 أيام فقط!",
            time: "منذ 3 دقائق"
        },
        {
            name: "فاطمة الزهراني",
            location: "جدة",
            text: "فريق محترف جداً، ساعدوني في كل خطوة",
            time: "منذ 7 دقائق"
        },
        {
            name: "محمد البلوي",
            location: "الدمام",
            text: "أسعار منافسة وخدمة عملاء رائعة",
            time: "منذ 12 دقيقة"
        },
        {
            name: "نورا العتيبي",
            location: "الطائف",
            text: "تجربة سهلة وبسيطة، أنصح بها بشدة",
            time: "منذ 18 دقيقة"
        }
    ];
    
    let currentIndex = 0;
    const feedContainer = document.querySelector('.live-testimonials-feed');
    
    function addTestimonial() {
        const testimonial = testimonials[currentIndex];
        const testimonialElement = document.createElement('div');
        testimonialElement.className = 'live-testimonial';
        testimonialElement.innerHTML = `
            <span class="customer-name">${testimonial.name}</span>
            <span class="testimonial-text">${testimonial.text} - ${testimonial.location}</span>
            <span class="time-ago">${testimonial.time}</span>
        `;
        
        if (feedContainer.children.length >= 4) {
            feedContainer.removeChild(feedContainer.lastChild);
        }
        
        feedContainer.insertBefore(testimonialElement, feedContainer.firstChild);
        currentIndex = (currentIndex + 1) % testimonials.length;
    }
    
    // Add initial testimonials
    for (let i = 0; i < 3; i++) {
        addTestimonial();
    }
    
    // Add new testimonial every 15 seconds
    testimonialInterval = setInterval(addTestimonial, 15000);
}

// ===== MULTI-STEP FORM =====
function initializeForm() {
    updateProgressBar();
    setupFormValidation();
    setupStepNavigation();
}

function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
    document.querySelector('.progress-text').textContent = `الخطوة ${currentStep} من ${totalSteps}`;
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    const targetStep = document.querySelector(`#step${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    currentStep = step;
    updateProgressBar();
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-step-btn');
    const nextBtn = document.querySelector('.next-step-btn');
    
    if (prevBtn) {
        prevBtn.style.display = step === 1 ? 'none' : 'flex';
    }
    
    if (nextBtn && step === totalSteps) {
        nextBtn.style.display = 'none';
    }
}

function setupStepNavigation() {
    const nextBtn = document.querySelector('.next-step-btn');
    const prevBtn = document.querySelector('.prev-step-btn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep < totalSteps) {
                    showStep(currentStep + 1);
                }
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`#step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'هذا الحقل مطلوب');
            isValid = false;
        } else {
            clearFieldError(field);
            
            // Additional validation for specific fields
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
                isValid = false;
            }
            
            if (field.type === 'tel' && !isValidPhone(field.value)) {
                showFieldError(field, 'يرجى إدخال رقم هاتف صحيح');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'هذا الحقل مطلوب');
        return false;
    }
    
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
        return false;
    }
    
    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        showFieldError(field, 'يرجى إدخال رقم هاتف صحيح');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    const feedback = field.parentNode.querySelector('.input-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = 'input-feedback error';
    }
    field.style.borderColor = 'var(--danger-red)';
}

function clearFieldError(field) {
    const feedback = field.parentNode.querySelector('.input-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'input-feedback';
    }
    field.style.borderColor = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\+]?[0-9\-\(\)\s]{8,}$/.test(phone);
}

// ===== FORM SUBMISSION =====
function submitForm() {
    if (isSubmitting) return;
    
    const form = document.getElementById('advancedBookingForm');
    const formData = new FormData(form);
    
    // Validate final step
    if (!validateCurrentStep()) {
        return;
    }
    
    // Check terms agreement
    const termsCheckbox = document.getElementById('agreeTerms');
    if (!termsCheckbox.checked) {
        alert('يرجى الموافقة على الشروط والأحكام');
        return;
    }
    
    isSubmitting = true;
    showLoadingOverlay();
    
    // Simulate form submission
    setTimeout(() => {
        hideLoadingOverlay();
        showSuccessModal();
        isSubmitting = false;
        
        // Track conversion
        trackConversion(formData);
        
        // Reset form
        form.reset();
        showStep(1);
    }, 2000);
}

function showLoadingOverlay() {
    document.querySelector('.loading-overlay').classList.add('show');
}

function hideLoadingOverlay() {
    document.querySelector('.loading-overlay').classList.remove('show');
}

function showSuccessModal() {
    document.querySelector('.success-modal').classList.add('show');
}

function hideSuccessModal() {
    document.querySelector('.success-modal').classList.remove('show');
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Parallax effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== FLOATING ELEMENTS =====
function initializeFloatingElements() {
    // WhatsApp and Call buttons
    const whatsappBtn = document.querySelector('.whatsapp-float');
    const callBtn = document.querySelector('.call-float');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const message = encodeURIComponent('مرحباً، أرغب في الاستفسار عن خدمات التأشيرات');
            window.open(`https://wa.me/966123456789?text=${message}`, '_blank');
            
            // Track WhatsApp click
            trackEvent('WhatsApp', 'Click', 'Float Button');
        });
    }
    
    if (callBtn) {
        callBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'tel:+966123456789';
            
            // Track call click
            trackEvent('Phone', 'Click', 'Float Button');
        });
    }
}

// ===== ANALYTICS & TRACKING =====
function setupAnalytics() {
    // Track page view
    trackPageView();
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > maxScroll) {
            maxScroll = Math.floor(scrollPercent / 25) * 25; // Track in 25% increments
            if (maxScroll > 0 && maxScroll <= 100) {
                trackEvent('Scroll', 'Depth', `${maxScroll}%`);
            }
        }
    });
}

function trackPageView() {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'Arabic Landing Page - Visa Services',
            page_location: window.location.href
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
    }
}

function trackEvent(category, action, label) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_category: category,
            content_name: label
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function for performance
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

// Throttle function for performance
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
    }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Parallax effect for hero background (if needed)
    const heroBg = document.querySelector('.hero-background img');
    if (heroBg) {
        heroBg.style.transform = `translate3d(0, ${rate}px, 0)`;
    }

    // Back to top button visibility
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (scrolled > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}, 16); // ~60fps

// Intersection Observer for animations (more performant than scroll events)
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    document.querySelectorAll('.benefit-card, .testimonial-card, .faq-item').forEach(card => {
        observer.observe(card);
    });
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload hero image
    const heroImage = new Image();
    heroImage.src = 'images/visa-hero.jpg';

    // Preload important scripts
    const aosScript = document.createElement('link');
    aosScript.rel = 'preload';
    aosScript.href = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    aosScript.as = 'script';
    document.head.appendChild(aosScript);
}

// Initialize performance optimizations
function initializePerformanceOptimizations() {
    preloadCriticalResources();
    initializeIntersectionObserver();
    
    // Use optimized scroll handler
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializePerformanceOptimizations);

// ===== CONVERSION TRACKING =====
function trackConversion(formData) {
    const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        notes: formData.get('notes'),
        timestamp: new Date().toISOString(),
        source: 'landing_page',
        value: 1,
        currency: 'SAR',
        event_category: 'Form',
        event_label: 'Booking Submitted'
    };
    
    // Google Analytics Conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            send_to: 'GA_MEASUREMENT_ID/CONVERSION_ID',
            value: 1,
            currency: 'SAR',
            event_category: 'Form',
            event_label: 'Booking Submitted'
        });
    }
    
    // Facebook Pixel Conversion
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', customerData);
    }
    
    // Send data to backend (if available)
    sendToBackend(customerData);
}

function sendToBackend(data) {
    // This would be replaced with actual backend endpoint
    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Form submitted successfully:', result);
    })
    .catch(error => {
        console.error('Form submission error:', error);
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener('click', function(e) {
    // Modal close functionality
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-modal')) {
        hideSuccessModal();
    }
    
    // Final form submission
    if (e.target.classList.contains('submit-final-btn')) {
        e.preventDefault();
        submitForm();
    }
    
    // CTA buttons tracking
    if (e.target.classList.contains('btn-primary')) {
        trackEvent('CTA', 'Click', e.target.textContent.trim());
    }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideSuccessModal();
    }
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', function() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (testimonialInterval) clearInterval(testimonialInterval);
});