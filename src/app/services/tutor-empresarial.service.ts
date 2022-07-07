import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TutorEmpresarialService {

  _url = 'https://backendg1c2.herokuapp.com/GestionTutorEmpresarial';
  headers = new HttpHeaders().append('Content-type', 'application/json');


  constructor(
    private http: HttpClient
  ) {
  }

  getTutorEmpresarial() {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + '/ListarTutoresEmp', {
      headers: header

    });
  }

  createTutorEmpresarial(cedulaT: string, cedulaA: string, tutor): Promise<any> {
    return this.http.post(
      environment.URL_APP + `GestionTutorEmpresarial/CrearTutorEmpresarial/${cedulaT}/${cedulaA}`,
      {
        ...tutor
      }, {
        headers: this.headers
      }
    ).toPromise();
  }

  deleteTutorEmpresarial(id: any): Promise<any[]> {
    return this.http.delete<any[]>(
      environment.URL_APP + `GestionTutorEmpresarial/EliminarTutorEmpresarial/${id}`
    ).toPromise();
  }

}
