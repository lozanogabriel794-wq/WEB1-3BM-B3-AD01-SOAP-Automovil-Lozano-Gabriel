using System.Runtime.Serialization;

namespace AutoSoap.Models
{
    [DataContract]
    public class Vehiculo
    {
        [DataMember]
        public int IdVehiculo { get; set; }

        [DataMember]
        public string Placa { get; set; } = string.Empty;

        [DataMember]
        public string Marca { get; set; } = string.Empty;

        [DataMember]
        public string Modelo { get; set; } = string.Empty;

        [DataMember]
        public string Anio { get; set; } = string.Empty;

        [DataMember]
        public decimal Precio { get; set; }

        [DataMember]
        public bool Estado { get; set; }

        [DataMember]
        public int IdCategoria { get; set; }
    }
}
