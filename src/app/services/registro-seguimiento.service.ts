import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroSeguimiento } from '../models/Registro-seguimiento';
import { TutorE } from '../models/TutorE';

@Injectable({
  providedIn: 'root'
})
export class RegistroSeguimientoService {

    _url ='https://backendg1c2.herokuapp.com:443/GestionActividades_Cronograma';
    _urlt='https://backendg1c2.herokuapp.com:443/GestionTutorEmpresarial/ListarTutoresEmp';
    
  

  constructor(
    private http: HttpClient
  ) { }

  getActividades_Cronograma():Promise<any>{
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')
    return this.http.get<any>(this._url+'/ListaActividades_Cronograma',{
        headers: header
    }).toPromise();
  }
  postActividades_Cronograma(){
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')
    return this.http.post(this._url+'/CrearActividades_Cronograma',{
        headers: header
    });
  }
  
  getTutoresE():Observable<TutorE[]>{
    let header = new HttpHeaders()
    .set('Type-content','aplication/json')
    return this.http.get<TutorE[]>(this._urlt,{
        headers: header
    });
  
  }
}
