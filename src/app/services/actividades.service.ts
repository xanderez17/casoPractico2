import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment";
import { ActaReunion } from '../models/ActaReunion';
import { Actividades } from '../models/actividades';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  _url =  environment.URL_APP+'GestionActividades'

  private urlCreate: string = this._url+'/CrearActividades';
  private urlDelete: string = this._url+'/EliminarActividades';
  private urlSearch: string = this._url+'/ListaActividades';


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }








  createActividades(doc: Actividades): Observable<Actividades> {
    return this.http.post<Actividades>(`${this.urlCreate}`, doc, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar la actividad', 'error')
        return throwError(e);
      })
    );
  }

  deleteActividades(empid: String): Observable<Actividades> {
    return this.http.delete<Actividades>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }

 getActividades() {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + '/ListaActividades', {
      headers: header

    });
  }

  getActividadesEmpresa(empid) {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + `/CargarActividadesEmpresa/${empid}`, {
      headers: header

    });
  }

  getActividadesConvenio(empid) {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + `/ListaActividadesConvenio/${empid}`, {
      headers: header

    });
  }

  createActividadesc(act: any): Promise<any> {
    return this.http.post(
        this._url + `/CrearActividades`,act, {
          headers: this.httpHeaders
        }
      ).toPromise();
  }

  deleteActividad(id: any): Promise<any[]> {
    return this.http.delete<any[]>(
      this._url + `/EliminarActividades/${id}`
    ).toPromise();
  }


}
