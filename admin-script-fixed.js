// ADMIN SCRIPT FIXED - Solución definitiva para persistencia de doctores
// Este script reemplaza completamente la funcionalidad problemática

console.log('🔧 Admin Script Fixed - Cargando...');

// Variables globales
let siteData = {};
let hasUnsavedChanges = false;
let doctorCounter = 2;

// Función para verificar si estamos en Netlify
function isNetlifyEnvironment() {
    return window.location.hostname.includes('netlify.app') || 
           window.location.hostname.includes('luxe-smilee.netlify.app');
}

// Función mejorada para cargar datos
async function loadSiteDataFixed() {
    console.log('🔄 Cargando datos con Admin Script Fixed...');
    
    try {
        // 1. Intentar cargar desde Netlify Functions si están disponibles
        if (isNetlifyEnvironment()) {
            try {
                const response = await fetch('/.netlify/functions/site-data');
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Datos cargados desde Netlify Functions:', data);
                    siteData = data;
                    populateFormsFixed();
                    return;
                }
            } catch (error) {
                console.log('⚠️ Netlify Functions no disponibles, usando localStorage');
            }
        }
        
        // 2. Cargar desde localStorage
        const savedData = localStorage.getItem('siteData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                console.log('✅ Datos cargados desde localStorage:', data);
                siteData = data;
                populateFormsFixed();
                return;
            } catch (error) {
                console.error('❌ Error al parsear datos de localStorage:', error);
            }
        }
        
        // 3. Cargar datos por defecto
        console.log('ℹ️ Cargando datos por defecto');
        loadDefaultDataFixed();
        
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        loadDefaultDataFixed();
    }
}

// Función mejorada para guardar datos
async function saveSiteDataFixed(data) {
    console.log('💾 Guardando datos con Admin Script Fixed...');
    
    try {
        // 1. Intentar guardar en Netlify Functions si están disponibles
        if (isNetlifyEnvironment()) {
            try {
                const response = await fetch('/.netlify/functions/site-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Datos guardados en Netlify Functions:', result);
                    
                    // También guardar en localStorage como backup
                    localStorage.setItem('siteData', JSON.stringify(data));
                    console.log('💾 Backup guardado en localStorage');
                    return true;
                }
            } catch (error) {
                console.log('⚠️ Error al guardar en Netlify Functions:', error);
            }
        }
        
        // 2. Guardar en localStorage
        localStorage.setItem('siteData', JSON.stringify(data));
        console.log('✅ Datos guardados en localStorage');
        return true;
        
    } catch (error) {
        console.error('❌ Error al guardar datos:', error);
        return false;
    }
}

// Función para obtener datos por defecto
function loadDefaultDataFixed() {
    console.log('📋 Cargando datos por defecto...');
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
            tabTitle: "Odontología Peña - Herrera"
        }
    };
    
    populateFormsFixed();
}

