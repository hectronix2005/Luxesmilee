// DOCTOR PERSISTENCE FIX - Solución definitiva para persistencia de doctores
// Este script se puede agregar al admin actual para solucionar el problema

console.log('🔧 Doctor Persistence Fix - Cargando...');

// Función para verificar si estamos en Netlify
function isNetlifyEnvironment() {
    return window.location.hostname.includes('netlify.app') || 
           window.location.hostname.includes('luxe-smilee.netlify.app');
}

// Función para verificar si las Netlify Functions están disponibles
async function checkNetlifyFunctions() {
    try {
        const response = await fetch('/.netlify/functions/site-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.ok;
    } catch (error) {
        console.log('Netlify Functions no disponibles:', error);
        return false;
    }
}

// Función mejorada para cargar datos
async function loadSiteDataFixed() {
    console.log('🔄 Cargando datos con Doctor Persistence Fix...');
    
    try {
        // 1. Intentar cargar desde Netlify Functions si están disponibles
        if (isNetlifyEnvironment()) {
            try {
                const response = await fetch('/.netlify/functions/site-data');
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Datos cargados desde Netlify Functions:', data);
                    return data;
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
                return data;
            } catch (error) {
                console.error('❌ Error al parsear datos de localStorage:', error);
            }
        }
        
        // 3. Cargar datos por defecto
        console.log('ℹ️ Cargando datos por defecto');
        return getDefaultSiteData();
        
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        return getDefaultSiteData();
    }
}

// Función mejorada para guardar datos
async function saveSiteDataFixed(data) {
    console.log('💾 Guardando datos con Doctor Persistence Fix...');
    
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
function getDefaultSiteData() {
    return {
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
}

// Función mejorada para eliminar doctores
async function removeDoctorFixed(doctorId) {
    console.log('🗑️ Eliminando doctor con Doctor Persistence Fix:', doctorId);
    
    if (confirm('¿Estás seguro de que quieres eliminar este doctor? Esta acción no se puede deshacer.')) {
        const doctorElement = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        
        if (doctorElement) {
            // 1. Eliminar del DOM
            doctorElement.remove();
            console.log('✅ Doctor eliminado del DOM');
            
            // 2. Cargar datos actuales
            const currentData = await loadSiteDataFixed();
            
            // 3. Filtrar el doctor eliminado
            if (currentData.doctors) {
                currentData.doctors = currentData.doctors.filter((doctor, index) => {
                    // Usar el índice para identificar el doctor (ya que no tenemos ID único)
                    const doctorElementIndex = Array.from(document.querySelectorAll('.doctor-editor')).indexOf(doctorElement);
                    return index !== doctorElementIndex;
                });
            }
            
            // 4. Guardar datos actualizados
            const saveSuccess = await saveSiteDataFixed(currentData);
            
            if (saveSuccess) {
                console.log('✅ Doctor eliminado y datos guardados permanentemente');
                alert('Doctor eliminado exitosamente. Los cambios se han guardado permanentemente.');
            } else {
                console.error('❌ Error al guardar datos después de eliminar doctor');
                alert('Doctor eliminado, pero hubo un error al guardar los cambios.');
            }
        } else {
            console.error('❌ No se encontró el elemento del doctor');
            alert('Error: No se pudo encontrar el doctor a eliminar.');
        }
    }
}

// Función para poblar formularios con datos guardados
function populateFormsFixed(data) {
    console.log('📝 Poblando formularios con datos guardados:', data);
    
    if (!data || !data.doctors) {
        console.log('⚠️ No hay datos de doctores para poblar');
        return;
    }
    
    const doctorsEditor = document.querySelector('.doctors-editor');
    if (!doctorsEditor) {
        console.error('❌ No se encontró el contenedor de doctores');
        return;
    }
    
    // Limpiar doctores existentes
    const existingDoctors = doctorsEditor.querySelectorAll('.doctor-editor[data-doctor-id]');
    existingDoctors.forEach(doctor => doctor.remove());
    
    // Reconstruir doctores desde datos guardados
    data.doctors.forEach((doctor, index) => {
        const doctorId = index + 1;
        
        const doctorHTML = `
            <div class="doctor-editor" data-doctor-id="${doctorId}">
                <div class="doctor-header">
                    <h3>${doctor.name || 'Doctor'}</h3>
                    <button class="btn-remove" onclick="removeDoctorFixed(${doctorId})" title="Eliminar doctor">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="doctor${doctorId}-name">Nombre</label>
                        <input type="text" id="doctor${doctorId}-name" value="${doctor.name || ''}">
                    </div>
                    <div class="form-group">
                        <label for="doctor${doctorId}-specialty">Especialidad</label>
                        <input type="text" id="doctor${doctorId}-specialty" value="${doctor.specialty || ''}">
                    </div>
                    <div class="form-group">
                        <label for="doctor${doctorId}-experience">Años de Experiencia</label>
                        <input type="number" id="doctor${doctorId}-experience" value="${doctor.experience || ''}">
                    </div>
                    <div class="form-group">
                        <label for="doctor${doctorId}-image">Foto</label>
                        <div class="image-upload">
                            <input type="file" id="doctor${doctorId}-image" accept="image/*" onchange="previewImage(this, 'doctor${doctorId}-preview')">
                            <div class="upload-area" onclick="document.getElementById('doctor${doctorId}-image').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Subir foto</span>
                            </div>
                            <div class="image-preview" id="doctor${doctorId}-preview">
                                <img src="${doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=250&fit=crop&crop=face&auto=format&q=80'}" alt="${doctor.name || 'Doctor'}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        doctorsEditor.insertAdjacentHTML('beforeend', doctorHTML);
    });
    
    console.log(`✅ ${data.doctors.length} doctores cargados desde datos guardados`);
}

// Función para inicializar el fix
async function initializeDoctorPersistenceFix() {
    console.log('🚀 Inicializando Doctor Persistence Fix...');
    
    // Verificar si estamos en el admin
    if (!document.querySelector('.doctors-editor')) {
        console.log('⚠️ No se encontró el editor de doctores, saliendo...');
        return;
    }
    
    // Cargar datos guardados
    const savedData = await loadSiteDataFixed();
    
    // Poblar formularios con datos guardados
    populateFormsFixed(savedData);
    
    // Reemplazar la función removeDoctor original
    if (typeof window.removeDoctor === 'function') {
        window.removeDoctor = removeDoctorFixed;
        console.log('✅ Función removeDoctor reemplazada con versión mejorada');
    }
    
    console.log('🎉 Doctor Persistence Fix inicializado correctamente');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDoctorPersistenceFix);
} else {
    initializeDoctorPersistenceFix();
}

console.log('🔧 Doctor Persistence Fix - Script cargado');

