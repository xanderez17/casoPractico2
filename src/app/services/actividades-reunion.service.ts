import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment";
import { ActaReunion } from '../models/ActaReunion';
import { Actividades } from '../models/actividades';
import { ActividadesAReunion } from '../models/ActividadesAReunion';
import { ActividadesCronograma } from '../models/ActividadesCronograma';

@Injectable({
  providedIn: 'root'
})
export class ActividadesReunionService {

  _url =  environment.URL_APP+'GestionActividadesAReunion'

  private urlCreate: string = this._url+'/CrearActividadesAReunion';
  private urlDelete: string = this._url+'/EliminarActividadesAReunion';
  private urlSearch: string = this._url+'/ListaActividadesAReunion';


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  getActividades(): Observable<ActividadesAReunion[]> {
    return this.http.get(this.urlSearch).pipe(
      map(response => response as ActividadesAReunion[])
    );
  }


  createActividades(doc: ActividadesAReunion): Observable<ActividadesAReunion> {
    return this.http.post<ActividadesAReunion>(`${this.urlCreate}`, doc, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar la actividad', 'error')
        return throwError(e);
      })
    );
  }

  deleteActividades(empid: String): Observable<ActividadesAReunion> {
    return this.http.delete<ActividadesAReunion>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }

}