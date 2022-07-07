import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { evaluacionTE } from '../models/evaluacionTE';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class EvaluacionTEService {
  private url_mater: string = environment.URL_APP;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  getTutorEm() {
    let header = new HttpHeaders().set('Type-content', 'aplication/json');

    return this.http.get(
      environment.URL_APP + 'GestionTutorEmpresarial/ListarTutoresEmp',
      {
        headers: header,
      }
    );
  }

  createEvaluacion(eva: evaluacionTE): Observable<evaluacionTE> {
    return this.http
      .post<evaluacionTE>(
        environment.URL_APP + 'GestionEvaluacionTE/CrearEvaluacion_TE',
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
