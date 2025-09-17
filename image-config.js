// Professional Images Configuration for Dental Website
// These images are sourced from Unsplash and other professional sources

const imageConfig = {
    // Doctor Images - Professional female dentists
    doctors: {
        doctor1: {
            name: "Dra. Paola Peña",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face&auto=format&q=80",
            alt: "Dra. Paola Peña - Especialista en Implantología"
        },
        doctor2: {
            name: "Dra. Patricia Herrera", 
            image: "https://images.unsplash.com/photo-1594824388852-8a7b3b5b5b5b?w=400&h=500&fit=crop&crop=face&auto=format&q=80",
            alt: "Dra. Patricia Herrera - Especialista en Ortodoncia"
        }
    },

    // Before/After Gallery Images - Real dental transformation photos
    gallery: {
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
            after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop&auto=format&q=80"
        }
    },

    // Service Images - Professional dental procedures
    services: {
        veneers: {
            image: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop&auto=format&q=80",
            alt: "Carillas dentales de porcelana"
        },
        whitening: {
            image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop&auto=format&q=80",
            alt: "Blanqueamiento dental profesional"
        },
        orthodontics: {
            image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop&auto=format&q=80",
            alt: "Tratamiento de ortodoncia"
        },
        implants: {
            image: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop&auto=format&q=80",
            alt: "Implantes dentales"
        }
    },

    // Hero Background Images
    hero: {
        background: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=1920&h=1080&fit=crop&auto=format&q=80",
        overlay: "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)"
    },

    // Testimonial Images - Happy patients
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
    ],

    // Clinic Images
    clinic: {
        exterior: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop&auto=format&q=80",
        interior: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&auto=format&q=80",
        equipment: "https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=800&h=600&fit=crop&auto=format&q=80"
    }
};

// Function to get image URL by category and key
function getImageUrl(category, key) {
    if (imageConfig[category] && imageConfig[category][key]) {
        return imageConfig[category][key].image || imageConfig[category][key];
    }
    return null;
}

// Function to get image alt text
function getImageAlt(category, key) {
    if (imageConfig[category] && imageConfig[category][key]) {
        return imageConfig[category][key].alt || imageConfig[category][key].name || '';
    }
    return '';
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { imageConfig, getImageUrl, getImageAlt };
}


