import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActividadesConvenioService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getActividadesEmpresaConvenio(id_empresa: any): Promise<any[]> {
    return this.http.get<any[]>(
      environment.URL_APP + `GestionActividades/CargarActividadesEmpresa/${id_empresa}`
    ).toPromise();
  }
}
