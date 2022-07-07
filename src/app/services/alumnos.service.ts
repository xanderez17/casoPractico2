import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  headers= new HttpHeaders().append('Content-type','application/json');

  constructor(
    private http: HttpClient
  ) { }

  getAlumnos(): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP+'GestionAlumno/ListaAlumnos'
    ).toPromise();
  }

  getAlumnosST(): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP+'GestionAlumnoSTA/ListaAlumnos'
    ).toPromise();
  }

  getAlumnoCedula(cedula: string) {
    return this.http.get<any>(
      environment.URL_APP+`GestionAlumno/BuscarAlumnoCedula/${cedula}`
    ).toPromise();
  }

  getAlumnoByCedula(cedula: any) {
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')

    return this.http.get(environment.URL_APP+`GestionAlumno/BuscarAlumnoCedula/${cedula}`,{
        headers: header

    });
  }

  getlistaAlumnos() {
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')

    return this.http.get(environment.URL_APP+'GestionAlumno/ListaDatosAlumnos',{
        headers: header

    });
  }

  getDetalleAlumnos(){
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')

    return this.http.get(environment.URL_APP+'GestionAlumno/ListaAlumnos',{
        headers: header

    });
  }
  
}
