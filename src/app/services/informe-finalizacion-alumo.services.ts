import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InformeFinal } from '../models/InformeFinal';
import { environment } from "../../environments/environment";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})


export class InformeFinalAlumnoService {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  _url = 'https://backendg1c2.herokuapp.com/GestionInformeFinal'
  private url_mater: string = environment.URL_APP;
  private urlDelete: string = this.url_mater + 'GestionInformeFinal/EliminarInformeFinal';

  constructor(
    private http: HttpClient
  ) { }

  getInformeFinalAlumno() {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + '/ListaInformeFinal', {
      headers: header

    });
  }

  getInformeFinalparaAcreditacion() {
    let header = new HttpHeaders()
      .set('Type-content', 'aplication/json')

    return this.http.get(this._url + '/ListaInformesEstudiantes', {
      headers: header

    });
  }



  deleteInformeFinal(empid: number): Observable<InformeFinal> {
    return this.http.delete<InformeFinal>(`${this.urlDelete}/${empid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al eliminar', 'No se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }


  createInformeFinal(act: InformeFinal): Observable<InformeFinal> {
    return this.http.post<InformeFinal>(environment.URL_APP + 'GestionInformeFinal/CrearInformeFinal', act, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al guardar', 'NO se puede guardar el informe final', 'error')
        return throwError(e);
      })
    );
  }


}
