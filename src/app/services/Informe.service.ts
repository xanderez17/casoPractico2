import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { InformeVisita, Visita } from '../models/Visita';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InformeService {
  _urlI = 'https://backendg1c2.herokuapp.com/GestionInforme_Visita';
  urlCreateInforme = this._urlI + '/CrearInforme_Visita';
  urlUpdateInforme = this._urlI + '/EditarInforme_Visita';
  urlDeleteInforme = this._urlI + '/EliminarInforme_Visita';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  getListaInforme(): Promise<any[]> {
    return this.http
      .get<any[]>(
        environment.URL_APP + 'GestionInforme_Visita/ListaInforme_Visita'
      )
      .toPromise();
  }

  createInformeVisita(infvisita: InformeVisita): Observable<InformeVisita> {
    return this.http
      .post<InformeVisita>(this.urlCreateInforme, infvisita, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          swal.fire(
            'Error al guardar',
            'NO se puede guardar el Informe Visita',
            'error'
          );
          return throwError(e);
        })
      );
  }

  updateInforme(infvisita: InformeVisita): Observable<InformeVisita> {
    return this.http
      .put<InformeVisita>(
        `${this.urlUpdateInforme}/${infvisita.idInformeVisita}`,
        infvisita,
        {
          headers: this.httpHeaders,
        }
      )
      .pipe(
        catchError((e) => {
          swal.fire(
            'Error al actualizar',
            'NO se puede actualizar el Informe',
            'error'
          );
          return throwError(e);
        })
      );
  }

  deleteInforme(persid: number): Observable<InformeVisita> {
    return this.http
      .delete<InformeVisita>(`${this.urlDeleteInforme}/${persid}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          swal.fire(
            'Error al eliminar',
            'No se puede eliminar el Informe',
            'error'
          );
          return throwError(e);
        })
      );
  }
}
