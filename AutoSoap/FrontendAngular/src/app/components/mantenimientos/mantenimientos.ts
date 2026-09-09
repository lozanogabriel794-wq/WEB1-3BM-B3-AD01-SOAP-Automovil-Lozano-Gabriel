import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MantenimientosService, Mantenimiento } from '../../services/mantenimientos/mantenimientos';
import { VehiculosService, Vehiculo } from '../../services/vehiculos/vehiculos';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mantenimientos.html',
  styleUrls: ['./mantenimientos.css']
})
export class Mantenimientos implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  vehiculos: Vehiculo[] = [];
  mantenimientoActual: Mantenimiento = { idVehiculo: 0, fecha: new Date().toISOString().slice(0,10), tipo: 'Preventivo', descripcion: '', costo: 0, kilometraje: 0, estado: true };
  editando: boolean = false;
  mensaje: string = '';
  erroresValidacion: string[] = [];

  constructor(
    private mantenimientosService: MantenimientosService,
    private vehiculosService: VehiculosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVehiculos();
    this.cargarMantenimientos();
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

  cargarMantenimientos(): void {
    this.mantenimientosService.getMantenimientos().subscribe({
      next: (data) => {
        this.mantenimientos = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos', err);
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarMantenimiento(mant: Mantenimiento): void {
    this.mantenimientoActual = { ...mant };
    if (this.mantenimientoActual.fecha) {
      this.mantenimientoActual.fecha = this.mantenimientoActual.fecha.slice(0, 10);
    }
    this.editando = true;
    this.mensaje = '';
    this.erroresValidacion = [];
  }

  validarMantenimiento(): boolean {
    this.erroresValidacion = [];
    
    if (!this.mantenimientoActual.idVehiculo || this.mantenimientoActual.idVehiculo <= 0) {
      this.erroresValidacion.push('Debe seleccionar un vehículo.');
    }

    if (!this.mantenimientoActual.fecha || this.mantenimientoActual.fecha.trim() === '') {
      this.erroresValidacion.push('La fecha es obligatoria.');
    }

    if (!this.mantenimientoActual.tipo || (this.mantenimientoActual.tipo !== 'Preventivo' && this.mantenimientoActual.tipo !== 'Correctivo')) {
      this.erroresValidacion.push('Debe seleccionar un tipo de mantenimiento válido (Preventivo o Correctivo).');
    }

    if (!this.mantenimientoActual.descripcion || this.mantenimientoActual.descripcion.trim().length < 5) {
      this.erroresValidacion.push('La descripción es obligatoria y debe tener al menos 5 caracteres.');
    }

    if (this.mantenimientoActual.kilometraje === undefined || this.mantenimientoActual.kilometraje === null || isNaN(Number(this.mantenimientoActual.kilometraje)) || Number(this.mantenimientoActual.kilometraje) < 0) {
      this.erroresValidacion.push('El kilometraje debe ser un número mayor o igual a 0.');
    }

    if (this.mantenimientoActual.costo === undefined || this.mantenimientoActual.costo === null || isNaN(Number(this.mantenimientoActual.costo)) || Number(this.mantenimientoActual.costo) < 0) {
      this.erroresValidacion.push('El costo debe ser un número mayor o igual a 0.');
    }

    return this.erroresValidacion.length === 0;
  }

  guardarMantenimiento(): void {
    if (!this.validarMantenimiento()) {
      return;
    }

    if (this.editando && this.mantenimientoActual.idMantenimiento) {
      this.mantenimientosService.actualizarMantenimiento(this.mantenimientoActual.idMantenimiento, this.mantenimientoActual).subscribe({
        next: () => {
          this.mensaje = 'Mantenimiento actualizado exitosamente.';
          this.cargarMantenimientos();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.mantenimientosService.crearMantenimiento(this.mantenimientoActual).subscribe({
        next: () => {
          this.mensaje = 'Mantenimiento registrado exitosamente.';
          this.cargarMantenimientos();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error al crear', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminarMantenimiento(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de eliminar este mantenimiento?')) {
      this.mantenimientosService.eliminarMantenimiento(id).subscribe({
        next: () => {
          this.mensaje = 'Mantenimiento eliminado exitosamente.';
          this.erroresValidacion = [];
          this.cargarMantenimientos();
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.mensaje = '';
          this.erroresValidacion = ['No se pudo eliminar el mantenimiento. Puede que esté referenciado por otros registros.'];
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.mantenimientoActual = { idVehiculo: 0, fecha: new Date().toISOString().slice(0,10), tipo: 'Preventivo', descripcion: '', costo: 0, kilometraje: 0, estado: true };
    this.editando = false;
    this.erroresValidacion = [];
    this.cdr.detectChanges();
  }

  getVehiculoInfo(idVehiculo: number): string {
    const veh = this.vehiculos.find(v => v.idVehiculo == idVehiculo);
    return veh ? `${veh.marca} ${veh.modelo} (${veh.placa})` : 'Desconocido';
  }
}
