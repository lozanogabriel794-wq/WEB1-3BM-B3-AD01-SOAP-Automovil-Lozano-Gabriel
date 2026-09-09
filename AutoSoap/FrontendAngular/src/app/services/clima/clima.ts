import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  constructor(private http: HttpClient) { }

  getClima(ciudad: string): Observable<any> {
    const url = `${environment.apiWeatherUrl}?q=${ciudad}&appid=${environment.apiWeatherKey}&units=metric&lang=es`;
    return this.http.get(url);
  }
}
