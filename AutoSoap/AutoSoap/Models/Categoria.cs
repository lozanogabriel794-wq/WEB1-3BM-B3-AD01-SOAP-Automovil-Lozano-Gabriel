using System.Runtime.Serialization;

namespace AutoSoap.Models
{
    [DataContract]
    public class Categoria
    {
        [DataMember]
        public int IdCategoria { get; set; }

        [DataMember]
        public string Nombre { get; set; } = string.Empty;

        [DataMember]
        public string? Descripcion { get; set; }

        [DataMember]
        public bool Estado { get; set; }
    }
}
