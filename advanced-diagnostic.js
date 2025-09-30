// 🔧 ADVANCED DIAGNOSTIC SCRIPT
// Script avanzado para diagnosticar problemas de persistencia de doctores

console.log('🔧 Advanced Diagnostic Script - Cargando...');

// Función para interceptar y monitorear todas las operaciones de localStorage
function interceptLocalStorage() {
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
        console.log(`🔍 localStorage.setItem('${key}', ...)`);
        if (key === 'siteData') {
            try {
                const parsed = JSON.parse(value);
                console.log(`   📊 Doctores en datos guardados: ${parsed.doctors ? parsed.doctors.length : 0}`);
                if (parsed.doctors) {
                    parsed.doctors.forEach((doctor, index) => {
                        console.log(`     ${index + 1}. ${doctor.name}`);
                    });
                }
            } catch (e) {
                console.log(`   ❌ Error al parsear datos: ${e.message}`);
            }
        }
        return originalSetItem.call(this, key, value);
    };
    
    localStorage.getItem = function(key) {
        const result = originalGetItem.call(this, key);
        if (key === 'siteData') {
            console.log(`🔍 localStorage.getItem('${key}')`);
            if (result) {
                try {
                    const parsed = JSON.parse(result);
                    console.log(`   📊 Doctores en datos cargados: ${parsed.doctors ? parsed.doctors.length : 0}`);
                } catch (e) {
                    console.log(`   ❌ Error al parsear datos: ${e.message}`);
                }
            } else {
                console.log(`   ⚠️ No hay datos para '${key}'`);
            }
        }
        return result;
    };
    
    console.log('✅ Interceptores de localStorage instalados');
}

// Función para monitorear la función removeDoctor
function monitorRemoveDoctor() {
    if (typeof removeDoctor === 'function') {
        const originalRemoveDoctor = removeDoctor;
        window.removeDoctor = function(doctorId) {
            console.log(`🔍 removeDoctor(${doctorId}) llamado`);
            console.log('📊 Estado ANTES de la eliminación:');
            
            // Verificar estado antes
            const doctorElement = document.querySelector(`[data-doctor-id="${doctorId}"]`);
            if (doctorElement) {
                const nameElement = document.getElementById(`doctor${doctorId}-name`);
                const doctorName = nameElement ? nameElement.value : 'Sin nombre';
                console.log(`   👨‍⚕️ Doctor a eliminar: ${doctorName}`);
            }
            
            const doctorEditors = document.querySelectorAll('.doctor-editor');
            console.log(`   📊 Doctores en DOM antes: ${doctorEditors.length}`);
            
            if (typeof siteData !== 'undefined' && siteData.doctors) {
                console.log(`   📊 Doctores en siteData antes: ${siteData.doctors.length}`);
            }
            
            // Ejecutar función original
            const result = originalRemoveDoctor.call(this, doctorId);
            
            // Verificar estado después (con delay para que se complete la operación)
            setTimeout(() => {
                console.log('📊 Estado DESPUÉS de la eliminación:');
                const doctorEditorsAfter = document.querySelectorAll('.doctor-editor');
                console.log(`   📊 Doctores en DOM después: ${doctorEditorsAfter.length}`);
                
                if (typeof siteData !== 'undefined' && siteData.doctors) {
                    console.log(`   📊 Doctores en siteData después: ${siteData.doctors.length}`);
                }
                
                // Verificar localStorage
                const localData = localStorage.getItem('siteData');
                if (localData) {
                    try {
                        const parsed = JSON.parse(localData);
                        console.log(`   📊 Doctores en localStorage después: ${parsed.doctors ? parsed.doctors.length : 0}`);
                    } catch (e) {
                        console.log(`   ❌ Error al verificar localStorage: ${e.message}`);
                    }
                }
            }, 1000);
            
            return result;
        };
        console.log('✅ Monitor de removeDoctor instalado');
    } else {
        console.log('❌ Función removeDoctor no encontrada');
    }
}

