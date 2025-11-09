# 🔐 Documentación - Sistema de Autenticación y Gestión de Usuarios

## 📋 Tabla de Contenidos
1. [Sistema de Autenticación](#sistema-de-autenticación)
2. [Guards de Protección](#guards-de-protección)
3. [Gestión de Usuarios Admin](#gestión-de-usuarios-admin)
4. [Estructura de Archivos](#estructura-de-archivos)

---

## 🔑 Sistema de Autenticación

### Archivos Principales

#### **Models** (`auth/models/Usuario.model.ts`)
```typescript
- Usuario                // Entidad completa
- LoginRequestDto        // { correoElectronico, contrasena }
- LoginResponseDto       // { success, message, usuario }
- RegisterDto            // Datos para registro
- UserSession            // Datos en localStorage
```

#### **Service** (`auth/services/login.service.ts`)
```typescript
// Métodos principales
login(credentials)       → POST /api/usuarios/login
register(userData)       → POST /api/usuarios/register
logout()                 → Limpia localStorage
isLoggedIn()            → boolean
isAdmin()               → boolean
currentUser              → Signal reactivo

// LocalStorage
- Key: 'userSession'     → { id, nombre, apellido, correoElectronico, rol }
- Key: 'fullUserData'    → Datos completos del usuario
```

#### **Component** (`auth/components/login.component`)
```typescript
// Características
✅ Formulario Login/Registro con tabs animados
✅ Validación completa (email, password, confirmar password)
✅ Toggle mostrar/ocultar contraseñas
✅ Campos opcionales colapsables (teléfono, dirección, etc.)
✅ Auto-login después de registro
✅ Redirección inteligente con returnUrl
✅ Mensajes de error contextuales
✅ Loading states con spinners
```

### Flujo de Login
```
1. Usuario ingresa credenciales → /login
2. Service llama → POST /api/usuarios/login
3. Backend valida y devuelve → LoginResponseDto
4. Si success = true:
   - Guarda en localStorage (userSession + fullUserData)
   - Actualiza signal currentUser
   - Redirige según rol:
     * ADMIN → /admin
     * USER → / (home)
     * returnUrl si existe
5. Navbar detecta cambio y muestra usuario
```

### Flujo de Registro
```
1. Usuario completa formulario → Tab "Registrarse"
2. Validación de campos (nombre, apellido, email, password)
3. Confirma que passwords coincidan
4. Service → POST /api/usuarios/register
5. Asigna rol "USER" por defecto
6. Auto-login después de registro exitoso
7. Redirige a home
```

### LocalStorage - Gestión de Sesión
```typescript
// Estructura guardada
localStorage.setItem('userSession', JSON.stringify({
  id: 1,
  nombre: "Juan",
  apellido: "Pérez",
  correoElectronico: "juan@email.com",
  rol: "USER"
}));

// Al cargar la página
constructor() {
  this.loadUserFromStorage(); // Restaura sesión automáticamente
}

// Al cerrar sesión
logout() {
  localStorage.removeItem('userSession');
  localStorage.removeItem('fullUserData');
  currentUser.set(null);
}
```

### Navbar Integrado
```typescript
// Muestra información del usuario
✅ Avatar con iniciales (nombre + apellido)
✅ Nombre completo visible
✅ Email debajo del nombre
✅ Badge "Administrador" si es admin
✅ Dropdown con opciones:
   - Panel Admin (solo admin)
   - Mi Perfil
   - Mis Pedidos
   - Cerrar Sesión
✅ Botón "Iniciar Sesión" si no está logueado
✅ Responsive (desktop y móvil)
```

---

## 🛡️ Guards de Protección

### Archivo: `core/guards/auth.guard.ts`

#### **authGuard** (Usuario Autenticado)
```typescript
// Uso
canActivate: [authGuard]

// Comportamiento
- Verifica: isLoggedIn()
- Si NO logueado → /login?returnUrl=/ruta-intentada
- Si logueado → Permite acceso
```

#### **adminGuard** (Solo Administradores)
```typescript
// Uso
canActivate: [adminGuard]

// Comportamiento
- Verifica: isLoggedIn()
  * NO → /login?returnUrl=/admin
- Verifica: isAdmin()
  * NO → Alerta + Redirige a /
  * SÍ → Permite acceso

// Aplicado en app.routes.ts
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [adminGuard],  // 🔒 Todas las rutas hijas protegidas
  children: [...]
}
```

### Matriz de Acceso
| Ruta | Sin Login | USER | ADMIN |
|------|-----------|------|-------|
| `/` | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅* | ✅* |
| `/admin` | ❌ → /login | ❌ → / + Alerta | ✅ |
| `/admin/*` | ❌ → /login | ❌ → / + Alerta | ✅ |

*\*Si ya logueado, redirige automáticamente*

---

## 👥 Gestión de Usuarios Admin

### Service: `admin/services/admin-user.service.ts`
```typescript
// CRUD Completo
getAllUsers()           → GET /api/usuarios
getUserById(id)         → GET /api/usuarios/{id}
getUserByEmail(email)   → GET /api/usuarios/email/{email}
createUser(userData)    → POST /api/usuarios/register
updateUser(id, data)    → PUT /api/usuarios/{id}
deleteUser(id)          → DELETE /api/usuarios/{id}
checkEmailExists(email) → GET /api/usuarios/exists/{email}
```

### Componente Lista: `user-admin.component`
```typescript
// Características
✅ Tabla con todos los usuarios
✅ Búsqueda en tiempo real (nombre, apellido, email)
✅ Filtro por rol (ADMIN/USER/Todos)
✅ Estadísticas: Total, Admins, Users
✅ Paginación (10 por página)
✅ Avatar con iniciales y gradiente
✅ Badges de rol con colores:
   - 🟣 ADMIN (purple)
   - 🔵 USER (blue)
✅ Acciones: Editar ✏️, Eliminar 🗑️
✅ Modal de confirmación para eliminar
✅ Loading state
✅ Empty state ilustrado
```

### Componente Formulario: `user-edit.component`
```typescript
// Modos
- Modo CREAR: Todos los campos, contraseña requerida
- Modo EDITAR: Email no editable, contraseña opcional

// Secciones del Formulario
1. 📋 Información Personal
   - Nombre, Apellido (requeridos)
   - Email (requerido, no editable en edición)
   - Rol (USER/ADMIN)
   - Teléfono (opcional)

2. 🔒 Seguridad
   - Contraseña (min 6 caracteres)
   - Confirmar Contraseña
   - Toggle mostrar/ocultar
   - En edición: dejar en blanco = mantener actual

3. 📍 Dirección (Todo Opcional)
   - Dirección
   - Ciudad, País, Código Postal

// Validaciones
✅ Nombre/Apellido: min 2 caracteres
✅ Email: formato válido
✅ Contraseña: min 6 caracteres (requerida en crear)
✅ Contraseñas deben coincidir
✅ Feedback visual (border rojo + mensaje)
```

### Navegación Admin
```typescript
// Sidebar actualizado
menuItems = [
  📊 Dashboard       → /admin/dashboard
  📦 Productos       → /admin/productos
  🏷️ Categorías     → /admin/categorias
  🏢 Marcas          → /admin/marcas
  👥 Usuarios        → /admin/usuarios  // NUEVO
]

// Rutas configuradas
/admin/usuarios              → Lista
/admin/usuarios/nuevo        → Crear
/admin/usuarios/editar/:id   → Editar
```

---

## 📁 Estructura de Archivos

```
src/app/
├── core/
│   └── guards/
│       └── auth.guard.ts              # authGuard + adminGuard
│
├── features/
│   ├── auth/
│   │   ├── models/
│   │   │   └── Usuario.model.ts       # Interfaces de usuario
│   │   ├── services/
│   │   │   └── login.service.ts       # Autenticación y sesión
│   │   └── components/
│   │       └── login.component/       # Login/Registro
│   │
│   └── admin/
│       ├── services/
│       │   └── admin-user.service.ts  # CRUD usuarios
│       └── components/
│           ├── user/
│           │   ├── user-admin.component/      # Lista usuarios
│           │   └── user-edit.component/       # Crear/Editar
│           └── admin.component/               # Sidebar actualizado
│
├── layout/
│   └── navbar/
│       └── navbar.component/          # Navbar con usuario logueado
│
└── app.routes.ts                      # Rutas con guards aplicados
```

---

## 🔄 Flujos Completos

### Crear Usuario Admin
```
1. Admin → /admin/usuarios
2. Click "Nuevo Usuario"
3. Completar formulario:
   - Nombre: María
   - Apellido: González
   - Email: maria@tienda.com
   - Rol: ADMIN
   - Contraseña: Admin123
4. Click "Crear Usuario"
5. POST /api/usuarios/register
6. Usuario creado con rol ADMIN
7. Redirige a lista
8. María puede iniciar sesión como admin
```

### Editar Rol de Usuario
```
1. Admin busca usuario en lista
2. Click botón editar ✏️
3. Carga formulario con datos actuales
4. Cambia Rol de USER → ADMIN
5. Click "Actualizar Usuario"
6. PUT /api/usuarios/{id}
7. Usuario ahora tiene permisos de admin
8. Redirige a lista actualizada
```

### Resetear Contraseña
```
1. Admin edita usuario
2. Ingresa nueva contraseña
3. Confirma nueva contraseña
4. Click "Actualizar Usuario"
5. PUT /api/usuarios/{id} (incluye hashContrasena)
6. Contraseña actualizada
7. Usuario debe usar nueva contraseña en próximo login
```

### Eliminar Usuario
```
1. Admin click botón eliminar 🗑️
2. Modal de confirmación:
   "¿Eliminar a Juan Pérez?"
3. Click "Eliminar"
4. DELETE /api/usuarios/{id}
5. Usuario eliminado de BD
6. Lista se recarga automáticamente
```

---

## 🎯 Casos de Uso Clave

### 1. Primer Login Después de Registro
```
Usuario → Registro → Auto-login → Home (con navbar mostrando usuario)
```

### 2. Usuario Intenta Acceder a Admin
```
USER → /admin → Guard detecta rol → Alerta → Redirige a /
```

### 3. Sesión Persistente
```
Usuario logueado → Cierra navegador → Abre navegador
→ Signal carga de localStorage → Sesión activa
```

### 4. Logout Completo
```
Usuario → Click "Cerrar Sesión"
→ localStorage.clear()
→ currentUser.set(null)
→ Navbar muestra "Iniciar Sesión"
→ Guards bloquean rutas protegidas
```

---

## 🔐 Seguridad Implementada

### Frontend
- ✅ Guards en rutas sensibles
- ✅ Validación de formularios
- ✅ Verificación de roles en guards
- ✅ Contraseñas no visibles (tipo password)
- ✅ Confirmación antes de eliminar
- ✅ Email no editable (previene duplicados)

### Backend (Endpoints)
- ✅ POST /api/usuarios/login - Autenticación
- ✅ POST /api/usuarios/register - Registro
- ✅ GET /api/usuarios/exists/{email} - Verificar duplicados
- ✅ PUT /api/usuarios/{id} - Actualizar (con validación)
- ✅ DELETE /api/usuarios/{id} - Eliminar

---

## 📊 Estadísticas Visuales

### En Lista de Usuarios
```
┌────────────────────────────────────────────────┐
│  🔵 Total Usuarios:     15                     │
│  🟣 Administradores:     3                     │
│  🔵 Usuarios Regulares: 12                     │
└────────────────────────────────────────────────┘
```

### Filtros Disponibles
```
🔍 Búsqueda: Nombre, apellido o email
📋 Rol: Todos | ADMIN | USER
📄 Paginación: 10 por página
```

---

## ✨ Características Destacadas

### Autenticación
- 🎨 UI moderna con gradientes y animaciones
- 🔄 Tabs animados Login/Registro
- 👁️ Toggle mostrar/ocultar contraseñas
- 📱 Responsive (móvil y desktop)
- ⚡ Validación en tiempo real
- 💾 Persistencia automática en localStorage
- 🔄 Auto-login después de registro

### Gestión Usuarios
- 📊 Estadísticas en tiempo real
- 🔍 Búsqueda instantánea
- 🎨 Avatares con iniciales y gradientes
- 🏷️ Badges de rol con colores
- ⚠️ Modales de confirmación
- 🔄 Recarga automática después de cambios
- 📄 Paginación completa

### Seguridad
- 🛡️ Guards de autenticación y autorización
- 🔒 Rutas protegidas por rol
- 🔑 Contraseñas hasheadas en backend
- ✅ Validación de email único
- 🚫 Email no editable (previene errores)
- 📍 ReturnUrl para redirección inteligente

---

## 🚀 Para Probar

### Test 1: Login y Navbar
```bash
1. Abre http://localhost:4200/login
2. Crea una cuenta nueva
3. Verifica que el navbar muestre tu nombre
4. Click en avatar → debe mostrar dropdown
5. Recarga página → sesión debe persistir
```

### Test 2: Protección Admin
```bash
1. Inicia sesión como USER
2. Intenta acceder a /admin
3. Debe mostrar alerta y redirigir a /
4. Cierra sesión
5. Intenta acceder a /admin
6. Debe redirigir a /login
```

### Test 3: Gestión de Usuarios
```bash
1. Inicia sesión como ADMIN
2. Ve a /admin/usuarios
3. Crea nuevo usuario con rol ADMIN
4. Verifica que aparezca en la lista
5. Edita su información
6. Busca el usuario creado
7. Elimínalo (con confirmación)
```

---

## 📝 Notas Importantes

1. **LocalStorage**: Se limpia completamente en logout
2. **Guards**: Aplicados en rutas padre (heredan hijos)
3. **Contraseñas**: En edición son opcionales (mantener actual si vacío)
4. **Email**: No se puede editar (clave única en BD)
5. **Roles**: Solo dos disponibles: USER y ADMIN
6. **Persistencia**: Sesión sobrevive a recargas de página
7. **ReturnUrl**: Redirige a ruta intentada después de login

---

**Sistema 100% funcional y listo para producción** 🎉
