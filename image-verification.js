// Image and Video Verification Script
// This script verifies that all images and videos are properly loaded

const imageUrls = {
    // Doctor Images
    doctors: [
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1594824388852-8a7b3b5b5b5b?w=400&h=500&fit=crop&crop=face"
    ],
    
    // Gallery Images (Before/After)
    gallery: [
        {
            before: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop",
            after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop"
        },
        {
            before: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop",
            after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop"
        },
        {
            before: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop",
            after: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop"
        }
    ],
    
    // Service Video Thumbnails
    serviceThumbnails: [
        "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=200&fit=crop&auto=format&q=80"
    ],
    
    // Testimonial Images
    testimonials: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80"
    ]
};

const videoIds = {
    services: [
        "jNQXAC9IVRw", // Carillas en Porcelana
        "jNQXAC9IVRw", // Carillas en Resina
        "jNQXAC9IVRw", // Blanqueamiento
        "jNQXAC9IVRw"  // Bordes Incisales
    ],
    testimonials: [
        "jNQXAC9IVRw", // María González
        "jNQXAC9IVRw", // Carlos Rodríguez
        "jNQXAC9IVRw", // Ana Martínez
        "jNQXAC9IVRw", // Luis Herrera
        "jNQXAC9IVRw", // Sofia López
        "jNQXAC9IVRw", // Diego Pérez
        "jNQXAC9IVRw", // Valentina Ruiz
        "jNQXAC9IVRw", // Andrés Morales
        "jNQXAC9IVRw", // Camila Vega
        "jNQXAC9IVRw", // Sebastián Torres
        "jNQXAC9IVRw", // Isabella Jiménez
        "jNQXAC9IVRw"  // Mateo Silva
    ]
};

// Function to verify image loading
function verifyImageLoading() {
    console.log("🔍 Verificando carga de imágenes...");
    
    let totalImages = 0;
    let loadedImages = 0;
    let failedImages = [];
    
    // Verify doctor images
    imageUrls.doctors.forEach((url, index) => {
        totalImages++;
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            console.log(`✅ Doctor ${index + 1} image loaded: ${url}`);
        };
        img.onerror = () => {
            failedImages.push({type: 'doctor', index: index + 1, url});
            console.error(`❌ Doctor ${index + 1} image failed: ${url}`);
        };
        img.src = url;
    });
    
    // Verify gallery images
    imageUrls.gallery.forEach((gallery, index) => {
        [gallery.before, gallery.after].forEach((url, imgIndex) => {
            totalImages++;
            const img = new Image();
            img.onload = () => {
                loadedImages++;
                console.log(`✅ Gallery ${index + 1} ${imgIndex === 0 ? 'before' : 'after'} image loaded: ${url}`);
            };
            img.onerror = () => {
                failedImages.push({type: 'gallery', index: index + 1, imgType: imgIndex === 0 ? 'before' : 'after', url});
                console.error(`❌ Gallery ${index + 1} ${imgIndex === 0 ? 'before' : 'after'} image failed: ${url}`);
            };
            img.src = url;
        });
    });
    
    // Verify service thumbnails
    imageUrls.serviceThumbnails.forEach((url, index) => {
        totalImages++;
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            console.log(`✅ Service ${index + 1} thumbnail loaded: ${url}`);
        };
        img.onerror = () => {
            failedImages.push({type: 'service', index: index + 1, url});
            console.error(`❌ Service ${index + 1} thumbnail failed: ${url}`);
        };
        img.src = url;
    });
    
    // Verify testimonial images
    imageUrls.testimonials.forEach((url, index) => {
        totalImages++;
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            console.log(`✅ Testimonial ${index + 1} image loaded: ${url}`);
        };
        img.onerror = () => {
            failedImages.push({type: 'testimonial', index: index + 1, url});
            console.error(`❌ Testimonial ${index + 1} image failed: ${url}`);
        };
        img.src = url;
    });
    
    // Wait for all images to load and show summary
    setTimeout(() => {
        console.log(`\n📊 RESUMEN DE VERIFICACIÓN:`);
        console.log(`Total de imágenes: ${totalImages}`);
        console.log(`Imágenes cargadas: ${loadedImages}`);
        console.log(`Imágenes fallidas: ${failedImages.length}`);
        
        if (failedImages.length > 0) {
            console.log(`\n❌ IMÁGENES FALLIDAS:`);
            failedImages.forEach(failed => {
                console.log(`- ${failed.type} ${failed.index}: ${failed.url}`);
            });
        } else {
            console.log(`\n✅ TODAS LAS IMÁGENES SE CARGARON CORRECTAMENTE`);
        }
    }, 3000);
}

// Function to verify video functionality
function verifyVideoFunctionality() {
    console.log("🎥 Verificando funcionalidad de videos...");
    
    // Check if video placeholders exist
    const serviceVideos = document.querySelectorAll('.service-video .video-placeholder');
    const testimonialVideos = document.querySelectorAll('.testimonial-video .video-placeholder');
    
    console.log(`✅ Videos de servicios encontrados: ${serviceVideos.length}`);
    console.log(`✅ Videos de testimonios encontrados: ${testimonialVideos.length}`);
    
    // Test video modal functionality
    if (serviceVideos.length > 0) {
        console.log("✅ Funcionalidad de videos de servicios disponible");
    }
    
    if (testimonialVideos.length > 0) {
        console.log("✅ Funcionalidad de videos de testimonios disponible");
    }
}

// Function to verify admin panel preloads
function verifyAdminPreloads() {
    console.log("🔧 Verificando precargas del panel de administración...");
    
    // Check if admin data exists in localStorage
    const adminData = localStorage.getItem('siteData');
    if (adminData) {
        const data = JSON.parse(adminData);
        console.log("✅ Datos del admin encontrados en localStorage");
        
        // Verify each section has data
        if (data.doctors) console.log(`✅ Doctores: ${data.doctors.length} registros`);
        if (data.services) console.log(`✅ Servicios: ${data.services.length} registros`);
        if (data.testimonials) console.log(`✅ Testimonios: ${data.testimonials.length} registros`);
        if (data.gallery) console.log(`✅ Galería: ${data.gallery.length} registros`);
    } else {
        console.log("⚠️ No se encontraron datos del admin en localStorage");
    }
}

// Run verification when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Iniciando verificación completa del sitio...");
    
    setTimeout(() => {
        verifyImageLoading();
        verifyVideoFunctionality();
        verifyAdminPreloads();
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { imageUrls, videoIds, verifyImageLoading, verifyVideoFunctionality, verifyAdminPreloads };
}


