<div align="center">
  <br />
  <h1>WorkoutHub API</h1>
  <p><strong>El motor backend para tu próxima aplicación de fitness.</strong></p>
  <p>Una API robusta, escalable y lista para usar, construida con las mejores prácticas de la industria.</p>
  <br />

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Auth" />
  </p>
</div>

---

## 📖 Sobre el Proyecto

**WorkoutHub** es más que una simple API; es una base sólida para construir aplicaciones de fitness completas. Ha sido diseñada pensando en la escalabilidad y la facilidad de mantenimiento, permitiendo a los desarrolladores centrarse en crear una experiencia de usuario increíble sin preocuparse por la complejidad del backend.

El sistema gestiona toda la lógica de negocio esencial: desde el registro y la autenticación segura de usuarios hasta la creación y gestión detallada de rutinas y ejercicios personalizados.

## ✨ Características Principales

-   **🔐 Autenticación Segura:** Sistema completo de registro y login basado en **JWT (JSON Web Tokens)**.
-   **👤 Gestión de Perfiles de Usuario:** Almacena datos relevantes del usuario como peso, altura y nivel de actividad.
-   **🏋️‍♀️ CRUD Completo de Rutinas:** Crea, lee, actualiza y elimina rutinas de ejercicio personalizadas.
-   **💪 CRUD Completo de Ejercicios:** Añade ejercicios detallados (series, repeticiones) a rutinas específicas.
-   **🔗 Relaciones de Datos Lógicas:** Los ejercicios pertenecen a rutinas, y las rutinas pertenecen a usuarios, con borrado en cascada para mantener la integridad.
-   **✅ Validación de Datos:** Usa `class-validator` para asegurar que los datos de entrada son correctos y seguros.
-   **🧱 Arquitectura Modular:** Organizado en módulos de NestJS (`Auth`, `Routines`, `Exercises`) para una máxima cohesión y bajo acoplamiento.

## 🛠️ Stack Tecnológico

-   **Framework:** [NestJS](https://nestjs.com/) - Un marco de Node.js progresivo para construir aplicaciones eficientes y escalables.
-   **ORM:** [Prisma](https://www.prisma.io/) - ORM de próxima generación para Node.js y TypeScript.
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript que añade tipado estático.
-   **Base de Datos:** [SQLite](https://www.sqlite.org/index.html) - Base de datos SQL ligera y sin servidor, ideal para desarrollo y prototipado.
-   **Autenticación:** [Passport](http://www.passportjs.org/) con estrategia `passport-jwt`.
-   **Validación:** [class-validator](https://github.com/typestack/class-validator) y [class-transformer](https://github.com/typestack/class-transformer).

## 🚀 Primeros Pasos

Sigue estas instrucciones para tener una copia del proyecto corriendo en tu máquina local.

### 1. Prerrequisitos

-   Node.js (v18+)
-   NPM o Yarn

### 2. Instalación

```bash
# Clona el repositorio
git clone <URL_DEL_REPOSITORIO>

# Entra al directorio
cd workouthub-backend

# Instala las dependencias
npm install

# Crea tu archivo de variables de entorno
# (y configúralo si es necesario)
cp .env.example .env

# Aplica las migraciones de la base de datos
npx prisma migrate dev
```

### 3. Ejecutando la Aplicación

```bash
# Iniciar en modo desarrollo
npm run start:dev
```

La API estará escuchando en `http://localhost:3000`.

## 📚 Guía de la API

_(La guía detallada de la API que generamos anteriormente se mantiene aquí sin cambios, ya que es muy completa.)_

---

## 🔮 Roadmap a Futuro

WorkoutHub es un proyecto en evolución. Algunas ideas para el futuro incluyen:

-   [ ] Implementar roles de usuario (ej. `USER`, `ADMIN`).
-   [ ] Añadir endpoints para seguimiento de progreso (ej. registrar peso levantado en un ejercicio).
-   [ ] Integrar un sistema de logros o gamificación.
-   [ ] Subida de imágenes/videos para los ejercicios.
-   [ ] Implementar tests unitarios y de integración.

## 📜 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.