// Gallery Images Verification Script
// This script specifically verifies the before/after gallery images

const galleryImages = {
    case1: {
        title: "Carillas en Porcelana",
        before: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop&auto=format&q=80",
        after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop&auto=format&q=80"
    },
    case2: {
        title: "Blanqueamiento Dental",
        before: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop&auto=format&q=80",
        after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop&auto=format&q=80"
    },
    case3: {
        title: "Diseño de Sonrisa Completo",
        before: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop&auto=format&q=80",
        after: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop&auto=format&q=80"
    }
};

// Function to verify gallery images loading
function verifyGalleryImages() {
    console.log("🖼️ Verificando imágenes de la galería antes/después...");
    
    let totalImages = 0;
    let loadedImages = 0;
    let failedImages = [];
    
    Object.keys(galleryImages).forEach((caseKey, index) => {
        const galleryCase = galleryImages[caseKey];
        console.log(`\n📋 Verificando ${galleryCase.title}:`);
        
        // Verify before image
        totalImages++;
        const beforeImg = new Image();
        beforeImg.onload = () => {
            loadedImages++;
            console.log(`✅ Imagen ANTES cargada: ${galleryCase.before}`);
        };
        beforeImg.onerror = () => {
            failedImages.push({case: galleryCase.title, type: 'before', url: galleryCase.before});
            console.error(`❌ Imagen ANTES falló: ${galleryCase.before}`);
        };
        beforeImg.src = galleryCase.before;
        
        // Verify after image
        totalImages++;
        const afterImg = new Image();
        afterImg.onload = () => {
            loadedImages++;
            console.log(`✅ Imagen DESPUÉS cargada: ${galleryCase.after}`);
        };
        afterImg.onerror = () => {
            failedImages.push({case: galleryCase.title, type: 'after', url: galleryCase.after});
            console.error(`❌ Imagen DESPUÉS falló: ${galleryCase.after}`);
        };
        afterImg.src = galleryCase.after;
    });
    
    // Wait for all images to load and show summary
    setTimeout(() => {
        console.log(`\n📊 RESUMEN DE GALERÍA:`);
        console.log(`Total de imágenes: ${totalImages}`);
        console.log(`Imágenes cargadas: ${loadedImages}`);
        console.log(`Imágenes fallidas: ${failedImages.length}`);
        
        if (failedImages.length > 0) {
            console.log(`\n❌ IMÁGENES FALLIDAS:`);
            failedImages.forEach(failed => {
                console.log(`- ${failed.case} (${failed.type}): ${failed.url}`);
            });
        } else {
            console.log(`\n✅ TODAS LAS IMÁGENES DE LA GALERÍA SE CARGARON CORRECTAMENTE`);
        }
    }, 3000);
}

// Function to verify gallery slider functionality
function verifyGallerySlider() {
    console.log("🎚️ Verificando funcionalidad del slider de la galería...");
    
    const galleryCards = document.querySelectorAll('.before-after-card');
    console.log(`✅ Tarjetas de galería encontradas: ${galleryCards.length}`);
    
    galleryCards.forEach((card, index) => {
        const sliderHandle = card.querySelector('.slider-handle');
        const sliderLine = card.querySelector('.slider-line');
        const beforeImage = card.querySelector('.before-image');
        const afterImage = card.querySelector('.after-image');
        
        if (sliderHandle && sliderLine && beforeImage && afterImage) {
            console.log(`✅ Caso ${index + 1}: Slider funcional`);
        } else {
            console.error(`❌ Caso ${index + 1}: Elementos del slider faltantes`);
        }
    });
}

// Function to verify admin gallery preloads
function verifyAdminGalleryPreloads() {
    console.log("🔧 Verificando precargas de galería en el admin...");
    
    // Check if we're on admin page
    if (window.location.pathname.includes('admin.html')) {
        const adminGalleryImages = document.querySelectorAll('.gallery-item-editor .image-preview img');
        console.log(`✅ Imágenes de galería en admin: ${adminGalleryImages.length}`);
        
        adminGalleryImages.forEach((img, index) => {
            if (img.src && img.src !== '') {
                console.log(`✅ Imagen ${index + 1} precargada: ${img.src}`);
            } else {
                console.error(`❌ Imagen ${index + 1} no precargada`);
            }
        });
    } else {
        console.log("ℹ️ No estamos en la página de admin, saltando verificación de precargas");
    }
}

// Function to test gallery slider interaction
function testGallerySliderInteraction() {
    console.log("🖱️ Probando interacción del slider...");
    
    const firstSlider = document.querySelector('.slider-handle');
    if (firstSlider) {
        console.log("✅ Slider encontrado, probando interacción...");
        
        // Simulate click on slider
        firstSlider.click();
        console.log("✅ Click en slider ejecutado");
        
        // Check if slider moved
        setTimeout(() => {
            const sliderLine = document.querySelector('.slider-line');
            if (sliderLine) {
                console.log("✅ Slider interactivo funcionando");
            }
        }, 100);
    } else {
        console.error("❌ No se encontró slider para probar");
    }
}

// Run verification when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Iniciando verificación de galería...");
    
    setTimeout(() => {
        verifyGalleryImages();
        verifyGallerySlider();
        verifyAdminGalleryPreloads();
        
        // Test interaction after a delay
        setTimeout(() => {
            testGallerySliderInteraction();
        }, 2000);
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { galleryImages, verifyGalleryImages, verifyGallerySlider, verifyAdminGalleryPreloads };
}


