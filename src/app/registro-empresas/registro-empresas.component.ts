import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Empresa } from '../services/empresa';
import { EmpresaService } from '../services/empresa.service';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { PersonaService } from '../services/persona.service';
import { EmpleadoService } from '../services/empleado.service';
import { Persona } from '../models/Persona';
import { Empleado } from '../models/Empleado';

@Component({
  selector: 'app-registro-empresas',
  templateUrl: './registro-empresas.component.html',
  styleUrls: ['./registro-empresas.component.css']
})
export class RegistroEmpresasComponent implements OnInit {

  empresa: Empresa = new Empresa();
  formEmpresa: FormGroup;
  formEmpleado: FormGroup;

  empleado: Empleado = new Empleado();
  empresaData: any;
  persona: Persona = new Persona();

  rempleado: boolean;
  ddopcionesCargo: any = ['Gerente'];
  cedulacorrecta :boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private empresaservice: EmpresaService,
    private _messageService: MessageService,
    private personaService: PersonaService,
    private empleadoService: EmpleadoService
  ) { }

  ngOnInit(): void {
    this.rempleado=false;

    this.formEmpresa = this.formBuilder.group({
      ruc: ['', Validators.required],
      empresa: ['', Validators.required],
      mision: ['', Validators.required],
      vision: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      naturaleza: ['', Validators.required]
    });

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

      abrev_titulo: ['', Validators.required]
    });

  }

  public create(): void {

    if (this.formEmpresa.invalid) {

      console.log("ERROR AL CREAR EMPRESA")
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
      return;
    }
    this.empresaservice.createEmpresa(this.empresa).subscribe(
      Response => {
        this.empresaData = Response['data']
        console.log(this.empresa);

        swal.fire(
          'Empresa Guardada',
          `Empresa ${this.empresa.nombreEmpresa} creada con exito!`,
          'success'
        )
        this.dialogGerente()
      }
    )


  }

  public limpiar(): void {
    this.empresa.direccion = null;
    this.empresa.idEmpresa = null;
    this.empresa.mision = null;
    this.empresa.vision = null;
    this.empresa.ruc = null;
    this.empresa.telefono = null;
    this.empresa.direccion = null;
    this.empresa.nombreEmpresa = null;

  }

  dialogGerente(){
    this.rempleado = true
  }

  public verficardATOS() {
    console.log("INGRESA METODO")
    if (this.formEmpleado.valid) {
      console.log("FORM VALIDO")

      this.validarCedula("0"+this.formEmpleado.value.cedula);
      if(this.cedulacorrecta){
        if (this.validarEmail(this.formEmpleado.value.correo)) {
          this.persona.cedula = "0"+ this.formEmpleado.value.cedula;
          this.persona.telefono = "0"+this.formEmpleado.value.telefono;
          this.empresa.ruc = "0"+ this.formEmpresa.value.ruc;
          this.personaService.crearPersona(this.persona).then(value => {
            console.log(this.persona)
            console.log(this.empleado);
            this.empleado.cargo="gerente"
            this.empleadoService.crearEmpleado(this.persona.cedula, this.empresaData[0].idEmpresa, this.empleado).then(value1 => {
              this.mostarMensajeCorrecto('El empleado fue registrado exitosamente')
              this.formEmpleado.reset();
              this.rempleado = false
            })
              .catch((err) => {
                this.personaService.getPersonasByCedula(this.persona.cedula).subscribe(value1 => {
                  var personael = value1 ['data']
                  this.personaService.deletePersona(personael[0].idPersona).then(value2 => {
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
          swal.fire('Correo incorrecto','Ingrese un correo electrónico valido','error');
          return;
        }
      }else{
        swal.fire('Cedula incorrecta','Ingrese un numero de cedula valida','error');
        return;
      }
    } else {
      console.log("FORM INVALIDO");

      this.mostrarMensajeError('NO ESTAN INGRESADOS TODOS LOS DATOS, VERIFICAR!')
    }

    this.limpiar()
  }

  mostrarMensajeError(mensaje: String): void {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Incorrecto: ' + mensaje,
      life: 3000,
    });
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


  mostarMensajeCorrecto(mensaje: String): void {
    this._messageService.add({
      severity: 'success',
      summary: 'Hecho',
      detail: 'Correcto: ' + mensaje,
      life: 3000,
    });
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
}
