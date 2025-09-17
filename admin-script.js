// Admin Panel JavaScript
let siteData = {};
let hasUnsavedChanges = false;

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadSiteData();
    setupEventListeners();
    setupAutoSave();
    setupDoctorLabelUpdates(); // Setup dynamic label updates for doctors
    
    // Debug: Show current data status
    setTimeout(() => {
        debugDataStatus();
    }, 1000);
});

// Initialize Admin Panel
function initializeAdmin() {
    console.log('Admin Panel Initialized');
    
    // Check if user is logged in (simple check)
    if (!localStorage.getItem('adminLoggedIn')) {
        showLoginModal();
    }
}

// Show Login Modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="login-overlay">
            <div class="login-content">
                <h2>Acceso al Panel de Administración</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username">Usuario</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="btn-login">Iniciar Sesión</button>
                </form>
                <p class="login-note">Usuario: admin | Contraseña: admin123</p>
            </div>
        </div>
    `;
    
    // Add login modal styles
    const loginStyles = `
        .login-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-overlay {
            background: rgba(0, 0, 0, 0.8);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .login-content {
            background: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        .login-content h2 {
            color: #4A90E2;
            margin-bottom: 30px;
        }
        .login-content .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        .login-content label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
        }
        .login-content input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
        }
        .btn-login {
            background: #4A90E2;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-bottom: 20px;
        }
        .btn-login:hover {
            background: #357ABD;
        }
        .login-note {
            color: #666;
            font-size: 0.9rem;
            font-style: italic;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loginStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(modal);
    
    // Handle login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        } else {
            alert('Credenciales incorrectas');
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            hasUnsavedChanges = true;
            updateSaveButton();
        });
    });
    
    // Color inputs
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('change', function() {
            hasUnsavedChanges = true;
            updateSaveButton();
            previewColorChanges();
        });
    });
}

// Show Section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Load Site Data
async function loadSiteData() {
    try {
        // Try to load from server API first
        try {
            const response = await fetch('/api/site-data');
            if (response.ok) {
                siteData = await response.json();
                console.log('Site data loaded from server API:', siteData);
                populateForms();
                return;
            }
        } catch (apiError) {
            console.log('Server API not available, trying other sources:', apiError);
        }
        
        // Try to load from Firebase
        if (window.firebaseDB) {
            const docRef = window.firebaseDB.doc(window.firebaseDB.db, 'site', 'content');
            const docSnap = await window.firebaseDB.getDoc(docRef);
            
            if (docSnap.exists()) {
                siteData = docSnap.data();
                console.log('Site data loaded from Firebase');
                populateForms();
                return;
            }
        }
        
        // Try localStorage first
        const savedData = localStorage.getItem('siteData');
        if (savedData) {
            try {
                siteData = JSON.parse(savedData);
                console.log('Site data loaded from localStorage:', siteData);
                populateForms();
                return;
            } catch (parseError) {
                console.error('Error parsing localStorage data:', parseError);
            }
        }
        
        // Try sessionStorage as backup
        const sessionData = sessionStorage.getItem('siteData');
        if (sessionData) {
            try {
                siteData = JSON.parse(sessionData);
                console.log('Site data loaded from sessionStorage:', siteData);
                populateForms();
                return;
            } catch (parseError) {
                console.error('Error parsing sessionStorage data:', parseError);
            }
        }
        
        // If no data found, load defaults
        console.log('No saved data found, loading defaults');
        loadDefaultData();
        
    } catch (error) {
        console.error('Error loading site data:', error);
        loadDefaultData();
    }
}

