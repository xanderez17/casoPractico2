import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { Carrera } from '../models/Carrera';
import { Docente } from '../models/Docente';
import { Persona } from '../models/Persona';
import { CarreraService } from '../services/carrera.service';
import { DocenteService } from '../services/docente.service';
import { PersonaService } from '../services/persona.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-registro-docentes',
  templateUrl: './registro-docentes.component.html',
  styleUrls: ['./registro-docentes.component.css']
})
export class RegistroDocentesComponent implements OnInit {

  docente: Docente = new Docente();
  formDocente: FormGroup;
  formPersona: FormGroup;
  persona: Persona;
  carreras : Carrera[];
  carrera :Carrera;

  cedulacorrecta:boolean =false;
  banpersona :boolean =true;
  bantitulo:boolean =false;

  dropselect: Carrera;
  tipo_d: String;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private docenteservice: DocenteService,
    private carreraservice:CarreraService,
    private personaservice : PersonaService
  ) {  this.listarCarreras(); }

  ngOnInit(): void {
    this.persona  = new Persona();
    this.formDocente = this.formBuilder.group({
      abrevtitulo: ['', Validators.required],
      titulo: ['', Validators.required],
      area: ['', Validators.required],
    });
    this.formPersona = this.formBuilder.group({
      pnombre: ['', Validators.required],
      snombre: ['', Validators.required],
      papellido: ['', Validators.required],
      sapellido: ['', Validators.required],
      cedula: ['', Validators.required],
      correo: ['', Validators.required],
      direccion: ['', Validators.required],
      fechan: ['', Validators.required],
      telefono: ['', Validators.required],
    });
    this.listarCarreras();
    
  }

  public create(): void {

    if (this.formDocente.invalid) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
      return;
    }
    this.docente.carrera=this.carrera;
    console.log(this.docente);
    this.docenteservice.createDocente(this.docente, this.persona.cedula, this.carrera.idCarrera).subscribe(
      
      Response => {
        swal.fire(
          'Docente Guardado',
          `Docente ${this.docente.persona.primerNombre} creado con exito!`,
          'success'
        )
        this.limpiar();
        this.banpersona=true;
        this.bantitulo=false;
      }
    )
    
    
  }
  public SiguienteDatos(): void {
    
    if (this.formPersona.invalid) {
      
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
      return;
    }

    this.validarCedula("0"+this.formPersona.value.cedula);
    if(this.cedulacorrecta){
      
      if (this.validarEmail(this.formPersona.value.correo)) {
           
        this.persona.cedula = "0"+ this.formPersona.value.cedula;
        this.persona.telefono = "0"+this.formPersona.value.telefono;
        this.personaservice.createPersona(this.persona).subscribe(
          Response => {
            this.banpersona=false;
            this.bantitulo=true;
            this.BuscarPersonaCedula();
            swal.fire(
              'Datos personales',
              `Persona con CI: ${"0"+this.persona.cedula} creada con exito!`,
              'success'
            )
        }
        )
      }else{
        swal.fire('Correo incorrecto','Ingrese un correo electronico valido','error');
        return;
      }
    }else{
      swal.fire('Cedula incorrecta','Ingrese un numero de cedula valida','error');
      return;
    }
    
  }

  public BuscarPersonaCedula(): void {
    this.personaservice.getPersonasByCedula(this.persona.cedula).subscribe((resp: any)=>{
      console.log(resp.data)
      this.docente.persona = resp.data[0];
    })

  }

  public limpiar(): void {
    this.docente.abrevTitulo = null;
    this.docente.area = null;
    this.docente.persona = null;
    this.docente.titulo = null;

    this.persona.cedula=null;
    this.persona.correo=null;
    this.persona.direccion=null;
    this.persona.fechaNac=null;
    this.persona.primerApellido=null;
    this.persona.primerNombre=null;
    this.persona.segundoApellido=null;
    this.persona.segundoNombre=null;
    this.persona.telefono=null;
    
  }

  OnChange(ev) {
    if (ev.value == null) {}else{
      this.tipo_d = ev.value.name;
      this.carrera = ev.value;
    }
  }

  listarCarreras():void {
    this.carreraservice.getCarreras().subscribe(value => {
      this.carreras=value['data'];
    })
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


}

