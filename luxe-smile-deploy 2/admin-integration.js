// Admin Integration Script
// This script connects the admin panel with the main site

let siteData = {};

// Initialize admin integration
document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
    updateSiteContent();
    showAdminAccess();
});

// Load site data from localStorage
function loadSiteData() {
    const savedData = localStorage.getItem('siteData');
    if (savedData) {
        siteData = JSON.parse(savedData);
        console.log('Site data loaded from admin panel');
    } else {
        console.log('No admin data found, using default content');
    }
}

// Update site content with admin data
function updateSiteContent() {
    if (!siteData || Object.keys(siteData).length === 0) {
        return; // Use default content if no admin data
    }

    // Update Hero Section
    if (siteData.hero) {
        updateHeroSection();
    }

    // Update Doctors Section
    if (siteData.doctors) {
        updateDoctorsSection();
    }

    // Update Services Section
    if (siteData.services) {
        updateServicesSection();
    }

    // Update Testimonials Section
    if (siteData.testimonials) {
        updateTestimonialsSection();
    }

    // Update Gallery Section
    if (siteData.gallery) {
        updateGallerySection();
    }

    // Update Contact Section
    if (siteData.contact) {
        updateContactSection();
    }

    // Update Site Settings
    if (siteData.settings) {
        updateSiteSettings();
    }
}

// Update Hero Section
function updateHeroSection() {
    const hero = siteData.hero;
    
    // Update title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && hero.title) {
        heroTitle.textContent = hero.title;
    }

    // Update subtitle
    const heroSubtitle = document.querySelector('.hero h2');
    if (heroSubtitle && hero.subtitle) {
        heroSubtitle.textContent = hero.subtitle;
    }

    // Update features
    const heroFeatures = document.querySelector('.hero-features');
    if (heroFeatures && hero.features) {
        heroFeatures.innerHTML = '';
        hero.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            heroFeatures.appendChild(li);
        });
    }
}

// Update Doctors Section
function updateDoctorsSection() {
    const doctors = siteData.doctors;
    const doctorsContainer = document.getElementById('doctors-container');
    
    if (!doctorsContainer || !doctors) return;
    
    // Clear existing doctors
    doctorsContainer.innerHTML = '';
    
    // Create doctor cards dynamically
    doctors.forEach((doctor, index) => {
        const doctorCardHTML = `
            <div class="doctor-card">
                <div class="doctor-image">
                    <img src="${doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face'}" alt="${doctor.name}">
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name || 'Doctor'}</h3>
                    <p class="specialty">${doctor.specialty || 'Especialidad'}</p>
                    <div class="experience">
                        <span class="experience-label">Años de experiencia</span>
                        <span class="experience-number">+${doctor.experience || 0}</span>
                    </div>
                    <a href="#" class="btn-outline">Ver Presentación</a>
                </div>
            </div>
        `;
        
        doctorsContainer.insertAdjacentHTML('beforeend', doctorCardHTML);
    });
}

// Update Services Section
function updateServicesSection() {
    const services = siteData.services;
    
    services.forEach((service, index) => {
        const serviceCard = document.querySelectorAll('.service-card')[index];
        if (serviceCard) {
            // Update title
            const titleElement = serviceCard.querySelector('h3');
            if (titleElement && service.title) {
                titleElement.textContent = service.title;
            }

            // Update description
            const descriptionElement = serviceCard.querySelector('.service-content p');
            if (descriptionElement && service.description) {
                descriptionElement.innerHTML = service.description;
            }

            // Update features
            const featuresElement = serviceCard.querySelector('.service-features');
            if (featuresElement && service.features) {
                featuresElement.innerHTML = '';
                service.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresElement.appendChild(li);
                });
            }

            // Update price
            const priceElement = serviceCard.querySelector('.price');
            if (priceElement && service.price) {
                priceElement.innerHTML = `<strong>Precios:</strong> ${service.price}`;
            }

            // Update video thumbnail
            const videoElement = serviceCard.querySelector('.service-video');
            if (videoElement && service.thumbnail) {
                videoElement.style.backgroundImage = `url(${service.thumbnail})`;
            }
        }
    });
}

// Update Testimonials Section
function updateTestimonialsSection() {
    const testimonials = siteData.testimonials;
    
    testimonials.forEach((testimonial, index) => {
        const testimonialVideo = document.querySelectorAll('.testimonial-video')[index];
        if (testimonialVideo && testimonial.thumbnail) {
            testimonialVideo.style.backgroundImage = `url(${testimonial.thumbnail})`;
        }
    });
}

