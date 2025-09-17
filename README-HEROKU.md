# 🚀 Luxe Smile Admin Panel - Heroku Deployment

## 📋 **Descripción**

Panel de administración completo para Luxe Smile - Odontología Peña Herrera, desplegado en Heroku con servidor backend Express.js.

## 🎯 **Características**

- ✅ **Panel de administración completo** con interfaz moderna
- ✅ **Servidor backend Express.js** para manejo de datos
- ✅ **API REST** para operaciones CRUD
- ✅ **Persistencia de datos** en múltiples fuentes
- ✅ **Autenticación básica** para acceso seguro
- ✅ **Responsive design** para todos los dispositivos
- ✅ **Despliegue automático** en Heroku

## 🚀 **Despliegue Rápido**

### **Opción 1: Script Automatizado (Recomendado)**
```bash
./deploy-heroku.sh
```

### **Opción 2: Comandos Manuales**
```bash
# 1. Iniciar sesión en Heroku
heroku login

# 2. Crear aplicación
heroku create luxe-smile-admin

# 3. Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=admin123

# 4. Desplegar
git push heroku main
```

## 📱 **URLs de Acceso**

Una vez desplegado, tendrás acceso a:

- **Sitio Principal:** `https://luxe-smile-admin.herokuapp.com/`
- **Panel de Administración:** `https://luxe-smile-admin.herokuapp.com/admin`
- **API de Datos:** `https://luxe-smile-admin.herokuapp.com/api/site-data`
- **Health Check:** `https://luxe-smile-admin.herokuapp.com/health`

## 🔐 **Credenciales de Acceso**

- **Usuario:** `admin`
- **Contraseña:** `admin123`

> ⚠️ **Importante:** Cambia estas credenciales en producción usando variables de entorno de Heroku.

## 🛠️ **Funcionalidades del Panel**

### **Secciones Administrables:**
- 🏠 **Hero Section** - Título, subtítulo, características
- 👩‍⚕️ **Doctores** - Gestión completa de doctores
- 🦷 **Servicios** - Servicios y precios
- 🖼️ **Galería** - Imágenes antes/después
- 💬 **Testimonios** - Videos y testimonios
- 📞 **Contacto** - Información de contacto
- ⚙️ **Configuración** - Colores y configuración general

### **Características Técnicas:**
- ✅ **Guardado automático** al eliminar/agregar doctores
- ✅ **Múltiples fuentes de datos** (API → Firebase → localStorage)
- ✅ **Sincronización en tiempo real**
- ✅ **Herramientas de debug** integradas
- ✅ **Manejo de errores robusto**

## 🔧 **Comandos Útiles**

### **Ver logs en tiempo real:**
```bash
heroku logs --tail --app luxe-smile-admin
```

### **Reiniciar aplicación:**
```bash
heroku restart --app luxe-smile-admin
```

### **Ver información de la app:**
```bash
heroku info --app luxe-smile-admin
```

### **Configurar variables de entorno:**
```bash
heroku config:set VARIABLE_NAME=value --app luxe-smile-admin
```

## 📊 **Estructura del Proyecto**

```
luxe-smile-admin/
├── server.js              # Servidor Express principal
├── package.json           # Dependencias y scripts
├── Procfile              # Configuración de Heroku
├── .gitignore            # Archivos ignorados
├── admin.html            # Panel de administración
├── admin-script.js       # Lógica del panel (actualizado)
├── admin-styles.css      # Estilos del panel
├── admin-integration.js  # Integración con sitio principal
├── index.html            # Sitio web principal
├── styles.css            # Estilos del sitio
├── script.js             # Lógica del sitio
├── firebase-config.js    # Configuración de Firebase
└── deploy-heroku.sh      # Script de despliegue
```

## 🔄 **Actualizaciones**

Para actualizar la aplicación:

1. **Hacer cambios en el código**
2. **Ejecutar el script de despliegue:**
   ```bash
   ./deploy-heroku.sh
   ```

O manualmente:
```bash
git add .
git commit -m "Descripción de los cambios"
git push heroku main
```

## 🐛 **Solución de Problemas**

### **Error: "App not found"**
```bash
heroku apps:info --app luxe-smile-admin
```

### **Error: "Build failed"**
```bash
heroku logs --tail --app luxe-smile-admin
```

### **Error: "Module not found"**
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push heroku main
```

## 💰 **Costos**

- **Plan Gratuito:** Gratis (con limitaciones)
- **Plan Básico:** $7/mes (recomendado para producción)

## 🔐 **Seguridad**

### **Recomendaciones:**
1. Cambiar credenciales por defecto
2. Usar HTTPS (automático en Heroku)
3. Configurar variables de entorno para datos sensibles
4. Implementar autenticación robusta

### **Cambiar credenciales:**
```bash
heroku config:set ADMIN_USERNAME=tu_usuario_seguro --app luxe-smile-admin
heroku config:set ADMIN_PASSWORD=tu_contraseña_segura --app luxe-smile-admin
```

## 📞 **Soporte**

Si tienes problemas:

1. Revisar logs: `heroku logs --tail --app luxe-smile-admin`
2. Verificar configuración: `heroku config --app luxe-smile-admin`
3. Reiniciar aplicación: `heroku restart --app luxe-smile-admin`

## 🎉 **¡Listo para Usar!**

Una vez desplegado, tu panel de administración estará disponible en:
**https://luxe-smile-admin.herokuapp.com/admin**

¡Disfruta administrando tu sitio web! 🚀
