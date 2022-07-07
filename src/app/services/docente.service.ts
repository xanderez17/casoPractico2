import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment";
import { Docente } from '../models/Docente';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  _url =  environment.URL_APP+'GestionDocente'

  private urlCreate: string = this._url+'/CrearDocente';
  private urlDelete: string = this._url+'/EliminarDocente';
  private urlUpdate: string = this._url+'/EditarDocente';


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }


  getDocenteCedula(cedula: string) {
    return this.http.get<any[]>(
      environment.URL_APP+`GestionDocente/BuscarDocenteCedula/${cedula}`
    ).toPromise();
  }

  getDocentes(): Observable<Docente[]> {
    return this.http.get(environment.URL_APP+`GestionDocente/ListaDocentes`).pipe(
      map(response => response as Docente[])
    );
  }

  getDocentesGeneral(): Observable<Docente[]> {
    return this.http.get(environment.URL_APP+`GestionDocente/ListaDocentesGeneral`).pipe(
      map(response => response as Docente[])
    );
  }



  createDocente(doc: Docente, ced :String, id : number): Observable<Docente> {
    return this.http.post<Docente>(`${this.urlCreate}/${ced}/${id}`, doc, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar al docente', 'error')
        return throwError(e);
      })
    );
  }

  deleteDocente(empid: String): Observable<Docente> {
    return this.http.delete<Docente>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }

  updateDocente(emp: Docente, ced : String): Observable<Docente> {
    return this.http.put<Docente>(`${this.urlUpdate}/${ced}`, emp, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al actualizar', 'NO se puede actualizar a empresa', 'error')
        return throwError(e);
      })
    );
  }

}
