import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ResponsablepppService {

  headers = new HttpHeaders().append('Content-type', 'application/json');

  constructor(
    private http: HttpClient
  ) {
  }

  getResponsables(): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP + `GestionResponsablePPP/ListarResponsablesVista`
    ).toPromise();
  }


}
