import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Persona } from '../models/Persona';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  _url1 = 'https://backendg1c2.herokuapp.com/GestionPersona'
  _url = environment.URL_APP+'GestionPersona'
  private urlCreate: string = this._url+'/CrearPersona';
  private urlUpdate: string = this._url+'/EditarPersona';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient
  ) {
  }

  getPersonasByCedula(cedula: any) {
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')

    return this.http.get(this._url+'/PersonaByCedula/'+cedula,{
        headers: header

    });
  }



  createPersona(pers: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.urlCreate, pers, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al guardar', 'NO se puede guardar a la persona', 'error')
        return throwError(e);
      })
    );
  }

  updatePersona(emp: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.urlUpdate}/${emp.idPersona}`, emp, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire('Error al actualizar', 'No se puede actualizar a la persona', 'error')
        return throwError(e);
      })
    );
  }

  crearPersona(persona: any): Promise<any> {
    return this.http.post(
      environment.URL_APP + `GestionPersona/CrearPersona`,
      {
        ...persona
      }, {
        headers: this.httpHeaders
      }
    ).toPromise();
  }

  deletePersona(id: any): Promise<any[]> {
    return this.http.delete<any[]>(
      environment.URL_APP + `GestionPersona/EliminarPersona/${id}`
    ).toPromise();
  }

  getForPersona(cedula: any): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP + `GestionPersona/PersonaByCedula/${cedula}`
    ).toPromise();
  }

  getPersonaTodo() {
    let header = new HttpHeaders()
        .set('Type-content', 'aplication/json')
    return this.http.get(this._url1 + '/ListaPersonas', {
        headers: header
    });
}

}
