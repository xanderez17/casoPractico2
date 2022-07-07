import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Carrera} from "../models/Carrera";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import Swal from "sweetalert2";
import {Visita} from "../models/Visita";
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

    _url ='https://backendg1c2.herokuapp.com/GestionCarrera'
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) {
  }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(environment.URL_APP + 'GestionCarrera/ListarCarreras');
  }

  createCarrera(carrera: Carrera): Observable<Carrera> {
    return this.http
      .post<Carrera>(environment.URL_APP + 'GestionCarrera/CrearCarrera', carrera)
      .pipe(
        catchError((e) => {
          swal.fire(
            'Error al guardar',
            'NO se puede guardar la carrera',
            'error'
          );
          return throwError(e);
        })
      );
  }

  updateCarrera(id: String,carrera: Carrera): Observable<Carrera>{
    return this.http.put<Carrera>(`${environment.URL_APP+'GestionCarrera/EditarCarrera'}/
    ${id}`, carrera, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al actualizar', 'NO se puede actualizar la carrera', 'error')
        return throwError(e);
      })
    );
  }


  getCarrerasGestionDocentes(): Promise<any[]> {
    return this.http.get<any[]>(
      this._url+'/ListarCarreras'
    ).toPromise();
  }
}
