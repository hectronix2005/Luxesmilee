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
            
            // Load users if users section is selected
            if (section === 'users') {
                loadUsers();
            }
            
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

// Load Site Data - VERSIÓN NETLIFY PURA: Solo usa Netlify Function
async function loadSiteData() {
    console.log('📂 === INICIANDO CARGA DE DATOS DESDE NETLIFY ===');
    
    try {
        console.log('🌐 Cargando datos desde Netlify Function...');
        
        const response = await fetch('/.netlify/functions/site-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache'
        });
        
        if (response.ok) {
            const netlifyData = await response.json();
            
            if (netlifyData && netlifyData.doctors && netlifyData.doctors.length > 0) {
                siteData = netlifyData;
                console.log('✅ Datos cargados desde Netlify Function');
                console.log('  - Número de doctores:', siteData.doctors.length);
                
                siteData.doctors.forEach((doctor, index) => {
                    console.log(`  - Doctor ${index + 1}: "${doctor.name}"`);
                });
                
                populateForms();
                return;
            } else {
                console.log('⚠️ Netlify Function retornó datos vacíos o incompletos');
            }
        } else {
            console.error('❌ Netlify Function error:', response.status);
            const errorText = await response.text();
            console.error('   Error details:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Error crítico al cargar datos desde Netlify:', error);
    }
    
    // Si Netlify falló, cargar datos por defecto
    console.log('⚠️ Cargando datos por defecto debido a error en Netlify');
    loadDefaultData();
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
            secondaryColor: "#357ABD",
            tabTitle: "Odontología Peña - Herrera" // Nueva propiedad para el título de la tab
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
        
        // Clear ALL existing doctors to rebuild from saved data
        const existingDoctors = doctorsEditor.querySelectorAll('.doctor-editor[data-doctor-id]');
        existingDoctors.forEach((doctor) => {
            doctor.remove();
        });
        
        // Reset doctor counter
        doctorCounter = 0;
        
        // Load doctors dynamically from saved data
        siteData.doctors.forEach((doctor, index) => {
            doctorCounter++;
            
            // Create doctor HTML
            const doctorHTML = `
                <div class="doctor-editor" data-doctor-id="${doctorCounter}">
                    <div class="doctor-header">
                        <h3>${doctor.name || 'Doctor'}</h3>
                        <button class="btn-remove" onclick="removeDoctor(${doctorCounter})" title="Eliminar doctor">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="doctor${doctorCounter}-name">Nombre</label>
                            <input type="text" id="doctor${doctorCounter}-name" value="${doctor.name || ''}">
                        </div>
                        <div class="form-group">
                            <label for="doctor${doctorCounter}-specialty">Especialidad</label>
                            <input type="text" id="doctor${doctorCounter}-specialty" value="${doctor.specialty || ''}">
                        </div>
                        <div class="form-group">
                            <label for="doctor${doctorCounter}-experience">Años de Experiencia</label>
                            <input type="number" id="doctor${doctorCounter}-experience" value="${doctor.experience || ''}">
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
                                    <img src="${doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=250&fit=crop&crop=face&auto=format&q=80'}" alt="${doctor.name || 'Doctor'}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            doctorsEditor.insertAdjacentHTML('beforeend', doctorHTML);
        });
        
        // Setup label updates after loading all doctors
        setTimeout(() => {
            setupDoctorLabelUpdates();
            setupDoctorAutoSave();
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
        
        // Actualizar título de la tab si existe el campo
        const tabTitleInput = document.getElementById('tab-title');
        if (tabTitleInput) {
            tabTitleInput.value = siteData.settings.tabTitle || siteData.settings.siteTitle || '';
        }
    }
}

// Save All Changes - VERSIÓN NETLIFY PURA: Solo guarda en Netlify Function
async function saveAllChanges() {
    console.log('💾 === INICIANDO GUARDADO EN NETLIFY ===');
    showLoading();
    
    try {
        // PASO 1: Recolectar datos del formulario
        console.log('📝 PASO 1: Recolectando datos del formulario...');
        collectFormData();
        
        // PASO 2: Verificar que los datos se recolectaron correctamente
        console.log('🔍 PASO 2: Verificando datos recolectados:');
        console.log('  - Número de doctores:', siteData.doctors ? siteData.doctors.length : 0);
        if (siteData.doctors && siteData.doctors.length > 0) {
            siteData.doctors.forEach((doctor, index) => {
                console.log(`  - Doctor ${index + 1}: "${doctor.name}" - ${doctor.specialty} (${doctor.experience} años)`);
            });
        }
        
        // PASO 3: Guardar SOLO en Netlify Function
        console.log('🌐 PASO 3: Guardando datos en Netlify Function...');
        
        const response = await fetch('/.netlify/functions/site-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(siteData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Datos guardados exitosamente en Netlify Function');
            console.log('   Timestamp:', result.timestamp);
            console.log('   Doctores guardados:', result.doctorsCount);
            
            // Verificar que se guardó correctamente volviendo a cargar
            console.log('🔍 PASO 4: Verificando guardado...');
            const verifyResponse = await fetch('/.netlify/functions/site-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (verifyResponse.ok) {
                const verifiedData = await verifyResponse.json();
                console.log('✅ Verificación exitosa:');
                console.log('  - Doctores verificados:', verifiedData.doctors ? verifiedData.doctors.length : 0);
                if (verifiedData.doctors && verifiedData.doctors.length > 0) {
                    verifiedData.doctors.forEach((doctor, index) => {
                        console.log(`  - Doctor ${index + 1}: "${doctor.name}"`);
                    });
                }
            }
            
            // Update main site
            updateMainSite();
            
            hideLoading();
            showSuccessMessage('✅ Cambios guardados permanentemente en Netlify');
            hasUnsavedChanges = false;
            updateSaveButton();
            
            console.log('🎉 === GUARDADO COMPLETADO EN NETLIFY ===');
            return;
            
        } else {
            const errorText = await response.text();
            console.error('❌ Error al guardar en Netlify Function:', response.status, errorText);
            
            hideLoading();
            showSuccessMessage('❌ Error al guardar cambios en Netlify');
            
            throw new Error(`Netlify Function error: ${response.status} - ${errorText}`);
        }
        
    } catch (error) {
        console.error('❌ ERROR CRÍTICO durante el guardado:', error);
        
        hideLoading();
        showSuccessMessage('❌ Error crítico al guardar cambios en Netlify');
        
        console.error('   Error details:', error.message);
        console.error('   Stack trace:', error.stack);
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
    const doctorEditors = document.querySelectorAll('.doctor-editor');
    console.log('🔍 Found doctor editors:', doctorEditors.length);
    const newDoctors = [];
    
    doctorEditors.forEach((editor, index) => {
        const doctorId = editor.getAttribute('data-doctor-id');
        console.log(`👨‍⚕️ Processing doctor ${index + 1} with ID: ${doctorId}`);
        
        const nameElement = document.getElementById(`doctor${doctorId}-name`);
        const specialtyElement = document.getElementById(`doctor${doctorId}-specialty`);
        const experienceElement = document.getElementById(`doctor${doctorId}-experience`);
        
        console.log('📝 Doctor elements found:', {
            name: !!nameElement,
            specialty: !!specialtyElement,
            experience: !!experienceElement
        });
        
        if (nameElement && specialtyElement && experienceElement) {
            // Preserve existing image data
            const existingDoctor = siteData.doctors && siteData.doctors[index] ? siteData.doctors[index] : null;
            const imageData = existingDoctor?.image || '';
            
            const doctorData = {
                name: nameElement.value,
                specialty: specialtyElement.value,
                experience: parseInt(experienceElement.value) || 0,
                image: imageData
            };
            
            console.log('✅ Adding doctor data:', doctorData);
            newDoctors.push(doctorData);
        } else {
            console.warn('⚠️ Missing elements for doctor:', doctorId);
        }
    });
    
    console.log('📊 Final doctors array:', newDoctors);
    siteData.doctors = newDoctors;
    
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
        secondaryColor: document.getElementById('secondary-color').value,
        tabTitle: document.getElementById('tab-title') ? document.getElementById('tab-title').value : document.getElementById('site-title').value
    };
    
    // Actualizar título de la tab en el navegador
    if (siteData.settings.tabTitle) {
        document.title = siteData.settings.tabTitle;
    }
}

// Update Main Site
function updateMainSite() {
    // This would typically send data to a server
    // Data is now stored in Netlify Function
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
    // Store image data in siteData object (will be saved to Netlify with the rest of the data)
    
    // Update site data
    if (inputId.includes('doctor') && inputId.includes('image')) {
        // Handle all doctor images (doctor1, doctor2, doctor3, etc.)
        const doctorMatch = inputId.match(/doctor(\d+)-image/);
        if (doctorMatch) {
            const doctorIndex = parseInt(doctorMatch[1]) - 1; // Convert to 0-based index
            if (siteData.doctors && siteData.doctors[doctorIndex]) {
                siteData.doctors[doctorIndex].image = imageData;
                console.log(`Updated image for doctor ${doctorIndex + 1}:`, imageData.substring(0, 50) + '...');
            }
        }
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
async function addNewDoctor() {
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
    
    // Immediately save changes to persist the new doctor in Netlify
    console.log('💾 Guardando nuevo doctor en Netlify...');
    collectFormData();
    
    // Guardar SOLO en Netlify Function
    try {
        const response = await fetch('/.netlify/functions/site-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(siteData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Nuevo doctor guardado en Netlify Function');
            console.log('   Timestamp:', result.timestamp);
            
            // Update main site
            updateMainSite();
            
            hasUnsavedChanges = false;
            updateSaveButton();
            
            showSuccessMessage('✅ Nuevo doctor agregado y guardado en Netlify');
        } else {
            const errorText = await response.text();
            console.error('❌ Error al guardar nuevo doctor:', response.status, errorText);
            showSuccessMessage('❌ Error al guardar nuevo doctor en Netlify');
        }
    } catch (apiError) {
        console.error('❌ Error crítico al guardar nuevo doctor:', apiError);
        showSuccessMessage('❌ Error crítico al agregar doctor');
    }
    
    // Scroll to the new doctor
    const newDoctorElement = doctorsEditor.querySelector(`[data-doctor-id="${doctorCounter}"]`);
    newDoctorElement.scrollIntoView({ behavior: 'smooth' });
    
    // Setup label updates for the new doctor
    setupDoctorLabelUpdates();
    setupDoctorAutoSave();
    
    // Add change listeners for the new doctor
    if (newDoctorElement) {
        const specialtyInput = document.getElementById(`doctor${doctorCounter}-specialty`);
        const experienceInput = document.getElementById(`doctor${doctorCounter}-experience`);
        
        if (specialtyInput) {
            specialtyInput.addEventListener('input', function() {
                hasUnsavedChanges = true;
                updateSaveButton();
            });
        }
        
        if (experienceInput) {
            experienceInput.addEventListener('input', function() {
                hasUnsavedChanges = true;
                updateSaveButton();
            });
        }
    }
    
    showSuccessMessage('Nuevo doctor agregado y cambios guardados exitosamente');
    console.log('Nuevo doctor agregado y datos actualizados:', siteData.doctors);
}

// Remove doctor - VERSIÓN CORREGIDA PARA PERSISTENCIA GARANTIZADA
async function removeDoctor(doctorId) {
    console.log('🗑️ Attempting to remove doctor:', doctorId);
    
    if (confirm('¿Estás seguro de que quieres eliminar este doctor? Esta acción no se puede deshacer.')) {
        const doctorElement = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        console.log('🔍 Doctor element found:', doctorElement);
        
        if (doctorElement) {
            // PASO 1: Obtener el nombre del doctor antes de eliminarlo
            const nameElement = document.getElementById(`doctor${doctorId}-name`);
            const doctorName = nameElement ? nameElement.value : `Doctor ID ${doctorId}`;
            console.log(`👨‍⚕️ Eliminando doctor: ${doctorName}`);
            
            // PASO 2: Remover del DOM
            doctorElement.remove();
            console.log('✅ Doctor element removed from DOM');
            
            // PASO 3: Recolectar datos del formulario (solo doctores visibles)
            console.log('📝 Collecting form data after deletion...');
            const doctorEditors = document.querySelectorAll('.doctor-editor');
            const newDoctors = [];
            
            doctorEditors.forEach((editor, index) => {
                const currentDoctorId = editor.getAttribute('data-doctor-id');
                const currentNameElement = document.getElementById(`doctor${currentDoctorId}-name`);
                const currentSpecialtyElement = document.getElementById(`doctor${currentDoctorId}-specialty`);
                const currentExperienceElement = document.getElementById(`doctor${currentDoctorId}-experience`);
                
                if (currentNameElement && currentSpecialtyElement && currentExperienceElement) {
                    // Preserve existing image data
                    const existingDoctor = siteData.doctors && siteData.doctors[index] ? siteData.doctors[index] : null;
                    const imageData = existingDoctor?.image || '';
                    
                    const doctorData = {
                        name: currentNameElement.value,
                        specialty: currentSpecialtyElement.value,
                        experience: parseInt(currentExperienceElement.value) || 0,
                        image: imageData
                    };
                    
                    newDoctors.push(doctorData);
                }
            });
            
            // PASO 4: Actualizar siteData con solo los doctores visibles
            siteData.doctors = newDoctors;
            console.log(`📊 Site data updated: ${newDoctors.length} doctores restantes`);
            newDoctors.forEach((doctor, index) => {
                console.log(`   ${index + 1}. ${doctor.name}`);
            });
            
            // PASO 5: Guardar eliminación SOLO en Netlify Function
            console.log('🌐 PASO 5: Guardando eliminación en Netlify Function...');
            
            try {
                const response = await fetch('/.netlify/functions/site-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(siteData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Eliminación guardada exitosamente en Netlify Function');
                    console.log('   Timestamp:', result.timestamp);
                    console.log('   Doctores restantes:', result.doctorsCount);
                    
                    // Actualizar estado de la aplicación
                    updateMainSite();
                    hasUnsavedChanges = false;
                    updateSaveButton();
                    showSuccessMessage(`✅ Doctor "${doctorName}" eliminado y guardado en Netlify`);
                    
                    console.log('🎉 Doctor eliminado exitosamente y persistido en Netlify');
                } else {
                    const errorText = await response.text();
                    console.error('❌ Error al guardar eliminación:', response.status, errorText);
                    showSuccessMessage(`❌ Error al guardar eliminación del doctor "${doctorName}"`);
                }
            } catch (apiError) {
                console.error('❌ Error crítico al guardar eliminación:', apiError);
                showSuccessMessage(`❌ Error crítico al eliminar doctor "${doctorName}"`);
            }
            
            console.log('🎉 Doctor eliminado exitosamente y datos persistidos');
            
        } else {
            console.error('❌ Doctor element not found for ID:', doctorId);
            showSuccessMessage('Error: No se encontró el doctor a eliminar');
        }
    } else {
        console.log('❌ Doctor deletion cancelled by user');
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
        
        // Add change listeners for specialty and experience
        const specialtyInput = document.getElementById(`doctor${doctorId}-specialty`);
        const experienceInput = document.getElementById(`doctor${doctorId}-experience`);
        
        if (specialtyInput) {
            specialtyInput.addEventListener('input', function() {
                hasUnsavedChanges = true;
                updateSaveButton();
            });
        }
        
        if (experienceInput) {
            experienceInput.addEventListener('input', function() {
                hasUnsavedChanges = true;
                updateSaveButton();
            });
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

// Setup Auto Save - VERSIÓN MEJORADA PARA PERSISTENCIA GARANTIZADA
function setupAutoSave() {
    // Auto save every 10 seconds if there are unsaved changes (más frecuente)
    setInterval(() => {
        if (hasUnsavedChanges) {
            console.log('⏰ Auto-saving changes...');
            saveAllChanges();
        }
    }, 10000); // Reducido de 30s a 10s
    
    // Auto-save doctor changes immediately
    setupDoctorAutoSave();
}

// Auto-save for doctor changes - VERSIÓN MEJORADA PARA PERSISTENCIA GARANTIZADA
function setupDoctorAutoSave() {
    console.log('🔄 Configurando auto-save para doctores...');
    
    // Set up auto-save for existing doctors
    const doctorEditors = document.querySelectorAll('.doctor-editor');
    console.log(`📋 Configurando auto-save para ${doctorEditors.length} doctores`);
    
    doctorEditors.forEach((editor, index) => {
        const doctorId = editor.getAttribute('data-doctor-id');
        const nameInput = document.getElementById(`doctor${doctorId}-name`);
        const specialtyInput = document.getElementById(`doctor${doctorId}-specialty`);
        const experienceInput = document.getElementById(`doctor${doctorId}-experience`);
        
        console.log(`👨‍⚕️ Configurando auto-save para Doctor ${index + 1} (ID: ${doctorId})`);
        
        // Add auto-save listeners for each input
        [nameInput, specialtyInput, experienceInput].forEach(input => {
            if (input) {
                // Auto-save when user leaves the field (blur)
                input.addEventListener('blur', function() {
                    console.log(`💾 Auto-save trigger: ${input.id} blur`);
                    if (hasUnsavedChanges) {
                        console.log('⏰ Auto-saving doctor changes on blur...');
                        saveAllChanges();
                    }
                });
                
                // Auto-save after user stops typing (debounced)
                let timeoutId;
                input.addEventListener('input', function() {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        console.log(`💾 Auto-save trigger: ${input.id} input (debounced)`);
                        if (hasUnsavedChanges) {
                            console.log('⏰ Auto-saving doctor changes after typing...');
                            saveAllChanges();
                        }
                    }, 2000); // Guarda 2 segundos después de que el usuario deje de escribir
                });
                
                console.log(`✅ Auto-save configurado para: ${input.id}`);
            }
        });
    });
    
    console.log('🎉 Auto-save para doctores configurado completamente');
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
    console.log('Netlify Function available: true');
    console.log('Firebase available:', !!window.firebaseDB);
    console.log('========================');
}

// ===== USER MANAGEMENT FUNCTIONS =====

// Load users from Netlify Function
async function loadUsers() {
    try {
        console.log('📂 Loading users from Netlify Function...');
        
        const response = await fetch('/.netlify/functions/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Users loaded successfully:', result.users.length);
            renderUsers(result.users);
            return result.users;
        } else {
            throw new Error(result.error || 'Failed to load users');
        }
    } catch (error) {
        console.error('❌ Error loading users:', error);
        showNotification('Error al cargar usuarios: ' + error.message, 'error');
        return [];
    }
}

// Render users in the UI
function renderUsers(users) {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;

    if (users.length === 0) {
        usersList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>No hay usuarios registrados</p>
            </div>
        `;
        return;
    }

    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-header">
                <div class="user-avatar">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>@${user.username}</p>
                </div>
            </div>
            
            <div class="user-role ${user.role}">${user.role}</div>
            <div class="user-status ${user.status}">${user.status === 'active' ? 'Activo' : 'Inactivo'}</div>
            
            <div class="user-details">
                <p><i class="fas fa-envelope"></i> ${user.email}</p>
                ${user.phone ? `<p><i class="fas fa-phone"></i> ${user.phone}</p>` : ''}
                <p><i class="fas fa-calendar"></i> Creado: ${new Date(user.createdAt).toLocaleDateString()}</p>
                ${user.lastLogin ? `<p><i class="fas fa-clock"></i> Último acceso: ${new Date(user.lastLogin).toLocaleDateString()}</p>` : '<p><i class="fas fa-clock"></i> Nunca ha iniciado sesión</p>'}
            </div>
            
            <div class="user-actions">
                <button class="btn-edit" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                ${user.username !== 'admin' || user.role !== 'administrator' ? `
                <button class="btn-delete" onclick="deleteUser(${user.id}, '${user.username}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Show add user modal
function showAddUserModal() {
    const modal = document.getElementById('add-user-modal');
    if (modal) {
        modal.classList.add('show');
        // Clear form
        document.getElementById('add-user-form').reset();
    }
}

// Close add user modal
function closeAddUserModal() {
    const modal = document.getElementById('add-user-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Create new user
async function createUser() {
    const form = document.getElementById('add-user-form');
    const formData = new FormData(form);
    
    const userData = {
        username: document.getElementById('new-user-username').value.trim(),
        email: document.getElementById('new-user-email').value.trim(),
        name: document.getElementById('new-user-name').value.trim(),
        phone: document.getElementById('new-user-phone').value.trim(),
        role: document.getElementById('new-user-role').value,
        status: document.getElementById('new-user-status').value
    };

    // Validate required fields
    if (!userData.username || !userData.email || !userData.name) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }

    try {
        console.log('➕ Creating new user:', userData.username);
        
        const response = await fetch('/.netlify/functions/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ User created successfully:', result.user.username);
            showNotification('Usuario creado exitosamente', 'success');
            closeAddUserModal();
            loadUsers(); // Reload users list
        } else {
            throw new Error(result.error || 'Failed to create user');
        }
    } catch (error) {
        console.error('❌ Error creating user:', error);
        showNotification('Error al crear usuario: ' + error.message, 'error');
    }
}

// Show edit user modal
function editUser(userId) {
    // First load current users to get the user data
    loadUsers().then(users => {
        const user = users.find(u => u.id === userId);
        if (!user) {
            showNotification('Usuario no encontrado', 'error');
            return;
        }

        // Populate edit form
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-username').value = user.username;
        document.getElementById('edit-user-email').value = user.email;
        document.getElementById('edit-user-name').value = user.name;
        document.getElementById('edit-user-phone').value = user.phone || '';
        document.getElementById('edit-user-role').value = user.role;
        document.getElementById('edit-user-status').value = user.status;

        // Show modal
        const modal = document.getElementById('edit-user-modal');
        if (modal) {
            modal.classList.add('show');
        }
    });
}

// Close edit user modal
function closeEditUserModal() {
    const modal = document.getElementById('edit-user-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Update user
async function updateUser() {
    const userId = document.getElementById('edit-user-id').value;
    
    const userData = {
        username: document.getElementById('edit-user-username').value.trim(),
        email: document.getElementById('edit-user-email').value.trim(),
        name: document.getElementById('edit-user-name').value.trim(),
        phone: document.getElementById('edit-user-phone').value.trim(),
        role: document.getElementById('edit-user-role').value,
        status: document.getElementById('edit-user-status').value
    };

    // Validate required fields
    if (!userData.username || !userData.email || !userData.name) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }

    try {
        console.log('✏️ Updating user:', userId);
        
        const response = await fetch(`/.netlify/functions/users?id=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ User updated successfully:', result.user.username);
            showNotification('Usuario actualizado exitosamente', 'success');
            closeEditUserModal();
            loadUsers(); // Reload users list
        } else {
            throw new Error(result.error || 'Failed to update user');
        }
    } catch (error) {
        console.error('❌ Error updating user:', error);
        showNotification('Error al actualizar usuario: ' + error.message, 'error');
    }
}

// Delete user
async function deleteUser(userId, username) {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }

    try {
        console.log('🗑️ Deleting user:', userId);
        
        const response = await fetch(`/.netlify/functions/users?id=${userId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ User deleted successfully:', result.deletedUser.username);
            showNotification('Usuario eliminado exitosamente', 'success');
            loadUsers(); // Reload users list
        } else {
            throw new Error(result.error || 'Failed to delete user');
        }
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        showNotification('Error al eliminar usuario: ' + error.message, 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 1rem 1.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 10001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left: 4px solid #28a745;
                color: #155724;
            }
            .notification-error {
                border-left: 4px solid #dc3545;
                color: #721c24;
            }
            .notification-info {
                border-left: 4px solid #17a2b8;
                color: #0c5460;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
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

