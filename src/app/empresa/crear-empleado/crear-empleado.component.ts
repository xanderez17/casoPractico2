import {Component, OnInit} from '@angular/core';
import {Empleado} from "../../models/Empleado";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EmpleadoService} from "../../services/empleado.service";
import {Persona} from "../../models/Persona";
import {TokenService} from "../../services/token.service";
import {PersonaService} from "../../services/persona.service";
import {MessageService} from "primeng/api";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.css']
})
export class CrearEmpleadoComponent implements OnInit {

  empleado: any;
  formEmpleado: FormGroup;
  empresaData: any;
  cedulacorrecta: boolean =false;
  persona: Persona;

  ddopcionesCargo: any = ['Gerente', 'Secretario', 'Empleado', 'Desarrollador'];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private empleadoService: EmpleadoService,
    private tokenservice: TokenService,
    private personaService: PersonaService,
    private _messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.formEmpleado = this.formBuilder.group({
      cedula: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      fechaNac: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', Validators.required],
      cargo: ['', Validators.required],
      abrev_titulo: ['', Validators.required],
    });

    this.devolverEmpresa();
  }


  devolverEmpresa() {
    this.empleadoService.getEmpresaLogeado(this.tokenservice.getUserName()).then(value => {
      this.empresaData = value['data'];
      console.log('empresa', this.empresaData[0].idEmpresa)
    }).catch((err) => {
      console.log('ERROR')
    })
  }


  verficardATOS() {
  
    if (this.formEmpleado.valid) {
      let objetoPersona: any = {
        cedula:"0"+ this.formEmpleado.value.cedula,
        primerNombre: this.formEmpleado.value.primerNombre,
        segundoNombre: this.formEmpleado.value.segundoNombre,
        primerApellido: this.formEmpleado.value.primerApellido,
        segundoApellido: this.formEmpleado.value.segundoApellido,
        fechaNac: this.formEmpleado.value.fechaNac,
        telefono: "0"+ this.formEmpleado.value.telefono,
        direccion: this.formEmpleado.value.direccion,
        correo: this.formEmpleado.value.correo,
      }
      let objetoEmpleado: any = {
        abrev_titulo: this.formEmpleado.value.abrev_titulo,
        cargo: this.formEmpleado.value.cargo
      }

      console.log(objetoEmpleado)
      console.log(objetoPersona)
      this.validarCedula("0"+ this.formEmpleado.value.cedula);
      if(this.cedulacorrecta==true){
        if (this.validarEmail(this.formEmpleado.value.correo)) {
          this.personaService.crearPersona(objetoPersona).then(value => {
            this.empleadoService.crearEmpleado(objetoPersona.cedula, this.empresaData[0].idEmpresa, objetoEmpleado).then(value1 => {
              this.mostarMensajeCorrecto('El empleado fue registrado exitosamente')
              this.formEmpleado.reset();
            })
              .catch((err) => {
                this.personaService.getPersonasByCedula(objetoPersona.cedula).subscribe(value1 => {
                  this.personaService.deletePersona(value1[0].idPersona).then(value2 => {
                    this.mostrarMensajeError('SE CREO PERSONA PERO COMO NO SE CREO PERSONAL SE ELIMINO')
                  })
                })
              })
            console.log(value['mensaje'])
          }).catch((err) => {
            console.log('ERROR AL CREAR PERSONA', err)
            this.mostrarMensajeError('ERROR AL CREAR PERSONA')
          })
        }else{
          Swal.fire('Correo incorrecto','Ingrese un correo electronico valido','error');
          return;
        }
      }else{
        Swal.fire('Cedula incorrecta','Ingrese un numero de cedula valida','error');
        return;
      }
    } else {
      this.mostrarMensajeError('NO ESTAN INGRESADOS TODOS LOS DATOS, VERIFICAR!');
      return;
    }
  }


  validarEmail(email: string):boolean {
    let mailValido = false;
      'use strict';

      var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (email.match(EMAIL_REGEX)){
        mailValido = true;
      }
    return mailValido;
  }

  validarCedula(cedula: String) {
    let cedulaCorrecta = false;
    if (cedula.length == 10) {
      let tercerDigito = parseInt(cedula.substring(2, 3));
      if (tercerDigito < 6) {
        // El ultimo digito se lo considera dígito verificador
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let verificador = parseInt(cedula.substring(9, 10));
        let suma: number = 0;
        let digito: number = 0;
        for (let i = 0; i < (cedula.length - 1); i++) {
          digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
          suma += ((parseInt((digito % 10) + '') + (parseInt((digito / 10) + ''))));
        }
        suma = Math.round(suma);
        if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10) == verificador)) {
          cedulaCorrecta = true;
        } else if ((10 - (Math.round(suma % 10))) == verificador) {
          cedulaCorrecta = true;
        } else {
          cedulaCorrecta = false;
        }
      } else {
        cedulaCorrecta = false;
      }
    } else {
      cedulaCorrecta = false;
    }
    this.cedulacorrecta = cedulaCorrecta;
  }


  //metodos para mensajes en pantalla
  mostrarMensajeError(mensaje: String): void {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Incorrecto: ' + mensaje,
      life: 3000,
    });
  }


  mostarMensajeCorrecto(mensaje: String): void {
    this._messageService.add({
      severity: 'success',
      summary: 'Hecho',
      detail: 'Correcto: ' + mensaje,
      life: 3000,
    });
  }
}
