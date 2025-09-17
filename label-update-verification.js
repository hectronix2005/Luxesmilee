// Label Update Verification Script
// This script verifies the dynamic label update functionality for doctors

// Function to verify label update functionality
function verifyLabelUpdateFunctionality() {
    console.log("🏷️ Verificando funcionalidad de actualización de labels...");
    
    if (window.location.pathname.includes('admin.html')) {
        const doctorEditors = document.querySelectorAll('.doctor-editor');
        console.log(`✅ Editores de doctores encontrados: ${doctorEditors.length}`);
        
        doctorEditors.forEach((editor, index) => {
            const doctorId = editor.getAttribute('data-doctor-id');
            const nameInput = document.getElementById(`doctor${doctorId}-name`);
            const titleElement = editor.querySelector('h3');
            
            if (nameInput && titleElement) {
                console.log(`✅ Doctor ${index + 1} (ID: ${doctorId}): Input y título encontrados`);
                
                // Test the label update functionality
                const originalName = nameInput.value;
                const testName = "Dr. Test " + Date.now();
                
                // Simulate typing in the input
                nameInput.value = testName;
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Check if the title was updated
                setTimeout(() => {
                    if (titleElement.textContent === testName) {
                        console.log(`✅ Doctor ${index + 1}: Label actualizado correctamente`);
                    } else {
                        console.error(`❌ Doctor ${index + 1}: Label no se actualizó correctamente`);
                    }
                    
                    // Restore original name
                    nameInput.value = originalName;
                    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                }, 100);
                
            } else {
                console.error(`❌ Doctor ${index + 1}: Input o título no encontrados`);
            }
        });
    } else {
        console.log("ℹ️ No estamos en la página de admin, saltando verificación de labels");
    }
}

// Function to test image alt text updates
function testImageAltTextUpdates() {
    console.log("🖼️ Verificando actualización de alt text de imágenes...");
    
    if (window.location.pathname.includes('admin.html')) {
        const doctorEditors = document.querySelectorAll('.doctor-editor');
        
        doctorEditors.forEach((editor, index) => {
            const doctorId = editor.getAttribute('data-doctor-id');
            const nameInput = document.getElementById(`doctor${doctorId}-name`);
            const imageElement = editor.querySelector('img');
            
            if (nameInput && imageElement) {
                const originalName = nameInput.value;
                const testName = "Dr. Imagen Test " + Date.now();
                
                // Simulate typing in the input
                nameInput.value = testName;
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Check if the image alt text was updated
                setTimeout(() => {
                    if (imageElement.alt === testName) {
                        console.log(`✅ Doctor ${index + 1}: Alt text de imagen actualizado correctamente`);
                    } else {
                        console.error(`❌ Doctor ${index + 1}: Alt text de imagen no se actualizó`);
                    }
                    
                    // Restore original name
                    nameInput.value = originalName;
                    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                }, 100);
            }
        });
    }
}

// Function to test event listener setup
function testEventListenerSetup() {
    console.log("🎧 Verificando configuración de event listeners...");
    
    if (window.location.pathname.includes('admin.html')) {
        const doctorEditors = document.querySelectorAll('.doctor-editor');
        
        doctorEditors.forEach((editor, index) => {
            const doctorId = editor.getAttribute('data-doctor-id');
            const nameInput = document.getElementById(`doctor${doctorId}-name`);
            
            if (nameInput) {
                // Check if the event handler is attached
                if (nameInput._labelUpdateHandler) {
                    console.log(`✅ Doctor ${index + 1}: Event handler configurado`);
                } else {
                    console.error(`❌ Doctor ${index + 1}: Event handler no configurado`);
                }
            }
        });
    }
}

// Function to test real-time updates
function testRealTimeUpdates() {
    console.log("⚡ Probando actualizaciones en tiempo real...");
    
    if (window.location.pathname.includes('admin.html')) {
        const firstDoctor = document.querySelector('.doctor-editor');
        if (firstDoctor) {
            const doctorId = firstDoctor.getAttribute('data-doctor-id');
            const nameInput = document.getElementById(`doctor${doctorId}-name`);
            const titleElement = firstDoctor.querySelector('h3');
            
            if (nameInput && titleElement) {
                const originalName = nameInput.value;
                const testNames = [
                    "Dr. Juan Pérez",
                    "Dra. María González", 
                    "Dr. Carlos Rodríguez",
                    "Dra. Ana Martínez"
                ];
                
                let currentIndex = 0;
                
                const updateInterval = setInterval(() => {
                    if (currentIndex < testNames.length) {
                        const testName = testNames[currentIndex];
                        nameInput.value = testName;
                        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        setTimeout(() => {
                            if (titleElement.textContent === testName) {
                                console.log(`✅ Actualización en tiempo real ${currentIndex + 1}: "${testName}"`);
                            } else {
                                console.error(`❌ Error en actualización ${currentIndex + 1}: "${testName}"`);
                            }
                        }, 50);
                        
                        currentIndex++;
                    } else {
                        // Restore original name
                        nameInput.value = originalName;
                        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                        clearInterval(updateInterval);
                        console.log("✅ Prueba de actualizaciones en tiempo real completada");
                    }
                }, 500);
            }
        }
    }
}

// Function to verify unsaved changes detection
function verifyUnsavedChangesDetection() {
    console.log("💾 Verificando detección de cambios no guardados...");
    
    if (window.location.pathname.includes('admin.html')) {
        const firstDoctor = document.querySelector('.doctor-editor');
        if (firstDoctor) {
            const doctorId = firstDoctor.getAttribute('data-doctor-id');
            const nameInput = document.getElementById(`doctor${doctorId}-name`);
            
            if (nameInput) {
                const originalName = nameInput.value;
                const testName = "Dr. Cambio Test " + Date.now();
                
                // Check initial state
                const initialUnsavedState = hasUnsavedChanges;
                console.log(`Estado inicial de cambios no guardados: ${initialUnsavedState}`);
                
                // Make a change
                nameInput.value = testName;
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    const newUnsavedState = hasUnsavedChanges;
                    if (newUnsavedState) {
                        console.log("✅ Cambios no guardados detectados correctamente");
                    } else {
                        console.error("❌ Cambios no guardados no detectados");
                    }
                    
                    // Restore original name
                    nameInput.value = originalName;
                    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                }, 100);
            }
        }
    }
}

// Run verification when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Iniciando verificación de actualización de labels...");
    
    setTimeout(() => {
        verifyLabelUpdateFunctionality();
        testImageAltTextUpdates();
        testEventListenerSetup();
        
        // Test real-time updates after a delay
        setTimeout(() => {
            testRealTimeUpdates();
            verifyUnsavedChangesDetection();
        }, 2000);
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        verifyLabelUpdateFunctionality, 
        testImageAltTextUpdates, 
        testEventListenerSetup, 
        testRealTimeUpdates, 
        verifyUnsavedChangesDetection 
    };
}


