# RunPeak eCommerce

RunPeak es un prototipo académico de tienda virtual para el curso de Ingeniería
de Software. Permite practicar planificación, desarrollo con agentes, pruebas,
colaboración y despliegue continuo.

## Funciones actuales

- Catálogo y detalle de productos.
- Registro e inicio de sesión.
- Favoritos y carrito de compra.
- Compra y consulta de pedidos.
- Administración de productos, inventario y pedidos.

El pago es simulado: no procesa dinero ni utiliza tarjetas reales.

## Arquitectura

```text
Usuario → Interfaz en Vercel → Servidor en Vercel → Base de datos en Supabase
```

- **Interfaz:** pantallas de la tienda, desarrolladas con React.
- **Servidor:** reglas del negocio y seguridad, desarrollado con Express.
- **Base de datos:** productos, usuarios y pedidos almacenados en PostgreSQL.
- **GitHub:** código, tareas, revisiones y automatizaciones.
- **Vercel:** publicación y versiones temporales para probar cambios.
- **Supabase:** base de datos de la versión publicada.

## Enlaces útiles

| Recurso | Enlace | Utilidad |
| --- | --- | --- |
| Aplicación | [runpeak-ecommerce.vercel.app](https://runpeak-ecommerce.vercel.app) | Probar la tienda publicada. |
| Repositorio | [github.com/PalCarls/runpeak-ecommerce](https://github.com/PalCarls/runpeak-ecommerce) | Consultar tareas, código y solicitudes de cambios. |
| Estado del servidor | [Ver estado](https://runpeak-ecommerce-backend-palcarls-projects.vercel.app/api/health) | Confirmar que el servidor responde. |
| Estado de la base de datos | [Ver conexión](https://runpeak-ecommerce-backend-palcarls-projects.vercel.app/api/health/db) | Confirmar la conexión con Supabase. |
| Productos | [Ver productos](https://runpeak-ecommerce-backend-palcarls-projects.vercel.app/api/products) | Confirmar que se pueden consultar datos. |

La aplicación y el repositorio son públicos. Actualmente los enlaces del
servidor solicitan iniciar sesión en Vercel porque el despliegue está protegido.
Para usarlos como comprobaciones públicas se debe desactivar esa protección en
Vercel o configurar un dominio público para el servidor.

## Trabajo con agentes

No es necesario que todos los integrantes programen. El equipo define la
necesidad y valida el resultado; el agente puede analizar, implementar, probar y
documentar el cambio.

Cada funcionalidad debe indicar:

```text
Como: tipo de usuario
Quiero: funcionalidad
Para: beneficio esperado

Debe cumplirse:
1. Resultado observable.
2. Comportamiento ante un caso incorrecto.
3. Condición que permita aprobar la tarea.
```

Ejemplo de solicitud al agente:

```text
Implementa esta funcionalidad en una rama nueva.
Revisa primero el funcionamiento actual, agrega pruebas y comprueba el flujo.
No publiques cambios sin autorización.
Al terminar, explica qué cambiaste y cómo probarlo.
```

## Flujo de trabajo

1. Registrar la funcionalidad en una tarea de GitHub.
2. Crear una rama para ese cambio.
3. Pedir al agente que implemente y pruebe la solución.
4. Crear una solicitud de cambios (*Pull Request*).
5. Probar el enlace temporal generado por Vercel.
6. Aprobar y unir el cambio si cumple lo solicitado.
7. Presentar el avance y registrar lo aprendido en la iteración.

Una persona diferente debe probar el resultado antes de aprobarlo.

## Cómo probar una funcionalidad

Desde el enlace temporal de Vercel, comprobar:

- Que se cumplan los criterios de la tarea.
- Que los mensajes sean claros.
- Que los casos incorrectos no rompan la aplicación.
- Que sigan funcionando el catálogo, el carrito y el inicio de sesión.
- Que la pantalla se vea correctamente en computadora y teléfono.

Si existe un error, registrar los pasos realizados, el resultado obtenido y el
resultado esperado. Adjuntar una captura cuando sea útil.

## Avance sugerido del prototipo

1. **Experiencia básica:** corregir errores y simplificar registro, compra y
   consulta de pedidos.
2. **Facilitar la compra:** incorporar búsqueda, filtros y mejor información de
   tallas y disponibilidad.
3. **Mejorar la administración:** facilitar la gestión de inventario y pedidos.
4. **Validar con usuarios:** medir resultados, mejorar accesibilidad y revisar
   seguridad antes de considerar pagos reales.

Conviene entregar una mejora pequeña y demostrable en cada iteración.

## Infraestructura

La versión publicada utiliza tres recursos:

1. Una base PostgreSQL en Supabase.
2. Un proyecto de Vercel con **Directorio raíz** (*Root Directory*) `backend`.
3. Otro proyecto de Vercel con **Directorio raíz** (*Root Directory*) `frontend`.

Variables principales del backend:

```text
DATABASE_URL=<conexión de Supabase>
DATABASE_SSL=true
FRONTEND_URL=https://<frontend>
AUTH_SECRET=<cadena aleatoria larga>
ADMIN_EMAIL=<correo administrador>
ADMIN_PASSWORD=<contraseña segura>
```

Generar `AUTH_SECRET` con:

```bash
openssl rand -base64 48
```

Variable del frontend:

```text
VITE_API_URL=https://<backend>/api
```

Las claves se guardan en Vercel. Nunca deben publicarse en GitHub.

## Comandos principales

Se requiere Docker, Node.js y npm. Todos los comandos se ejecutan desde la
carpeta principal del proyecto.

### Crear una rama para una funcionalidad

```bash
git switch dev
git pull origin dev
git switch -c feature/nombre-funcionalidad
```

Al terminar y después de comprobar el cambio:

```bash
git status
git add <archivos-modificados>
git commit -m "feat: descripción breve"
git push -u origin feature/nombre-funcionalidad
```

Luego se crea en GitHub una solicitud de cambios hacia `dev`.

### Preparar el proyecto por primera vez

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm --prefix backend install
npm --prefix frontend install
docker compose up -d
npm --prefix backend run db:setup
```

### Iniciar el proyecto

En una terminal, iniciar el servidor:

```bash
npm --prefix backend run dev
```

En otra terminal, iniciar la interfaz:

```bash
npm --prefix frontend run dev
```

Abrir `http://localhost:5173` en el navegador.

### Comprobar antes de entregar un cambio

```bash
npm --prefix backend test
npm --prefix backend run build
npm --prefix frontend run lint
npm --prefix frontend run build
```

Los comandos deben terminar sin errores. Actualmente el análisis del frontend
muestra una advertencia en `AppContext.tsx`, pero no impide la compilación.

El frontend todavía no tiene pruebas automáticas. Por eso no se incluye
`npm --prefix frontend test`: ese comando devuelve `No test files found` hasta
que se creen las primeras pruebas.

### Cambios en la base de datos

Todo cambio de tablas debe guardarse como una migración en
`backend/src/migrations/`. No se deben modificar las tablas de producción sin
dejar ese registro en el repositorio.

```bash
npm --prefix backend run db:migrate
```

Para cargar los datos iniciales:

```bash
npm --prefix backend run db:seed
```

Las migraciones de producción todavía son manuales. Deben ejecutarse con la
conexión de Supabase configurada y verificarse después desde el panel de
Supabase y el enlace relacionado del servidor.

### Detener el proyecto

Detener los procesos de las dos terminales con `Ctrl + C` y luego ejecutar:

```bash
docker compose down
```

## Reglas básicas

- No compartir contraseñas, claves de acceso ni datos personales con agentes.
- No usar tarjetas o información real durante las pruebas.
- No aprobar cambios sin probarlos.
- No publicar directamente sin una solicitud de cambios (*Pull Request*).

Antes de convertir el prototipo en un producto real se requiere una revisión
adicional de seguridad, privacidad y operación.
