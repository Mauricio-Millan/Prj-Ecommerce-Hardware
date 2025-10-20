# 🔧 Documentación de Git - Frontend E-commerce Hardware

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Configuración Inicial de Git](#configuración-inicial-de-git)
3. [Archivo .gitattributes](#archivo-gitattributes)
4. [Archivo .gitignore](#archivo-gitignore)
5. [Workflow de Git](#workflow-de-git)
6. [Convenciones de Commits](#convenciones-de-commits)
7. [Branching Strategy](#branching-strategy)
8. [Comandos Útiles](#comandos-útiles)
9. [Resolución de Problemas](#resolución-de-problemas)
10. [Buenas Prácticas](#buenas-prácticas)

---

## 🎯 Introducción

Esta documentación cubre todo lo relacionado con **Git y Control de Versiones** para el proyecto Frontend E-commerce Hardware. Aprenderás cómo configurar Git correctamente, manejar finales de línea, seguir convenciones de commits y resolver problemas comunes.

**Proyecto:** Frontend E-commerce Hardware  
**Repositorio:** Prj-Ecommerce-Hardware  
**Owner:** Mauricio-Millan  
**Branch Principal:** Frontend  
**Fecha:** Octubre 2025

---

## ⚙️ Configuración Inicial de Git

### 1. Configurar tu identidad

```bash
# Configurar nombre (global para todos tus proyectos)
git config --global user.name "Tu Nombre"

# Configurar email
git config --global user.email "tu.email@ejemplo.com"

# Verificar configuración
git config --global --list
```

### 2. Configurar editor por defecto

```bash
# Visual Studio Code
git config --global core.editor "code --wait"

# Vim
git config --global core.editor "vim"

# Notepad (Windows)
git config --global core.editor "notepad"
```

### 3. Configurar finales de línea (IMPORTANTE)

```bash
# Windows (recomendado en equipos mixtos)
git config --global core.autocrlf true

# Linux/Mac
git config --global core.autocrlf input

# Sin conversión automática
git config --global core.autocrlf false
```

**Explicación:**
- `true`: Convierte LF a CRLF al checkout, CRLF a LF al commit (Windows)
- `input`: Convierte CRLF a LF al commit, no hace nada al checkout (Linux/Mac)
- `false`: No hace ninguna conversión

### 4. Otras configuraciones útiles

```bash
# Colorear output de Git
git config --global color.ui auto

# Mostrar estado corto por defecto
git config --global status.short true

# Pull con rebase en lugar de merge
git config --global pull.rebase true

# Usar SSH en lugar de HTTPS
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

---

## 📄 Archivo .gitattributes

### ¿Qué es .gitattributes?

El archivo `.gitattributes` le dice a Git cómo manejar ciertos archivos. Su uso principal es **normalizar finales de línea** en equipos con diferentes sistemas operativos.

### ⚠️ El Problema: LF vs CRLF

**Síntomas:**
```
warning: in the working copy of 'tailwind.config.js', LF will be replaced by CRLF the next time Git touches it
```

**Causa:**
- **Windows** usa CRLF (`\r\n`) para finales de línea
- **Linux/Mac** usa LF (`\n`) para finales de línea
- Git puede causar conflictos si no está configurado correctamente

**Consecuencias:**
- Cambios fantasma en archivos (Git ve cambios aunque no editaste nada)
- Conflictos de merge innecesarios
- Diffs confusos con "^M" al final de líneas

### ✅ La Solución: Crear .gitattributes

**Ubicación:** Raíz del proyecto

```gitattributes
# =============================================================================
# .gitattributes - Configuración de finales de línea para el proyecto
# =============================================================================

# Normalización automática para todos los archivos de texto
* text=auto

# =============================================================================
# ARCHIVOS DE CÓDIGO - FORZAR LF
# =============================================================================

# TypeScript y JavaScript
*.ts text eol=lf
*.js text eol=lf
*.mjs text eol=lf
*.cjs text eol=lf

# Archivos de configuración JavaScript/TypeScript
*.json text eol=lf
tsconfig*.json text eol=lf
angular.json text eol=lf
package.json text eol=lf
package-lock.json text eol=lf

# HTML y Templates
*.html text eol=lf

# Estilos
*.css text eol=lf
*.scss text eol=lf
*.sass text eol=lf
*.less text eol=lf

# Documentación
*.md text eol=lf
*.txt text eol=lf

# =============================================================================
# ARCHIVOS DE CONFIGURACIÓN
# =============================================================================

.gitignore text eol=lf
.gitattributes text eol=lf
.editorconfig text eol=lf
.eslintrc* text eol=lf
.prettierrc* text eol=lf
tailwind.config.js text eol=lf

# Scripts de Shell
*.sh text eol=lf

# Scripts de PowerShell
*.ps1 text eol=crlf

# Scripts de Batch (Windows)
*.bat text eol=crlf
*.cmd text eol=crlf

# =============================================================================
# ARCHIVOS BINARIOS - NO MODIFICAR
# =============================================================================

# Imágenes
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.webp binary
*.ico binary
*.svg binary
*.bmp binary
*.tiff binary

# Fuentes
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
*.otf binary

# Videos
*.mp4 binary
*.avi binary
*.mov binary
*.webm binary

# Archivos comprimidos
*.zip binary
*.tar binary
*.gz binary
*.rar binary
*.7z binary

# Documentos
*.pdf binary
*.doc binary
*.docx binary
*.xls binary
*.xlsx binary
*.ppt binary
*.pptx binary

# Otros
*.exe binary
*.dll binary
*.so binary
*.dylib binary

# =============================================================================
# LINGUIST OVERRIDES (Para estadísticas de GitHub)
# =============================================================================

# Excluir archivos generados de las estadísticas
*.min.js linguist-generated=true
*.min.css linguist-generated=true
dist/** linguist-generated=true
.angular/** linguist-generated=true

# Excluir dependencias
node_modules/** linguist-vendored
```

### 📝 Explicación de las Propiedades

#### `text=auto`
```gitattributes
* text=auto
```
- Detecta automáticamente archivos de texto vs binarios
- Normaliza finales de línea en archivos de texto
- Deja archivos binarios sin tocar

#### `text eol=lf`
```gitattributes
*.ts text eol=lf
```
- Marca el archivo como texto
- Fuerza uso de LF (`\n`) en el repositorio
- Al hacer checkout:
  - En Windows: Puede convertir a CRLF según `core.autocrlf`
  - En Linux/Mac: Mantiene LF

#### `text eol=crlf`
```gitattributes
*.bat text eol=crlf
```
- Fuerza uso de CRLF en el repositorio
- Útil para scripts de Windows que requieren CRLF

#### `binary`
```gitattributes
*.png binary
```
- Marca el archivo como binario
- Git no intentará hacer merge ni diff
- No se modifican finales de línea

#### `linguist-generated`
```gitattributes
*.min.js linguist-generated=true
```
- Excluye archivos de las estadísticas de lenguajes en GitHub
- Útil para archivos generados automáticamente

#### `linguist-vendored`
```gitattributes
node_modules/** linguist-vendored
```
- Excluye dependencias de terceros de las estadísticas
- No afecta funcionalidad, solo estadísticas de GitHub

---

## 🚫 Archivo .gitignore

### ¿Qué es .gitignore?

Define qué archivos y carpetas **NO** deben ser incluidos en el control de versiones.

### ✅ .gitignore Recomendado para Angular

```gitignore
# =============================================================================
# .gitignore - Archivos y carpetas a ignorar en Git
# =============================================================================

# =============================================================================
# DEPENDENCIES - Dependencias de Node.js
# =============================================================================
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# =============================================================================
# ANGULAR BUILD - Archivos generados por Angular CLI
# =============================================================================

# Build outputs
/dist
/tmp
/out-tsc
/.angular
/build

# Caché de compilación
.angular/cache
*.tsbuildinfo

# =============================================================================
# TYPESCRIPT - Archivos generados
# =============================================================================
*.js.map
*.d.ts.map

# =============================================================================
# TESTING - Cobertura de tests
# =============================================================================
/coverage
*.lcov
.nyc_output

# Archivos de test end-to-end
/e2e/*.js
/e2e/*.map

# =============================================================================
# IDEs y EDITORES
# =============================================================================

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/

# IntelliJ IDEA / WebStorm
.idea/
*.iml
*.iws
*.ipr
out/

# Sublime Text
*.sublime-workspace
*.sublime-project

# Vim
*.swp
*.swo
*~

# Emacs
*~
\#*\#
.\#*

# =============================================================================
# OPERATING SYSTEMS
# =============================================================================

# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.Spotlight-V100
.Trashes

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk

# Linux
*~
.directory
.Trash-*

# =============================================================================
# LOGS - Archivos de registro
# =============================================================================
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# =============================================================================
# ENVIRONMENT - Variables de entorno
# =============================================================================
.env
.env.local
.env.*.local
.env.production

# =============================================================================
# SASS - Archivos generados
# =============================================================================
.sass-cache/
*.css.map

# =============================================================================
# OTROS
# =============================================================================

# Archivos temporales
*.tmp
*.temp
*.bak
*.swp
*.swo

# Archivos comprimidos (opcional, depende del proyecto)
*.zip
*.tar.gz
*.rar

# Documentation builds (si usas herramientas como Compodoc)
/documentation
```

### 📝 Explicación de Secciones

#### 1. Dependencies
```gitignore
node_modules/
```
- **¿Por qué?** `node_modules` puede tener millones de archivos
- Ocupa mucho espacio
- Se puede regenerar con `npm install`
- **Resultado:** Repositorio más ligero y rápido

#### 2. Angular Build
```gitignore
/dist
/.angular
```
- Archivos generados por `ng build`
- Se pueden regenerar en cualquier momento
- No deben estar en el repo

#### 3. IDEs
```gitignore
.vscode/*
!.vscode/settings.json
```
- Ignora configuración personal del editor
- Excepto archivos compartidos del equipo (con `!`)

#### 4. Operating Systems
```gitignore
.DS_Store
Thumbs.db
```
- Archivos del sistema operativo
- No tienen nada que ver con el código

#### 5. Environment
```gitignore
.env
.env.local
```
- Variables de entorno con datos sensibles
- API keys, contraseñas, etc.
- **CRÍTICO:** Nunca subir estos archivos

---

## 🔄 Workflow de Git

### 1. Flujo Básico Diario

```bash
# 1. Ver estado del repositorio
git status

# 2. Ver cambios no staged
git diff

# 3. Agregar archivos al staging area
git add .                    # Todos los archivos
git add src/app/*.ts         # Solo archivos TypeScript en app
git add -p                   # Interactivo (pregunta por cada cambio)

# 4. Ver cambios staged
git diff --staged

# 5. Hacer commit
git commit -m "feat: agregar componente de navbar"

# 6. Ver historial
git log --oneline --graph --all

# 7. Subir cambios
git push origin Frontend
```

### 2. Trabajando con Branches

```bash
# Ver branches
git branch                   # Locales
git branch -a                # Locales y remotas

# Crear nueva branch
git branch feature/catalogo

# Cambiar a una branch
git checkout feature/catalogo

# Crear y cambiar en un solo comando
git checkout -b feature/catalogo

# Cambiar a main/Frontend
git checkout Frontend

# Eliminar branch local
git branch -d feature/catalogo

# Eliminar branch remota
git push origin --delete feature/catalogo
```

### 3. Sincronizar con Remoto

```bash
# Descargar cambios sin aplicar
git fetch origin

# Descargar y aplicar cambios
git pull origin Frontend

# Pull con rebase (evita merge commits)
git pull --rebase origin Frontend

# Ver remotos configurados
git remote -v

# Agregar remoto
git remote add origin https://github.com/Mauricio-Millan/Prj-Ecommerce-Hardware.git
```

---

## 💬 Convenciones de Commits

### Conventional Commits

Formato estándar para mensajes de commit claros y útiles.

#### Estructura

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

#### Tipos de Commits

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat: agregar carrito de compras` |
| `fix` | Corrección de bug | `fix: corregir error 404 en imágenes` |
| `docs` | Documentación | `docs: actualizar README con instrucciones` |
| `style` | Cambios de formato (no afectan código) | `style: formatear código con prettier` |
| `refactor` | Refactorización | `refactor: simplificar lógica del navbar` |
| `perf` | Mejoras de rendimiento | `perf: optimizar carga de imágenes` |
| `test` | Agregar o modificar tests | `test: agregar tests para product service` |
| `build` | Cambios en build o dependencias | `build: actualizar Angular a v20` |
| `ci` | Cambios en CI/CD | `ci: agregar GitHub Actions workflow` |
| `chore` | Tareas de mantenimiento | `chore: limpiar archivos obsoletos` |
| `revert` | Revertir commit anterior | `revert: revertir commit abc123` |

#### Ejemplos Correctos

```bash
# Feature
git commit -m "feat(navbar): agregar badge de contador en carrito"

# Fix
git commit -m "fix(banner): corregir auto-rotation que no se detenía"

# Docs
git commit -m "docs: agregar sección de troubleshooting"

# Style
git commit -m "style(footer): ajustar espaciado entre columnas"

# Refactor
git commit -m "refactor(home): extraer lógica de carousel a servicio"

# Perf
git commit -m "perf(images): implementar lazy loading en product cards"

# Build
git commit -m "build: agregar configuración de assets en angular.json"

# Con scope y breaking change
git commit -m "feat(api)!: cambiar estructura de respuesta de productos

BREAKING CHANGE: la propiedad 'price' ahora es un objeto con 'amount' y 'currency'"
```

#### ❌ Ejemplos Incorrectos

```bash
# Muy vago
git commit -m "fix stuff"
git commit -m "updates"
git commit -m "wip"

# Sin tipo
git commit -m "agregar navbar"

# Muy largo en una línea
git commit -m "feat: agregar navbar completo con menu mobile responsive y carrito de compras con badge y animaciones"

# Sin descripción clara
git commit -m "feat: cambios"
```

#### 📝 Buenas Prácticas para Mensajes

1. **Primera línea máximo 50-72 caracteres**
2. **Usar imperativo**: "agregar" no "agregado" o "agrega"
3. **No terminar con punto**
4. **Ser específico pero conciso**
5. **Separar scope con paréntesis**
6. **Usar minúsculas** (excepto nombres propios o siglas)

---

## 🌿 Branching Strategy

### Git Flow Simplificado

```
main (producción)
    ↓
Frontend (desarrollo principal)
    ↓
feature/* (nuevas funcionalidades)
bugfix/* (corrección de bugs)
hotfix/* (correcciones urgentes en producción)
```

### Convenciones de Nombres de Branches

#### Feature Branches
```bash
feature/nombre-descriptivo

# Ejemplos:
feature/catalogo-productos
feature/detalle-producto
feature/carrito-compras
feature/checkout
feature/user-authentication
```

#### Bugfix Branches
```bash
bugfix/descripcion-del-bug

# Ejemplos:
bugfix/404-error-imagenes
bugfix/navbar-mobile-menu
bugfix/product-card-overflow
```

#### Hotfix Branches
```bash
hotfix/descripcion-urgente

# Ejemplos:
hotfix/payment-gateway-down
hotfix/critical-security-vulnerability
```

### Workflow Completo

```bash
# 1. Actualizar branch principal
git checkout Frontend
git pull origin Frontend

# 2. Crear nueva feature branch
git checkout -b feature/catalogo-productos

# 3. Trabajar en la feature
# ... hacer cambios ...
git add .
git commit -m "feat(catalogo): agregar grid de productos"

# 4. Más commits si es necesario
git commit -m "feat(catalogo): agregar filtros por categoría"
git commit -m "test(catalogo): agregar tests unitarios"

# 5. Actualizar con últimos cambios de Frontend
git checkout Frontend
git pull origin Frontend
git checkout feature/catalogo-productos
git rebase Frontend

# 6. Subir feature branch
git push origin feature/catalogo-productos

# 7. Crear Pull Request en GitHub

# 8. Después del merge, limpiar
git checkout Frontend
git pull origin Frontend
git branch -d feature/catalogo-productos
```

---

## 🛠️ Comandos Útiles

### Información del Repositorio

```bash
# Ver estado completo
git status

# Ver estado resumido
git status -s

# Ver historial de commits
git log

# Ver historial con gráfico
git log --oneline --graph --all --decorate

# Ver cambios de un archivo específico
git log -p src/app/app.component.ts

# Ver quién modificó cada línea de un archivo
git blame src/app/app.component.ts

# Ver estadísticas de commits
git shortlog -sn
```

### Deshacer Cambios

```bash
# Descartar cambios en working directory
git checkout -- archivo.ts
git restore archivo.ts  # Nuevo comando

# Descartar TODOS los cambios no staged
git checkout -- .
git restore .

# Quitar archivo del staging area (mantener cambios)
git reset HEAD archivo.ts
git restore --staged archivo.ts  # Nuevo comando

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (descartar cambios)
git reset --hard HEAD~1

# Revertir un commit (crea nuevo commit)
git revert abc123
```

### Stashing (Guardar cambios temporalmente)

```bash
# Guardar cambios sin commit
git stash

# Guardar con mensaje
git stash save "WIP: trabajando en navbar"

# Ver lista de stashes
git stash list

# Aplicar último stash (mantener en lista)
git stash apply

# Aplicar y eliminar de lista
git stash pop

# Aplicar stash específico
git stash apply stash@{2}

# Eliminar un stash
git stash drop stash@{0}

# Eliminar todos los stashes
git stash clear
```

### Buscar y Filtrar

```bash
# Buscar texto en commits
git log --grep="navbar"

# Buscar texto en código
git grep "productService"

# Ver commits de un autor
git log --author="Mauricio"

# Ver commits en un rango de fechas
git log --since="2025-10-01" --until="2025-10-19"

# Ver commits que modificaron un archivo
git log -- src/app/app.component.ts
```

### Tagging (Versiones)

```bash
# Crear tag
git tag v1.0.0

# Crear tag anotado
git tag -a v1.0.0 -m "Versión 1.0.0 - Primera release"

# Ver tags
git tag

# Ver detalles de un tag
git show v1.0.0

# Subir tag a remoto
git push origin v1.0.0

# Subir todos los tags
git push --tags

# Eliminar tag local
git tag -d v1.0.0

# Eliminar tag remoto
git push origin --delete v1.0.0
```

### Limpieza

```bash
# Ver archivos no tracked
git clean -n

# Eliminar archivos no tracked
git clean -f

# Eliminar archivos y directorios no tracked
git clean -fd

# Incluir archivos en .gitignore
git clean -fdx
```

---

## 🔧 Resolución de Problemas

### 1. ⚠️ Warning: LF will be replaced by CRLF

**Síntoma:**
```
warning: in the working copy of 'tailwind.config.js', LF will be replaced by CRLF the next time Git touches it
```

**Causa:** Git detectó finales de línea LF pero tu sistema usa CRLF.

**Solución:**

**Opción 1:** Crear `.gitattributes` (RECOMENDADO)
```bash
# Crear archivo .gitattributes con la configuración recomendada
# (ver sección anterior)
```

**Opción 2:** Configurar Git
```bash
# Windows
git config core.autocrlf true

# Linux/Mac
git config core.autocrlf input
```

**Opción 3:** Normalizar archivos existentes
```bash
git add --renormalize .
git commit -m "chore: normalizar finales de línea"
```

---

### 2. ❌ Error: Your local changes would be overwritten

**Síntoma:**
```
error: Your local changes to the following files would be overwritten by merge:
    src/app/app.component.ts
Please commit your changes or stash them before you merge.
```

**Solución:**

**Opción 1:** Guardar cambios (commit)
```bash
git add .
git commit -m "wip: trabajo en progreso"
git pull
```

**Opción 2:** Guardar temporalmente (stash)
```bash
git stash
git pull
git stash pop
```

**Opción 3:** Descartar cambios locales
```bash
git reset --hard HEAD
git pull
```

---

### 3. ❌ Merge Conflict

**Síntoma:**
```
CONFLICT (content): Merge conflict in src/app/app.component.ts
Automatic merge failed; fix conflicts and then commit the result.
```

**Solución:**

1. **Abrir archivo con conflicto**
```typescript
<<<<<<< HEAD
// Tu código
const title = 'Mi App';
=======
// Código del remoto
const title = 'Nuestra App';
>>>>>>> origin/Frontend
```

2. **Resolver manualmente**
```typescript
// Elegir una versión o combinar
const title = 'Mi App'; // Versión final
```

3. **Marcar como resuelto**
```bash
git add src/app/app.component.ts
git commit -m "fix: resolver conflicto en app.component"
```

**Herramientas de VS Code:**
- "Accept Current Change"
- "Accept Incoming Change"
- "Accept Both Changes"
- "Compare Changes"

---

### 4. ❌ Rejected: non-fast-forward

**Síntoma:**
```
! [rejected]        Frontend -> Frontend (non-fast-forward)
error: failed to push some refs to 'github.com/user/repo.git'
```

**Causa:** El remoto tiene commits que no tienes localmente.

**Solución:**

**Opción 1:** Pull y merge
```bash
git pull origin Frontend
git push origin Frontend
```

**Opción 2:** Pull con rebase
```bash
git pull --rebase origin Frontend
git push origin Frontend
```

**Opción 3:** Force push (¡PELIGROSO!)
```bash
# Solo si estás seguro y trabajas solo
git push --force origin Frontend
```

---

### 5. ❌ Detached HEAD State

**Síntoma:**
```
You are in 'detached HEAD' state.
```

**Causa:** Hiciste checkout a un commit específico.

**Solución:**

**Si NO quieres guardar cambios:**
```bash
git checkout Frontend
```

**Si QUIERES guardar cambios:**
```bash
git checkout -b new-branch-name
git checkout Frontend
git merge new-branch-name
```

---

### 6. ❌ Commit Incorrecto (antes de push)

**Corregir mensaje del último commit:**
```bash
git commit --amend -m "feat: mensaje corregido"
```

**Agregar archivos al último commit:**
```bash
git add archivo-olvidado.ts
git commit --amend --no-edit
```

**Deshacer último commit:**
```bash
# Mantener cambios
git reset --soft HEAD~1

# Descartar cambios
git reset --hard HEAD~1
```

---

### 7. ❌ Commit Incorrecto (después de push)

**Revertir commit:**
```bash
# Crea un nuevo commit que deshace los cambios
git revert abc123
git push origin Frontend
```

**Reset y force push (¡PELIGROSO!):**
```bash
# Solo si trabajas solo y estás seguro
git reset --hard HEAD~1
git push --force origin Frontend
```

---

### 8. ❌ Archivo Grande Bloqueado

**Síntoma:**
```
remote: error: File archivo-grande.zip is 200 MB; this exceeds GitHub's file size limit of 100 MB
```

**Solución:**

**Eliminar archivo del último commit:**
```bash
git rm --cached archivo-grande.zip
git commit --amend --no-edit
git push origin Frontend
```

**Eliminar archivo del historial:**
```bash
# Usando filter-branch (lento)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch archivo-grande.zip" \
  --prune-empty --tag-name-filter cat -- --all

# O usando BFG Repo-Cleaner (más rápido)
bfg --delete-files archivo-grande.zip
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

### 9. ❌ Subí credenciales por error

**PASOS URGENTES:**

1. **Revocar las credenciales inmediatamente**
   - API keys
   - Contraseñas
   - Tokens

2. **Eliminar del historial**
```bash
# Eliminar archivo .env del historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push --force --all
```

3. **Agregar a .gitignore**
```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: agregar .env a gitignore"
```

---

### 10. ❌ Repositorio muy pesado

**Ver tamaño del repo:**
```bash
git count-objects -vH
```

**Limpiar objetos no referenciados:**
```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Ver archivos más grandes:**
```bash
git rev-list --objects --all |
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  sed -n 's/^blob //p' |
  sort --numeric-sort --key=2 |
  tail -10
```

---

## ✅ Buenas Prácticas

### 1. Commits

✅ **Hacer:**
- Commits pequeños y atómicos
- Un commit = un cambio lógico
- Mensajes descriptivos con Conventional Commits
- Commit frecuente (no esperar al final del día)

❌ **Evitar:**
- Commits gigantes con muchos cambios
- Mensajes vagos: "fix", "update", "wip"
- Mezclar múltiples funcionalidades en un commit
- Commits con código roto/que no compila

### 2. Branches

✅ **Hacer:**
- Crear branch por cada feature/bugfix
- Nombres descriptivos: `feature/catalogo-productos`
- Mantener branches cortas (días, no semanas)
- Eliminar branches después del merge
- Actualizar frecuentemente desde Frontend

❌ **Evitar:**
- Trabajar directo en Frontend/main
- Branches con nombres vagos: "test", "cambios"
- Branches de larga duración (más de 1-2 semanas)
- Acumular muchas branches sin usar

### 3. Pull Requests

✅ **Hacer:**
- Describir qué cambia y por qué
- Incluir screenshots si hay cambios visuales
- Referenciar issues: "Closes #123"
- Hacer self-review antes de pedir review
- Mantener PRs pequeños (menos de 400 líneas)

❌ **Evitar:**
- PRs gigantes (1000+ líneas)
- PRs sin descripción
- Mergear sin code review
- Dejar PRs abiertos mucho tiempo

### 4. General

✅ **Hacer:**
- Pull antes de empezar a trabajar
- Push al finalizar el día
- Usar .gitignore correctamente
- Usar .gitattributes para normalizar
- Revisar `git status` antes de commit
- Revisar `git diff` antes de commit

❌ **Evitar:**
- Subir `node_modules/`
- Subir archivos de build (`dist/`)
- Subir credenciales/secrets
- Subir archivos de configuración del IDE
- Force push en branches compartidas

---

## 📊 Git Aliases Útiles

Agrega estos shortcuts a tu configuración de Git:

```bash
# Ver configuración actual de aliases
git config --global --list | grep alias

# Alias para status corto
git config --global alias.st "status -s"

# Alias para log bonito
git config --global alias.lg "log --oneline --graph --all --decorate"

# Alias para ver branches
git config --global alias.br "branch -v"

# Alias para commit rápido
git config --global alias.cm "commit -m"

# Alias para checkout
git config --global alias.co "checkout"

# Alias para ver diferencias staged
git config --global alias.ds "diff --staged"

# Alias para deshacer último commit
git config --global alias.undo "reset --soft HEAD~1"

# Alias para ver últimos 10 commits
git config --global alias.last "log -10 --oneline --graph"

# Alias para ver contributors
git config --global alias.who "shortlog -sn"
```

**Uso:**
```bash
git st          # En lugar de git status -s
git lg          # En lugar de git log --oneline --graph --all
git cm "fix: ..." # En lugar de git commit -m "fix: ..."
git undo        # Deshacer último commit
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Herramientas
- [GitKraken](https://www.gitkraken.com/) - GUI para Git
- [SourceTree](https://www.sourcetreeapp.com/) - Cliente visual
- [Git Graph (VS Code)](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) - Extensión
- [GitLens (VS Code)](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - Extensión

### Cheat Sheets
- [Git Cheat Sheet (GitHub)](https://education.github.com/git-cheat-sheet-education.pdf)
- [Interactive Git Cheatsheet](https://ndpsoftware.com/git-cheatsheet.html)

---

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Setup Inicial
1. Clonar el repositorio
2. Configurar tu identidad
3. Crear archivo `.gitattributes`
4. Verificar que está configurado correctamente

### Ejercicio 2: Workflow Básico
1. Crear branch `feature/mi-primera-feature`
2. Hacer 3 commits con Conventional Commits
3. Hacer push de la branch
4. Crear Pull Request en GitHub

### Ejercicio 3: Manejo de Conflictos
1. Crear dos branches desde Frontend
2. Modificar el mismo archivo en ambas
3. Mergear una branch
4. Intentar mergear la segunda (causará conflicto)
5. Resolver el conflicto manualmente

### Ejercicio 4: Deshacer Cambios
1. Hacer un commit
2. Deshacerlo con `git reset --soft`
3. Hacer otro commit
4. Revertirlo con `git revert`
5. Ver la diferencia en el historial

---

**Autor:** GitHub Copilot  
**Proyecto:** Frontend E-commerce Hardware  
**Fecha:** Octubre 2025  
**Versión:** 1.0

---

¡Happy coding! 🚀🔧