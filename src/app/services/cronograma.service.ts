import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CronogramaService {

  headers= new HttpHeaders().append('Content-type','application/json');

  url = environment.URL_APP + 'GestionCronograma/'

  constructor(
    private http: HttpClient
  ) { }

  createCronograma(cronograma): Promise<any> {
    return this.http.post(
      this.url + `CrearCronograma`,
      cronograma, {
        headers: this.headers
      }
    ).toPromise();
  }

  updateActividadesCronograma(id , cronograma){
    return this.http.put<any[]>(
        this.url+`EditarCronograma/${id}`,cronograma, { headers: this.headers }
      ).toPromise();
  }

  getCronogramas() {
    return this.http.get<any[]>(
      this.url+`ListaCronograma`
    ).toPromise();
  }


  deleteCronogramas(id: any): Promise<any[]> {
    return this.http.delete<any[]>(
      this.url + `EliminarCronograma/${id}`
    ).toPromise();
  }

}