// Función mejorada para poblar formularios
function populateFormsFixed() {
    console.log('📝 Poblando formularios con Admin Script Fixed...');
    
    // Hero Section
    if (siteData.hero) {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroFeatures = document.getElementById('hero-features');
        
        if (heroTitle) heroTitle.value = siteData.hero.title || '';
        if (heroSubtitle) heroSubtitle.value = siteData.hero.subtitle || '';
        if (heroFeatures) heroFeatures.value = siteData.hero.features ? siteData.hero.features.join('\n') : '';
    }
    
    // Doctors - CRITICAL FIX: Rebuild from saved data only
    if (siteData.doctors) {
        const doctorsEditor = document.querySelector('.doctors-editor');
        if (doctorsEditor) {
            // Clear ALL existing doctors
            const existingDoctors = doctorsEditor.querySelectorAll('.doctor-editor[data-doctor-id]');
            existingDoctors.forEach((doctor) => {
                doctor.remove();
            });
            
            // Reset doctor counter
            doctorCounter = 0;
            
            // Rebuild doctors from saved data ONLY
            siteData.doctors.forEach((doctor, index) => {
                doctorCounter++;
                
                const doctorHTML = `
                    <div class="doctor-editor" data-doctor-id="${doctorCounter}">
                        <div class="doctor-header">
                            <h3>${doctor.name || 'Doctor'}</h3>
                            <button class="btn-remove" onclick="removeDoctorFixed(${doctorCounter})" title="Eliminar doctor">
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
            
            console.log(`✅ ${siteData.doctors.length} doctores reconstruidos desde datos guardados`);
        }
    }
    
    // Services
    if (siteData.services) {
        siteData.services.forEach((service, index) => {
            const num = index + 1;
            const titleElement = document.getElementById(`service${num}-title`);
            const descriptionElement = document.getElementById(`service${num}-description`);
            const featuresElement = document.getElementById(`service${num}-features`);
            const priceElement = document.getElementById(`service${num}-price`);
            const videoElement = document.getElementById(`service${num}-video`);
            
            if (titleElement) titleElement.value = service.title || '';
            if (descriptionElement) descriptionElement.value = service.description || '';
            if (featuresElement) featuresElement.value = service.features ? service.features.join('\n') : '';
            if (priceElement) priceElement.value = service.price || '';
            if (videoElement) videoElement.value = service.video || '';
        });
    }
    
    // Gallery
    if (siteData.gallery) {
        siteData.gallery.forEach((item, index) => {
            const num = index + 1;
            const titleElement = document.getElementById(`gallery${num}-title`);
            const descriptionElement = document.getElementById(`gallery${num}-description`);
            
            if (titleElement) titleElement.value = item.title || '';
            if (descriptionElement) descriptionElement.value = item.description || '';
        });
    }
    
    // Testimonials
    if (siteData.testimonials) {
        siteData.testimonials.forEach((testimonial, index) => {
            const num = index + 1;
            const nameElement = document.getElementById(`testimonial${num}-name`);
            const treatmentElement = document.getElementById(`testimonial${num}-treatment`);
            const quoteElement = document.getElementById(`testimonial${num}-quote`);
            const videoElement = document.getElementById(`testimonial${num}-video`);
            
            if (nameElement) nameElement.value = testimonial.name || '';
            if (treatmentElement) treatmentElement.value = testimonial.treatment || '';
            if (quoteElement) quoteElement.value = testimonial.quote || '';
            if (videoElement) videoElement.value = testimonial.video || '';
        });
    }
    
    // Contact
    if (siteData.contact) {
        const addressElement = document.getElementById('contact-address');
        const cityElement = document.getElementById('contact-city');
        const phoneElement = document.getElementById('contact-phone');
        const emailElement = document.getElementById('contact-email');
        
        if (addressElement) addressElement.value = siteData.contact.address || '';
        if (cityElement) cityElement.value = siteData.contact.city || '';
        if (phoneElement) phoneElement.value = siteData.contact.phone || '';
        if (emailElement) emailElement.value = siteData.contact.email || '';
    }
    
    // Settings
    if (siteData.settings) {
        const siteTitleElement = document.getElementById('site-title');
        const siteDescriptionElement = document.getElementById('site-description');
        const primaryColorElement = document.getElementById('primary-color');
        const secondaryColorElement = document.getElementById('secondary-color');
        const tabTitleElement = document.getElementById('tab-title');
        
        if (siteTitleElement) siteTitleElement.value = siteData.settings.siteTitle || '';
        if (siteDescriptionElement) siteDescriptionElement.value = siteData.settings.siteDescription || '';
        if (primaryColorElement) primaryColorElement.value = siteData.settings.primaryColor || '#4A90E2';
        if (secondaryColorElement) secondaryColorElement.value = siteData.settings.secondaryColor || '#357ABD';
        if (tabTitleElement) tabTitleElement.value = siteData.settings.tabTitle || siteData.settings.siteTitle || '';
    }
}

// Función mejorada para recolectar datos
function collectFormDataFixed() {
    console.log('📊 Recolectando datos con Admin Script Fixed...');
    
    // Hero Section
    if (siteData.hero) {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroFeatures = document.getElementById('hero-features');
        
        siteData.hero = {
            title: heroTitle ? heroTitle.value : '',
            subtitle: heroSubtitle ? heroSubtitle.value : '',
            features: heroFeatures ? heroFeatures.value.split('\n').filter(line => line.trim()) : []
        };
    }
    
    // Doctors - CRITICAL FIX: Collect from DOM elements
    const doctorEditors = document.querySelectorAll('.doctor-editor');
    const newDoctors = [];
    
    doctorEditors.forEach((editor, index) => {
        const doctorId = editor.getAttribute('data-doctor-id');
        
        const nameElement = document.getElementById(`doctor${doctorId}-name`);
        const specialtyElement = document.getElementById(`doctor${doctorId}-specialty`);
        const experienceElement = document.getElementById(`doctor${doctorId}-experience`);
        
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
            
            newDoctors.push(doctorData);
        }
    });
    
    siteData.doctors = newDoctors;
    console.log(`📊 ${newDoctors.length} doctores recolectados`);
    
    // Services
    siteData.services = [];
    for (let i = 1; i <= 4; i++) {
        const titleElement = document.getElementById(`service${i}-title`);
        const descriptionElement = document.getElementById(`service${i}-description`);
        const featuresElement = document.getElementById(`service${i}-features`);
        const priceElement = document.getElementById(`service${i}-price`);
        const videoElement = document.getElementById(`service${i}-video`);
        
        siteData.services.push({
            title: titleElement ? titleElement.value : '',
            description: descriptionElement ? descriptionElement.value : '',
            features: featuresElement ? featuresElement.value.split('\n').filter(line => line.trim()) : [],
            price: priceElement ? priceElement.value : '',
            video: videoElement ? videoElement.value : '',
            thumbnail: siteData.services[i-1]?.thumbnail || ''
        });
    }
    
    // Gallery
    siteData.gallery = [];
    for (let i = 1; i <= 3; i++) {
        const titleElement = document.getElementById(`gallery${i}-title`);
        const descriptionElement = document.getElementById(`gallery${i}-description`);
        
        siteData.gallery.push({
            title: titleElement ? titleElement.value : '',
            description: descriptionElement ? descriptionElement.value : '',
            beforeImage: siteData.gallery[i-1]?.beforeImage || '',
            afterImage: siteData.gallery[i-1]?.afterImage || ''
        });
    }
    
    // Testimonials
    siteData.testimonials = [];
    for (let i = 1; i <= 3; i++) {
        const nameElement = document.getElementById(`testimonial${i}-name`);
        const treatmentElement = document.getElementById(`testimonial${i}-treatment`);
        const quoteElement = document.getElementById(`testimonial${i}-quote`);
        const videoElement = document.getElementById(`testimonial${i}-video`);
        
        siteData.testimonials.push({
            name: nameElement ? nameElement.value : '',
            treatment: treatmentElement ? treatmentElement.value : '',
            quote: quoteElement ? quoteElement.value : '',
            video: videoElement ? videoElement.value : '',
            thumbnail: siteData.testimonials[i-1]?.thumbnail || ''
        });
    }
    
    // Contact
    const addressElement = document.getElementById('contact-address');
    const cityElement = document.getElementById('contact-city');
    const phoneElement = document.getElementById('contact-phone');
    const emailElement = document.getElementById('contact-email');
    
    siteData.contact = {
        address: addressElement ? addressElement.value : '',
        city: cityElement ? cityElement.value : '',
        phone: phoneElement ? phoneElement.value : '',
        email: emailElement ? emailElement.value : ''
    };
    
    // Settings
    const siteTitleElement = document.getElementById('site-title');
    const siteDescriptionElement = document.getElementById('site-description');
    const primaryColorElement = document.getElementById('primary-color');
    const secondaryColorElement = document.getElementById('secondary-color');
    const tabTitleElement = document.getElementById('tab-title');
    
    siteData.settings = {
        siteTitle: siteTitleElement ? siteTitleElement.value : '',
        siteDescription: siteDescriptionElement ? siteDescriptionElement.value : '',
        primaryColor: primaryColorElement ? primaryColorElement.value : '#4A90E2',
        secondaryColor: secondaryColorElement ? secondaryColorElement.value : '#357ABD',
        tabTitle: tabTitleElement ? tabTitleElement.value : (siteTitleElement ? siteTitleElement.value : '')
    };
}

// Función mejorada para guardar cambios
async function saveAllChangesFixed() {
    console.log('💾 Guardando cambios con Admin Script Fixed...');
    
    try {
        // Collect all form data
        collectFormDataFixed();
        
        // Save data
        const saveSuccess = await saveSiteDataFixed(siteData);
        
        if (saveSuccess) {
            console.log('✅ Cambios guardados exitosamente');
            hasUnsavedChanges = false;
            updateSaveButton();
            showSuccessMessage('Cambios guardados exitosamente');
        } else {
            console.error('❌ Error al guardar cambios');
            showSuccessMessage('Error al guardar cambios');
        }
        
    } catch (error) {
        console.error('❌ Error al guardar cambios:', error);
        showSuccessMessage('Error al guardar cambios');
    }
}

// Función mejorada para eliminar doctores
async function removeDoctorFixed(doctorId) {
    console.log(`🗑️ Eliminando doctor ID: ${doctorId} con Admin Script Fixed`);
    
    if (confirm('¿Estás seguro de que quieres eliminar este doctor? Esta acción no se puede deshacer.')) {
        const doctorElement = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        
        if (doctorElement) {
            // Remove from DOM
            doctorElement.remove();
            console.log('✅ Doctor eliminado del DOM');
            
            // Immediately collect form data to update siteData
            collectFormDataFixed();
            console.log('📊 Datos recolectados después de eliminación');
            
            // Save changes immediately
            const saveSuccess = await saveSiteDataFixed(siteData);
            
            if (saveSuccess) {
                console.log('✅ Doctor eliminado y cambios guardados permanentemente');
                hasUnsavedChanges = false;
                updateSaveButton();
                showSuccessMessage('Doctor eliminado y cambios guardados permanentemente');
            } else {
                console.error('❌ Error al guardar eliminación');
                showSuccessMessage('Error al guardar eliminación');
            }
        } else {
            console.error('❌ No se encontró el elemento del doctor');
            showSuccessMessage('Error: No se encontró el doctor a eliminar');
        }
    } else {
        console.log('❌ Eliminación cancelada por el usuario');
    }
}

// Función para agregar nuevo doctor
async function addNewDoctorFixed() {
    console.log('➕ Agregando nuevo doctor con Admin Script Fixed...');
    
    doctorCounter++;
    const doctorsEditor = document.querySelector('.doctors-editor');
    
    const newDoctorHTML = `
        <div class="doctor-editor" data-doctor-id="${doctorCounter}">
            <div class="doctor-header">
                <h3>Nuevo Doctor</h3>
                <button class="btn-remove" onclick="removeDoctorFixed(${doctorCounter})" title="Eliminar doctor">
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
    
    // Immediately save changes
    collectFormDataFixed();
    const saveSuccess = await saveSiteDataFixed(siteData);
    
    if (saveSuccess) {
        console.log('✅ Nuevo doctor agregado y guardado');
        hasUnsavedChanges = false;
        updateSaveButton();
        showSuccessMessage('Nuevo doctor agregado exitosamente');
    } else {
        console.error('❌ Error al guardar nuevo doctor');
        showSuccessMessage('Error al guardar nuevo doctor');
        hasUnsavedChanges = true;
        updateSaveButton();
    }
}

// Funciones auxiliares
function updateSaveButton() {
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) {
        if (hasUnsavedChanges) {
            saveBtn.style.background = '#ff9800';
            saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Guardar Cambios';
        } else {
            saveBtn.style.background = '#4CAF50';
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        }
    }
}

function showSuccessMessage(message) {
    console.log('✅ ' + message);
    // Aquí podrías mostrar un mensaje en la UI si existe el elemento
    const messageElement = document.getElementById('success-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}

function previewImage(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Función para inicializar el script fixed
async function initializeAdminScriptFixed() {
    console.log('🚀 Inicializando Admin Script Fixed...');
    
    // Verificar si estamos en el admin
    if (!document.querySelector('.doctors-editor')) {
        console.log('⚠️ No se encontró el editor de doctores, saliendo...');
        return;
    }
    
    // Cargar datos
    await loadSiteDataFixed();
    
    // Reemplazar funciones originales
    if (typeof window.loadSiteData === 'function') {
        window.loadSiteData = loadSiteDataFixed;
        console.log('✅ Función loadSiteData reemplazada');
    }
    
    if (typeof window.saveAllChanges === 'function') {
        window.saveAllChanges = saveAllChangesFixed;
        console.log('✅ Función saveAllChanges reemplazada');
    }
    
    if (typeof window.removeDoctor === 'function') {
        window.removeDoctor = removeDoctorFixed;
        console.log('✅ Función removeDoctor reemplazada');
    }
    
    if (typeof window.addNewDoctor === 'function') {
        window.addNewDoctor = addNewDoctorFixed;
        console.log('✅ Función addNewDoctor reemplazada');
    }
    
    if (typeof window.populateForms === 'function') {
        window.populateForms = populateFormsFixed;
        console.log('✅ Función populateForms reemplazada');
    }
    
    if (typeof window.collectFormData === 'function') {
        window.collectFormData = collectFormDataFixed;
        console.log('✅ Función collectFormData reemplazada');
    }
    
    console.log('🎉 Admin Script Fixed inicializado correctamente');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminScriptFixed);
} else {
    initializeAdminScriptFixed();
}

console.log('🔧 Admin Script Fixed - Script cargado');

