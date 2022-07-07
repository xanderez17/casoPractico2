import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment";
import { ActaReunion } from '../models/ActaReunion';
import { Actividades } from '../models/actividades';
import { ActividadesCronograma } from '../models/ActividadesCronograma';
import { Asignatura } from '../models/Asignatura';

@Injectable({
  providedIn: 'root'
})
export class AsignaturasService {

  _url =  environment.URL_APP+'GestionAsignaturas'

  private urlCreate: string = this._url+'/CrearAsignaturas';
  private urlDelete: string = this._url+'/EliminarAsignaturas';
  private urlSearch: string = this._url+'/ListaAsignaturas';


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get(this.urlSearch).pipe(
      map(response => response as Asignatura[])
    );
  }


  createAsignaturas(doc: Asignatura): Observable<Asignatura> {
    return this.http.post<Asignatura>(`${this.urlCreate}`, doc, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar la Asignaturas', 'error')
        return throwError(e);
      })
    );
  }

  deleteAsignaturas(empid: String): Observable<Asignatura> {
    return this.http.delete<Asignatura>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }

}