// Form Configuration for Production
// This file contains configuration for form handling in production

// Netlify Forms Configuration
const NETLIFY_FORMS_CONFIG = {
    contactForm: {
        name: "contact",
        method: "POST",
        netlify: true,
        action: "/"
    },
    appointmentForm: {
        name: "appointment", 
        method: "POST",
        netlify: true,
        action: "/"
    }
};

// Formspree Configuration (Alternative)
const FORMSPREE_CONFIG = {
    contactForm: {
        action: "https://formspree.io/f/YOUR_FORM_ID",
        method: "POST"
    },
    appointmentForm: {
        action: "https://formspree.io/f/YOUR_APPOINTMENT_FORM_ID", 
        method: "POST"
    }
};

// EmailJS Configuration (Alternative)
const EMAILJS_CONFIG = {
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID", 
    userId: "YOUR_USER_ID"
};

// Function to configure forms for production
function configureFormsForProduction(platform = 'netlify') {
    console.log(`Configuring forms for ${platform}...`);
    
    if (platform === 'netlify') {
        // Configure Netlify forms
        const contactForm = document.querySelector('form[name="contact"]');
        const appointmentForm = document.querySelector('form[name="appointment"]');
        
        if (contactForm) {
            contactForm.setAttribute('data-netlify', 'true');
            contactForm.setAttribute('method', 'POST');
            contactForm.setAttribute('action', '/');
        }
        
        if (appointmentForm) {
            appointmentForm.setAttribute('data-netlify', 'true');
            appointmentForm.setAttribute('method', 'POST');
            appointmentForm.setAttribute('action', '/');
        }
        
        console.log('✅ Netlify forms configured');
        
    } else if (platform === 'formspree') {
        // Configure Formspree forms
        const contactForm = document.querySelector('form[name="contact"]');
        const appointmentForm = document.querySelector('form[name="appointment"]');
        
        if (contactForm) {
            contactForm.setAttribute('action', FORMSPREE_CONFIG.contactForm.action);
            contactForm.setAttribute('method', 'POST');
        }
        
        if (appointmentForm) {
            appointmentForm.setAttribute('action', FORMSPREE_CONFIG.appointmentForm.action);
            appointmentForm.setAttribute('method', 'POST');
        }
        
        console.log('✅ Formspree forms configured');
        
    } else if (platform === 'emailjs') {
        // Configure EmailJS
        console.log('✅ EmailJS configuration ready');
        console.log('📧 Remember to configure EmailJS in your forms');
    }
}

// Function to add hidden fields for Netlify
function addNetlifyHiddenFields() {
    const forms = document.querySelectorAll('form[data-netlify="true"]');
    
    forms.forEach(form => {
        // Add hidden field for form name
        const formName = form.getAttribute('name');
        if (formName) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = 'form-name';
            hiddenField.value = formName;
            form.appendChild(hiddenField);
        }
        
        // Add honeypot field for spam protection
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'bot-field';
        honeypot.style.display = 'none';
        form.appendChild(honeypot);
    });
}

// Function to handle form submissions
function handleFormSubmission(form, platform = 'netlify') {
    form.addEventListener('submit', function(e) {
        if (platform === 'netlify') {
            // Netlify handles form submission automatically
            console.log('📤 Form submitted to Netlify');
        } else if (platform === 'formspree') {
            // Formspree handles form submission automatically
            console.log('📤 Form submitted to Formspree');
        } else if (platform === 'emailjs') {
            // Handle EmailJS submission
            e.preventDefault();
            console.log('📤 Form submitted via EmailJS');
            // Add EmailJS submission logic here
        }
    });
}

// Initialize form configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Auto-detect platform based on URL
    const isNetlify = window.location.hostname.includes('netlify.app');
    const isVercel = window.location.hostname.includes('vercel.app');
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isFirebase = window.location.hostname.includes('firebaseapp.com');
    
    let platform = 'netlify'; // Default
    
    if (isNetlify) {
        platform = 'netlify';
    } else if (isVercel) {
        platform = 'formspree'; // Vercel doesn't have built-in forms
    } else if (isGitHubPages) {
        platform = 'formspree'; // GitHub Pages doesn't have built-in forms
    } else if (isFirebase) {
        platform = 'formspree'; // Firebase doesn't have built-in forms
    }
    
    // Configure forms
    configureFormsForProduction(platform);
    
    if (platform === 'netlify') {
        addNetlifyHiddenFields();
    }
    
    // Setup form submission handlers
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        handleFormSubmission(form, platform);
    });
    
    console.log(`🚀 Forms configured for ${platform} platform`);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        configureFormsForProduction,
        addNetlifyHiddenFields,
        handleFormSubmission,
        NETLIFY_FORMS_CONFIG,
        FORMSPREE_CONFIG,
        EMAILJS_CONFIG
    };
}


