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

## Inicio rápido local

Requisitos: Docker, Docker Compose, Node.js y npm.

Todos los comandos siguientes se ejecutan desde la raíz del repositorio.

### 1. Preparar el entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm --prefix backend install
npm --prefix frontend install
```

### 2. Iniciar PostgreSQL

```bash
docker compose up -d
docker compose ps
```

> `compose.yaml` es el archivo de configuración; no se escribe como subcomando.
> En este proyecto no necesitas `build`: Compose solo inicia PostgreSQL desde
> una imagen ya publicada.

### 3. Crear las tablas y datos iniciales

```bash
npm --prefix backend run db:setup
```

### 4. Iniciar la aplicación

Terminal 1 (backend):

```bash
npm --prefix backend run dev
```

Terminal 2 (frontend):

```bash
npm --prefix frontend run dev
```

Abre `http://localhost:5173`. La API queda en `http://localhost:3000/api`.

Para detener PostgreSQL:

```bash
docker compose down
```

Los datos se conservan en un volumen de Docker. Para eliminarlos también, usa
`docker compose down -v`.

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

## Despliegue simple: Supabase + Vercel

El despliegue usa tres recursos: una base de datos en Supabase y dos proyectos
en Vercel (backend y frontend). Ambos proyectos de Vercel apuntan al mismo
repositorio.

### 1. Crear la base de datos

1. Crea un proyecto en Supabase.
2. En **Connect**, copia la URL **Transaction pooler** (puerto `6543`).
3. Guárdala temporalmente: se usará como `DATABASE_URL`.

### 2. Desplegar el backend

1. En Vercel, importa este repositorio.
2. En **Root Directory**, selecciona `backend`.
3. Agrega estas variables de entorno:

```text
DATABASE_URL=<URL Transaction pooler de Supabase>
DATABASE_SSL=true
DATABASE_POOL_MAX=3
FRONTEND_URL=https://<dominio-del-frontend-en-vercel>
AUTH_SECRET=<secreto-aleatorio-largo>
ADMIN_EMAIL=<correo-administrador>
ADMIN_PASSWORD=<contraseña-segura-inicial>
```

4. Pulsa **Deploy** y copia el dominio generado para el backend.

El dominio del frontend todavía no existirá en el primer despliegue. Puedes
completar `FRONTEND_URL` después del paso 3 y volver a desplegar el backend.

### 3. Desplegar el frontend

1. En Vercel, importa nuevamente el mismo repositorio como otro proyecto.
2. En **Root Directory**, selecciona `frontend`.
3. Agrega esta variable de entorno:

```text
VITE_API_URL=https://<dominio-del-backend>/api
```

4. Pulsa **Deploy** y copia el dominio generado para el frontend.
5. Regresa al proyecto del backend, asigna ese dominio a `FRONTEND_URL` y vuelve
   a desplegarlo.

### 4. Crear tablas y usuario administrador

Desde una terminal local, ejecuta una sola vez:

```bash
cd backend
DATABASE_URL='<URL Transaction pooler de Supabase>' \
DATABASE_SSL=true \
ADMIN_EMAIL='<correo-administrador>' \
ADMIN_PASSWORD='<contraseña-segura>' \
npm run db:setup
cd ..
```

### 5. Comprobar el despliegue

```bash
curl https://<dominio-del-backend>/api/health
curl https://<dominio-del-backend>/api/health/db
```

Ambas respuestas deben indicar `OK`. Después abre el dominio del frontend y
prueba el catálogo y el inicio de sesión.

Para permitir varios dominios en CORS, sepáralos con comas en `FRONTEND_URL`.
El archivo `frontend/vercel.json` permite abrir directamente rutas SPA como
`/catalogo`, `/carrito` o `/admin` sin recibir un error 404.

No copiar los archivos `.env` locales a Vercel ni guardar secretos en Git.
