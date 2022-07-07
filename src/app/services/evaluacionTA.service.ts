import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { evaluacionTA } from '../models/evaluacionTA';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class EvaluacionTAService {
  private url_mater: string = environment.URL_APP;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  getTutorA() {
    let header = new HttpHeaders().set('Type-content', 'aplication/json');

    return this.http.get(
      environment.URL_APP + 'GestionTutorAcademico/ListaTutorAcademico',
      {
        headers: header,
      }
    );
  }

  createEvaluacion(eva: evaluacionTA): Observable<evaluacionTA> {
    return this.http
      .post<evaluacionTA>(
        environment.URL_APP + 'GestionActividades/CrearEvaluacion_TA',
        eva,
        { headers: this.httpHeaders }
      )
      .pipe(
        catchError((e) => {
          swal.fire(
            'Error al guardar',
            'NO se puede guardar registro Alumno',
            'error'
          );
          return throwError(e);
        })
      );
  }
}
