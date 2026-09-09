using AutoSoap.Data;
using AutoSoap.Models;

namespace AutoSoap.Services
{
    public class VehiculoService : IVehiculoService
    {
        private readonly ConcesionariaDbContext _context;

        public VehiculoService(ConcesionariaDbContext context)
        {
            _context = context;
        }

        public List<Categoria> ObtenerCategorias()
        {
            return _context.Categoria.ToList();
        }

        public Categoria ObtenerCategoria(int id)
        {
            return _context.Categoria.FirstOrDefault(c => c.IdCategoria == id)!;
        }

        public bool AgregarCategoria(Categoria categoria)
        {
            try
            {
                _context.Categoria.Add(categoria);
                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ActualizarCategoria(Categoria categoria)
        {
            try
            {
                var existing = _context.Categoria.FirstOrDefault(c => c.IdCategoria == categoria.IdCategoria);
                if (existing != null)
                {
                    existing.Nombre = categoria.Nombre;
                    existing.Descripcion = categoria.Descripcion;
                    existing.Estado = categoria.Estado;
                    
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool EliminarCategoria(int id)
        {
            try
            {
                var categoria = _context.Categoria.FirstOrDefault(c => c.IdCategoria == id);
                if (categoria != null)
                {
                    _context.Categoria.Remove(categoria);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public List<Vehiculo> ObtenerVehiculos()
        {
            return _context.Vehiculo.ToList();
        }

        public Vehiculo ObtenerVehiculo(int id)
        {
            return _context.Vehiculo.FirstOrDefault(v => v.IdVehiculo == id)!;
        }

        public bool AgregarVehiculo(Vehiculo vehiculo)
        {
            try
            {
                _context.Vehiculo.Add(vehiculo);
                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ActualizarVehiculo(Vehiculo vehiculo)
        {
            try
            {
                var existing = _context.Vehiculo.FirstOrDefault(v => v.IdVehiculo == vehiculo.IdVehiculo);
                if (existing != null)
                {
                    existing.Placa = vehiculo.Placa;
                    existing.Marca = vehiculo.Marca;
                    existing.Modelo = vehiculo.Modelo;
                    existing.Anio = vehiculo.Anio;
                    existing.Precio = vehiculo.Precio;
                    existing.Estado = vehiculo.Estado;
                    existing.IdCategoria = vehiculo.IdCategoria;
                    
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool EliminarVehiculo(int id)
        {
            try
            {
                var vehiculo = _context.Vehiculo.FirstOrDefault(v => v.IdVehiculo == id);
                if (vehiculo != null)
                {
                    _context.Vehiculo.Remove(vehiculo);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public List<Vehiculo> ObtenerVehiculoPorMarca(string marca)
        {
            return _context.Vehiculo
                .Where(v => v.Marca.Contains(marca))
                .ToList();
        }

        public List<Vehiculo> ObtenerVehiculoPorCategoria(int idCategoria)
        {
            return _context.Vehiculo
                .Where(v => v.IdCategoria == idCategoria)
                .ToList();
        }
    }
}
