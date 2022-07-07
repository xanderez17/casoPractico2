import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { map,catchError } from 'rxjs';
import {environment} from "../../environments/environment";
import { SolicitudAlumno } from '../models/SolicitudAlumno';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SolicitudAlumnoService {

  private url_mater: string =environment.URL_APP;

  private urlCreate: string = this.url_mater+'/GestionSolicitudAlumno/CrearSolicitudAlumno';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getSolicitudAlumno() {
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')
    return this.http.get(environment.URL_APP+'GestionSolicitudAlumno/ListaSolicitudAlumno',{
        headers: header
    });
  }

  createSolicitudAlumno(sol:SolicitudAlumno):Observable<SolicitudAlumno>{
    return this.http.post<SolicitudAlumno>(environment.URL_APP+'GestionSolicitudAlumno/CrearSolicitudAlumno',sol,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        swal.fire('Error al guardar', 'NO se puede guardar registro Alumno', 'error')
        return throwError(e);
      })
    );
  }

  updateSolicitudA(soli: any, id : String): Promise<any[]> {
    return this.http.put<any>(
      `${environment.URL_APP+`GestionSolicitudAlumno/EditarSolicitudAlumno`}/${id}`, soli,{
        headers: this.httpHeaders
      }).toPromise();
  }


  listaSolicitudesAlumnosAprobados(id_empresa:any): Promise<any[]>{
    return this.http.get<any[]>(
      environment.URL_APP+`GestionSolicitudAlumno/ListaSolAlumnosAprobados/${id_empresa}`
    ).toPromise();
  }


}
