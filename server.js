const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database file path
const DATA_FILE = path.join(__dirname, 'site-data.json');

// Helper functions for data persistence
function loadSiteData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading site data:', error);
    }
    return null;
}

function saveSiteData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('Site data saved to file successfully');
        return true;
    } catch (error) {
        console.error('Error saving site data:', error);
        return false;
    }
}

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://www.gstatic.com"]
        }
    }
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Admin panel routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Main site route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API routes for admin panel
app.get('/api/site-data', (req, res) => {
    try {
        // Try to load from file first
        const savedData = loadSiteData();
        if (savedData) {
            console.log('Site data loaded from file');
            return res.json(savedData);
        }
        
        // If no saved data, return default structure
        console.log('No saved data found, returning defaults');
        const defaultData = {
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
                secondaryColor: "#357ABD"
            }
        };
        
        res.json(defaultData);
    } catch (error) {
        console.error('Error fetching site data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save site data endpoint
app.post('/api/site-data', (req, res) => {
    try {
        const siteData = req.body;
        console.log('Site data received:', siteData);
        
        // Save to file
        const success = saveSiteData(siteData);
        
        if (success) {
            res.json({ 
                success: true, 
                message: 'Site data saved successfully to database',
                timestamp: new Date().toISOString(),
                data: siteData
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: 'Failed to save site data' 
            });
        }
    } catch (error) {
        console.error('Error saving site data:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Luxe Smile Admin Panel'
    });
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
    // If it's an API request, return 404
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other requests, serve the main index.html
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Luxe Smile Admin Panel running on port ${PORT}`);
    console.log(`📱 Main site: http://localhost:${PORT}`);
    console.log(`⚙️ Admin panel: http://localhost:${PORT}/admin`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
