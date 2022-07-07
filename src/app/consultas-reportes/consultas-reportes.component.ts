import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Alumno } from '../models/Alumno';
import { AlumnosService } from '../services/alumnos.service';
import { Empresa } from '../services/empresa';
import { EmpresaService } from '../services/empresa.service';

@Component({
  selector: 'app-consultas-reportes',
  templateUrl: './consultas-reportes.component.html',
  styleUrls: ['./consultas-reportes.component.css']
})
export class ConsultasReportesComponent implements OnInit {

  drop: ingresoDrop[];
  dropselect: ingresoDrop;
  tipo_d: String;

  banEmpresas :boolean;
  banAlumnos:boolean;
  banTutores :boolean;

  empresa: Empresa = new Empresa();
  empresas : Empresa[];
  cols: any[];

  dataAlumnos: any[] ;
  colsalumnos: any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private empresaservice: EmpresaService,
    private _alumnoCrud: AlumnosService,
  ) {
    this.tipo_d = "Empresas";
  }

  ngOnInit(): void {
    this.drop = [{ name: 'Empresas' }, { name: 'Estudiantes' }, { name: 'Tutores' }];
    this.dropselect = this.drop[0];
    this.cargarDatos(this.dropselect.name);
    this.cols = [
      { field: 'ruc', header: 'Ruc' },
      { field: 'nombreEmpresa', header: 'Empresa' },
      { field: 'vision', header: 'Vision' },
      { field: 'mision', header: 'Mision' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Dirección' }
    ];
    this.listarEmpresas();
    this.colsalumnos=[
      {field:'cedula',header:'Cedula'},
      {field:'primer_nombre',header:'Primer nombre'},
      {field:'segundo_nombre',header:'Segundo Nombre'},
      {field:'primer_apellido',header:'Primer apellido'},
      {field:'segundo_apellido',header:'Segundo Apellido'},
      {field:'correo',header:'Correo'},
      {field:'ciclo',header:'Ciclo'},
      {field:'paralelo',header:'Paralelo'},
      {field:'promedio',header:'Promedio'}

    ];

    this.obtenerAlumnos();
  }

  obtenerAlumnos():void{
    this._alumnoCrud.getAlumnos().then(value => {
      this.dataAlumnos=value['data'];
      console.log(this.dataAlumnos)
    })
  }

  OnChange(ev) {
    if (ev.value == null) {}else{
      this.cargarDatos(ev.value.name);
      this.tipo_d = ev.value.name;
    }
  }

  /* ----  Filtrar por Tipo  ------------ */
  cargarDatos(tipo: string) {
    switch (tipo) {
      case "Empresas" : this.banEmpresas=true;this.banAlumnos=false;  this.banTutores=false; break;
      case "Estudiantes": this.banEmpresas=false;this.banAlumnos=true;  this.banTutores=false; break;
      case "Tutores":  this.banEmpresas=false;this.banAlumnos=false;  this.banTutores=true; break;
    }
  }

  listarEmpresas():void {
    this.empresaservice.getEmpresas().then(value => {
      this.empresas=value['data'];
      console.log(this.empresas)
    })
  }

}

interface ingresoDrop {
  name: string;
}
