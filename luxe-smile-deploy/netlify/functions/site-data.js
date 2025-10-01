// Netlify Function para gestionar datos del sitio
// Almacena los datos usando un archivo JSON persistente en el sistema de archivos de Netlify

const fs = require('fs').promises;
const path = require('path');

// Ruta donde se almacenarán los datos (en el directorio de la función)
const DATA_FILE = path.join(__dirname, 'site-data.json');

// Datos por defecto si no existe el archivo
const DEFAULT_DATA = {
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
    services: [],
    gallery: [],
    testimonials: [],
    contact: {
        address: "",
        city: "",
        phone: "",
        email: ""
    },
    settings: {
        siteTitle: "Odontología Peña - Herrera",
        siteDescription: "Expertas en Sonrisas - Diseño de Sonrisa, Ortodoncia e Implantes Dentales",
        primaryColor: "#4A90E2",
        secondaryColor: "#357ABD",
        tabTitle: "Odontología Peña - Herrera"
    }
};

exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Manejar preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // GET: Obtener datos
        if (event.httpMethod === 'GET') {
            console.log('📂 GET request - Loading site data from file');
            
            try {
                // Intentar leer el archivo de datos
                const data = await fs.readFile(DATA_FILE, 'utf8');
                const siteData = JSON.parse(data);
                
                console.log('✅ Data loaded successfully from file');
                console.log('  - Doctors count:', siteData.doctors ? siteData.doctors.length : 0);
                if (siteData.doctors && siteData.doctors.length > 0) {
                    siteData.doctors.forEach((doctor, index) => {
                        console.log(`  - Doctor ${index + 1}: "${doctor.name}"`);
                    });
                }
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(siteData)
                };
            } catch (error) {
                // Si no existe el archivo, retornar datos por defecto
                console.log('⚠️ Data file not found, returning defaults');
                
                // Guardar los datos por defecto para futuras peticiones
                await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(DEFAULT_DATA)
                };
            }
        }

        // POST: Guardar datos
        if (event.httpMethod === 'POST') {
            console.log('💾 POST request - Saving site data to file');
            
            if (!event.body) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'No data provided' 
                    })
                };
            }

            // Parsear los datos recibidos
            const newData = JSON.parse(event.body);
            
            console.log('📝 Data received:');
            console.log('  - Doctors count:', newData.doctors ? newData.doctors.length : 0);
            if (newData.doctors && newData.doctors.length > 0) {
                newData.doctors.forEach((doctor, index) => {
                    console.log(`  - Doctor ${index + 1}: "${doctor.name}" - ${doctor.specialty}`);
                });
            }

            // Guardar los datos en el archivo
            await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
            
            console.log('✅ Data saved successfully to file');

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Data saved successfully to file',
                    timestamp: new Date().toISOString(),
                    doctorsCount: newData.doctors ? newData.doctors.length : 0
                })
            };
        }

        // Método no permitido
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: 'Method not allowed' 
            })
        };

    } catch (error) {
        console.error('❌ Error in site-data function:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: error.message 
            })
        };
    }
};

