import {Component, OnInit} from '@angular/core';
import {Carrera} from "../../models/Carrera";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CarreraService} from "../../services/carrera.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-crear-carrera',
  templateUrl: './crear-carrera.component.html',
  styleUrls: ['./crear-carrera.component.css']
})
export class CrearCarreraComponent implements OnInit {

  carrera = new Carrera();
  formCarrera: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private carreraService: CarreraService
  ) {
    this.formCarrera = this.formBuilder.group({
      nombre: ['', Validators.required],
      abreviatura: ['', Validators.required],
      modalidad: ['', Validators.required],
      duracion: ['', Validators.required]
    });
  }

  ngOnInit(): void {


  }

  crearCarrera(): void {
    if (this.formCarrera.invalid) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacíos',
        'error'
      )
      return;
    }
    this.carreraService.createCarrera(this.carrera).subscribe(
      Response => {
        swal.fire(
          'Carrera Guardada',
          `Empresa ${this.carrera.nombre} creada con exito!`,
          'success'
        )
        this.limpiar()
      }
    )


  }

  limpiar(): void {
    this.carrera.nombre = null;
    this.carrera.abreviatura = null;
    this.carrera.modalidad = null;
    this.carrera.duracion = null;
    this.carrera.idCarrera = null;
  }

}
