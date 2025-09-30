// 🔧 DOCTOR DELETION DIAGNOSTIC SCRIPT
// Este script se puede ejecutar en la consola del navegador para diagnosticar problemas de eliminación de doctores

console.log('🔧 Doctor Deletion Diagnostic Script - Cargando...');

// Función para diagnosticar el estado actual
function diagnoseDoctorDeletion() {
    console.log('🔍 === DIAGNÓSTICO DE ELIMINACIÓN DE DOCTORES ===');
    
    // 1. Verificar datos en localStorage
    console.log('\n📊 1. VERIFICANDO LOCALSTORAGE:');
    const localData = localStorage.getItem('siteData');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            console.log('✅ localStorage contiene datos');
            console.log(`   - Doctores: ${parsed.doctors ? parsed.doctors.length : 0}`);
            if (parsed.doctors) {
                parsed.doctors.forEach((doctor, index) => {
                    console.log(`     ${index + 1}. ${doctor.name}`);
                });
            }
        } catch (e) {
            console.log('❌ Error al parsear localStorage:', e);
        }
    } else {
        console.log('⚠️ localStorage no contiene datos');
    }
    
    // 2. Verificar datos en sessionStorage
    console.log('\n📊 2. VERIFICANDO SESSIONSTORAGE:');
    const sessionData = sessionStorage.getItem('siteData');
    if (sessionData) {
        try {
            const parsed = JSON.parse(sessionData);
            console.log('✅ sessionStorage contiene datos');
            console.log(`   - Doctores: ${parsed.doctors ? parsed.doctors.length : 0}`);
        } catch (e) {
            console.log('❌ Error al parsear sessionStorage:', e);
        }
    } else {
        console.log('⚠️ sessionStorage no contiene datos');
    }
    
    // 3. Verificar elementos del DOM
    console.log('\n📊 3. VERIFICANDO ELEMENTOS DEL DOM:');
    const doctorEditors = document.querySelectorAll('.doctor-editor');
    console.log(`✅ Encontrados ${doctorEditors.length} elementos .doctor-editor en el DOM`);
    
    doctorEditors.forEach((editor, index) => {
        const doctorId = editor.getAttribute('data-doctor-id');
        const nameElement = document.getElementById(`doctor${doctorId}-name`);
        const name = nameElement ? nameElement.value : 'Sin nombre';
        console.log(`   ${index + 1}. ID: ${doctorId}, Nombre: ${name}`);
    });
    
    // 4. Verificar variable siteData global
    console.log('\n📊 4. VERIFICANDO VARIABLE SITE DATA:');
    if (typeof siteData !== 'undefined') {
        console.log('✅ Variable siteData existe');
        console.log(`   - Doctores: ${siteData.doctors ? siteData.doctors.length : 0}`);
        if (siteData.doctors) {
            siteData.doctors.forEach((doctor, index) => {
                console.log(`     ${index + 1}. ${doctor.name}`);
            });
        }
    } else {
        console.log('❌ Variable siteData no está definida');
    }
    
    // 5. Verificar función removeDoctor
    console.log('\n📊 5. VERIFICANDO FUNCIÓN REMOVE DOCTOR:');
    if (typeof removeDoctor === 'function') {
        console.log('✅ Función removeDoctor existe');
        console.log('   - Función disponible para eliminar doctores');
    } else {
        console.log('❌ Función removeDoctor no está definida');
    }
    
    // 6. Verificar función collectFormData
    console.log('\n📊 6. VERIFICANDO FUNCIÓN COLLECT FORM DATA:');
    if (typeof collectFormData === 'function') {
        console.log('✅ Función collectFormData existe');
    } else {
        console.log('❌ Función collectFormData no está definida');
    }
    
    console.log('\n🔍 === FIN DEL DIAGNÓSTICO ===');
}

