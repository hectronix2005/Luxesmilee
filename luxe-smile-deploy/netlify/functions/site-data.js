// Netlify Function para gestionar datos del sitio
// Almacena los datos usando Netlify Blobs (almacenamiento persistente)

const { getStore } = require('@netlify/blobs');

// Nombre de la clave donde se almacenarán los datos
const DATA_KEY = 'site-data';

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
        // Obtener el store de Netlify Blobs
        const store = getStore('site-data-store');

        // GET: Obtener datos
        if (event.httpMethod === 'GET') {
            console.log('📂 GET request - Loading site data from Netlify Blobs');
            
            try {
                // Intentar leer los datos del blob
                const dataString = await store.get(DATA_KEY);
                
                if (dataString) {
                    const siteData = JSON.parse(dataString);
                    
                    console.log('✅ Data loaded successfully from Netlify Blobs');
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
                } else {
                    // Si no existe, retornar y guardar datos por defecto
                    console.log('⚠️ No data found in Netlify Blobs, saving defaults');
                    
                    await store.set(DATA_KEY, JSON.stringify(DEFAULT_DATA));
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(DEFAULT_DATA)
                    };
                }
            } catch (error) {
                console.error('❌ Error reading from Netlify Blobs:', error);
                
                // Retornar datos por defecto en caso de error
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(DEFAULT_DATA)
                };
            }
        }

        // POST: Guardar datos
        if (event.httpMethod === 'POST') {
            console.log('💾 POST request - Saving site data to Netlify Blobs');
            
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

            // Guardar los datos en Netlify Blobs
            await store.set(DATA_KEY, JSON.stringify(newData));
            
            console.log('✅ Data saved successfully to Netlify Blobs');

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Data saved successfully to Netlify Blobs',
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

