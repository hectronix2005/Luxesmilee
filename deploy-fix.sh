#!/bin/bash

# 🔧 Script para deploy de la corrección de errores 404
echo "🚀 Iniciando deploy de corrección de errores 404..."

# Verificar que estamos en el directorio correcto
if [ ! -f "admin.html" ]; then
    echo "❌ Error: No se encontró admin.html en el directorio actual"
    exit 1
fi

# Verificar que los archivos están corregidos
echo "🔍 Verificando que los archivos están corregidos..."

# Verificar admin.html principal
if grep -q "doctor-management-verification.js" admin.html; then
    echo "❌ Error: admin.html principal todavía tiene referencias problemáticas"
    exit 1
fi

# Verificar archivos de deploy
if grep -q "doctor-management-verification.js" luxe-smile-deploy/admin.html; then
    echo "❌ Error: luxe-smile-deploy/admin.html todavía tiene referencias problemáticas"
    exit 1
fi

if grep -q "doctor-management-verification.js" "luxe-smile-deploy 2/admin.html"; then
    echo "❌ Error: luxe-smile-deploy 2/admin.html todavía tiene referencias problemáticas"
    exit 1
fi

echo "✅ Todos los archivos están corregidos"

# Copiar archivos corregidos a las carpetas de deploy
echo "📁 Copiando archivos corregidos..."

# Copiar admin.html corregido
cp admin.html luxe-smile-deploy/admin.html
cp admin.html "luxe-smile-deploy 2/admin.html"

# Copiar admin-script.js corregido
cp admin-script.js luxe-smile-deploy/admin-script.js
cp admin-script.js "luxe-smile-deploy 2/admin-script.js"

echo "✅ Archivos copiados correctamente"

# Verificar que la función removeDoctor está corregida
echo "🔍 Verificando función removeDoctor..."
if grep -q "VERSIÓN CORREGIDA PARA PERSISTENCIA GARANTIZADA" admin-script.js; then
    echo "✅ Función removeDoctor está corregida"
else
    echo "❌ Error: Función removeDoctor no está corregida"
    exit 1
fi

echo "🎉 Deploy de corrección completado exitosamente"
echo ""
echo "📋 Próximos pasos:"
echo "1. Hacer commit y push de los cambios"
echo "2. Esperar a que Netlify haga el deploy automático"
echo "3. Probar la eliminación de doctores en https://luxesmilee.com/admin.html"
echo ""
echo "🔍 Para verificar que funciona:"
echo "- Abrir https://luxesmilee.com/admin.html"
echo "- Abrir consola del navegador (F12)"
echo "- No debe haber errores 404"
echo "- Probar eliminar un doctor"