// Función para monitorear la función loadSiteData
function monitorLoadSiteData() {
    if (typeof loadSiteData === 'function') {
        const originalLoadSiteData = loadSiteData;
        window.loadSiteData = function() {
            console.log('🔍 loadSiteData() llamado');
            console.log('📊 Estado ANTES de cargar datos:');
            
            if (typeof siteData !== 'undefined' && siteData.doctors) {
                console.log(`   📊 Doctores en siteData antes: ${siteData.doctors.length}`);
            }
            
            const doctorEditors = document.querySelectorAll('.doctor-editor');
            console.log(`   📊 Doctores en DOM antes: ${doctorEditors.length}`);
            
            // Ejecutar función original
            const result = originalLoadSiteData.call(this);
            
            // Verificar estado después
            setTimeout(() => {
                console.log('📊 Estado DESPUÉS de cargar datos:');
                if (typeof siteData !== 'undefined' && siteData.doctors) {
                    console.log(`   📊 Doctores en siteData después: ${siteData.doctors.length}`);
                    siteData.doctors.forEach((doctor, index) => {
                        console.log(`     ${index + 1}. ${doctor.name}`);
                    });
                }
                
                const doctorEditorsAfter = document.querySelectorAll('.doctor-editor');
                console.log(`   📊 Doctores en DOM después: ${doctorEditorsAfter.length}`);
            }, 1000);
            
            return result;
        };
        console.log('✅ Monitor de loadSiteData instalado');
    } else {
        console.log('❌ Función loadSiteData no encontrada');
    }
}

// Función para monitorear la función populateForms
function monitorPopulateForms() {
    if (typeof populateForms === 'function') {
        const originalPopulateForms = populateForms;
        window.populateForms = function() {
            console.log('🔍 populateForms() llamado');
            console.log('📊 Estado ANTES de poblar formularios:');
            
            if (typeof siteData !== 'undefined' && siteData.doctors) {
                console.log(`   📊 Doctores en siteData antes: ${siteData.doctors.length}`);
                siteData.doctors.forEach((doctor, index) => {
                    console.log(`     ${index + 1}. ${doctor.name}`);
                });
            }
            
            const doctorEditors = document.querySelectorAll('.doctor-editor');
            console.log(`   📊 Doctores en DOM antes: ${doctorEditors.length}`);
            
            // Ejecutar función original
            const result = originalPopulateForms.call(this);
            
            // Verificar estado después
            setTimeout(() => {
                console.log('📊 Estado DESPUÉS de poblar formularios:');
                const doctorEditorsAfter = document.querySelectorAll('.doctor-editor');
                console.log(`   📊 Doctores en DOM después: ${doctorEditorsAfter.length}`);
                
                doctorEditorsAfter.forEach((editor, index) => {
                    const doctorId = editor.getAttribute('data-doctor-id');
                    const nameElement = document.getElementById(`doctor${doctorId}-name`);
                    const doctorName = nameElement ? nameElement.value : 'Sin nombre';
                    console.log(`     ${index + 1}. ID: ${doctorId}, Nombre: ${doctorName}`);
                });
            }, 1000);
            
            return result;
        };
        console.log('✅ Monitor de populateForms instalado');
    } else {
        console.log('❌ Función populateForms no encontrada');
    }
}

