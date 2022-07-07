import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Empresa } from '../services/empresa';
import { EmpresaService } from '../services/empresa.service';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { Docente } from '../models/Docente';
import { DocenteService } from '../services/docente.service';
import { CarreraService } from '../services/carrera.service';
import { PersonaService } from '../services/persona.service';
import { Carrera } from '../models/Carrera';
import { Persona } from '../models/Persona';

@Component({
  selector: 'app-gestion-docentes',
  templateUrl: './gestion-docentes.component.html',
  styleUrls: ['./gestion-docentes.component.css']
})
export class GestionDocentesComponent implements OnInit {

  dis: boolean;
  docentes : Docente[];
  docente: Docente;
  formDocente: FormGroup;
  formPersona: FormGroup;
  persona: Persona = new Persona();
  carreras : Carrera[];
  carrera :Carrera;

  banpersona :boolean =true;
  bantitulo:boolean =false;

  dropselect: Carrera;
  tipo_d: String;


  showDialogEdit(doc:any):void {

    this.BuscarPersonaCedula( doc.cedula.toString());
    this.dis= true;
    this.docente =doc;

    this.docente.abrevTitulo =doc.abrev_titulo;
    this.tipo_d = doc.carrera;
    this.banpersona=true;
    this.bantitulo=false;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private docenteservice: DocenteService,
    private carreraservice:CarreraService,
    private personaservice : PersonaService
  ) {   }

  ngOnInit(): void {

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

    this.persona  = new Persona();
    this.docente = new Docente();
    this.listaDocentes();
    this.listarCarreras();
  }

  public BuscarPersonaCedula(ced: String): void {
    this.personaservice.getPersonasByCedula(ced).subscribe((resp: any)=>{
      console.log(resp.data)
      this.persona = resp.data[0];
    })

  }

  listarCarreras():void {
    this.carreraservice.getCarreras().subscribe(value => {
      this.carreras=value['data'];
    })
  }

  listaDocentes(){
    this.docenteservice.getDocentes().subscribe((resp: any)=>{
      console.log(resp.data)
      this.docentes = resp.data
    }
    )
  }


  public actualizar(): void {

    if (this.formDocente.invalid) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
      return;
    }

    this.docente.carrera=this.dropselect;

    this.docenteservice.updateDocente(this.docente, this.persona.cedula)
      .subscribe(docente => {

        swal.fire(
          'Docente Guardado',
          `Docente ${this.persona.primerNombre} actualizado con exito!`,
          'success'
        )
        this.dis = false;
        window.location.reload();
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

    this.personaservice.updatePersona(this.persona)
    .subscribe(persona => {
      this.banpersona=false;
    this.bantitulo=true;
    swal.fire(
      'Datos personales',
      `Datos actualizados correctamente!`,
      'success'
    )
    }
  )


  }



  OnChange(ev) {
    if (ev.value == null) {}else{
      this.tipo_d = ev.value.name;
      this.carrera = ev.value;
    }
  }

  editarDocente():void {
    if (this.formDocente.invalid) {
      return;
    }

    this.dis = false;
  }



  eliminarDocente(emp: Docente): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${this.persona.cedula}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.docenteservice.deleteDocente(this.persona.cedula).subscribe(
          response => {
            this.docentes = this.docentes.filter(servi => servi !== emp)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El docente fue eliminado.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El docente no se elimino.',
          'error'
        )
      }
    })
  }

}
