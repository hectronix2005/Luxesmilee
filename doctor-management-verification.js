// Doctor Management Verification Script
// This script verifies the dynamic doctor management functionality

// Function to verify doctor management UI
function verifyDoctorManagementUI() {
    console.log("👩‍⚕️ Verificando interfaz de gestión de doctores...");
    
    // Check if we're on admin page
    if (window.location.pathname.includes('admin.html')) {
        // Check for add doctor button
        const addButton = document.querySelector('.btn-add');
        if (addButton) {
            console.log("✅ Botón 'Agregar Doctor' encontrado");
        } else {
            console.error("❌ Botón 'Agregar Doctor' no encontrado");
        }
        
        // Check for existing doctors
        const doctorEditors = document.querySelectorAll('.doctor-editor');
        console.log(`✅ Editores de doctores encontrados: ${doctorEditors.length}`);
        
        // Check for remove buttons
        const removeButtons = document.querySelectorAll('.btn-remove');
        console.log(`✅ Botones de eliminar encontrados: ${removeButtons.length}`);
        
        // Check doctor headers
        const doctorHeaders = document.querySelectorAll('.doctor-header');
        console.log(`✅ Encabezados de doctores encontrados: ${doctorHeaders.length}`);
        
    } else {
        console.log("ℹ️ No estamos en la página de admin, saltando verificación de UI");
    }
}

// Function to test add doctor functionality
function testAddDoctor() {
    console.log("➕ Probando funcionalidad de agregar doctor...");
    
    if (window.location.pathname.includes('admin.html')) {
        const initialDoctors = document.querySelectorAll('.doctor-editor').length;
        console.log(`Doctores iniciales: ${initialDoctors}`);
        
        // Try to add a new doctor
        if (typeof addNewDoctor === 'function') {
            addNewDoctor();
            
            setTimeout(() => {
                const newDoctors = document.querySelectorAll('.doctor-editor').length;
                console.log(`Doctores después de agregar: ${newDoctors}`);
                
                if (newDoctors > initialDoctors) {
                    console.log("✅ Doctor agregado exitosamente");
                } else {
                    console.error("❌ Error al agregar doctor");
                }
            }, 1000);
        } else {
            console.error("❌ Función addNewDoctor no encontrada");
        }
    } else {
        console.log("ℹ️ No estamos en la página de admin, saltando prueba de agregar doctor");
    }
}

// Function to test remove doctor functionality
function testRemoveDoctor() {
    console.log("🗑️ Probando funcionalidad de eliminar doctor...");
    
    if (window.location.pathname.includes('admin.html')) {
        const doctors = document.querySelectorAll('.doctor-editor');
        console.log(`Doctores disponibles para eliminar: ${doctors.length}`);
        
        if (doctors.length > 2) { // Only test if we have more than the default 2 doctors
            const lastDoctor = doctors[doctors.length - 1];
            const doctorId = lastDoctor.getAttribute('data-doctor-id');
            
            if (typeof removeDoctor === 'function') {
                console.log(`Probando eliminar doctor con ID: ${doctorId}`);
                // Note: We won't actually call removeDoctor to avoid breaking the UI
                console.log("✅ Función removeDoctor disponible");
            } else {
                console.error("❌ Función removeDoctor no encontrada");
            }
        } else {
            console.log("ℹ️ No hay doctores adicionales para probar eliminación");
        }
    } else {
        console.log("ℹ️ No estamos en la página de admin, saltando prueba de eliminar doctor");
    }
}

// Function to verify main site doctor display
function verifyMainSiteDoctorDisplay() {
    console.log("🏥 Verificando visualización de doctores en el sitio principal...");
    
    if (!window.location.pathname.includes('admin.html')) {
        const doctorsContainer = document.getElementById('doctors-container');
        if (doctorsContainer) {
            console.log("✅ Contenedor de doctores encontrado");
            
            const doctorCards = doctorsContainer.querySelectorAll('.doctor-card');
            console.log(`✅ Tarjetas de doctores encontradas: ${doctorCards.length}`);
            
            doctorCards.forEach((card, index) => {
                const name = card.querySelector('h3');
                const specialty = card.querySelector('.specialty');
                const experience = card.querySelector('.experience-number');
                const image = card.querySelector('img');
                
                if (name && specialty && experience && image) {
                    console.log(`✅ Doctor ${index + 1}: ${name.textContent} - ${specialty.textContent} - ${experience.textContent}`);
                } else {
                    console.error(`❌ Doctor ${index + 1}: Elementos faltantes`);
                }
            });
        } else {
            console.error("❌ Contenedor de doctores no encontrado");
        }
    } else {
        console.log("ℹ️ Estamos en la página de admin, saltando verificación del sitio principal");
    }
}

// Function to verify doctor data persistence
function verifyDoctorDataPersistence() {
    console.log("💾 Verificando persistencia de datos de doctores...");
    
    const adminData = localStorage.getItem('siteData');
    if (adminData) {
        const data = JSON.parse(adminData);
        if (data.doctors) {
            console.log(`✅ Datos de doctores encontrados en localStorage: ${data.doctors.length} doctores`);
            
            data.doctors.forEach((doctor, index) => {
                console.log(`  - Doctor ${index + 1}: ${doctor.name} (${doctor.experience} años de experiencia)`);
            });
        } else {
            console.log("ℹ️ No hay datos de doctores en localStorage");
        }
    } else {
        console.log("ℹ️ No hay datos del admin en localStorage");
    }
}

// Function to test doctor counter
function testDoctorCounter() {
    console.log("🔢 Verificando contador de doctores...");
    
    if (window.location.pathname.includes('admin.html')) {
        if (typeof doctorCounter !== 'undefined') {
            console.log(`✅ Contador de doctores: ${doctorCounter}`);
        } else {
            console.error("❌ Variable doctorCounter no encontrada");
        }
    } else {
        console.log("ℹ️ No estamos en la página de admin, saltando verificación del contador");
    }
}

// Run verification when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Iniciando verificación de gestión de doctores...");
    
    setTimeout(() => {
        verifyDoctorManagementUI();
        verifyMainSiteDoctorDisplay();
        verifyDoctorDataPersistence();
        testDoctorCounter();
        
        // Test functionality after a delay
        setTimeout(() => {
            testAddDoctor();
            testRemoveDoctor();
        }, 2000);
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        verifyDoctorManagementUI, 
        testAddDoctor, 
        testRemoveDoctor, 
        verifyMainSiteDoctorDisplay, 
        verifyDoctorDataPersistence 
    };
}


