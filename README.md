# RunPeak eCommerce

RunPeak eCommerce es un proyecto base para demostrar prácticas de Scrum, DevOps y DevSecOps en un entorno académico.

## Stack tecnológico

- **Frontend:** React + Vite + TypeScript
- **Backend:** Express + TypeScript
- **ORM:** TypeORM
- **Base de datos:** PostgreSQL
- **Testing:** Vitest
- **CI/CD:** GitHub Actions
- **Seguridad:** CodeQL y Dependabot

## Estructura del repositorio

```text
runpeak-ecommerce/
├── frontend/
├── backend/
├── docs/
├── .github/
│   ├── workflows/
│   ├── dependabot.yml
│   └── pull_request_template.md
├── .gitignore
├── .editorconfig
└── README.md
```

## Flujo Scrum + DevOps + DevSecOps

1. Planificación del trabajo en issues y sprint backlog.
2. Desarrollo en ramas con Pull Requests.
3. Ejecución automática de CI (instalación, build y pruebas).
4. Revisión de código y validaciones de seguridad (CodeQL, Dependabot).
5. Merge a `main` con trazabilidad del cambio.

## Ejecución local

### 1. Base de datos

La base de datos local corre en Docker y conserva sus datos en un volumen:

```bash
docker compose up -d postgres
docker compose ps
```

PostgreSQL queda disponible en `localhost:5432` con la base de datos y usuario
`runpeak`. Las credenciales son exclusivamente locales.

### 2. Variables de entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Instalar dependencias

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Backend

```bash
cd backend
npm run db:setup
npm run dev
```

El backend queda disponible en `http://localhost:3000`.

### 5. Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

### Health check

Con el backend ejecutándose, validar:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/db
```

Respuesta esperada:

```json
{"status":"OK"}
```

## API del MVP

La API está disponible bajo `/api` e incluye:

- `GET /products` y `GET /products/:slug`: catálogo, variantes y stock.
- `GET /coupons` y `POST /coupons/validate`: promociones vigentes.
- `POST /auth/register`, `POST /auth/login` y `GET /auth/me`: cuentas y sesión.
- `GET|POST|DELETE /favorites`: favoritos de clientes autenticados.
- `POST /orders`: checkout como invitado o usuario, validación de precios, cupón
  y stock dentro de una transacción.
- `GET /orders/:number?email=...`: seguimiento para compras como invitado.
- `/admin/products`, `/admin/orders` y `/admin/dashboard`: gestión protegida por
  rol de administrador.

El esquema está en `backend/src/migrations/001_initial.sql`. Para recrear o
actualizar los datos iniciales locales:

```bash
cd backend
npm run db:migrate
npm run db:seed
```

El usuario administrativo local inicial es `admin@runpeak.local` con contraseña
`Admin123!`. Estas credenciales son solo para desarrollo; en producción se deben
configurar `ADMIN_EMAIL`, `ADMIN_PASSWORD` y un `AUTH_SECRET` largo antes de
ejecutar el seed.

### Alcance del pago

El checkout del MVP registra el pago como aprobado para permitir probar el flujo
completo, pero no procesa ni almacena números de tarjeta. Para aceptar dinero
real se debe integrar una pasarela como Mercado Pago, Culqi o Stripe y confirmar
el pago mediante webhooks antes de marcar el pedido como pagado.

## Configuración de producción

Para el MVP se recomienda crear dos proyectos de Vercel conectados al mismo
repositorio y una base PostgreSQL en Supabase.

### 1. Backend en Vercel

1. Importar el repositorio en Vercel.
2. Configurar **Root Directory** como `backend`.
3. Vercel detectará Express automáticamente.
4. Agregar estas variables para Production y Preview:

```text
DATABASE_URL=<Transaction pooler de Supabase, puerto 6543>
DATABASE_SSL=true
DATABASE_POOL_MAX=3
FRONTEND_URL=https://<dominio-del-frontend>
AUTH_SECRET=<secreto-aleatorio-largo>
ADMIN_EMAIL=<correo-administrador>
ADMIN_PASSWORD=<contraseña-segura-inicial>
```

Para varias URLs permitidas en CORS, separar `FRONTEND_URL` con comas.

### 2. Frontend en Vercel

1. Importar nuevamente el mismo repositorio como otro proyecto.
2. Configurar **Root Directory** como `frontend`.
3. Agregar la variable antes de desplegar:

```text
VITE_API_URL=https://<dominio-del-backend>/api
```

El archivo `frontend/vercel.json` permite abrir directamente rutas SPA como
`/catalogo`, `/carrito` o `/admin` sin recibir un error 404.

### 3. Supabase

1. Crear un proyecto de Supabase.
2. Abrir **Connect** y copiar la conexión **Transaction pooler** (puerto 6543),
   recomendada para funciones serverless.
3. Guardar esa URL únicamente como `DATABASE_URL` en Vercel.
4. Crear o ejecutar las migraciones de las tablas cuando se agregue el modelo
   de datos del MVP.

No copiar los archivos `.env` locales a Vercel ni guardar secretos en Git.
