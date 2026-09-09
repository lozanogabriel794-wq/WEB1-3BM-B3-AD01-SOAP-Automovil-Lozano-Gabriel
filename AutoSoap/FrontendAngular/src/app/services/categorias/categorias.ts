import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { XMLParser } from 'fast-xml-parser';

export interface Categoria {
  idCategoria?: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
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
          nombre: typeof c.Nombre === 'object' ? '' : c.Nombre,
          descripcion: typeof c.Descripcion === 'object' ? '' : c.Descripcion,
          estado: String(c.Estado).toLowerCase() === 'true'
        }));
      })
    );
  }

  crearCategoria(categoria: Categoria): Observable<any> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <AgregarCategoria xmlns="http://tempuri.org/">
            <categoria xmlns:a="http://schemas.datacontract.org/2004/07/AutoSoap.Models" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
              <a:Descripcion>${categoria.descripcion || ''}</a:Descripcion>
              <a:Estado>${categoria.estado}</a:Estado>
              <a:Nombre>${categoria.nombre}</a:Nombre>
            </categoria>
          </AgregarCategoria>
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('AgregarCategoria', xmlRequest);
  }
  
  actualizarCategoria(categoria: Categoria): Observable<any> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <ActualizarCategoria xmlns="http://tempuri.org/">
            <categoria xmlns:a="http://schemas.datacontract.org/2004/07/AutoSoap.Models" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
              <a:Descripcion>${categoria.descripcion || ''}</a:Descripcion>
              <a:Estado>${categoria.estado}</a:Estado>
              <a:IdCategoria>${categoria.idCategoria}</a:IdCategoria>
              <a:Nombre>${categoria.nombre}</a:Nombre>
            </categoria>
          </ActualizarCategoria>
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('ActualizarCategoria', xmlRequest);
  }
  
  eliminarCategoria(id: number): Observable<any> {
    const xmlRequest = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <EliminarCategoria xmlns="http://tempuri.org/">
            <id>${id}</id>
          </EliminarCategoria>
        </s:Body>
      </s:Envelope>
    `;

    return this.enviarSoap('EliminarCategoria', xmlRequest);
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
