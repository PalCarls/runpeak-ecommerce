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

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm test
```

### Backend

```bash
cd backend
npm install
npm run dev
npm run build
npm test
```

### Health check

Con el backend ejecutándose, validar:

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:

```json
{"status":"OK"}
```
