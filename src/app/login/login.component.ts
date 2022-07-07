import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {TokenService} from "../services/token.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {LoginUsuario} from "../models/LoginUsuario";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  username: string;
  password: string;
  roles: string[] = [];
  errMsj: string;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private changeDedectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.changeDedectionRef.detectChanges();
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void{
    this.loginUsuario = new LoginUsuario(this.username, this.password);
    this.authService.login(this.loginUsuario).subscribe(data =>{
      this.isLogged = true;
      this.isLoginFail = false;

      this.tokenService.setToken(data.token);
      this.tokenService.setUserName(data.username);
      this.tokenService.setAuthorities(data.authorities);
      this.roles = data.authorities;
  
      
      window.location.replace('/')
    },
      err => {
      this.isLogged = false;
      this.isLoginFail = true;
      this.errMsj = err.error.message;
      // console.log(err.error.message);
      }
    );
  }

}

