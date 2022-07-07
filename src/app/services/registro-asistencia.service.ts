import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { registroA } from '../models/RegistroAsistencia';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from "../../environments/environment";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})


export class RegistroAsistenciaService {
    _url = 'https://backendg1c2.herokuapp.com/RegistroAsistencia'

    private urlUpdate: string = this._url + '/EditarRegistroAsistencia';

    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(
        private http: HttpClient, private router: Router
    ) { }


    getRegistoAsistencialista() {
        let header = new HttpHeaders()
            .set('Type-content', 'aplication/json')
        return this.http.get(this._url + '/ListaRegAsistencias', {
            headers: header
        });
    }

    updateReAsistencia(reg: registroA): Observable<registroA> {
        return this.http.put<registroA>(`${this.urlUpdate}/${reg.idRegistroAsistencia}`, reg, { headers: this.httpHeaders }).pipe(
            catchError(e => {
                Swal.fire('Error', 'NO se puede subir el documento', 'error')
                return throwError(e);
            })
        );
    }

    createReAsistencia(act: registroA): Observable<registroA> {
        return this.http.post<registroA>(environment.URL_APP + 'RegistroAsistencia/CrearRegistroAsistencia/'+act.alumno.persona.cedula, act, { headers: this.httpHeaders }).pipe(
            catchError(e => {
                Swal.fire('Error al guardar', 'NO se puede guardar registro de asistencia', 'error')
                return throwError(e);
            })
        );
    }

}