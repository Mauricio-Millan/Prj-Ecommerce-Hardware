# 📝 Guía de Nombrado de Archivos - Mejores Prácticas

## 🎯 Problema Resuelto

**Error:** Las imágenes no se cargaban porque los nombres de archivo contenían **espacios** y **mayúsculas inconsistentes**.

```
❌ MAL:
- "banner 1.webp"    (tiene espacio)
- "marca 2.png"      (tiene espacio)
- "Marca1.webp"      (inconsistencia mayúsculas/minúsculas)

✅ BIEN:
- "banner1.webp"     (sin espacios)
- "marca2.png"       (sin espacios, todo minúsculas)
- "marca1.webp"      (consistente)
```

---

## ✅ Reglas para Nombrar Archivos

### 1. **Sin Espacios**
Los espacios en URLs se codifican como `%20`, lo que causa problemas.

```bash
# ❌ Evita
banner 1.webp
product image.jpg
my file.png

# ✅ Usa guiones o camelCase
banner1.webp
banner-1.webp
product-image.jpg
myFile.png
```

### 2. **Todo en Minúsculas**
Los servidores Linux distinguen mayúsculas/minúsculas.

```bash
# ❌ Evita (inconsistencias)
Banner1.webp
banner2.webp
BANNER3.webp

# ✅ Consistente
banner1.webp
banner2.webp
banner3.webp
```

### 3. **Nombres Descriptivos**
Usa nombres que describan el contenido.

```bash
# ❌ Poco descriptivo
img1.jpg
foto.png
pic.webp

# ✅ Descriptivo
hero-banner.jpg
product-cpu-intel.png
logo-empresa.webp
```

### 4. **Prefijos para Organización**
Usa prefijos consistentes para agrupar archivos relacionados.

```bash
# Banners
banner-home.webp
banner-promo-verano.webp
banner-ofertas.webp

# Productos
product-cpu-i9.jpg
product-gpu-rtx4090.jpg
product-ram-32gb.jpg

# Logos
logo-intel.png
logo-amd.png
logo-nvidia.png
```

### 5. **Extensiones Correctas**
Usa las extensiones apropiadas y en minúsculas.

```bash
# ✅ Extensiones comunes
.jpg / .jpeg  - Fotos comprimidas
.png          - Imágenes con transparencia
.webp         - Formato moderno, mejor compresión
.svg          - Gráficos vectoriales (logos, iconos)
.gif          - Animaciones simples
```

### 6. **Versiones y Tamaños**
Si tienes múltiples versiones de la misma imagen:

```bash
# Por tamaño
product-cpu-thumbnail.jpg
product-cpu-medium.jpg
product-cpu-large.jpg

# Por sufijo
product-cpu@1x.jpg
product-cpu@2x.jpg
product-cpu@3x.jpg

# Por dimensiones
banner-1920x1080.webp
banner-1280x720.webp
banner-640x360.webp
```

---

## 🛠️ Script de Renombrado Automático

### PowerShell (Windows)

```powershell
# Eliminar espacios de todos los archivos en una carpeta
Get-ChildItem "ruta/carpeta" | ForEach-Object {
    $newName = $_.Name -replace " ", "-"
    Rename-Item -Path $_.FullName -NewName $newName
}

# Convertir a minúsculas
Get-ChildItem "ruta/carpeta" | ForEach-Object {
    $newName = $_.Name.ToLower()
    Rename-Item -Path $_.FullName -NewName $newName
}

# Ambos (eliminar espacios Y minúsculas)
Get-ChildItem "ruta/carpeta" | ForEach-Object {
    $newName = $_.Name.ToLower() -replace " ", "-"
    if ($_.Name -ne $newName) {
        Rename-Item -Path $_.FullName -NewName $newName
    }
}
```

### Bash (Linux/Mac)

```bash
# Eliminar espacios
for file in *; do
    mv "$file" "${file// /-}"
done

# Convertir a minúsculas
for file in *; do
    mv "$file" "$(echo $file | tr '[:upper:]' '[:lower:]')"
done

# Renombrar con prefijo
for file in *.jpg; do
    mv "$file" "product-$file"
done
```

---

## 📁 Estructura de Carpetas Recomendada

```
assets/
├── images/
│   ├── banners/
│   │   ├── banner-home.webp
│   │   ├── banner-promo.webp
│   │   └── banner-ofertas.webp
│   ├── products/
│   │   ├── cpu/
│   │   │   ├── intel-i9-13900k.jpg
│   │   │   └── amd-ryzen-9-7950x.jpg
│   │   ├── gpu/
│   │   │   ├── nvidia-rtx-4090.jpg
│   │   │   └── amd-rx-7900xtx.jpg
│   │   └── ram/
│   │       ├── corsair-vengeance-32gb.jpg
│   │       └── gskill-trident-64gb.jpg
│   ├── brands/
│   │   ├── logo-intel.png
│   │   ├── logo-amd.png
│   │   ├── logo-nvidia.png
│   │   └── logo-corsair.png
│   ├── categories/
│   │   ├── cat-procesadores.jpg
│   │   ├── cat-graficas.jpg
│   │   └── cat-memorias.jpg
│   └── ui/
│       ├── icon-cart.svg
│       ├── icon-search.svg
│       └── icon-user.svg
└── videos/
    └── promo-verano.mp4
```

