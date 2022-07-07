import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ActaReunionService {

    _url ='https://backendg1c2.herokuapp.com/GestionActaDeReunion';
    
    
    constructor(
        private http: HttpClient
    ) { }

    getActaReunion() {
        let header = new HttpHeaders()
            .set('Type-content', 'aplication/json')

            return this.http.get(this._url+'/ListaActaDeReunion',{
            headers: header

        });
    }

}
