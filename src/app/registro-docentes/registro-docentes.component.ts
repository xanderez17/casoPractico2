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
    
    this.personaservice.createPersona(this.persona).subscribe(
      Response => {
        this.banpersona=false;
        this.bantitulo=true;
        this.BuscarPersonaCedula();
        swal.fire(
          'Datos personales',
          `Persona con CI: ${this.persona.cedula} creada con exito!`,
          'success'
        )
    }
    )
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


}

