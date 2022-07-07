import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment";
import { ActaReunion } from '../models/ActaReunion';
import { Actividades } from '../models/actividades';
import { ActividadesCronograma } from '../models/ActividadesCronograma';




@Injectable({
  providedIn: 'root'
})
export class ActividadesCronogramaService {


  _url =  environment.URL_APP+'GestionActividades_Cronograma'

  private urlCreate: string = this._url+'/CrearActividades_Cronograma';
  private urlDelete: string = this._url+'/EliminarActividades_Cronograma';
  private urlSearch: string = this._url+'/ListaActividades_Cronograma';

  headers= new HttpHeaders().append('Content-type','application/json');

  url = environment.URL_APP + 'GestionActividades_Cronograma/'

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient, private router: Router) { }

  getActividades(): Observable<ActividadesCronograma[]> {
    return this.http.get(this.urlSearch).pipe(
      map(response => response as ActividadesCronograma[])
    );
  }


  createActividades(doc: Actividades): Observable<ActividadesCronograma> {
    return this.http.post<ActividadesCronograma>(`${this.urlCreate}`, doc, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar la actividad', 'error')
        return throwError(e);
      })
    );
  }

  deleteActividades(empid: String): Observable<ActividadesCronograma> {
    return this.http.delete<ActividadesCronograma>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }

  createActividadCronograma(cronograma): Promise<any> {
    return this.http.post(
      this.url + `CrearActividades_Cronograma`,
      {
        ...cronograma
      }, {
        headers: this.headers
      }
    ).toPromise();
  }

  getActividadesByCronograma(idcronograma) {
    return this.http.get<any[]>(
      this.url+`ListaActividadesPorCronograma/${idcronograma}`
    ).toPromise();
  }

  updateActividadesCronograma(id , actividad){
    return this.http.put<any[]>(
      this.url+`EditarActividades_Cronograma/${id}`,actividad, { headers: this.headers }
    ).toPromise();
  }

  deleteCronogramas(id: any): Promise<any[]> {
    return this.http.delete<any[]>(
      this.url + `EliminarActividades_Cronograma/${id}`
    ).toPromise();
  }

}
