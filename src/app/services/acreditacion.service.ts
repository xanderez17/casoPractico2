import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs';
import swal from 'sweetalert2';
import { Acreditacion } from '../models/Acreditacion';


@Injectable({
    providedIn: 'root'
  })

export class AcreditacionService{
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(private http: HttpClient){     
    }


    createAcreditacion(act: Acreditacion): Observable<Acreditacion> {
        return this.http.post<Acreditacion>(`${environment.URL_APP + 'GestionAcreditacion/CrearAcreditacion'}/${act.vinculacion.docente.persona.cedula}/${act.alumno.persona.cedula}`, act, { headers: this.httpHeaders }).pipe(
          catchError(e => {
            swal.fire('Error al guardar', 'NO se puede guardar el informe final', 'error')
            return throwError(e);
          })
        );
      }

      getAcreditacion() {
        let header = new HttpHeaders()
          .set('Type-content', 'aplication/json')
    
        return this.http.get(environment.URL_APP + 'GestionAcreditacion/ListaInformesAcreditados', {
          headers: header
    
        });
      }
}