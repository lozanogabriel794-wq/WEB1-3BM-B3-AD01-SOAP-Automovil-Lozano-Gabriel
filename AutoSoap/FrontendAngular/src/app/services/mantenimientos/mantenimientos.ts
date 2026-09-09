import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Mantenimiento {
  idMantenimiento?: number;
  idVehiculo: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  costo: number;
  kilometraje: number;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {
  private apiUrl = `${environment.apiRestUrl}/Mantenimientos`;

  constructor(private http: HttpClient) { }

  getMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  getMantenimiento(id: number): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.apiUrl}/${id}`);
  }

  crearMantenimiento(mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(this.apiUrl, mantenimiento);
  }

  actualizarMantenimiento(id: number, mantenimiento: Mantenimiento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mantenimiento);
  }

  eliminarMantenimiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
