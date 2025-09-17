// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initScrollAnimations();
    initVideoPlaceholders();
    initMobileMenu();
    initFormHandling();
    initCounterAnimations();
    initParallaxEffects();
    initTestimonialSlider();
    initBeforeAfterGallery();
});

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.doctor-card, .service-card, .benefit-card, .faq-item, .testimonial-video');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Video Placeholder Interactions
function initVideoPlaceholders() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach((placeholder, index) => {
        placeholder.addEventListener('click', function() {
            // Get video ID based on context
            let videoId = 'dQw4w9WgXcQ'; // Default
            let title = 'Video';
            
            // Check if it's a service video
            const serviceCard = this.closest('.service-card');
            if (serviceCard) {
                const serviceTitle = serviceCard.querySelector('h3').textContent;
                if (serviceTitle.includes('porcelana')) {
                    videoId = 'dQw4w9WgXcQ'; // Replace with real veneer video
                    title = 'Carillas en Porcelana';
                } else if (serviceTitle.includes('resina')) {
                    videoId = 'dQw4w9WgXcQ'; // Replace with real resin veneer video
                    title = 'Carillas en Resina';
                } else if (serviceTitle.includes('Blanqueamiento')) {
                    videoId = 'dQw4w9WgXcQ'; // Replace with real whitening video
                    title = 'Blanqueamiento Dental';
                } else if (serviceTitle.includes('incisales')) {
                    videoId = 'dQw4w9WgXcQ'; // Replace with real incisal edges video
                    title = 'Bordes Incisales';
                }
            }
            
            // Check if it's a testimonial video
            const testimonialVideo = this.closest('.testimonial-video');
            if (testimonialVideo) {
                videoId = 'dQw4w9WgXcQ'; // Replace with real testimonial video
                title = 'Testimonio de Paciente';
            }
            
            // Create modal for video
            createVideoModal(videoId, title);
        });
        
        // Add hover effects
        placeholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        
        placeholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
    });
}

// Create Video Modal
function createVideoModal(videoId = 'dQw4w9WgXcQ', title = 'Video') {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                        frameborder="0" 
                        allowfullscreen
                        title="${title}">
                    </iframe>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .video-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 10px;
            overflow: hidden;
        }
        .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            color: white;
            cursor: pointer;
            z-index: 10001;
        }
        .video-container {
            position: relative;
            width: 800px;
            height: 450px;
        }
        .video-container iframe {
            width: 100%;
            height: 100%;
        }
        @media (max-width: 768px) {
            .video-container {
                width: 90vw;
                height: 50vw;
            }
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(styleSheet);
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.querySelector('.video-modal')) {
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile menu styles
    const mobileStyles = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #4A90E2;
            cursor: pointer;
        }
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            .nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            .nav.active {
                display: block;
            }
            .nav ul {
                flex-direction: column;
                gap: 15px;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mobileStyles;
    document.head.appendChild(styleSheet);
    
    // Add button to header
    header.querySelector('.header-content').appendChild(mobileMenuBtn);
    
    // Toggle menu
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close menu when clicking on links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
}

// Form Handling
function initFormHandling() {
    // Create appointment form modal
    const appointmentLinks = document.querySelectorAll('a[href="#cita"], .btn-primary');
    
    appointmentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            createAppointmentForm();
        });
    });
}

// Create Appointment Form
function createAppointmentForm() {
    const modal = document.createElement('div');
    modal.className = 'appointment-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>Agenda tu Cita</h2>
                <form class="appointment-form">
                    <div class="form-group">
                        <label for="name">Nombre Completo</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Teléfono</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="service">Servicio de Interés</label>
                        <select id="service" name="service" required>
                            <option value="">Selecciona un servicio</option>
                            <option value="carillas-porcelana">Carillas en Porcelana</option>
                            <option value="carillas-resina">Carillas en Resina</option>
                            <option value="blanqueamiento">Blanqueamiento</option>
                            <option value="bordes-incisales">Bordes Incisales</option>
                            <option value="valoracion">Valoración General</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="date">Fecha Preferida</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Mensaje Adicional</label>
                        <textarea id="message" name="message" rows="4"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    `;
    
    // Add form modal styles
    const formStyles = `
        .appointment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .appointment-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .appointment-modal .modal-content {
            position: relative;
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-height: 90vh;
            overflow-y: auto;
        }
        .appointment-modal .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 2rem;
            color: #666;
            cursor: pointer;
        }
        .appointment-form {
            margin-top: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #4A90E2;
        }
        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = formStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(modal);
    
    // Form submission
    const form = modal.querySelector('.appointment-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        showSuccessMessage();
        document.body.removeChild(modal);
        document.head.removeChild(styleSheet);
    });
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(styleSheet);
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        }
    });
    
    // Set minimum date to today
    const dateInput = modal.querySelector('#date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Show Success Message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-check-circle"></i>
            <h3>¡Solicitud Enviada!</h3>
            <p>Hemos recibido tu solicitud de cita. Te contactaremos pronto para confirmar tu cita.</p>
        </div>
    `;
    
    const messageStyles = `
        .success-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .message-content i {
            font-size: 3rem;
            color: #4CAF50;
            margin-bottom: 15px;
        }
        .message-content h3 {
            color: #333;
            margin-bottom: 10px;
        }
        .message-content p {
            color: #666;
            line-height: 1.6;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = messageStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        document.body.removeChild(message);
        document.head.removeChild(styleSheet);
    }, 3000);
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.experience-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate Counter
function animateCounter(element) {
    const target = parseInt(element.textContent.replace('+', ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = '+' + Math.floor(current);
    }, 16);
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Testimonial Slider (for mobile)
function initTestimonialSlider() {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (!testimonialsGrid) return;
    
    // Add touch/swipe functionality for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    testimonialsGrid.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    testimonialsGrid.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > 50) {
            // Add visual feedback for swipe
            testimonialsGrid.style.transform = `translateX(-${Math.min(diffX * 0.1, 20)}px)`;
        }
    });
    
    testimonialsGrid.addEventListener('touchend', () => {
        isDragging = false;
        testimonialsGrid.style.transform = 'translateX(0)';
    });
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading styles
    const loadingStyles = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        body.loaded {
            opacity: 1;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
});

