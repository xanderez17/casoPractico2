import { Component, OnInit } from '@angular/core';
import { ConvocatoriaService } from '../services/convocatoria.service';
import { SolicitudAlumnoService } from '../services/solicitud-alumno.service';
@Component({
  selector: 'app-consultasppp',
  templateUrl: './consulta-estudiantes-asignados.components.html',
})
export class ConsultasEstudiantesAsignadosComponent implements OnInit {
  public titulo="CONSULTA DE ESTUDIANTES ASIGNADOS";
  public convocatoriaTitulo="CONVOCATORIAS"
  public listaTitulo ="ESTUDIANTES"
  public convocatorias: Array<any>=[];
  public asignados:Array<any>=[];
  usuario:string="";

  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  constructor(private convocatoriaService: ConvocatoriaService, private solicitudalumnoservice : SolicitudAlumnoService ){
    this.verSeleccion="Seleccione una convocatoria";
  }

  ngOnInit(): void {
    this.listarConvocatoria();
    this.listaAlumnosAsignados();
  }

  listarConvocatoria(){
    this.convocatoriaService.getConvocatoria().subscribe((resp: any)=>{
      console.log(resp.data)
      this.convocatorias = resp.data
      })
  }

  listaAlumnosAsignados(){
    this.solicitudalumnoservice.getSolicitudAlumno().subscribe((resp: any)=>{
      console.log(resp.data)
      this.asignados = resp.data
    }
    )
  }


  capturarConvocatoria() {
    this.verSeleccion = this.opcionSeleccionado;
}


}