// Función para probar la eliminación de un doctor específico
function testDoctorDeletion(doctorId) {
    console.log(`🧪 === PROBANDO ELIMINACIÓN DEL DOCTOR ID: ${doctorId} ===`);
    
    // Verificar estado antes de la eliminación
    console.log('\n📊 ESTADO ANTES DE LA ELIMINACIÓN:');
    const doctorElement = document.querySelector(`[data-doctor-id="${doctorId}"]`);
    if (doctorElement) {
        const nameElement = document.getElementById(`doctor${doctorId}-name`);
        const doctorName = nameElement ? nameElement.value : 'Sin nombre';
        console.log(`✅ Doctor encontrado: ${doctorName}`);
        
        // Contar doctores en localStorage antes
        const localData = localStorage.getItem('siteData');
        if (localData) {
            const parsed = JSON.parse(localData);
            console.log(`📊 Doctores en localStorage antes: ${parsed.doctors ? parsed.doctors.length : 0}`);
        }
        
        // Contar doctores en DOM antes
        const doctorEditors = document.querySelectorAll('.doctor-editor');
        console.log(`📊 Doctores en DOM antes: ${doctorEditors.length}`);
        
        // Ejecutar eliminación
        console.log('\n🗑️ EJECUTANDO ELIMINACIÓN...');
        removeDoctor(doctorId);
        
        // Verificar estado después de la eliminación
        setTimeout(() => {
            console.log('\n📊 ESTADO DESPUÉS DE LA ELIMINACIÓN:');
            
            // Contar doctores en localStorage después
            const localDataAfter = localStorage.getItem('siteData');
            if (localDataAfter) {
                const parsedAfter = JSON.parse(localDataAfter);
                console.log(`📊 Doctores en localStorage después: ${parsedAfter.doctors ? parsedAfter.doctors.length : 0}`);
            }
            
            // Contar doctores en DOM después
            const doctorEditorsAfter = document.querySelectorAll('.doctor-editor');
            console.log(`📊 Doctores en DOM después: ${doctorEditorsAfter.length}`);
            
            console.log('\n🧪 === FIN DE LA PRUEBA ===');
        }, 1000);
        
    } else {
        console.log(`❌ No se encontró el doctor con ID: ${doctorId}`);
    }
}

// Función para simular el flujo completo de eliminación
function simulateFullDeletionFlow() {
    console.log('🔄 === SIMULANDO FLUJO COMPLETO DE ELIMINACIÓN ===');
    
    // 1. Verificar estado inicial
    console.log('\n1️⃣ ESTADO INICIAL:');
    diagnoseDoctorDeletion();
    
    // 2. Eliminar el primer doctor
    console.log('\n2️⃣ ELIMINANDO PRIMER DOCTOR:');
    const firstDoctor = document.querySelector('.doctor-editor');
    if (firstDoctor) {
        const doctorId = firstDoctor.getAttribute('data-doctor-id');
        testDoctorDeletion(doctorId);
    }
    
    // 3. Simular recarga de página después de 3 segundos
    setTimeout(() => {
        console.log('\n3️⃣ SIMULANDO RECARGA DE PÁGINA:');
        console.log('🔄 Recargando datos...');
        
        // Simular recarga de datos
        if (typeof loadSiteData === 'function') {
            loadSiteData();
        }
        if (typeof populateForms === 'function') {
            populateForms();
        }
        
        // Verificar estado final
        setTimeout(() => {
            console.log('\n4️⃣ ESTADO FINAL DESPUÉS DE RECARGA:');
            diagnoseDoctorDeletion();
            console.log('\n🔄 === FIN DE LA SIMULACIÓN ===');
        }, 1000);
    }, 3000);
}

// Función para limpiar todos los datos y empezar de nuevo
function resetAllData() {
    console.log('🗑️ === LIMPIANDO TODOS LOS DATOS ===');
    
    localStorage.removeItem('siteData');
    sessionStorage.removeItem('siteData');
    
    console.log('✅ Todos los datos limpiados');
    console.log('🔄 Recargue la página para empezar de nuevo');
}

// Función para forzar el guardado de datos actuales
function forceSaveCurrentData() {
    console.log('💾 === FORZANDO GUARDADO DE DATOS ACTUALES ===');
    
    if (typeof collectFormData === 'function') {
        collectFormData();
        console.log('✅ Datos recolectados del formulario');
    }
    
    if (typeof siteData !== 'undefined') {
        localStorage.setItem('siteData', JSON.stringify(siteData));
        sessionStorage.setItem('siteData', JSON.stringify(siteData));
        console.log('✅ Datos guardados en localStorage y sessionStorage');
    } else {
        console.log('❌ No se pudo guardar - siteData no está definido');
    }
}

// Mostrar instrucciones de uso
console.log(`
🔧 DOCTOR DELETION DIAGNOSTIC SCRIPT CARGADO

Funciones disponibles:
- diagnoseDoctorDeletion()           - Diagnostica el estado actual
- testDoctorDeletion(doctorId)       - Prueba eliminar un doctor específico
- simulateFullDeletionFlow()         - Simula el flujo completo de eliminación
- resetAllData()                     - Limpia todos los datos
- forceSaveCurrentData()             - Fuerza el guardado de datos actuales

Ejemplos de uso:
- diagnoseDoctorDeletion()
- testDoctorDeletion(1)
- simulateFullDeletionFlow()
- resetAllData()
- forceSaveCurrentData()

Para usar, ejecute cualquiera de estas funciones en la consola del navegador.
`);

// Exportar funciones globalmente para uso en consola
window.diagnoseDoctorDeletion = diagnoseDoctorDeletion;
window.testDoctorDeletion = testDoctorDeletion;
window.simulateFullDeletionFlow = simulateFullDeletionFlow;
window.resetAllData = resetAllData;
window.forceSaveCurrentData = forceSaveCurrentData;

console.log('✅ Funciones de diagnóstico disponibles globalmente');
