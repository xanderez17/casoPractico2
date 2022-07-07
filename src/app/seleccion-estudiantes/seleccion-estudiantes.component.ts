import { Component, OnInit } from '@angular/core';
import { ConvocatoriaService } from '../services/convocatoria.service';
import { SolicitudAlumnoService } from '../services/solicitud-alumno.service';


@Component({
  selector: 'app-registro-empresas',
  templateUrl: './seleccion-estudiantes.component.html',
  styleUrls: ['./seleccion-estudiantes.css']

})


export class SeleccionEstudiantesComponent implements OnInit {
  public titulo="SELECCIÓN DE ESTUDIANTES";
  public convocatoriaTitulo="CONVOCATORIAS"
  public listaTitulo ="LISTA DE SOLICITUDES"
  public convocatorias: Array<any>=[];
  public solicitudes: Array<any>=[];
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';

  constructor( private convocatoriaService: ConvocatoriaService,private solicitudesalumnoservice : SolicitudAlumnoService) {
    this.verSeleccion="Seleccione una convocatoria";
     }

  ngOnInit(): void {
    this.listarDatos();
    this.listarSolicitudAlumnos();
  }

  public listarDatos(){
    this.convocatoriaService.getConvocatoria().subscribe((resp: any)=>{
      console.log(resp.data)
      this.convocatorias = resp.data
      })
  }

  listarSolicitudAlumnos(){
    this.solicitudesalumnoservice.getSolicitudAlumno().subscribe((resp: any)=>{
      console.log(resp.data)
      this.solicitudes = resp.data
    }
    )
  }

  capturarConvocatoria() {
    this.verSeleccion = this.opcionSeleccionado;
}

}
