# 🚀 Guía de Despliegue en Heroku - Panel de Administración

## 📋 **Prerequisitos**

1. **Cuenta de Heroku** - [Crear cuenta gratuita](https://signup.heroku.com/)
2. **Heroku CLI** - [Descargar e instalar](https://devcenter.heroku.com/articles/heroku-cli)
3. **Git** - [Descargar e instalar](https://git-scm.com/)
4. **Node.js** - Versión 18 o superior

---

## 🔧 **Configuración Inicial**

### 1. **Verificar Heroku CLI**
```bash
heroku --version
```

### 2. **Iniciar sesión en Heroku**
```bash
heroku login
```

### 3. **Navegar al directorio del proyecto**
```bash
cd "/Users/hectorneira/Documents/PROGRAMACION BACK UP/LUXE SMILE"
```

---

## 📦 **Preparar el Proyecto**

### 1. **Inicializar Git (si no está inicializado)**
```bash
git init
```

### 2. **Agregar archivos al repositorio**
```bash
git add .
```

### 3. **Hacer commit inicial**
```bash
git commit -m "Initial commit: Luxe Smile Admin Panel"
```

---

## 🚀 **Desplegar en Heroku**

### 1. **Crear aplicación en Heroku**
```bash
heroku create luxe-smile-admin
```

### 2. **Configurar variables de entorno (opcional)**
```bash
heroku config:set NODE_ENV=production
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=admin123
```

### 3. **Desplegar la aplicación**
```bash
git push heroku main
```

### 4. **Abrir la aplicación**
```bash
heroku open
```

---

## 🔍 **Verificar el Despliegue**

### **URLs de la Aplicación:**
- **Sitio Principal:** `https://luxe-smile-admin.herokuapp.com/`
- **Panel de Administración:** `https://luxe-smile-admin.herokuapp.com/admin`
- **API de Datos:** `https://luxe-smile-admin.herokuapp.com/api/site-data`
- **Health Check:** `https://luxe-smile-admin.herokuapp.com/health`

### **Credenciales de Acceso:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 🛠️ **Comandos Útiles de Heroku**

### **Ver logs en tiempo real:**
```bash
heroku logs --tail
```

### **Abrir consola de la aplicación:**
```bash
heroku run bash
```

### **Reiniciar la aplicación:**
```bash
heroku restart
```

### **Ver información de la aplicación:**
```bash
heroku info
```

### **Ver variables de entorno:**
```bash
heroku config
```

---

## 📁 **Estructura del Proyecto Desplegado**

```
luxe-smile-admin/
├── server.js              # Servidor Express
├── package.json           # Dependencias y scripts
├── Procfile              # Configuración de Heroku
├── .gitignore            # Archivos ignorados por Git
├── admin.html            # Panel de administración
├── admin-script.js       # Lógica del panel
├── admin-styles.css      # Estilos del panel
├── admin-integration.js  # Integración con sitio principal
├── index.html            # Sitio web principal
├── styles.css            # Estilos del sitio
├── script.js             # Lógica del sitio
└── ... (otros archivos estáticos)
```

---

## 🔄 **Actualizaciones Futuras**

### **Para actualizar la aplicación:**

1. **Hacer cambios en el código**
2. **Agregar cambios a Git:**
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   ```
3. **Desplegar actualización:**
   ```bash
   git push heroku main
   ```

---

## 🐛 **Solución de Problemas**

### **Error: "App not found"**
```bash
heroku apps:info
heroku apps:rename nuevo-nombre
```

### **Error: "Build failed"**
```bash
heroku logs --tail
# Revisar los logs para identificar el problema
```

### **Error: "Port already in use"**
- Heroku asigna automáticamente el puerto
- Usar `process.env.PORT` en el código

### **Error: "Module not found"**
```bash
# Verificar que todas las dependencias estén en package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push heroku main
```

---

## 💰 **Costos de Heroku**

### **Plan Gratuito (Hobby):**
- ✅ **Gratis** para aplicaciones pequeñas
- ✅ **750 horas/mes** de tiempo de ejecución
- ✅ **Soporte básico**
- ⚠️ **La aplicación se "duerme"** después de 30 minutos de inactividad

### **Plan Básico ($7/mes):**
- ✅ **Siempre activo** (no se duerme)
- ✅ **Soporte prioritario**
- ✅ **Métricas avanzadas**

---

## 🔐 **Seguridad**

### **Recomendaciones:**
1. **Cambiar credenciales por defecto** en producción
2. **Usar HTTPS** (Heroku lo proporciona automáticamente)
3. **Configurar variables de entorno** para datos sensibles
4. **Implementar autenticación robusta** en el futuro

### **Configurar credenciales seguras:**
```bash
heroku config:set ADMIN_USERNAME=tu_usuario_seguro
heroku config:set ADMIN_PASSWORD=tu_contraseña_segura
```

---

## 📊 **Monitoreo**

### **Ver métricas de la aplicación:**
```bash
heroku logs --tail
```

### **Ver uso de recursos:**
```bash
heroku ps
```

---

## 🎯 **Próximos Pasos**

1. **Desplegar la aplicación** siguiendo esta guía
2. **Probar el panel de administración** en la URL de Heroku
3. **Configurar dominio personalizado** (opcional)
4. **Implementar base de datos** para persistencia real
5. **Configurar CI/CD** para despliegues automáticos

---

## 📞 **Soporte**

Si tienes problemas con el despliegue:

1. **Revisar logs:** `heroku logs --tail`
2. **Verificar configuración:** `heroku config`
3. **Reiniciar aplicación:** `heroku restart`
4. **Contactar soporte de Heroku** si es necesario

---

**¡Tu panel de administración estará funcionando en Heroku! 🎉**
