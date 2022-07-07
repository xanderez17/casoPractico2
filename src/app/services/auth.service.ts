import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {NuevoUsuario} from "../models/nuevo-usuario";
import {Observable} from "rxjs";
import {LoginUsuario} from "../models/LoginUsuario";
import {JwtDto} from "../models/Jwt-Dto";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = environment.URL_APP+"auth/";


  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any>{
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDto>{
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }


}