// FAQ Accordion (if needed)
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
}

// Initialize FAQ accordion
document.addEventListener('DOMContentLoaded', initFAQAccordion);

// Add FAQ accordion styles
const faqStyles = `
    .faq-item {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .faq-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    .faq-item h3 {
        position: relative;
        padding-right: 30px;
    }
    .faq-item h3::after {
        content: '+';
        position: absolute;
        right: 0;
        top: 0;
        font-size: 1.5rem;
        transition: transform 0.3s ease;
    }
    .faq-item.open h3::after {
        transform: rotate(45deg);
    }
    .faq-item p {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    .faq-item.open p {
        max-height: 200px;
    }
`;

const faqStyleSheet = document.createElement('style');
faqStyleSheet.textContent = faqStyles;
document.head.appendChild(faqStyleSheet);

// Before/After Gallery Functionality
function initBeforeAfterGallery() {
    const beforeAfterCards = document.querySelectorAll('.before-after-card');
    
    beforeAfterCards.forEach(card => {
        const imageContainer = card.querySelector('.image-container');
        const afterImage = card.querySelector('.after-image');
        const sliderHandle = card.querySelector('.slider-handle');
        const sliderLine = card.querySelector('.slider-line');
        
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let containerRect = null;
        
        // Mouse events
        imageContainer.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events
        imageContainer.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
        
        // Click events
        imageContainer.addEventListener('click', handleClick);
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            containerRect = imageContainer.getBoundingClientRect();
            
            if (e.type === 'mousedown') {
                startX = e.clientX;
            } else if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
            }
            
            imageContainer.style.cursor = 'grabbing';
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            if (e.type === 'mousemove') {
                currentX = e.clientX;
            } else if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX;
            }
            
            updateSlider();
        }
        
        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            imageContainer.style.cursor = 'grab';
        }
        
        function handleClick(e) {
            if (isDragging) return;
            
            containerRect = imageContainer.getBoundingClientRect();
            const clickX = e.clientX - containerRect.left;
            const percentage = (clickX / containerRect.width) * 100;
            
            setSliderPosition(percentage);
        }
        
        function updateSlider() {
            if (!containerRect) return;
            
            const deltaX = currentX - startX;
            const containerWidth = containerRect.width;
            const percentage = Math.max(0, Math.min(100, 50 + (deltaX / containerWidth) * 100));
            
            setSliderPosition(percentage);
        }
        
        function setSliderPosition(percentage) {
            const clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            afterImage.style.clipPath = clipPath;
            sliderHandle.style.left = `${percentage}%`;
            sliderLine.style.left = `${percentage}%`;
        }
        
        // Initialize slider at 50%
        setSliderPosition(50);
    });
}

// Add enhanced styles for before/after functionality
const beforeAfterStyles = `
    .image-container {
        position: relative;
    }
    
    .slider-handle {
        transition: left 0.1s ease;
    }
    
    .slider-line {
        transition: left 0.1s ease;
    }
    
    .after-image {
        transition: clip-path 0.1s ease;
    }
    
    .image-container:hover .slider-circle {
        transform: scale(1.1);
    }
    
    .image-container:active .slider-circle {
        transform: scale(1.2);
    }
    
    /* Add instruction tooltip */
    .before-after-card:hover::after {
        content: '👆 Arrastra para comparar';
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        z-index: 10;
        white-space: nowrap;
        animation: fadeInUp 0.3s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .before-after-card:hover::after {
            content: '👆 Desliza para comparar';
        }
    }
`;

const beforeAfterStyleSheet = document.createElement('style');
beforeAfterStyleSheet.textContent = beforeAfterStyles;
document.head.appendChild(beforeAfterStyleSheet);
