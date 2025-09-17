#!/bin/bash

# 🚀 LUXE SMILE - SCRIPT DE DEPLOYMENT AUTOMÁTICO
# Este script prepara el proyecto para deployment

echo "🚀 Iniciando preparación para deployment de LUXE SMILE..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    print_error "No se encontró index.html. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

print_status "Directorio del proyecto verificado"

# Crear directorio de deployment
DEPLOY_DIR="luxe-smile-deploy"
if [ -d "$DEPLOY_DIR" ]; then
    rm -rf "$DEPLOY_DIR"
fi

mkdir "$DEPLOY_DIR"
print_status "Directorio de deployment creado: $DEPLOY_DIR"

# Copiar archivos principales
print_info "Copiando archivos principales..."

# Archivos HTML
cp index.html "$DEPLOY_DIR/"
cp admin.html "$DEPLOY_DIR/"

# Archivos CSS
cp styles.css "$DEPLOY_DIR/"
cp admin-styles.css "$DEPLOY_DIR/"

# Archivos JavaScript
cp script.js "$DEPLOY_DIR/"
cp admin-script.js "$DEPLOY_DIR/"
cp admin-integration.js "$DEPLOY_DIR/"
cp form-config.js "$DEPLOY_DIR/"

# Archivos de configuración
cp netlify.toml "$DEPLOY_DIR/" 2>/dev/null || print_warning "netlify.toml no encontrado"
cp vercel.json "$DEPLOY_DIR/" 2>/dev/null || print_warning "vercel.json no encontrado"
cp firebase.json "$DEPLOY_DIR/" 2>/dev/null || print_warning "firebase.json no encontrado"

# Crear directorio .github/workflows si no existe
mkdir -p "$DEPLOY_DIR/.github/workflows"
cp .github/workflows/deploy.yml "$DEPLOY_DIR/.github/workflows/" 2>/dev/null || print_warning "GitHub workflow no encontrado"

# Archivos de documentación
cp README.md "$DEPLOY_DIR/" 2>/dev/null || print_warning "README.md no encontrado"
cp DEPLOYMENT-GUIDE.md "$DEPLOY_DIR/" 2>/dev/null || print_warning "DEPLOYMENT-GUIDE.md no encontrado"
cp README-DEPLOYMENT.md "$DEPLOY_DIR/" 2>/dev/null || print_warning "README-DEPLOYMENT.md no encontrado"
cp ADMIN-README.md "$DEPLOY_DIR/" 2>/dev/null || print_warning "ADMIN-README.md no encontrado"

print_status "Archivos principales copiados"

# Verificar archivos críticos
print_info "Verificando archivos críticos..."

CRITICAL_FILES=(
    "index.html"
    "styles.css"
    "script.js"
    "admin.html"
    "admin-styles.css"
    "admin-script.js"
    "admin-integration.js"
    "form-config.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$DEPLOY_DIR/$file" ]; then
        print_status "$file ✓"
    else
        print_error "$file ✗"
    fi
done

# Crear archivo de información del deployment
cat > "$DEPLOY_DIR/DEPLOYMENT-INFO.txt" << EOF
🚀 LUXE SMILE - INFORMACIÓN DE DEPLOYMENT
==========================================

Fecha de deployment: $(date)
Versión: 1.0.0
Estado: Listo para producción

ARCHIVOS INCLUIDOS:
- index.html (Página principal)
- styles.css (Estilos principales)
- script.js (JavaScript principal)
- admin.html (Panel de administración)
- admin-styles.css (Estilos del admin)
- admin-script.js (JavaScript del admin)
- admin-integration.js (Integración admin)
- form-config.js (Configuración de formularios)

CONFIGURACIONES INCLUIDAS:
- netlify.toml (Netlify)
- vercel.json (Vercel)
- firebase.json (Firebase)
- .github/workflows/deploy.yml (GitHub Pages)

CREDENCIALES DEL ADMIN:
- URL: https://tu-sitio.com/admin.html
- Usuario: admin
- Contraseña: luxesmile2024

PLATAFORMAS RECOMENDADAS:
1. Netlify (Más fácil)
2. Vercel (Para desarrolladores)
3. GitHub Pages (Gratis)
4. Firebase (Google Cloud)

INSTRUCCIONES RÁPIDAS:
1. Arrastrar esta carpeta a la plataforma elegida
2. Esperar 2-3 minutos
3. ¡Tu sitio estará online!

SOPORTE:
- Documentación completa en DEPLOYMENT-GUIDE.md
- Guía rápida en README-DEPLOYMENT.md
- Guía del admin en ADMIN-README.md

¡Gracias por usar LUXE SMILE! 🦷✨
EOF

print_status "Archivo de información creado"

# Mostrar resumen
echo ""
echo "🎉 DEPLOYMENT PREPARADO EXITOSAMENTE!"
echo "======================================"
echo ""
print_info "Directorio de deployment: $DEPLOY_DIR"
print_info "Archivos listos para subir a cualquier plataforma"
echo ""
print_warning "PRÓXIMOS PASOS:"
echo "1. Ir a netlify.com, vercel.com, o github.com"
echo "2. Arrastrar la carpeta '$DEPLOY_DIR' a la plataforma"
echo "3. ¡Tu sitio estará online en minutos!"
echo ""
print_info "CREDENCIALES DEL ADMIN:"
echo "   URL: https://tu-sitio.com/admin.html"
echo "   Usuario: admin"
echo "   Contraseña: luxesmile2024"
echo ""
print_status "¡Listo para deployment! 🚀"

# Mostrar tamaño del directorio
DEPLOY_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
print_info "Tamaño del deployment: $DEPLOY_SIZE"

echo ""
echo "📁 Contenido del directorio de deployment:"
ls -la "$DEPLOY_DIR"

echo ""
print_status "Script de deployment completado exitosamente!"


