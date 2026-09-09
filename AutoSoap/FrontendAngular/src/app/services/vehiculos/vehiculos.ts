import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { XMLParser } from 'fast-xml-parser';

export interface Categoria {
  idCategoria: number;
  nombre: string;
  estado?: boolean;
}

export interface Vehiculo {
  idVehiculo?: number;
  idCategoria: number;
  marca: string;
  modelo: string;
  anio: string;
  precio: number;
  placa: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private soapUrl = environment.apiSoapUrl;
  private parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
  });

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <ObtenerCategorias xmlns="http://tempuri.org/" />
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('ObtenerCategorias', xmlRequest).pipe(
      map(res => {
        let categorias = res?.Envelope?.Body?.ObtenerCategoriasResponse?.ObtenerCategoriasResult?.Categoria;
        if (!categorias) return [];
        if (!Array.isArray(categorias)) categorias = [categorias];
        
        return categorias.map((c: any) => ({
          idCategoria: c.IdCategoria,
          nombre: c.Nombre,
          descripcion: c.Descripcion,
          estado: c.Estado === 'true' || c.Estado === true
        }));
      })
    );
  }

  getVehiculos(): Observable<Vehiculo[]> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <ObtenerVehiculos xmlns="http://tempuri.org/" />
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('ObtenerVehiculos', xmlRequest).pipe(
      map(res => {
        let vehiculos = res?.Envelope?.Body?.ObtenerVehiculosResponse?.ObtenerVehiculosResult?.Vehiculo;
        if (!vehiculos) return [];
        if (!Array.isArray(vehiculos)) vehiculos = [vehiculos];
        
        return vehiculos.map((v: any) => ({
          idVehiculo: v.IdVehiculo,
          idCategoria: v.IdCategoria,
          placa: typeof v.Placa === 'object' ? '' : v.Placa,
          marca: typeof v.Marca === 'object' ? '' : v.Marca,
          modelo: typeof v.Modelo === 'object' ? '' : v.Modelo,
          anio: typeof v.Anio === 'object' ? '' : v.Anio,
          precio: v.Precio,
          estado: String(v.Estado).toLowerCase() === 'true'
        }));
      })
    );
  }

  crearVehiculo(vehiculo: Vehiculo): Observable<any> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <AgregarVehiculo xmlns="http://tempuri.org/">
            <vehiculo xmlns:a="http://schemas.datacontract.org/2004/07/AutoSoap.Models" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
              <a:Anio>${vehiculo.anio}</a:Anio>
              <a:Estado>${vehiculo.estado}</a:Estado>
              <a:IdCategoria>${vehiculo.idCategoria}</a:IdCategoria>
              <a:Marca>${vehiculo.marca}</a:Marca>
              <a:Modelo>${vehiculo.modelo}</a:Modelo>
              <a:Placa>${vehiculo.placa}</a:Placa>
              <a:Precio>${vehiculo.precio}</a:Precio>
            </vehiculo>
          </AgregarVehiculo>
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('AgregarVehiculo', xmlRequest);
  }
  
  actualizarVehiculo(vehiculo: Vehiculo): Observable<any> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <ActualizarVehiculo xmlns="http://tempuri.org/">
            <vehiculo xmlns:a="http://schemas.datacontract.org/2004/07/AutoSoap.Models" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
              <a:Anio>${vehiculo.anio}</a:Anio>
              <a:Estado>${vehiculo.estado}</a:Estado>
              <a:IdCategoria>${vehiculo.idCategoria}</a:IdCategoria>
              <a:IdVehiculo>${vehiculo.idVehiculo}</a:IdVehiculo>
              <a:Marca>${vehiculo.marca}</a:Marca>
              <a:Modelo>${vehiculo.modelo}</a:Modelo>
              <a:Placa>${vehiculo.placa}</a:Placa>
              <a:Precio>${vehiculo.precio}</a:Precio>
            </vehiculo>
          </ActualizarVehiculo>
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('ActualizarVehiculo', xmlRequest);
  }

  eliminarVehiculo(id: number): Observable<any> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <EliminarVehiculo xmlns="http://tempuri.org/">
            <id>${id}</id>
          </EliminarVehiculo>
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('EliminarVehiculo', xmlRequest);
  }

  private enviarSoap(action: string, xml: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `"http://tempuri.org/IVehiculoService/${action}"`
    });
    return this.http.post(this.soapUrl, xml, { headers, responseType: 'text' }).pipe(
      map(xmlResponse => this.parser.parse(xmlResponse))
    );
  }
}
