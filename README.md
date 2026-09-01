# AutoSoap - Servicio Web SOAP con CoreWCF y Entity Framework

Proyecto desarrollado para la gestión y administración de vehículos y categorías de una concesionaria, utilizando un servicio web SOAP implementado con **CoreWCF** en .NET y persistencia de datos mediante **Entity Framework Core** y **SQL Server**.

---

## 📋 Descripción del Proyecto

El sistema expone un conjunto de operaciones mediante un servicio web SOAP (`/Service.svc`) que permite realizar consultas, registros, actualizaciones y eliminaciones de vehículos, así como la consulta de categorías disponibles en la base de datos.

---

## 🛠️ Tecnologías Utilizadas

* **C# / .NET**
* **CoreWCF** (para la implementación de servicios SOAP en .NET Core / .NET 6+)
* **Entity Framework Core** (ORM para la gestión de base de datos)
* **SQL Server**
* **Visual Studio / Visual Studio Code**

---

## 🗂️ Estructura del Repositorio

```text
AutoSoap/
│
├── Data/
│   └── ConcesionariaDbContext.cs
├── Models/
│   ├── Categoria.cs
│   └── Vehiculo.cs
├── Services/
│   ├── IVehiculoService.cs
│   └── VehiculoService.cs
├── SQL/
│   └── ConcesionariaDB.sql
├── Postman/
│   └── AutoSoap.postman_collection.json
├── Program.cs
└── README.md
```

---

## ⚙️ Instrucciones de Uso

### 1. Crear la Base de Datos
1. Abrir **SQL Server Management Studio (SSMS)** y conectarse a la instancia local de SQL Server.
2. Ejecutar el script SQL ubicado en la ruta:
   ```text
   SQL/ConcesionariaDB.sql
   ```
   *El script creará la base de datos junto con las tablas de `Categoria` y `Vehiculo`, además de insertar registros iniciales para las pruebas.*

### 2. Configurar la Conexión a la Base de Datos
Antes de ejecutar el proyecto, se debe verificar y ajustar la cadena de conexión ubicada en el archivo `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\SQLEXPRESS;Database=ConcesionariaDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```
> **Nota:** El nombre del servidor (`Server`) puede variar dependiendo de la computadora o instancia de SQL Server instalada (por ejemplo, `localhost`, `.\SQLEXPRESS`, etc.).

### 3. Abrir y Ejecutar el Proyecto
1. Abrir la solución o el proyecto en **Visual Studio**.
2. Restaurar las dependencias necesarias de NuGet si fuera requerido.
3. Ejecutar el proyecto (botón **Start** o presionando `F5`). El servicio web levantará en la ruta por defecto con el endpoint SOAP en:
   ```text
   http://localhost:<puerto>/Service.svc
   ```

### 4. Probar las Operaciones SOAP (Postman)
1. Abrir **Postman**.
2. Importar la colección ubicada en:
   ```text
   Postman/AutoSoap.postman_collection.json
   ```
3. La colección contiene las peticiones SOAP configuradas (XML) para probar las diferentes operaciones del servicio:
   * `ObtenerCategorias`
   * `ObtenerVehiculos`
   * `ObtenerVehiculo` (por ID)
   * `AgregarVehiculo`
   * `ActualizarVehiculo`
   * `EliminarVehiculo`
   * `ObtenerVehiculoPorMarca`
   * `ObtenerVehiculoPorCategoria`

---

## 👤 Autor

* **Estudiante:** Gabriel Alejandro Lozano Yumi
* **Asignatura:** Programación Web 1
* **Paralelo:** Tercero B Matutino
