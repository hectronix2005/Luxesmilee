#!/bin/bash

# 🚀 Script de Despliegue Automático en Heroku
# Panel de Administración - Luxe Smile

set -e  # Exit on any error

echo "🚀 Iniciando despliegue en Heroku..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio correcto."
    exit 1
fi

# Verificar que Heroku CLI está instalado
if ! command -v heroku &> /dev/null; then
    print_error "Heroku CLI no está instalado. Instálalo desde: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Verificar que Git está instalado
if ! command -v git &> /dev/null; then
    print_error "Git no está instalado. Instálalo desde: https://git-scm.com/"
    exit 1
fi

print_status "Verificando estado de Heroku CLI..."
if ! heroku auth:whoami &> /dev/null; then
    print_warning "No estás logueado en Heroku. Iniciando sesión..."
    heroku login
fi

# Obtener nombre de la aplicación
APP_NAME="luxe-smile-admin"
print_status "Usando aplicación: $APP_NAME"

# Verificar si la aplicación existe
if ! heroku apps:info $APP_NAME &> /dev/null; then
    print_status "Creando nueva aplicación en Heroku..."
    heroku create $APP_NAME
    print_success "Aplicación $APP_NAME creada exitosamente"
else
    print_status "Aplicación $APP_NAME ya existe"
fi

# Configurar variables de entorno
print_status "Configurando variables de entorno..."
heroku config:set NODE_ENV=production --app $APP_NAME
heroku config:set ADMIN_USERNAME=admin --app $APP_NAME
heroku config:set ADMIN_PASSWORD=admin123 --app $APP_NAME

# Inicializar Git si no está inicializado
if [ ! -d ".git" ]; then
    print_status "Inicializando repositorio Git..."
    git init
fi

# Agregar archivos al staging
print_status "Agregando archivos al repositorio..."
git add .

# Hacer commit
print_status "Haciendo commit de los cambios..."
git commit -m "Deploy: Luxe Smile Admin Panel - $(date)" || {
    print_warning "No hay cambios para hacer commit"
}

# Desplegar en Heroku
print_status "Desplegando en Heroku..."
git push heroku main || git push heroku master

# Verificar que el despliegue fue exitoso
print_status "Verificando estado del despliegue..."
sleep 5

if heroku ps --app $APP_NAME | grep -q "web.1.*up"; then
    print_success "¡Despliegue exitoso! 🎉"
    
    # Mostrar URLs importantes
    echo ""
    echo "📱 URLs de la aplicación:"
    echo "   Sitio Principal: https://$APP_NAME.herokuapp.com/"
    echo "   Panel de Admin:  https://$APP_NAME.herokuapp.com/admin"
    echo "   API de Datos:    https://$APP_NAME.herokuapp.com/api/site-data"
    echo "   Health Check:    https://$APP_NAME.herokuapp.com/health"
    echo ""
    echo "🔐 Credenciales de acceso:"
    echo "   Usuario: admin"
    echo "   Contraseña: admin123"
    echo ""
    
    # Abrir la aplicación en el navegador
    print_status "Abriendo aplicación en el navegador..."
    heroku open --app $APP_NAME
    
else
    print_error "El despliegue falló. Revisando logs..."
    heroku logs --tail --app $APP_NAME
    exit 1
fi

print_success "¡Despliegue completado exitosamente! 🚀"
