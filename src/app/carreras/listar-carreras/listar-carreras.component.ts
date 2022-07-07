import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Carrera } from 'src/app/models/Carrera';
import { Docente } from 'src/app/models/Docente';
import { CarreraService } from 'src/app/services/carrera.service';
import { DocenteService } from 'src/app/services/docente.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-listar-carreras',
  templateUrl: './listar-carreras.component.html',
  styleUrls: ['./listar-carreras.component.css']
})
export class ListarCarrerasComponent implements OnInit {

  carreras: Carrera[];
  docentes: any[];
  cols: any[];
  //DIALOGS
  coordinador: boolean;
  editar: boolean;

  
  carrera = new Carrera();
  docente: any;
  formCarrera: FormGroup;
  refresh:boolean =true;

  constructor(
    private carreraService: CarreraService,
    private formBuilder: FormBuilder,
    private docenteService: DocenteService
    ) {
    this.formCarrera = this.formBuilder.group({
      nombre: ['', Validators.required],
      abreviatura: ['', Validators.required],
      modalidad: ['', Validators.required],
      duracion: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.editar = false;
    this.coordinador = false;
    this.getCarreras();
    this.getDocentes();
    this.cols = [
      {field: 'idCarrera', header: 'ID Carrera'},
      {field: 'nombre', header: 'Nombre'},
      {field: 'abreviatura', header: 'Abreviatura'},
      {field: 'modalidad', header: 'Modalidad'},
      {field: 'duracion', header: 'Duración'},
      {field: 'acciones', header: 'Acciones'},
      {field: 'coordinador', header: 'Coordinador de Carrera'}
    ];


  }

  getCarreras(){
    this.carreraService.getCarreras().subscribe((resp: any)=>{
      console.log("CARRERAS")
      console.log(resp.data)
      this.carreras = resp.data
    })
  }
  getDocentes(){
    this.docenteService.getDocentesGeneral().subscribe((resp: any)=>{
      console.log("DOCENTES")
      console.log(resp.data)
      this.docentes = resp.data
    })
  }

  showDialogEdit(carrera: any){
      this.editar=true;
      this.carrera=carrera;
  }

  showDialogDocente(carrera: any){
    this.getDocentes();
    this.coordinador=true;
    this.carrera=carrera
}

  seleccionarDocente(docente:any){
    this.docente=docente;
    console.log("SE ASIGNO DOCENTE")
    this.docente.coordinador = true
    console.log(this.docente.coordinador)
    this.docenteService.updateDocente(this.docente,this.docente.persona.cedula).subscribe(
      res => {
        console.log("edicion docente")
        console.log(Response)
        swal.fire(
          'Docente Guardado',
          `Docente ${this.carrera.nombre} editado con exito!`,
          'success'
        )
      }
    )

    
    this.coordinador=false;
    //window.location.reload();

    //this.docenteService.updateDocente(docente,docente.persona.cedula)
    
  }

  updateCarrera(){  
    if (this.formCarrera.invalid) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacíos',
        'error'
      )
      this.carrera=new Carrera();
      
      return;
    }
    this.carreraService.updateCarrera(this.carrera.idCarrera,this.carrera).subscribe(
      Response => {
        console.log("edicion carrera")
        console.log(Response)
        swal.fire(
          'Carrera Guardada',
          `Carrera ${this.carrera.nombre} editada con exito!`,
          'success'
        )
        
      }
    )
    this.updateVisibility();
    this.editar=false
    this.carrera=new Carrera();
    
  }

  updateVisibility(): void {
    this.refresh = false;
    setTimeout(() => this.refresh = true, 0);
  }
  

}
