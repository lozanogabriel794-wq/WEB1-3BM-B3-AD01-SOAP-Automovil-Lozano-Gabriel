using Microsoft.EntityFrameworkCore;
using AutoSoap.Models;

namespace AutoSoap.Data
{
    public class ConcesionariaDbContext : DbContext
    {
        public ConcesionariaDbContext(DbContextOptions<ConcesionariaDbContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Vehiculo> Vehiculo { get; set; }
        public DbSet<Mantenimiento> Mantenimiento { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categoria>().HasKey(c => c.IdCategoria);
            modelBuilder.Entity<Vehiculo>().HasKey(v => v.IdVehiculo);
            modelBuilder.Entity<Mantenimiento>().HasKey(m => m.IdMantenimiento);
            
            // Relación Vehiculo -> Categoria
            modelBuilder.Entity<Vehiculo>()
                .HasOne<Categoria>()
                .WithMany()
                .HasForeignKey(v => v.IdCategoria);

            // Relación Mantenimiento -> Vehiculo
            modelBuilder.Entity<Mantenimiento>()
                .HasOne(m => m.Vehiculo)
                .WithMany()
                .HasForeignKey(m => m.IdVehiculo);
        }
    }
}
