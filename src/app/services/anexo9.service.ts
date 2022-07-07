import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
  export class Anexo9Service {

      _url ='https://backendg1c2.herokuapp.com/GestionAnexo9'

    constructor(
      private http: HttpClient
    ) { }

    getAnexo9lista() {
      let header = new HttpHeaders()
      .set('Type-content','aplication/json')
      return this.http.get(this._url+'/ListaAnexo9',{
          headers: header
      });
    }

  }