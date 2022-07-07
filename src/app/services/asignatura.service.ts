import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  _url ='https://backendg1c2.herokuapp.com/GestionAnexo9'

  constructor(
    private http: HttpClient
  ) { }

  getAsignaturas(): Promise<any[]>{
    return this.http.get<any>(
      environment.URL_APP+`GestionAsignaturas/ListaAsignaturas`
    ).toPromise();
  }

}
