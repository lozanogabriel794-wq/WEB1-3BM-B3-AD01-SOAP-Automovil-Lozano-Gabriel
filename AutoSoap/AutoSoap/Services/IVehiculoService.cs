using CoreWCF;
using AutoSoap.Models;

namespace AutoSoap.Services
{
    [ServiceContract]
    public interface IVehiculoService
    {
        [OperationContract]
        List<Categoria> ObtenerCategorias();

        [OperationContract]
        Categoria ObtenerCategoria(int id);

        [OperationContract]
        bool AgregarCategoria(Categoria categoria);

        [OperationContract]
        bool ActualizarCategoria(Categoria categoria);

        [OperationContract]
        bool EliminarCategoria(int id);

        [OperationContract]
        List<Vehiculo> ObtenerVehiculos();

        [OperationContract]
        Vehiculo ObtenerVehiculo(int id);

        [OperationContract]
        bool AgregarVehiculo(Vehiculo vehiculo);

        [OperationContract]
        bool ActualizarVehiculo(Vehiculo vehiculo);

        [OperationContract]
        bool EliminarVehiculo(int id);

        [OperationContract]
        List<Vehiculo> ObtenerVehiculoPorMarca(string marca);

        [OperationContract]
        List<Vehiculo> ObtenerVehiculoPorCategoria(int idCategoria);
    }
}