// Función para simular el flujo completo con monitoreo
function simulateFullFlowWithMonitoring() {
    console.log('🔄 === SIMULANDO FLUJO COMPLETO CON MONITOREO ===');
    
    // Paso 1: Verificar estado inicial
    console.log('\n1️⃣ ESTADO INICIAL:');
    console.log('📊 Doctores en localStorage:');
    const localData = localStorage.getItem('siteData');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            console.log(`   - Total: ${parsed.doctors ? parsed.doctors.length : 0}`);
            if (parsed.doctors) {
                parsed.doctors.forEach((doctor, index) => {
                    console.log(`     ${index + 1}. ${doctor.name}`);
                });
            }
        } catch (e) {
            console.log(`   ❌ Error: ${e.message}`);
        }
    }
    
    console.log('📊 Doctores en DOM:');
    const doctorEditors = document.querySelectorAll('.doctor-editor');
    console.log(`   - Total: ${doctorEditors.length}`);
    doctorEditors.forEach((editor, index) => {
        const doctorId = editor.getAttribute('data-doctor-id');
        const nameElement = document.getElementById(`doctor${doctorId}-name`);
        const doctorName = nameElement ? nameElement.value : 'Sin nombre';
        console.log(`     ${index + 1}. ID: ${doctorId}, Nombre: ${doctorName}`);
    });
    
    // Paso 2: Eliminar primer doctor
    console.log('\n2️⃣ ELIMINANDO PRIMER DOCTOR:');
    if (doctorEditors.length > 0) {
        const firstDoctor = doctorEditors[0];
        const doctorId = firstDoctor.getAttribute('data-doctor-id');
        const nameElement = document.getElementById(`doctor${doctorId}-name`);
        const doctorName = nameElement ? nameElement.value : 'Sin nombre';
        
        console.log(`🗑️ Eliminando doctor: ${doctorName} (ID: ${doctorId})`);
        removeDoctor(doctorId);
    } else {
        console.log('❌ No hay doctores para eliminar');
    }
    
    // Paso 3: Simular logout después de 3 segundos
    setTimeout(() => {
        console.log('\n3️⃣ SIMULANDO LOGOUT:');
        localStorage.removeItem('adminLoggedIn');
        console.log('✅ adminLoggedIn removido de localStorage');
        
        // Paso 4: Simular login después de 2 segundos
        setTimeout(() => {
            console.log('\n4️⃣ SIMULANDO LOGIN:');
            localStorage.setItem('adminLoggedIn', 'true');
            console.log('✅ adminLoggedIn agregado a localStorage');
            
            // Paso 5: Simular recarga de datos después de 2 segundos
            setTimeout(() => {
                console.log('\n5️⃣ SIMULANDO RECARGA DE DATOS:');
                if (typeof loadSiteData === 'function') {
                    loadSiteData();
                }
                if (typeof populateForms === 'function') {
                    populateForms();
                }
                
                // Paso 6: Verificar estado final después de 3 segundos
                setTimeout(() => {
                    console.log('\n6️⃣ ESTADO FINAL:');
                    console.log('📊 Doctores en localStorage:');
                    const localDataFinal = localStorage.getItem('siteData');
                    if (localDataFinal) {
                        try {
                            const parsed = JSON.parse(localDataFinal);
                            console.log(`   - Total: ${parsed.doctors ? parsed.doctors.length : 0}`);
                            if (parsed.doctors) {
                                parsed.doctors.forEach((doctor, index) => {
                                    console.log(`     ${index + 1}. ${doctor.name}`);
                                });
                            }
                        } catch (e) {
                            console.log(`   ❌ Error: ${e.message}`);
                        }
                    }
                    
                    console.log('📊 Doctores en DOM:');
                    const doctorEditorsFinal = document.querySelectorAll('.doctor-editor');
                    console.log(`   - Total: ${doctorEditorsFinal.length}`);
                    doctorEditorsFinal.forEach((editor, index) => {
                        const doctorId = editor.getAttribute('data-doctor-id');
                        const nameElement = document.getElementById(`doctor${doctorId}-name`);
                        const doctorName = nameElement ? nameElement.value : 'Sin nombre';
                        console.log(`     ${index + 1}. ID: ${doctorId}, Nombre: ${doctorName}`);
                    });
                    
                    console.log('\n🔄 === FIN DE LA SIMULACIÓN ===');
                }, 3000);
            }, 2000);
        }, 2000);
    }, 3000);
}

// Función para instalar todos los monitores
function installAllMonitors() {
    console.log('🔧 Instalando todos los monitores...');
    interceptLocalStorage();
    monitorRemoveDoctor();
    monitorLoadSiteData();
    monitorPopulateForms();
    console.log('✅ Todos los monitores instalados');
}

// Función para desinstalar todos los monitores
function uninstallAllMonitors() {
    console.log('🔧 Desinstalando monitores...');
    // Recargar la página para restaurar funciones originales
    window.location.reload();
}

// Instalar monitores automáticamente
installAllMonitors();

// Exportar funciones globalmente
window.installAllMonitors = installAllMonitors;
window.uninstallAllMonitors = uninstallAllMonitors;
window.simulateFullFlowWithMonitoring = simulateFullFlowWithMonitoring;

console.log(`
🔧 ADVANCED DIAGNOSTIC SCRIPT CARGADO

Funciones disponibles:
- installAllMonitors()              - Instalar todos los monitores
- uninstallAllMonitors()            - Desinstalar monitores (recarga página)
- simulateFullFlowWithMonitoring()  - Simular flujo completo con monitoreo

Los monitores están activos y registrarán automáticamente:
- Todas las operaciones de localStorage
- Llamadas a removeDoctor()
- Llamadas a loadSiteData()
- Llamadas a populateForms()

Para probar, ejecute: simulateFullFlowWithMonitoring()
`);
