import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { CertificadoEmpresa } from '../models/CertificadoEmpresa';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TutorE } from '../models/TutorE';

@Injectable({
    providedIn: 'root'
  })
export class CertificadoEmpresaService{
    _url =  environment.URL_APP+'GestionActaDeReunion'
    private ultCreateCer:string = this._url+'/CrearCertificadoEmpresa';

    _url2 = 'https://backendg1c2.herokuapp.com/RegistroAsistencia'

    private urlUpdate: string = this._url2 + '/EditarRegistroAsistencia';


    
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }


    createCertificado(doc: CertificadoEmpresa): Observable<CertificadoEmpresa> {
        return this.http.post<CertificadoEmpresa>(`${this.ultCreateCer}`, doc, { headers: this.httpHeaders }).pipe(
          catchError(e => {
            Swal.fire('Error al guardar', 'NO se puede guardar el certificado de  empresa', 'error')
            return throwError(e);
          })
        );
      }


      createTuEmpresarial(act: TutorE): Observable<TutorE> {
        return this.http.post<TutorE>(environment.URL_APP + 'GestionTutorEmpresarial/CrearTutorEmpresarial/'+act.personalEmpresa.persona.cedula+'/'+act.alumno.persona.cedula, act, { headers: this.httpHeaders }).pipe(
            catchError(e => {
                Swal.fire('Error al guardar', 'NO se puede guardar registro de tutor', 'error')
                return throwError(e);
            })
        );
    }


      updateReAsistencia(reg: TutorE): Observable<TutorE> {
        alert(reg.idTutorEmpresarial);
        return this.http.put<TutorE>(`${this.urlUpdate}/${reg.idTutorEmpresarial}`, reg, { headers: this.httpHeaders }).pipe(
            catchError(e => {
                Swal.fire('Error', 'NO se puede subir el documento', 'error')
                return throwError(e);
            })
        );
    }



}