// Load Default Data
function loadDefaultData() {
    siteData = {
        hero: {
            title: "Renueva Tu Confianza con Nuestro Diseño de Sonrisa",
            subtitle: "Alcanza la sonrisa que siempre has deseado",
            features: [
                "Transformación estética personalizada para tu sonrisa ideal.",
                "Corrección de imperfecciones dentales con carillas y blanqueamiento.",
                "Tecnología avanzada para resultados precisos y naturales."
            ]
        },
        doctors: [
            {
                name: "Dra. Paola Peña",
                specialty: "Odontóloga - Universidad Javeriana | Esp. en Implantología oral y reconstructiva",
                experience: 15,
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face"
            },
            {
                name: "Dra. Patricia Herrera",
                specialty: "Odontóloga - Universidad Javeriana | Esp. en Ortodoncia, maloclusiones y alineación dental",
                experience: 12,
                image: "https://images.unsplash.com/photo-1594824388852-8a7b3b5b5b5b?w=400&h=500&fit=crop&crop=face"
            }
        ],
        services: [
            {
                title: "Carillas en porcelana",
                description: "Solución de alta gama para transformar la estética dental. Garantizan durabilidad y un acabado natural",
                features: ["Duración: 10 a 20 años", "Gama alta", "Material resistente, duradero y seguro"],
                price: "desde $1.000.000",
                video: "jNQXAC9IVRw",
                thumbnail: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=200&fit=crop&auto=format&q=80"
            },
            {
                title: "Carillas en resina",
                description: "Alternativa económica y efectiva para mejorar la sonrisa. Ofrecen resultados estéticos en poco tiempo.",
                features: ["Duración: 2 a 5 años", "Gama media y alta", "Tratamiento minimamente invasivo"],
                price: "desde $400.000",
                video: "jNQXAC9IVRw",
                thumbnail: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=200&fit=crop&auto=format&q=80"
            },
            {
                title: "Blanqueamiento",
                description: "Tratamiento que elimina manchas y devuelve el brillo natural a los dientes. Procedimiento seguro y rápido para corregir el tono dental.",
                features: ["Tratamiento mínimamente invasivo", "Permite corregir el color de tus dientes"],
                price: "desde $200.000",
                video: "jNQXAC9IVRw",
                thumbnail: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=200&fit=crop&auto=format&q=80"
            },
            {
                title: "Bordes incisales",
                description: "Técnica sutil y conservadora que redefine la forma de los dientes para lograr una sonrisa armónica, respetando su estructura natural.",
                features: ["Tratamiento mínimamente invasivo", "Permite corregir la forma de tus dientes"],
                price: "desde $200.000",
                video: "jNQXAC9IVRw",
                thumbnail: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=200&fit=crop&auto=format&q=80"
            }
        ],
        gallery: [
            {
                title: "Carillas en Porcelana",
                description: "Transformación completa con carillas de alta calidad",
                beforeImage: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop",
                afterImage: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop"
            },
            {
                title: "Blanqueamiento Dental",
                description: "Resultado natural y brillante en una sola sesión",
                beforeImage: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop",
                afterImage: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop"
            },
            {
                title: "Diseño de Sonrisa Completo",
                description: "Transformación integral con múltiples técnicas",
                beforeImage: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop",
                afterImage: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop"
            }
        ],
        testimonials: [
            {
                name: "María González",
                treatment: "Carillas de Porcelana",
                quote: "Mi sonrisa cambió completamente, estoy muy feliz con el resultado",
                video: "jNQXAC9IVRw",
                thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face&auto=format&q=80"
            },
            {
                name: "Carlos Rodríguez",
                treatment: "Blanqueamiento",
                quote: "El blanqueamiento superó mis expectativas, mis dientes se ven perfectos",
                video: "jNQXAC9IVRw",
                thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80"
            },
            {
                name: "Ana Martínez",
                treatment: "Diseño de Sonrisa",
                quote: "La Dra. Paola es excelente, me ayudó a conseguir la sonrisa que siempre quise",
                video: "jNQXAC9IVRw",
                thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80"
            }
        ],
        contact: {
            address: "Calle 134 # 7B - 83 | Edificio El Bosque Consultorio 510",
            city: "Bogotá, Colombia",
            phone: "+57 311 894 0351",
            email: "odontologiapenaherrera@gmail.com"
        },
        settings: {
            siteTitle: "Odontología Peña - Herrera",
            siteDescription: "Expertas en Sonrisas - Diseño de Sonrisa, Ortodoncia e Implantes Dentales",
            primaryColor: "#4A90E2",
            secondaryColor: "#357ABD"
        }
    };
    
    populateForms();
}

