import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClimaService } from '../../services/clima/clima';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  climaData: any;
  loading: boolean = true;
  error: boolean = false;
  ciudad: string = 'Guayaquil';
  ciudades: string[] = ['Guayaquil', 'Quito', 'Cuenca', 'Manta', 'Machala', 'Loja', 'Ambato', 'Riobamba', 'Santo Domingo'];

  constructor(private climaService: ClimaService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerClima();
  }

  obtenerClima() {
    this.loading = true;
    this.error = false;
    this.climaService.getClima(this.ciudad).subscribe({
      next: (data) => {
        this.climaData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarCiudad(): void {
    this.obtenerClima();
  }
}
