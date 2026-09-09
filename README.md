# Actividad Autónoma (AA) - Programación Web I

**Tema Asignado:** Paralelo B (Matutino) - Categoría + Vehículo (SOAP) | Mantenimiento (REST)
**Estudiante:** Gabriel

🎥 **Video Demostrativo:** [Ver en YouTube](https://youtu.be/bxKpkd44UZ4)

## Descripción del Proyecto
Este proyecto es un sistema de gestión integral para una concesionaria / taller de vehículos. Permite administrar categorías de vehículos, el inventario de la flota vehicular y llevar un registro detallado del historial de mantenimientos de cada unidad.

**Entidades Principales y Relaciones:**
- **Categoría (1) -> (N) Vehículo:** Una categoría ("SUV", "Sedán") puede tener múltiples vehículos. Un vehículo pertenece a una sola categoría. (Implementado vía **SOAP**).
- **Vehículo (1) -> (N) Mantenimiento:** Un vehículo puede registrar múltiples mantenimientos a lo largo del tiempo. (Implementado vía **REST**).

## Tecnologías Utilizadas
- **Backend:** .NET 8 / C#
- **Servicios:** SOAP (CoreWCF) y REST (ASP.NET Core Web API)
- **Base de Datos:** SQL Server (con Entity Framework Core)
- **Frontend:** Angular 17+ (con TypeScript, HTML, CSS Vainilla y Bootstrap Icons)
- **API Externa:** OpenWeatherMap API

## Estructura del Repositorio
- `/AutoSoap`: Contiene el backend unificado que expone tanto los servicios SOAP (Categorías y Vehículos) como la API REST (Mantenimientos).
- `/FrontendAngular`: Código fuente de la aplicación cliente (SPA) construida en Angular.
- `/SQL`: Scripts de creación de tablas y población de datos de prueba (`datos_de_prueba.sql`).
- `/Postman`: Colección de pruebas utilizadas para verificar los endpoints independientemente.

---

## API Externa Utilizada
**OpenWeatherMap API (Current Weather Data)**
- **Información que retorna:** Condiciones climáticas actuales (estado del tiempo, temperatura, humedad, velocidad del viento, y un ícono oficial) de diversas ciudades de Ecuador.
- **Pantalla de Integración:** Se integra directamente en el **Dashboard** principal de la aplicación Angular.
- **Uso Funcional:** Con base en el clima (ej. si llueve o si hace mucho calor), el sistema genera recomendaciones preventivas automáticas de mantenimiento para los vehículos (revisión de frenos, refrigerante, etc.).

---

## Instrucciones de Despliegue y Ejecución

### 1. Base de Datos
1. Abrir SQL Server Management Studio (SSMS).
2. Crear una base de datos (o usar la predeterminada del `appsettings.json`).
3. Ejecutar los scripts ubicados en la carpeta `SQL` para generar las tablas `Categoria`, `Vehiculo` y `Mantenimiento` con sus datos iniciales.
4. Si es necesario, actualizar la cadena de conexión `ConnectionStrings:ConcesionariaDb` en el archivo `AutoSoap/appsettings.json`.

### 2. Ejecutar el Backend (SOAP y REST)
1. Abrir la solución en Visual Studio (o VS Code).
2. Restaurar paquetes NuGet.
3. Compilar y ejecutar el proyecto (Perfil HTTP o HTTPS).
4. **Endpoints Principales:**
   - **SOAP (Vehículos y Categorías):** `http://localhost:<puerto>/Service.svc`
   - **REST (Mantenimientos):** 
     - `GET /api/Mantenimientos`
     - `POST /api/Mantenimientos`
     - `PUT /api/Mantenimientos/{id}`
     - `DELETE /api/Mantenimientos/{id}`

### 3. Ejecutar el Frontend (Angular)
1. Abrir una terminal en la carpeta `/FrontendAngular`.
2. Ejecutar `npm install` para instalar las dependencias (`fast-xml-parser`, etc.).
3. *(Opcional)*: Configurar su propia API Key de OpenWeatherMap en `src/environments/environment.ts` (ya que la original no se sube a GitHub por seguridad).
4. Ejecutar `npm start` (o `ng serve`).
5. Acceder en el navegador a `http://localhost:4200/`.
