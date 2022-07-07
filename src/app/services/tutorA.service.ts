import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment";
import { TutorA } from '../models/TutorA';

@Injectable({
  providedIn: 'root'
})
export class TutorAService {

  headers = new HttpHeaders().append('Content-type', 'application/json');
  _url ='https://backendg1c2.herokuapp.com/GestionTutorAcademico';

  constructor(
    private http: HttpClient
  ) {
  }

  getTutoresAcademicos(): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP + `GestionTutorAcademico/ListaTutorAcademico`
    ).toPromise();
  }

  getTutoresAcademicosVista(): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP + `GestionTutorAcademico/ListaTutorAcademicoVista`
    ).toPromise();
  }

  getTutoresAcademicoId(id: number): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP + `GestionTutorAcademico/BuscarTutor/${id}`
    ).toPromise();
  }


  createTutorAcademico(cedulaD: string, cedulaA: string, tutor): Promise<any> {
    return this.http.post(
      environment.URL_APP + `GestionTutorAcademico/CrearTutorAcademico/${cedulaD}/${cedulaA}`,
      {
        ...tutor
      }, {
        headers: this.headers
      }
    ).toPromise();
  }
  createTutor(cedulaD: string, cedulaA: string,doc: TutorA): Observable<TutorA> {
    return this.http.post<TutorA>( environment.URL_APP + `GestionTutorAcademico/CrearTutorAcademico/${cedulaD}/${cedulaA}`, doc, { headers: this.headers }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar al tutor academico', 'error')
        return throwError(e);
      })
    );
  }

  deleteTutorAcademico(id: any): Promise<any[]> {
    return this.http.delete<any[]>(
      environment.URL_APP + `GestionTutorAcademico/EliminarTutorAcademico/${id}`
    ).toPromise();
  }


  getTutorAcademico() {
    let header = new HttpHeaders()
        .set('Type-content', 'aplication/json')

        return this.http.get(this._url+'/ListaTutorAcademico',{
        headers: header

    });
}

}
