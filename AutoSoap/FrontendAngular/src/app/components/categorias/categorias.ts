import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasService, Categoria } from '../../services/categorias/categorias';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit {
  categorias: Categoria[] = [];
  categoriaActual: Categoria = { nombre: '', descripcion: '', estado: true };
  editando: boolean = false;
  mensaje: string = '';
  erroresValidacion: string[] = [];

  constructor(private categoriasService: CategoriasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
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

  seleccionarCategoria(categoria: Categoria): void {
    this.categoriaActual = { ...categoria };
    this.editando = true;
    this.mensaje = '';
    this.erroresValidacion = [];
  }

  validarCategoria(): boolean {
    this.erroresValidacion = [];
    
    if (!this.categoriaActual.nombre || this.categoriaActual.nombre.trim() === '') {
      this.erroresValidacion.push('El nombre es obligatorio.');
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.categoriaActual.nombre)) {
      this.erroresValidacion.push('El nombre solo puede contener letras y espacios.');
    } else if (this.categoriaActual.nombre.length < 3 || this.categoriaActual.nombre.length > 100) {
      this.erroresValidacion.push('El nombre debe tener entre 3 y 100 caracteres.');
    }

    if (this.categoriaActual.descripcion && this.categoriaActual.descripcion.length > 255) {
      this.erroresValidacion.push('La descripción no puede exceder los 255 caracteres.');
    }

    return this.erroresValidacion.length === 0;
  }

  guardarCategoria(): void {
    if (!this.validarCategoria()) {
      return;
    }

    if (this.editando && this.categoriaActual.idCategoria) {
      this.categoriasService.actualizarCategoria(this.categoriaActual).subscribe({
        next: () => {
          this.mensaje = 'Categoría actualizada exitosamente.';
          this.cargarCategorias();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.categoriasService.crearCategoria(this.categoriaActual).subscribe({
        next: () => {
          this.mensaje = 'Categoría creada exitosamente.';
          this.cargarCategorias();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error al crear', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminarCategoria(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriasService.eliminarCategoria(id).subscribe({
        next: (res) => {
          const success = res?.Envelope?.Body?.EliminarCategoriaResponse?.EliminarCategoriaResult;
          if (success === true || success === 'true') {
            this.mensaje = 'Categoría eliminada exitosamente.';
            this.erroresValidacion = [];
            this.cargarCategorias();
          } else {
            this.mensaje = '';
            this.erroresValidacion = ['No se pudo eliminar la categoría. Es posible que tenga vehículos asociados.'];
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.mensaje = '';
          this.erroresValidacion = ['Ocurrió un error de red al intentar eliminar la categoría.'];
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.categoriaActual = { nombre: '', descripcion: '', estado: true };
    this.editando = false;
    this.erroresValidacion = [];
    this.cdr.detectChanges();
  }
}
