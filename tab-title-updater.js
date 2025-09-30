// Tab Title Updater - Actualiza el título de la tab dinámicamente
document.addEventListener('DOMContentLoaded', function() {
    updateTabTitle();
});

// Función para actualizar el título de la tab
async function updateTabTitle() {
    try {
        // Intentar cargar desde Netlify Function primero
        try {
            const response = await fetch('/.netlify/functions/site-data');
            if (response.ok) {
                const siteData = await response.json();
                if (siteData.settings && siteData.settings.tabTitle) {
                    document.title = siteData.settings.tabTitle;
                    console.log('✅ Tab title updated from Netlify Function:', siteData.settings.tabTitle);
                    return;
                }
            }
        } catch (apiError) {
            console.log('Netlify Function not available, trying other sources:', apiError);
        }
        
        // Intentar cargar desde localStorage
        const savedData = localStorage.getItem('siteData');
        if (savedData) {
            try {
                const siteData = JSON.parse(savedData);
                if (siteData.settings && siteData.settings.tabTitle) {
                    document.title = siteData.settings.tabTitle;
                    console.log('✅ Tab title updated from localStorage:', siteData.settings.tabTitle);
                    return;
                }
            } catch (parseError) {
                console.error('Error parsing localStorage data:', parseError);
            }
        }
        
        // Intentar cargar desde sessionStorage
        const sessionData = sessionStorage.getItem('siteData');
        if (sessionData) {
            try {
                const siteData = JSON.parse(sessionData);
                if (siteData.settings && siteData.settings.tabTitle) {
                    document.title = siteData.settings.tabTitle;
                    console.log('✅ Tab title updated from sessionStorage:', siteData.settings.tabTitle);
                    return;
                }
            } catch (parseError) {
                console.error('Error parsing sessionStorage data:', parseError);
            }
        }
        
        console.log('ℹ️ No custom tab title found, using default');
        
    } catch (error) {
        console.error('Error updating tab title:', error);
    }
}

// Función para actualizar el título en tiempo real cuando cambie
function watchForTabTitleChanges() {
    // Observar cambios en localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'siteData') {
            try {
                const siteData = JSON.parse(e.newValue);
                if (siteData.settings && siteData.settings.tabTitle) {
                    document.title = siteData.settings.tabTitle;
                    console.log('✅ Tab title updated from storage event:', siteData.settings.tabTitle);
                }
            } catch (error) {
                console.error('Error parsing storage data:', error);
            }
        }
    });
    
    // Observar cambios en sessionStorage (mismo tab)
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'siteData') {
            try {
                const siteData = JSON.parse(value);
                if (siteData.settings && siteData.settings.tabTitle) {
                    document.title = siteData.settings.tabTitle;
                    console.log('✅ Tab title updated from sessionStorage change:', siteData.settings.tabTitle);
                }
            } catch (error) {
                console.error('Error parsing sessionStorage data:', error);
            }
        }
    };
}

// Inicializar el observador de cambios
watchForTabTitleChanges();

// Función para actualizar el título manualmente (llamada desde admin)
window.updateTabTitle = updateTabTitle;

console.log('🔄 Tab Title Updater loaded successfully');

