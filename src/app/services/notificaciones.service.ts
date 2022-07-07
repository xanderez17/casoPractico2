import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  headers= new HttpHeaders().append('Content-type','application/json');

  url = environment.URL_APP + 'GestionNotificaciones/'

  constructor(
    private http: HttpClient
  ) { }

  getNotificaciones() {
    return this.http.get<any[]>(
      this.url+`ListaNotificaciones`
    ).toPromise();
  }


  deleteNotificacion(id: any): Promise<any[]> {
    return this.http.delete<any[]>(
      this.url + `EliminarNotificaciones/${id}`
    ).toPromise();
  }

}