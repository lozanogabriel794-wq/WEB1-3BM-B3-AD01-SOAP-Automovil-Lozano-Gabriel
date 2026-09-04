using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoSoap.Models
{
    public class Mantenimiento
    {
        [Key]
        public int IdMantenimiento { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        [StringLength(100)]
        public string Tipo { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Costo { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Kilometraje { get; set; }

        [Required]
        public bool Estado { get; set; } // Representa el INT (BIT) del pizarrón

        [Required]
        public int IdVehiculo { get; set; }

        // Propiedad de navegación opcional
        [ForeignKey("IdVehiculo")]
        public virtual Vehiculo? Vehiculo { get; set; }
    }
}
