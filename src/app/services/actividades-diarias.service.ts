import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { ActividadesDiarias } from '../models/actividades-diarias';
@Injectable({
  providedIn: 'root'
})


export class ActividadesDiariasService {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  _url = 'https://backendg1c2.herokuapp.com/ActividadesDiarias'

  private url_mater: string = environment.URL_APP;
  private urlDelete: string = this.url_mater+'ActividadesDiarias/EliminarActividadDiaria';

  constructor(
    private http: HttpClient
  ) { }

  getInformeActividadesDiarias() {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + '/ListaActividadesDiarias', {
      headers: header

    });
  }

  createregistroActividades(act: ActividadesDiarias): Observable<ActividadesDiarias> {
    return this.http.post<ActividadesDiarias>(environment.URL_APP + 'ActividadesDiarias/CrearActividadesDiarias', act, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al guardar', 'NO se puede guardar la actividad', 'error')
        return throwError(e);
      })
    );
  }


  deleteActividad(empid: number): Observable<ActividadesDiarias> {
    return this.http.delete<ActividadesDiarias>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }


}

