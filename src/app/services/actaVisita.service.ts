import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {Empresa} from "./empresa";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})

class Acta{
id
}

export class actaVisitaService {




  headers = new HttpHeaders().append('Content-type', 'application/json');
  private url_mater: string =environment.URL_APP;

  private urlCreate: string = this.url_mater+'/GestionActaDeReunion/CrearActaDeReunion';
  private urlDelete: string = this.url_mater+'/GestionActaDeReunion/CrearActaDeReunion';
  private urlUpdate: string = this.url_mater+'/GestionActaDeReunion/EditarActaDeReunion/{id}';
  private urlSearch: string = this.url_mater+'/GestionActaDeReunion/EliminarActaDeReunion/{id}';

  constructor(private http: HttpClient, private router: Router) {
  }

  getActa(): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP+'GestionActaDeReunion/CrearActaDeReunion'
    ).toPromise();
  }

  createActa(act: Acta): Observable<Empresa> {
    return this.http.post<Empresa>(this.urlCreate, emp, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al guardar', 'NO se puede guardar a la empresa', 'error')
        return throwError(e);
      })
    );
  }
}