// Update Gallery Section
function updateGallerySection() {
    const gallery = siteData.gallery;
    
    gallery.forEach((item, index) => {
        const galleryCard = document.querySelectorAll('.before-after-card')[index];
        if (galleryCard) {
            // Update title
            const titleElement = galleryCard.querySelector('h4');
            if (titleElement && item.title) {
                titleElement.textContent = item.title;
            }

            // Update description
            const descriptionElement = galleryCard.querySelector('.case-info p');
            if (descriptionElement && item.description) {
                descriptionElement.textContent = item.description;
            }

            // Update before image
            const beforeImage = galleryCard.querySelector('.before-image');
            if (beforeImage && item.beforeImage) {
                beforeImage.src = item.beforeImage;
            }

            // Update after image
            const afterImage = galleryCard.querySelector('.after-image');
            if (afterImage && item.afterImage) {
                afterImage.src = item.afterImage;
            }
        }
    });
}

// Update Contact Section
function updateContactSection() {
    const contact = siteData.contact;
    
    // Update address
    const addressElement = document.querySelector('.contact-item:nth-child(1) span');
    if (addressElement && contact.address) {
        addressElement.textContent = contact.address;
    }

    // Update city
    const cityElement = document.querySelector('.contact-item:nth-child(2) span');
    if (cityElement && contact.city) {
        cityElement.textContent = contact.city;
    }

    // Update phone
    const phoneElement = document.querySelector('.contact-item:nth-child(3) span');
    if (phoneElement && contact.phone) {
        phoneElement.textContent = contact.phone;
    }

    // Update email
    const emailElement = document.querySelector('.contact-item:nth-child(4) span');
    if (emailElement && contact.email) {
        emailElement.textContent = contact.email;
    }
}

// Update Site Settings
function updateSiteSettings() {
    const settings = siteData.settings;
    
    // Update site title
    if (settings.siteTitle) {
        document.title = settings.siteTitle;
        const logoElement = document.querySelector('.logo h2');
        if (logoElement) {
            logoElement.textContent = settings.siteTitle;
        }
    }

    // Update colors
    if (settings.primaryColor || settings.secondaryColor) {
        updateSiteColors(settings.primaryColor, settings.secondaryColor);
    }
}

// Update site colors
function updateSiteColors(primaryColor, secondaryColor) {
    const root = document.documentElement;
    
    if (primaryColor) {
        root.style.setProperty('--primary-color', primaryColor);
        // Update CSS custom properties
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --primary-color: ${primaryColor};
                --secondary-color: ${secondaryColor || '#357ABD'};
            }
            
            .btn-primary {
                background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor || '#357ABD'});
            }
            
            .btn-primary:hover {
                box-shadow: 0 10px 25px rgba(${hexToRgb(primaryColor)}, 0.3);
            }
            
            .nav a:hover,
            .logo h2,
            .doctor-info h3,
            .service-content h3,
            .case-info h4,
            .benefit-icon,
            .slider-circle,
            .contact-item i,
            .footer-section h3,
            .footer-message h2 {
                color: ${primaryColor};
            }
            
            .btn-secondary {
                color: ${primaryColor};
                border-color: ${primaryColor};
            }
            
            .btn-secondary:hover {
                background: ${primaryColor};
            }
        `;
        document.head.appendChild(style);
    }
}

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '74, 144, 226';
}

// Show admin access button for logged in admins
function showAdminAccess() {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isAdminLoggedIn === 'true') {
        const adminAccess = document.getElementById('admin-access');
        if (adminAccess) {
            adminAccess.style.display = 'block';
        }
    }
}

// Add admin access button styles
const adminAccessStyles = `
    .admin-access {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
    }
    
    .admin-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #4A90E2, #357ABD);
        color: white;
        border-radius: 50%;
        text-decoration: none;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    }
    
    .admin-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }
    
    .admin-btn i {
        font-size: 1.5rem;
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        50% {
            box-shadow: 0 5px 15px rgba(74, 144, 226, 0.6);
        }
        100% {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
    }
    
    @media (max-width: 768px) {
        .admin-access {
            bottom: 20px;
            right: 20px;
        }
        
        .admin-btn {
            width: 50px;
            height: 50px;
        }
        
        .admin-btn i {
            font-size: 1.2rem;
        }
    }
`;

const adminAccessStyleSheet = document.createElement('style');
adminAccessStyleSheet.textContent = adminAccessStyles;
document.head.appendChild(adminAccessStyleSheet);

// Listen for storage changes (when admin panel updates data)
window.addEventListener('storage', function(e) {
    if (e.key === 'siteData') {
        siteData = JSON.parse(e.newValue);
        updateSiteContent();
        console.log('Site content updated from admin panel');
    }
});

// Auto-refresh content every 5 seconds to catch admin changes
setInterval(() => {
    const newData = localStorage.getItem('siteData');
    if (newData && JSON.stringify(siteData) !== newData) {
        siteData = JSON.parse(newData);
        updateSiteContent();
    }
}, 5000);

console.log('Admin Integration Script Loaded');
