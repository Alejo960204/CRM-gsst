# CRM GSST - Backend

Este es el backend de **CRM GSST**, un módulo de intermediación y control de servicios de riesgos laborales (Seguridad y Salud en el Trabajo). Está construido utilizando **FastAPI**, **Pydantic v2**, y **PostgreSQL** mediante el driver `psycopg2` directo (sin ORM), asegurando consultas de alto rendimiento y control total del modelo relacional.

---

## 📌 Requisitos Previos

1. **Python 3.11+** instalado.
2. **PostgreSQL** instalado y ejecutándose en el puerto `5432`.
   - Credenciales recomendadas por defecto:
     - **Host:** `localhost`
     - **Usuario:** `postgres`
     - **Contraseña:** `postgres`
     - **Puerto:** `5432`

---

## 🚀 Instrucciones de Instalación (Windows PowerShell)

Sigue estos pasos dentro de la carpeta del proyecto para instalar las dependencias y levantar el servicio:

### 1. Clonar o abrir el directorio del proyecto
```powershell
# Ubícate en la carpeta donde tengas el proyecto crm-gsst-backend
# (reemplaza la ruta por la tuya, esta es solo un ejemplo)
cd C:\ruta\a\tu\proyecto\crm-gsst-backend
```

### 2. Crear e iniciar un entorno virtual (Opcional, pero recomendado)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Instalar las dependencias
```powershell
pip install -r requirements.txt
```

### 4. Configurar variables de entorno (`.env`)
El proyecto incluye un archivo `.env` ya configurado para desarrollo local. Si requieres ajustarlo, puedes basarte en `.env.example`:
```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crm_gsst
JWT_SECRET=fb3a8e97fdf131bb48092dbba164c017d23a74312384a86fbdc99b828a2a0de3
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
PORT=8000
HOST=127.0.0.1
ENTORNO=desarrollo
```

> ⚠️ El `JWT_SECRET` de ejemplo de arriba queda expuesto en este README. Rótalo antes de cualquier despliegue real (pendiente en la revisión de seguridad del punto 8 del backlog).

### 5. Configurar la Base de Datos
Si la base de datos `crm_gsst` no existe, créala en tu servidor PostgreSQL:
```powershell
# En PowerShell (usando la ruta por defecto del cliente de PostgreSQL)
$env:PGPASSWORD='postgres'
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE crm_gsst;"
```

Aplica el esquema SQL de creación de tablas e índices:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d crm_gsst -f db/schema.sql
```

**Si ya tenías la base de datos creada de antes** (con el rol `super_usuario` o sin la tabla `logs_sistema`), aplica además las migraciones en orden:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d crm_gsst -f db/migrations/001_rename_super_usuario_a_root_admin.sql
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d crm_gsst -f db/migrations/002_crear_logs_sistema.sql
```

### 6. Ejecutar el script semilla (Seed)
Registra los 3 usuarios de prueba con contraseñas hasheadas en la base de datos:
```powershell
python scripts/seed_usuarios.py
```

### 7. Levantar el Servidor
Inicia el servidor de desarrollo FastAPI usando `uvicorn`:
```powershell
# Levantar el servidor en http://127.0.0.1:8000
python -m uvicorn app.main:app --reload --port 8000
```
La documentación interactiva de la API estará disponible en [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## 👥 Usuarios de Prueba

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@crmgsst.com` | `Admin1234` |
| **Root Admin** | `root@crmgsst.com` | `Root1234` |
| **Cliente** | `cliente@empresademo.com` | `Cliente1234` |

---

## 📡 Tabla de Endpoints

Todos los endpoints tienen como prefijo `/api/v1`.

| Método | Ruta | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Público | Login de usuario. Retorna el JWT token y rol. |
| **POST** | `/auth/registro` | Público | Registro de Cliente (requiere aceptación de política). |
| **POST** | `/usuarios` | Admin, Root Admin | Crea un nuevo usuario en el sistema. |
| **GET** | `/usuarios` | Admin, Root Admin | Lista todos los usuarios. |
| **PATCH** | `/usuarios/{id}` | Admin, Root Admin | Modifica datos del usuario de forma parcial. |
| **DELETE** | `/usuarios/{id}` | Admin, Root Admin | Borrado lógico del usuario (cambio a inactivo). |
| **POST** | `/empresas` | Admin, Root Admin | Registra una nueva empresa. |
| **GET** | `/empresas` | Admin, Root Admin | Lista todas las empresas del sistema. |
| **GET** | `/empresas/{id}` | Admin, Root Admin | Detalle de una empresa específica. |
| **POST** | `/servicios` | Admin, Root Admin | Crea un servicio en el catálogo general. |
| **GET** | `/servicios` | Cualquier Autenticado | Consulta el catálogo completo de servicios. |
| **POST** | `/servicios/contratados` | Admin, Root Admin | Registra la contratación de un servicio. |
| **PATCH** | `/servicios/contratados/{id}` | Admin, Root Admin | Cambia el estado del servicio contratado. |
| **GET** | `/servicios/contratados` | Cualquier Autenticado | Lista los servicios contratados (Cliente: filtra por su empresa). |
| **POST** | `/normas` | Admin, Root Admin | Registra una nueva norma laboral (Versión 1). |
| **GET** | `/normas` | Cualquier Autenticado | Lista las normas vigentes con filtros opcionales. |
| **GET** | `/normas/{id}` | Cualquier Autenticado | Detalle de la versión vigente de la norma. |
| **PUT** | `/normas/{id}` | Admin, Root Admin | Edita la norma (incrementa versión y guarda histórico). |
| **GET** | `/normas/{id}/historial` | Cualquier Autenticado | Lista cronológica descendente de versiones de la norma. |
| **GET** | `/dashboard` | Cualquier Autenticado | Resumen estadístico (Cliente: limitado a su empresa). |
| **GET** | `/sistema/config` | Root Admin | Configuración técnica no sensible (puerto, entorno, CORS, expiración de token). |
| **GET** | `/sistema/logs` | Root Admin | Logs técnicos paginados de requests/responses (con filtros). |

---

## 🛠️ Ejecutar Pruebas Automatizadas

El proyecto cuenta con un script de verificación que cubre todos los flujos de negocio y reglas RBAC:
```powershell
python scripts/test_api.py
```