// Populate Forms
function populateForms() {
    // Hero Section
    if (siteData.hero) {
        document.getElementById('hero-title').value = siteData.hero.title || '';
        document.getElementById('hero-subtitle').value = siteData.hero.subtitle || '';
        document.getElementById('hero-features').value = siteData.hero.features ? siteData.hero.features.join('\n') : '';
    }
    
    // Doctors - Dynamic loading
    if (siteData.doctors) {
        const doctorsEditor = document.querySelector('.doctors-editor');
        
        // Clear existing doctors (except the first two default ones)
        const existingDoctors = doctorsEditor.querySelectorAll('.doctor-editor[data-doctor-id]');
        existingDoctors.forEach((doctor, index) => {
            if (index >= 2) { // Keep first two default doctors
                doctor.remove();
            }
        });
        
        // Load doctors dynamically
        siteData.doctors.forEach((doctor, index) => {
            if (index < 2) {
                // Update existing default doctors
                const num = index + 1;
                const nameElement = document.getElementById(`doctor${num}-name`);
                const specialtyElement = document.getElementById(`doctor${num}-specialty`);
                const experienceElement = document.getElementById(`doctor${num}-experience`);
                
                if (nameElement) nameElement.value = doctor.name || '';
                if (specialtyElement) specialtyElement.value = doctor.specialty || '';
                if (experienceElement) experienceElement.value = doctor.experience || '';
            } else {
                // Add new doctors
                doctorCounter = index + 1;
                addNewDoctor();
                
                // Set the values for the new doctor
                setTimeout(() => {
                    const num = index + 1;
                    const nameElement = document.getElementById(`doctor${num}-name`);
                    const specialtyElement = document.getElementById(`doctor${num}-specialty`);
                    const experienceElement = document.getElementById(`doctor${num}-experience`);
                    
                    if (nameElement) nameElement.value = doctor.name || '';
                    if (specialtyElement) specialtyElement.value = doctor.specialty || '';
                    if (experienceElement) experienceElement.value = doctor.experience || '';
                }, 100);
            }
        });
        
        // Setup label updates after loading all doctors
        setTimeout(() => {
            setupDoctorLabelUpdates();
        }, 200);
    }
    
    // Services
    if (siteData.services) {
        siteData.services.forEach((service, index) => {
            const num = index + 1;
            document.getElementById(`service${num}-title`).value = service.title || '';
            document.getElementById(`service${num}-description`).value = service.description || '';
            document.getElementById(`service${num}-features`).value = service.features ? service.features.join('\n') : '';
            document.getElementById(`service${num}-price`).value = service.price || '';
            document.getElementById(`service${num}-video`).value = service.video || '';
        });
    }
    
    // Gallery
    if (siteData.gallery) {
        siteData.gallery.forEach((item, index) => {
            const num = index + 1;
            document.getElementById(`gallery${num}-title`).value = item.title || '';
            document.getElementById(`gallery${num}-description`).value = item.description || '';
        });
    }
    
    // Testimonials
    if (siteData.testimonials) {
        siteData.testimonials.forEach((testimonial, index) => {
            const num = index + 1;
            document.getElementById(`testimonial${num}-name`).value = testimonial.name || '';
            document.getElementById(`testimonial${num}-treatment`).value = testimonial.treatment || '';
            document.getElementById(`testimonial${num}-quote`).value = testimonial.quote || '';
            document.getElementById(`testimonial${num}-video`).value = testimonial.video || '';
        });
    }
    
    // Contact
    if (siteData.contact) {
        document.getElementById('contact-address').value = siteData.contact.address || '';
        document.getElementById('contact-city').value = siteData.contact.city || '';
        document.getElementById('contact-phone').value = siteData.contact.phone || '';
        document.getElementById('contact-email').value = siteData.contact.email || '';
    }
    
    // Settings
    if (siteData.settings) {
        document.getElementById('site-title').value = siteData.settings.siteTitle || '';
        document.getElementById('site-description').value = siteData.settings.siteDescription || '';
        document.getElementById('primary-color').value = siteData.settings.primaryColor || '#4A90E2';
        document.getElementById('secondary-color').value = siteData.settings.secondaryColor || '#357ABD';
    }
}

// Save All Changes
async function saveAllChanges() {
    showLoading();
    
    try {
        // Collect all form data
        collectFormData();
        
        // Try to save to server API first
        try {
            const response = await fetch('/api/site-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(siteData)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Site data saved to server API successfully:', result);
            }
        } catch (apiError) {
            console.log('Server API not available, saving locally:', apiError);
        }
        
        // Save to Firebase if available
        if (window.firebaseDB) {
            const docRef = window.firebaseDB.doc(window.firebaseDB.db, 'site', 'content');
            await window.firebaseDB.setDoc(docRef, siteData);
            console.log('Site data saved to Firebase successfully');
        }
        
        // Always save to localStorage (primary storage for now)
        localStorage.setItem('siteData', JSON.stringify(siteData));
        console.log('Site data saved to localStorage:', siteData);
        
        // Also save to sessionStorage as additional backup
        sessionStorage.setItem('siteData', JSON.stringify(siteData));
        
        // Update main site
        updateMainSite();
        
        hideLoading();
        showSuccessMessage();
        hasUnsavedChanges = false;
        updateSaveButton();
        
    } catch (error) {
        console.error('Error saving data:', error);
        
        // Fallback to localStorage only
        localStorage.setItem('siteData', JSON.stringify(siteData));
        sessionStorage.setItem('siteData', JSON.stringify(siteData));
        updateMainSite();
        
        hideLoading();
        showSuccessMessage('Datos guardados localmente');
        hasUnsavedChanges = false;
        updateSaveButton();
    }
}

