import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { Asignatura } from '../models/Asignatura';
import { Convenio } from '../models/Convenio';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})


export class ConvenioService {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })


  private _url: string = environment.URL_APP+"GestionConvenios";

  constructor(
    private http: HttpClient
  ) { }

  getConvenio() {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + '/ListarConvenios', {
      headers: header

    });
  }

  createConvenio(convenio: any,cedulaGerente: any, cedulaResponsable: any): Promise<any> {
    return this.http.post(
        this._url + `/CrearConvenio/${cedulaGerente}/${cedulaResponsable}`,convenio, {
          headers: this.httpHeaders
        }
      ).toPromise();
  }

  createConvenio2(convenio, cedulaGerente: string,cedulaResponsable: string): Promise<any> {
    return this.http.post(
      this._url + `/CrearConvenio/${cedulaGerente}/${cedulaResponsable}`,
      {
        ...convenio
      }, {
        headers: this.httpHeaders
      }
    ).toPromise();
  }




  private urlCreate: string = this._url+'/CrearConvenios';
  private urlDelete: string = this._url+'/EliminarConvenios';
  private urlSearch: string = this._url+'/ListarConvenios';
  private urlUpdate: string = this._url+'/EditarConvenio';


  getConvenios(): Observable<Convenio[]> {
    return this.http.get(this.urlSearch).pipe(
      map(response => response as Convenio[])
    );
  }


  createConvenios(doc: Convenio): Observable<Convenio> {
    return this.http.post<Convenio>(`${this.urlCreate}`, doc, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar el convenio', 'error')
        return throwError(e);
      })
    );
  }

  deleteConvenios(empid: String): Observable<Convenio> {
    return this.http.delete<Convenio>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }

  updateConvenio(conv: Convenio, id : String): Observable<Convenio> {
    return this.http.put<Convenio>(`${this.urlUpdate}/${id}`, conv, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al actualizar', 'NO se puede actualizar a convenio', 'error')
        return throwError(e);
      })
    );
  }

}
