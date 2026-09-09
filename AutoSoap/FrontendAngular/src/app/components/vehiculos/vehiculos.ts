import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculosService, Vehiculo, Categoria } from '../../services/vehiculos/vehiculos';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos.html',
  styleUrls: ['./vehiculos.css']
})
export class Vehiculos implements OnInit {
  vehiculos: Vehiculo[] = [];
  categorias: Categoria[] = [];
  
  get categoriasDropdown(): Categoria[] {
    return this.categorias.filter(c => c.estado || c.idCategoria === this.vehiculoActual.idCategoria);
  }

  vehiculoActual: Vehiculo = { idCategoria: 0, marca: '', modelo: '', anio: new Date().getFullYear().toString(), precio: 0, placa: '', estado: true };
  editando: boolean = false;
  mensaje: string = '';
  erroresValidacion: string[] = [];

  constructor(private vehiculosService: VehiculosService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarVehiculos();
  }

  cargarCategorias(): void {
    this.vehiculosService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.cdr.detectChanges();
      }
    });
  }

  cargarVehiculos(): void {
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar vehículos', err);
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarVehiculo(vehiculo: Vehiculo): void {
    this.vehiculoActual = { ...vehiculo };
    this.editando = true;
    this.mensaje = '';
    this.erroresValidacion = [];
  }

  validarVehiculo(): boolean {
    this.erroresValidacion = [];
    
    if (!this.vehiculoActual.idCategoria || this.vehiculoActual.idCategoria <= 0) {
      this.erroresValidacion.push('Debe seleccionar una categoría.');
    }

    if (!this.vehiculoActual.marca || this.vehiculoActual.marca.trim() === '') {
      this.erroresValidacion.push('La marca es obligatoria.');
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.vehiculoActual.marca)) {
      this.erroresValidacion.push('La marca solo puede contener letras y espacios.');
    }

    if (!this.vehiculoActual.modelo || this.vehiculoActual.modelo.trim() === '') {
      this.erroresValidacion.push('El modelo es obligatorio.');
    }

    if (!this.vehiculoActual.anio || isNaN(Number(this.vehiculoActual.anio))) {
      this.erroresValidacion.push('El año debe ser un número válido.');
    } else {
      const anioNum = Number(this.vehiculoActual.anio);
      const anioActual = new Date().getFullYear();
      if (anioNum < 1950 || anioNum > anioActual + 1) {
        this.erroresValidacion.push(`El año debe estar entre 1950 y ${anioActual + 1}.`);
      }
    }

    if (!this.vehiculoActual.placa || this.vehiculoActual.placa.trim() === '') {
      this.erroresValidacion.push('La placa es obligatoria.');
    } else if (!/^[A-Z]{3}-\d{3,4}$/.test(this.vehiculoActual.placa)) {
      this.erroresValidacion.push('La placa debe tener el formato válido (Ej: ABC-1234 o ABC-123) en mayúsculas.');
    }

    if (!this.vehiculoActual.precio || isNaN(Number(this.vehiculoActual.precio)) || Number(this.vehiculoActual.precio) <= 0) {
      this.erroresValidacion.push('El precio debe ser un número mayor a 0.');
    }

    return this.erroresValidacion.length === 0;
  }

  guardarVehiculo(): void {
    if (!this.validarVehiculo()) {
      return;
    }

    if (this.editando) {
      this.vehiculosService.actualizarVehiculo(this.vehiculoActual).subscribe({
        next: () => {
          this.mensaje = 'Vehículo actualizado exitosamente.';
          this.cargarVehiculos();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.vehiculosService.crearVehiculo(this.vehiculoActual).subscribe({
        next: () => {
          this.mensaje = 'Vehículo creado exitosamente.';
          this.cargarVehiculos();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error al crear', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminarVehiculo(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de eliminar este vehículo?')) {
      this.vehiculosService.eliminarVehiculo(id).subscribe({
        next: (res) => {
          const success = res?.Envelope?.Body?.EliminarVehiculoResponse?.EliminarVehiculoResult;
          if (success === true || success === 'true') {
            this.mensaje = 'Vehículo eliminado exitosamente.';
            this.erroresValidacion = [];
            this.cargarVehiculos();
          } else {
            this.mensaje = '';
            this.erroresValidacion = ['No se pudo eliminar el vehículo. Es posible que tenga mantenimientos asociados.'];
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.mensaje = '';
          this.erroresValidacion = ['Ocurrió un error de red al intentar eliminar el vehículo.'];
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.vehiculoActual = { idCategoria: 0, marca: '', modelo: '', anio: new Date().getFullYear().toString(), precio: 0, placa: '', estado: true };
    this.editando = false;
    this.erroresValidacion = [];
    this.cdr.detectChanges();
  }

  getCategoriaNombre(idCategoria: number): string {
    const cat = this.categorias.find(c => c.idCategoria == idCategoria);
    return cat ? cat.nombre : 'Desconocida';
  }
}