// Collect Form Data
function collectFormData() {
    // Hero Section
    siteData.hero = {
        title: document.getElementById('hero-title').value,
        subtitle: document.getElementById('hero-subtitle').value,
        features: document.getElementById('hero-features').value.split('\n').filter(line => line.trim())
    };
    
    // Doctors - Dynamic collection
    siteData.doctors = [];
    const doctorEditors = document.querySelectorAll('.doctor-editor');
    
    doctorEditors.forEach((editor, index) => {
        const doctorId = editor.getAttribute('data-doctor-id');
        const nameElement = document.getElementById(`doctor${doctorId}-name`);
        const specialtyElement = document.getElementById(`doctor${doctorId}-specialty`);
        const experienceElement = document.getElementById(`doctor${doctorId}-experience`);
        
        if (nameElement && specialtyElement && experienceElement) {
            siteData.doctors.push({
                name: nameElement.value,
                specialty: specialtyElement.value,
                experience: parseInt(experienceElement.value) || 0,
                image: siteData.doctors[index]?.image || ''
            });
        }
    });
    
    // Services
    siteData.services = [];
    for (let i = 1; i <= 4; i++) {
        siteData.services.push({
            title: document.getElementById(`service${i}-title`).value,
            description: document.getElementById(`service${i}-description`).value,
            features: document.getElementById(`service${i}-features`).value.split('\n').filter(line => line.trim()),
            price: document.getElementById(`service${i}-price`).value,
            video: document.getElementById(`service${i}-video`).value,
            thumbnail: siteData.services[i-1]?.thumbnail || ''
        });
    }
    
    // Gallery
    siteData.gallery = [];
    for (let i = 1; i <= 3; i++) {
        siteData.gallery.push({
            title: document.getElementById(`gallery${i}-title`).value,
            description: document.getElementById(`gallery${i}-description`).value,
            beforeImage: siteData.gallery[i-1]?.beforeImage || '',
            afterImage: siteData.gallery[i-1]?.afterImage || ''
        });
    }
    
    // Testimonials
    siteData.testimonials = [];
    for (let i = 1; i <= 3; i++) {
        siteData.testimonials.push({
            name: document.getElementById(`testimonial${i}-name`).value,
            treatment: document.getElementById(`testimonial${i}-treatment`).value,
            quote: document.getElementById(`testimonial${i}-quote`).value,
            video: document.getElementById(`testimonial${i}-video`).value,
            thumbnail: siteData.testimonials[i-1]?.thumbnail || ''
        });
    }
    
    // Contact
    siteData.contact = {
        address: document.getElementById('contact-address').value,
        city: document.getElementById('contact-city').value,
        phone: document.getElementById('contact-phone').value,
        email: document.getElementById('contact-email').value
    };
    
    // Settings
    siteData.settings = {
        siteTitle: document.getElementById('site-title').value,
        siteDescription: document.getElementById('site-description').value,
        primaryColor: document.getElementById('primary-color').value,
        secondaryColor: document.getElementById('secondary-color').value
    };
}

// Update Main Site
function updateMainSite() {
    // This would typically send data to a server
    // For now, we'll store it in localStorage and the main site can read it
    console.log('Site data updated:', siteData);
}

