// Netlify Function para gestión de usuarios
// Maneja operaciones CRUD para usuarios del sistema

const fs = require('fs').promises;
const path = require('path');

// Ruta donde se almacenarán los datos de usuarios
const USERS_FILE = path.join(__dirname, 'users-data.json');

// Usuarios por defecto
const DEFAULT_USERS = [
    {
        id: 1,
        username: "admin",
        email: "admin@luxesmilee.com",
        role: "administrator",
        name: "Administrador Principal",
        phone: "",
        status: "active",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    }
];

exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
        // Leer usuarios existentes
        let users = [];
        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // Si no existe el archivo, usar usuarios por defecto
            users = DEFAULT_USERS;
            await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        }

        // GET: Obtener todos los usuarios
        if (event.httpMethod === 'GET') {
            console.log('📂 GET request - Loading users');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    users: users,
                    count: users.length
                })
            };
        }

        // POST: Crear nuevo usuario
        if (event.httpMethod === 'POST') {
            console.log('➕ POST request - Creating new user');
            
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

            const newUserData = JSON.parse(event.body);
            
            // Validar datos requeridos
            if (!newUserData.username || !newUserData.email || !newUserData.name) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'Username, email and name are required' 
                    })
                };
            }

            // Verificar si el username ya existe
            const existingUser = users.find(user => user.username === newUserData.username);
            if (existingUser) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'Username already exists' 
                    })
                };
            }

            // Crear nuevo usuario
            const newUser = {
                id: Math.max(...users.map(u => u.id), 0) + 1,
                username: newUserData.username,
                email: newUserData.email,
                role: newUserData.role || 'user',
                name: newUserData.name,
                phone: newUserData.phone || '',
                status: newUserData.status || 'active',
                createdAt: new Date().toISOString(),
                lastLogin: null
            };

            users.push(newUser);
            
            // Guardar usuarios actualizados
            await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
            
            console.log('✅ New user created:', newUser.username);

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'User created successfully',
                    user: newUser
                })
            };
        }

        // PUT: Actualizar usuario existente
        if (event.httpMethod === 'PUT') {
            console.log('✏️ PUT request - Updating user');
            
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

            const updateData = JSON.parse(event.body);
            const userId = parseInt(event.queryStringParameters?.id);
            
            if (!userId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'User ID is required' 
                    })
                };
            }

            const userIndex = users.findIndex(user => user.id === userId);
            if (userIndex === -1) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'User not found' 
                    })
                };
            }

            // Actualizar usuario
            users[userIndex] = {
                ...users[userIndex],
                ...updateData,
                id: userId, // Mantener el ID original
                createdAt: users[userIndex].createdAt, // Mantener fecha de creación
                lastLogin: users[userIndex].lastLogin // Mantener último login
            };
            
            // Guardar usuarios actualizados
            await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
            
            console.log('✅ User updated:', users[userIndex].username);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'User updated successfully',
                    user: users[userIndex]
                })
            };
        }

        // DELETE: Eliminar usuario
        if (event.httpMethod === 'DELETE') {
            console.log('🗑️ DELETE request - Deleting user');
            
            const userId = parseInt(event.queryStringParameters?.id);
            
            if (!userId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'User ID is required' 
                    })
                };
            }

            const userIndex = users.findIndex(user => user.id === userId);
            if (userIndex === -1) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'User not found' 
                    })
                };
            }

            const deletedUser = users[userIndex];
            
            // No permitir eliminar el usuario admin principal
            if (deletedUser.username === 'admin' && deletedUser.role === 'administrator') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'Cannot delete the main administrator user' 
                    })
                };
            }

            users.splice(userIndex, 1);
            
            // Guardar usuarios actualizados
            await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
            
            console.log('✅ User deleted:', deletedUser.username);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'User deleted successfully',
                    deletedUser: deletedUser
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
        console.error('❌ Error in users function:', error);
        
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
