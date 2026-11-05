# NutriPlan — Administración

Panel de administración (MVC) que alimenta al **Core** de NutriPlan: una
app de dietas personalizadas que genera un plan semanal según el
objetivo del cliente (bajar de peso / ganar masa / mantenimiento), sus
condiciones médicas (hipertensión, gota) y sus alergias, comparando los
alimentos disponibles contra tablas nutricionales.

Este repositorio **no es el Core** (eso ya fue aprobado y entregado
aparte como documento de análisis). Es la **Administración**: el CRUD de
los 6 catálogos que el Core necesita para poder generar las dietas.

## Catálogos administrados

| Catálogo | Qué alimenta en el Core |
|---|---|
| **Usuarios** | Clientes, nutricionistas y administradores. Cada cliente recibe un plan semanal. |
| **Categorías de alimentos** | Jerarquía padre → subcategoría (ej. Proteínas → Carnes rojas). |
| **Alimentos** | Macros (calorías, proteína, carbs, grasa), sodio, purinas y alergias que contiene. |
| **Objetivos** | Factor de ajuste calórico y proteína por kg según el objetivo del cliente. |
| **Condiciones médicas** | Tope diario de sodio (hipertensión) o purinas (gota). |
| **Alergias** | Excluyen automáticamente los alimentos vinculados. |

## Requisitos de la administración (consigna del docente)

Este proyecto cumple explícitamente los 3 puntos pedidos:

1. **Validación en backend de un dato sensible.**
   El dato sensible es la **cédula ecuatoriana** del usuario. Se valida
   con el algoritmo oficial (provincia 01–24, tercer dígito ≤ 5, dígito
   verificador módulo 10) en una regla VineJS del lado del servidor —
   [`app/validators/rules/cedula_ecuatoriana.ts`](app/validators/rules/cedula_ecuatoriana.ts) —
   nunca solo en JavaScript del navegador. Una cédula con dígito
   verificador incorrecto es rechazada por el servidor antes de llegar a
   la base de datos, incluso si se envía la petición HTTP directamente
   sin pasar por el formulario.

2. **Referencias a otra tabla mediante dropdown dependiente, no texto
   libre.**
   El ejemplo del docente fue país → provincia → ciudad; aquí el
   equivalente es **categoría → subcategoría** en el formulario de
   Alimentos ([`resources/views/pages/admin/foods/create.edge`](resources/views/pages/admin/foods/create.edge)):
   al elegir la categoría padre (ej. "Proteínas"), el segundo `<select>`
   se recarga dinámicamente (Alpine.js) solo con sus subcategorías (ej.
   "Carnes rojas", "Pescados y mariscos"). El id de la categoría nunca se
   escribe a mano. El rol de un Usuario y la categoría padre de una
   Categoría de alimentos también usan `<select>`, nunca un input de
   texto para una FK.

3. **Código versionado en Git con README, y desplegado.**
   Este repositorio, desplegado en Render (ver sección
   [Despliegue](#despliegue)).

## Stack técnico

- **Backend:** [AdonisJS 6](https://adonisjs.com) (kit *hypermedia*, Edge templates)
- **ORM:** Lucid
- **Base de datos:** PostgreSQL
- **Validación:** VineJS (reglas propias + reglas conscientes de la BD)
- **Autenticación:** sesiones (`@adonisjs/auth`, hash scrypt)
- **Frontend:** Edge + Alpine.js (sin framework JS pesado)

## Estructura relevante

```
app/
  controllers/admin/      Controladores de los 6 catálogos
  middleware/
    admin_only_middleware.ts   Restringe /admin al rol ADMIN
  models/                 Modelos Lucid (escritos a mano, sin auto-generación)
  validators/
    rules/cedula_ecuatoriana.ts   Validación backend del dato sensible
database/
  migrations/             8 tablas
  seeders/                Datos de demo (roles, catálogos, 1 usuario admin)
resources/views/
  pages/admin/            Vistas de cada catálogo (index/create/edit)
  partials/admin_sidebar.edge   Navegación del módulo de administración
start/routes.ts           Rutas /admin/* protegidas por auth + rol ADMIN
```

## Requisitos previos

- Node.js 20+
- PostgreSQL 14+

## Instalación

```bash
git clone https://github.com/Jay3azy/FitPlan.git
cd FitPlan
npm install
cp .env.example .env
```

Edita `.env` con los datos de tu PostgreSQL local:

```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_DATABASE=nutriplan
```

Genera una `APP_KEY` si `.env.example` no trae una:

```bash
node ace generate:key
```

## Migraciones y datos de demo

```bash
node ace migration:run
node ace db:seed
```

Esto crea las 8 tablas y las deja pobladas con: 3 roles, 13 categorías
de alimentos (4 padres + 9 subcategorías), 3 objetivos, 2 condiciones
médicas, 4 alergias y **1 usuario administrador de prueba**:

| Campo | Valor |
|---|---|
| Email | `admin@nutriplan.test` |
| Contraseña | `Admin1234` |
| Cédula | `1712345675` (válida, para probar el formulario sin fallar la validación) |
| Rol | ADMIN |

## Ejecutar en desarrollo

```bash
node ace serve --watch
```

La app queda en `http://localhost:3333`. Inicia sesión con el usuario
admin de arriba y entra a **Administración** en la barra de navegación.

## Despliegue

_Pendiente — se agrega el enlace una vez desplegado en Render._

## Video explicativo

_Pendiente — enlace al video (Loom/YouTube) explicando esta
administración y cómo alimenta al Core._