---

## 🎨 Convenciones por Tipo de Archivo

### Imágenes de Banner
```bash
banner-{ubicacion}-{tema}.{ext}

Ejemplos:
banner-home-hero.webp
banner-home-promo.webp
banner-category-gpu.webp
```

### Imágenes de Productos
```bash
product-{categoria}-{marca}-{modelo}.{ext}

Ejemplos:
product-cpu-intel-i9-13900k.jpg
product-gpu-nvidia-rtx4090.jpg
product-ram-corsair-32gb.jpg
```

### Logos de Marcas
```bash
logo-{marca}.{ext}

Ejemplos:
logo-intel.png
logo-amd.png
logo-nvidia.png
```

### Iconos
```bash
icon-{nombre}.svg

Ejemplos:
icon-cart.svg
icon-search.svg
icon-user.svg
icon-menu.svg
```

---

## ⚠️ Problemas Comunes y Soluciones

### Problema 1: "404 Not Found"
**Causa:** Nombre de archivo incorrecto en el código

```typescript
// ❌ El archivo se llama "banner1.webp" pero el código dice:
image: 'assets/banners/banner 1.webp'  // Error: espacio

// ✅ Solución:
image: 'assets/banners/banner1.webp'   // Sin espacio
```

### Problema 2: "Failed to load resource"
**Causa:** Ruta incorrecta o archivo no existe

```typescript
// ✅ Verifica:
1. ¿El archivo existe en assets/?
2. ¿La ruta es correcta?
3. ¿El nombre coincide exactamente (mayúsculas/minúsculas)?
4. ¿La extensión es correcta?
```

### Problema 3: Imágenes funcionan en desarrollo pero no en producción
**Causa:** Angular no incluye archivos no referenciados

```typescript
// ✅ Solución:
// Siempre usa rutas relativas desde assets/
'assets/images/banner.jpg'  // ✅ Correcto
'/images/banner.jpg'        // ❌ Puede fallar en producción
```

---

## 🔍 Checklist antes de Subir Imágenes

```markdown
[ ] Los nombres NO tienen espacios
[ ] Todo está en minúsculas (o sigues un patrón consistente)
[ ] Los nombres son descriptivos
[ ] Las extensiones son correctas (.jpg, .png, .webp, .svg)
[ ] Las imágenes están optimizadas (tamaño y compresión)
[ ] Las rutas en el código coinciden con los nombres reales
[ ] Las imágenes están en la carpeta correcta de assets/
[ ] Has probado las imágenes en el navegador
```

---

## 📊 Tamaños Recomendados de Imágenes

### Banners
```
Hero Banner:      1920x600px  (max 500KB)
Promo Banner:     1200x400px  (max 300KB)
Category Banner:  800x300px   (max 200KB)
```

### Productos
```
Thumbnail:        300x300px   (max 50KB)
Gallery:          800x800px   (max 150KB)
Zoom:             1500x1500px (max 300KB)
```

### Logos
```
Brand Logo:       200x80px    (SVG preferido)
Favicon:          32x32px     (PNG o ICO)
```

---

## 🚀 Herramientas Útiles

### Optimización de Imágenes
- **TinyPNG:** https://tinypng.com (PNG/JPG)
- **Squoosh:** https://squoosh.app (Todos los formatos)
- **ImageOptim:** https://imageoptim.com (Mac)

### Conversión a WebP
```bash
# Usando cwebp (Google)
cwebp input.jpg -q 80 -o output.webp

# Batch conversion
for file in *.jpg; do
    cwebp "$file" -q 80 -o "${file%.jpg}.webp"
done
```

### Renombrado Masivo
- **Bulk Rename Utility** (Windows)
- **Renamer** (Mac)
- **rename** command (Linux)

---

## ✅ Resumen de la Solución Aplicada

1. **Renombré los archivos:**
   - `banner 1.webp` → `banner1.webp`
   - `marca 2.png` → `marca2.png`
   - etc.

2. **Actualicé los componentes:**
   ```typescript
   // Banner Component
   image: 'assets/banners/banner1.webp'  // ✅ Sin espacios
   
   // Brand Component
   logo: 'assets/marcas/marca2.png'      // ✅ Sin espacios
   ```

3. **Resultado:** Las imágenes ahora cargan correctamente ✅

---

**Fecha:** Octubre 2025  
**Proyecto:** Frontend E-commerce Hardware

¡Mantén estos estándares para evitar problemas futuros! 🚀
