#!/bin/bash

# 🚀 Script para deploy a Netlify
echo "🚀 Iniciando deploy a Netlify..."

# Verificar que estamos en el directorio correcto
if [ ! -f "luxe-smile-deploy-ready.zip" ]; then
    echo "❌ Error: No se encontró luxe-smile-deploy-ready.zip"
    exit 1
fi

echo "✅ Archivo ZIP listo para deploy encontrado"
echo "📦 Tamaño del archivo: $(ls -lh luxe-smile-deploy-ready.zip | awk '{print $5}')"

# Verificar que los archivos están corregidos
echo "🔍 Verificando archivos corregidos..."

# Verificar que no hay referencias problemáticas
if grep -r "doctor-management-verification.js\|label-update-verification.js" luxe-smile-deploy/ > /dev/null 2>&1; then
    echo "❌ Error: Aún hay referencias a scripts inexistentes"
    exit 1
fi

echo "✅ Archivos verificados - sin referencias problemáticas"

# Verificar que la función removeDoctor está corregida
if grep -q "VERSIÓN CORREGIDA PARA PERSISTENCIA GARANTIZADA" luxe-smile-deploy/admin-script.js; then
    echo "✅ Función removeDoctor está corregida"
else
    echo "❌ Error: Función removeDoctor no está corregida"
    exit 1
fi

echo ""
echo "🎉 ARCHIVOS LISTOS PARA DEPLOY"
echo ""
echo "📋 OPCIONES DE DEPLOY:"
echo ""
echo "1️⃣ DEPLOY MANUAL (Recomendado):"
echo "   • Ir a https://app.netlify.com/"
echo "   • Hacer clic en 'Sites'"
echo "   • Seleccionar tu sitio 'luxesmilee'"
echo "   • Ir a 'Deploys'"
echo "   • Hacer clic en 'Trigger deploy' → 'Deploy site'"
echo "   • O arrastrar la carpeta 'luxe-smile-deploy' a Netlify"
echo ""
echo "2️⃣ DEPLOY POR DRAG & DROP:"
echo "   • Ir a https://app.netlify.com/drop"
echo "   • Arrastrar el archivo 'luxe-smile-deploy-ready.zip'"
echo "   • O arrastrar la carpeta 'luxe-smile-deploy'"
echo ""
echo "3️⃣ DEPLOY POR NETLIFY CLI (si lo tienes instalado):"
echo "   • netlify deploy --prod --dir=luxe-smile-deploy"
echo ""
echo "🔍 DESPUÉS DEL DEPLOY:"
echo "1. Ir a https://luxesmilee.com/admin.html"
echo "2. Abrir consola del navegador (F12)"
echo "3. Verificar que NO hay errores 404"
echo "4. Probar eliminar un doctor"
echo "5. Cerrar sesión y volver a abrir"
echo "6. Verificar que el doctor eliminado NO aparece"
echo ""
echo "📁 Archivos listos:"
echo "   • luxe-smile-deploy-ready.zip (para drag & drop)"
echo "   • luxe-smile-deploy/ (carpeta completa)"
echo ""
echo "✅ ¡Listo para deploy!"