// Preview Image
function previewImage(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            
            // Store image data
            storeImageData(input.id, e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Store Image Data
function storeImageData(inputId, imageData) {
    // Store image in localStorage (in real app, this would be uploaded to server)
    localStorage.setItem(`image_${inputId}`, imageData);
    
    // Update site data
    if (inputId.includes('doctor1-image')) {
        siteData.doctors[0].image = imageData;
    } else if (inputId.includes('doctor2-image')) {
        siteData.doctors[1].image = imageData;
    } else if (inputId.includes('gallery') && inputId.includes('before')) {
        const galleryIndex = parseInt(inputId.match(/\d+/)[0]) - 1;
        siteData.gallery[galleryIndex].beforeImage = imageData;
    } else if (inputId.includes('gallery') && inputId.includes('after')) {
        const galleryIndex = parseInt(inputId.match(/\d+/)[0]) - 1;
        siteData.gallery[galleryIndex].afterImage = imageData;
    } else if (inputId.includes('service') && inputId.includes('thumbnail')) {
        const serviceIndex = parseInt(inputId.match(/\d+/)[0]) - 1;
        if (siteData.services[serviceIndex]) {
            siteData.services[serviceIndex].thumbnail = imageData;
        }
    } else if (inputId.includes('testimonial') && inputId.includes('thumbnail')) {
        const testimonialIndex = parseInt(inputId.match(/\d+/)[0]) - 1;
        if (siteData.testimonials[testimonialIndex]) {
            siteData.testimonials[testimonialIndex].thumbnail = imageData;
        }
    }
    
    hasUnsavedChanges = true;
    updateSaveButton();
}

// Preview Site
function previewSite() {
    // Open main site in new tab
    window.open('index.html', '_blank');
}

// Doctor Management Functions
let doctorCounter = 2; // Start from 3 since we have 2 default doctors

// Add new doctor
function addNewDoctor() {
    doctorCounter++;
    const doctorsEditor = document.querySelector('.doctors-editor');
    
    const newDoctorHTML = `
        <div class="doctor-editor" data-doctor-id="${doctorCounter}">
            <div class="doctor-header">
                <h3>Nuevo Doctor</h3>
                <button class="btn-remove" onclick="removeDoctor(${doctorCounter})" title="Eliminar doctor">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label for="doctor${doctorCounter}-name">Nombre</label>
                    <input type="text" id="doctor${doctorCounter}-name" value="Nuevo Doctor">
                </div>
                <div class="form-group">
                    <label for="doctor${doctorCounter}-specialty">Especialidad</label>
                    <input type="text" id="doctor${doctorCounter}-specialty" value="Especialidad">
                </div>
                <div class="form-group">
                    <label for="doctor${doctorCounter}-experience">Años de Experiencia</label>
                    <input type="number" id="doctor${doctorCounter}-experience" value="5">
                </div>
                <div class="form-group">
                    <label for="doctor${doctorCounter}-image">Foto</label>
                    <div class="image-upload">
                        <input type="file" id="doctor${doctorCounter}-image" accept="image/*" onchange="previewImage(this, 'doctor${doctorCounter}-preview')">
                        <div class="upload-area" onclick="document.getElementById('doctor${doctorCounter}-image').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir foto</span>
                        </div>
                        <div class="image-preview" id="doctor${doctorCounter}-preview">
                            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=250&fit=crop&crop=face&auto=format&q=80" alt="Nuevo Doctor">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    doctorsEditor.insertAdjacentHTML('beforeend', newDoctorHTML);
    
    // Update the title dynamically
    const nameInput = document.getElementById(`doctor${doctorCounter}-name`);
    const titleElement = doctorsEditor.querySelector(`[data-doctor-id="${doctorCounter}"] h3`);
    
    nameInput.addEventListener('input', function() {
        const newName = this.value.trim();
        titleElement.textContent = newName || 'Nuevo Doctor';
        
        // Update the alt text of the image as well
        const imageElement = doctorsEditor.querySelector(`[data-doctor-id="${doctorCounter}"] img`);
        if (imageElement) {
            imageElement.alt = newName || 'Nuevo Doctor';
        }
    });
    
    // Immediately save changes to persist the new doctor
    collectFormData();
    localStorage.setItem('siteData', JSON.stringify(siteData));
    sessionStorage.setItem('siteData', JSON.stringify(siteData));
    
    // Update main site
    updateMainSite();
    
    hasUnsavedChanges = false;
    updateSaveButton();
    
    // Scroll to the new doctor
    const newDoctorElement = doctorsEditor.querySelector(`[data-doctor-id="${doctorCounter}"]`);
    newDoctorElement.scrollIntoView({ behavior: 'smooth' });
    
    // Setup label updates for the new doctor
    setupDoctorLabelUpdates();
    
    showSuccessMessage('Nuevo doctor agregado y cambios guardados exitosamente');
    console.log('Nuevo doctor agregado y datos actualizados:', siteData.doctors);
}

// Remove doctor
function removeDoctor(doctorId) {
    if (confirm('¿Estás seguro de que quieres eliminar este doctor? Esta acción no se puede deshacer.')) {
        const doctorElement = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        if (doctorElement) {
            // Remove from DOM
            doctorElement.remove();
            
            // Immediately save changes to persist the deletion
            collectFormData();
            localStorage.setItem('siteData', JSON.stringify(siteData));
            sessionStorage.setItem('siteData', JSON.stringify(siteData));
            
            // Update main site
            updateMainSite();
            
            hasUnsavedChanges = false;
            updateSaveButton();
            showSuccessMessage('Doctor eliminado y cambios guardados exitosamente');
            
            console.log('Doctor eliminado y datos actualizados:', siteData.doctors);
        }
    }
}

// Logout
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Only remove admin login status, keep site data
        localStorage.removeItem('adminLoggedIn');
        console.log('Admin logged out, site data preserved');
        window.location.reload();
    }
}

// Function to setup dynamic label updates for all doctors
function setupDoctorLabelUpdates() {
    const doctorEditors = document.querySelectorAll('.doctor-editor');
    
    doctorEditors.forEach((editor) => {
        const doctorId = editor.getAttribute('data-doctor-id');
        const nameInput = document.getElementById(`doctor${doctorId}-name`);
        const titleElement = editor.querySelector('h3');
        
        if (nameInput && titleElement) {
            // Remove existing event listeners to avoid duplicates
            nameInput.removeEventListener('input', nameInput._labelUpdateHandler);
            
            // Create new event handler
            nameInput._labelUpdateHandler = function() {
                const newName = this.value.trim();
                titleElement.textContent = newName || 'Doctor';
                
                // Update the alt text of the image as well
                const imageElement = editor.querySelector('img');
                if (imageElement) {
                    imageElement.alt = newName || 'Doctor';
                }
                
                // Mark as changed
                hasUnsavedChanges = true;
                updateSaveButton();
            };
            
            // Add the event listener
            nameInput.addEventListener('input', nameInput._labelUpdateHandler);
        }
    });
}

// Show Loading
function showLoading() {
    document.getElementById('loading-overlay').classList.add('show');
}

// Hide Loading
function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('show');
}

// Show Success Message
function showSuccessMessage(customMessage = null) {
    const message = document.getElementById('success-message');
    const messageText = message.querySelector('span');
    
    if (customMessage) {
        messageText.textContent = customMessage;
    } else {
        messageText.textContent = 'Cambios guardados exitosamente';
    }
    
    message.classList.add('show');
    
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

// Update Save Button
function updateSaveButton() {
    const saveBtn = document.querySelector('.btn-save');
    if (hasUnsavedChanges) {
        saveBtn.style.background = '#ff9800';
        saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Guardar Cambios';
    } else {
        saveBtn.style.background = '#4CAF50';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
}

// Preview Color Changes
function previewColorChanges() {
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;
    
    // Update CSS variables for preview
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

// Setup Auto Save
function setupAutoSave() {
    // Auto save every 30 seconds if there are unsaved changes
    setInterval(() => {
        if (hasUnsavedChanges) {
            console.log('Auto-saving changes...');
            saveAllChanges();
        }
    }, 30000);
}

// Export Site Data
function exportSiteData() {
    const dataStr = JSON.stringify(siteData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'site-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import Site Data
function importSiteData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    siteData = JSON.parse(e.target.result);
                    populateForms();
                    showSuccessMessage();
                } catch (error) {
                    alert('Error al importar el archivo');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveAllChanges();
    }
    
    // Ctrl+P to preview
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        previewSite();
    }
});

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
    }
});

// Debug function to check data status
function debugDataStatus() {
    console.log('=== DEBUG: Data Status ===');
    console.log('Current siteData:', siteData);
    console.log('localStorage siteData:', localStorage.getItem('siteData'));
    console.log('sessionStorage siteData:', sessionStorage.getItem('siteData'));
    console.log('Firebase available:', !!window.firebaseDB);
    console.log('========================');
}

// Add debug button to admin panel
function addDebugButton() {
    const debugBtn = document.createElement('button');
    debugBtn.innerHTML = '<i class="fas fa-bug"></i> Debug';
    debugBtn.className = 'btn-debug';
    debugBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: #ff9800;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    debugBtn.onclick = () => {
        debugDataStatus();
        alert('Revisa la consola del navegador (F12) para ver el estado de los datos');
    };
    document.body.appendChild(debugBtn);
}

// Add debug button after page loads
setTimeout(addDebugButton, 2000);

console.log('Admin Script Loaded Successfully');
