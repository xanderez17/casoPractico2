import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Carrera} from "../models/Carrera";
import {environment} from "../../environments/environment";
import {Empleado} from "../models/Empleado";
import {catchError} from "rxjs/operators";
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  headers = new HttpHeaders().append('Content-type', 'application/json');

  constructor(
    private httpClient:HttpClient
  ) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.httpClient.get<Empleado[]>(environment.URL_APP + 'GestionPersonalEmpresa/ListaPersonal');
  }

  getEmpleadosFiltrar(): Promise<any[]> {
    return this.httpClient.get<any[]>(
      environment.URL_APP + `GestionPersonalEmpresa/ListaPersonal`
    ).toPromise();
  }

  getGerente(idEmpresa: string) {
    return this.httpClient.get<any[]>(
      environment.URL_APP+`GestionPersonalEmpresa/ListaGerente/${idEmpresa}`
    ).toPromise();
  }

  createEmpleado(empleado: Empleado, cedula: String, idEmp: number): Observable<Empleado> {
    return this.httpClient
      .post<Empleado>(environment.URL_APP + `GestionPersonalEmpresa/CrearPersonal/${cedula}/${idEmp}` ,empleado)
      .pipe(
        catchError((e) => {
          swal.fire(
            'Error al guardar',
            'NO se puede guardar el empleado',
            'error'
          );
          return throwError(e);
        })
      );
  }

  getEmpresaLogeado(cedula: string) {
    return this.httpClient.get<any[]>(
      environment.URL_APP+`GestionPersonalEmpresa/DevolverEmpresa/${cedula}`
    ).toPromise();
  }

  crearEmpleado(cedula_persona: string, id_empresa: string, empleado): Promise<any> {
    return this.httpClient.post(
      environment.URL_APP + `GestionPersonalEmpresa/CrearPersonal/${cedula_persona}/${id_empresa}`,
      {
        ...empleado
      }, {
        headers: this.headers
      }
    ).toPromise();
  }

  getEmpleadosEmpresa(empresa: number): Promise<any[]>{
    return this.httpClient.get<any[]>(
      environment.URL_APP+`GestionPersonalEmpresa/ListaPersonalEmpresa/${empresa}`
    ).toPromise();
  }

  listarTutoresMios(empresa: number): Promise<any[]>{
    return this.httpClient.get<any[]>(
      environment.URL_APP+`GestionPersonalEmpresa/ListaTutoresEmpresa/${empresa}`
    ).toPromise();
  }

  obtenerEmpleado(cedula: any): Promise<any[]>{
    return this.httpClient.get<any[]>(
      environment.URL_APP+`GestionPersonalEmpresa/ListaPersonalEmp/${cedula}`
    ).toPromise();
  }




}
