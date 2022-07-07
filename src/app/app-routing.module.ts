import {Component, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {PagenotfoundComponent} from './components/pagenotfound/pagenotfound.component';
import {ConsultaspppComponent} from './consultasppp/consultasppp.component';
import {LoginComponent} from './login/login.component';
import {RegistroDocentesComponent} from './registro-docentes/registro-docentes.component';
import {RegistroEmpresasComponent} from './registro-empresas/registro-empresas.component';
import {SeleccionEstudiantesComponent} from './seleccion-estudiantes/seleccion-estudiantes.component';
import {ConsultaConvocatoriaComponent} from './consulta-convocatoria/consulta-convocatoria.component';
import {DesigTutorAcademicoComponent} from './desig-tutor-academico/desig-tutor-academico.component';
import {DesigTutorEmpresarialComponent} from './desig-tutor-empresarial/desig-tutor-empresarial.component';
import {ConsultasEstudiantesAsignadosComponent} from './consulta-estudiantes-asignados/consulta-estudiantes-asignados.components';
import {GestionEmpresaComponent} from './gestion-empresa/gestion-empresa.component';
import {RegistroAsistenciaComponent} from './registro-asistencia/registro-asistencia.component';
import {SolicitudEstudianteComponent} from './solicitud-estudiante/solicitud-estudiante.component';
import {RegistroVisitaComponent} from './registro-visita/registro-visita.component';
import {ConsultasReportesComponent} from './consultas-reportes/consultas-reportes.component';
import {InformeFinalAlumnoComponent} from './informe-finalizacion-alumno/informe-finalizacion-alumo.components';
import { EvaluacionEstudianteTutorEmpresarialComponent} from './evaluacion-estudiante-tutor-empresarial/evaluacion-estudiante-tutor-empresarial.components';
import {AnexosdePPPComponent} from './anexosde-ppp/anexosde-ppp.component';
import {ActaReunionComponent} from './acta-reunion/acta-reunion.component';
import {RegistroConvocatoriaComponent} from './registro-convocatoria/registro-convocatoria.component';
import {CertificadoAlumnoComponent} from './certificado-alumno/certificado-alumno.components';
import {RegistroSeguimientoAlumnoComponent} from './registro-seguimiento/registro-seguimiento.components';
import {
  EvaluacionEstudianteTutorAcademicoComponent
} from './evaluacion-estudiante-tutor-academico/evaluacion-estudiante-tutor-academico.component';
import {
  InformeFinalTutorAcademicoComponent
} from './informe-final-tutor-academico/informe-final-tutor-academico.component';
import {GestionVisitasComponent} from './gestion-visitas/gestion-visitas.component';
import {CrearActaComponent} from './crear-acta/crear-acta.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ConsultaEstadoComponent} from './consulta-estado/consulta-estado.component';
import {ProdGuardService as guard} from './guards/prod-guard.service';
import {ListaResponsablepppComponent} from './lista-responsableppp/lista-responsableppp.component';
import {CrearCarreraComponent} from "./carreras/crear-carrera/crear-carrera.component";
import {ListarCarrerasComponent} from "./carreras/listar-carreras/listar-carreras.component";
import {GestionDocentesComponent} from './gestion-docentes/gestion-docentes.component';
import {SolicitudEmpresaComponent} from "./solicitud-empresa/solicitud-empresa.component";
import {HistorialComponent} from "./historial/historial.component";
import {CrearEmpleadoComponent} from "./empresa/crear-empleado/crear-empleado.component";
import {ConsultaConvPublicoComponent} from './consulta-conv-publico/consulta-conv-publico.component';
import {InformeAcreditacionComponent} from './informe-acreditacion/informe-acreditacion.component';
import {GestionConvocatoriaComponent} from "./responsable/gestion-convocatoria/gestion-convocatoria.component";
import { NotificacionCronogramaComponent } from './notificacion-cronograma/notificacion-cronograma.component';
import {
  GenerarCertificadoEmpresaComponent
} from "./tutor-empresarial/generar-certificado-empresa/generar-certificado-empresa.component";
import { RegistroSeguimientoService } from './services/registro-seguimiento.service';
import { ConsultaRegistroAsistenciaComponent } from './consulta-registro-asistencia/consulta-registro-asistencia.component';
import { ListaConvocatoriasComponent} from './responsable/lista-convocatorias/lista-convocatorias.component';

const routes: Routes = [
  {path: '', component:DashboardComponent},
  {path: 'consulta-conv-publico', component: ConsultaConvPublicoComponent},
   {path: 'informe-acreditacion/:cedula', component:InformeAcreditacionComponent},
  {path: 'anexosde-ppp', component: AnexosdePPPComponent},
  {path: 'registro-docente', component: RegistroDocentesComponent},
  {path: 'registro-empresa', component: RegistroEmpresasComponent},
  {path: 'seleccion-estudiantes', component: SeleccionEstudiantesComponent},
  {path: 'consultasppp', component: ConsultaspppComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'notificacion-tutor-academico', component: NotificacionCronogramaComponent },
  //KevinAche
  {path: 'dashboard', component: DashboardComponent},
  {path: 'crear-carrera', component: CrearCarreraComponent},
  {path: 'listar-carreras', component: ListarCarrerasComponent},
  {path: 'consulta-convocatoria', component: ConsultaConvocatoriaComponent},
  {path: 'crear-empleado', component: CrearEmpleadoComponent},
  {path: 'gestion-convocatoria', component: GestionConvocatoriaComponent},
  {path: 'cons-est-asignados', component: ConsultasEstudiantesAsignadosComponent},
  {path: 'gestion-empresa', component: GestionEmpresaComponent},
  {path: 'registro-asistencia/:cedula', component: RegistroAsistenciaComponent},
  {path: 'seleccion-estudiantes', component: SeleccionEstudiantesComponent},
  {path: 'consulta-convocatoria', component: ConsultaConvocatoriaComponent},
  {path: 'generar-certificado-empresa', component: GenerarCertificadoEmpresaComponent},
  {
    path: 'cons-est-asignados',
    component: ConsultasEstudiantesAsignadosComponent,
  },
  {path: 'gestion-empresa', component: GestionEmpresaComponent},
  {path: 'registro-asistencia', component: RegistroAsistenciaComponent},
  {path: 'desig-tutor-academico', component: DesigTutorAcademicoComponent},
  {path: 'solicitud-estudiante', component: SolicitudEstudianteComponent},
  {path: 'registro-visita', component: RegistroVisitaComponent},
  {path: 'consultas-reportes', component: ConsultasReportesComponent},
  {path: '', component: HomeComponent},
  {path: 'registro-docente', component: RegistroDocentesComponent},
  {path: 'registro-empresa', component: RegistroEmpresasComponent},
  {path: 'seleccion-estudiantes', component: SeleccionEstudiantesComponent},
  {path: 'consultasppp', component: ConsultaspppComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'consulta-convocatoria', component: ConsultaConvocatoriaComponent},
  { path: 'gestion-empresa', component: GestionEmpresaComponent },
  { path: 'registro-asistencia', component: RegistroAsistenciaComponent },
  { path: 'desig-tutor-academico', component: DesigTutorAcademicoComponent },
  {
    path: 'desig-tutor-empresarial',
    component: DesigTutorEmpresarialComponent,
  },
  //vero
  {path: 'consulta-registro-asistencia',component: ConsultaRegistroAsistenciaComponent},
  { path: 'solicitud-estudiante', component: SolicitudEstudianteComponent },
  { path: 'registro-visita', component: RegistroVisitaComponent },
  { path: 'consultas-reportes', component: ConsultasReportesComponent },
  { path: '', component: HomeComponent },
  { path: 'registro-docente', component: RegistroDocentesComponent },
  { path: 'registro-empresa', component: RegistroEmpresasComponent },
  { path: 'seleccion-estudiantes', component: SeleccionEstudiantesComponent },
  { path: 'consultasppp', component: ConsultaspppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'consulta-convocatoria', component: ConsultaConvocatoriaComponent },
  {
    path: 'cons-est-asignados',
    component: ConsultasEstudiantesAsignadosComponent,
  },
  {path: 'gestion-empresa', component: GestionEmpresaComponent},
  {path: 'registro-asistencia', component: RegistroAsistenciaComponent},

  {path: 'desig-tutor-academico', component: DesigTutorAcademicoComponent},
  {path: 'desig-tutor-empresarial', component: DesigTutorEmpresarialComponent},
  {path: 'solicitud-estudiante/:rol/:cedula', component: SolicitudEstudianteComponent},
  {path: 'registro-visita', component: RegistroVisitaComponent},
  {path: 'consultas-reportes', component: ConsultasReportesComponent},
  {
    path: 'desig-tutor-academico',
    component: DesigTutorAcademicoComponent,
    canActivate: [guard],
    data: { expectedRol: ['admin'] },
  },
  {path: 'solicitud-estudiante', component: SolicitudEstudianteComponent},
  {path: 'registro-visita', component: RegistroVisitaComponent},
  {path: 'consultas-reportes', component: ConsultasReportesComponent},
  {path: 'consulta-estado', component: ConsultaEstadoComponent},
  //Franklin
  {path: 'registro-convocatoria', component: RegistroConvocatoriaComponent},
  {path: 'inf-fin-alumno/:cedula', component: InformeFinalAlumnoComponent},
  {path: 'acta-reunion', component: ActaReunionComponent},
  {path: 'crear-acta', component: CrearActaComponent},
  {path: 'acta-reunion', component: ActaReunionComponent},
  {path: 'reg-seg-alumno', component: RegistroSeguimientoAlumnoComponent},
  {path: 'cert-alumno', component: CertificadoAlumnoComponent},

  //Liss
  {path: 'evaluacion-estudiante-tutor-academico', component: EvaluacionEstudianteTutorAcademicoComponent},
  {path: 'informe-final-tutor', component: InformeFinalTutorAcademicoComponent},
  {path: 'gestion-docentes', component: GestionDocentesComponent},
  // {path:'consulta-estado',component:ConsultaEstadoComponent},
  //Franklin
  {path: 'registro-convocatoria', component: RegistroConvocatoriaComponent},
  {path: 'inf-fin-alumno', component: InformeFinalAlumnoComponent},
  {path: 'evaluacion-estudiante-tutor-empresarial', component: EvaluacionEstudianteTutorEmpresarialComponent},
  {path: 'acta-reunion', component: ActaReunionComponent},
  {path: 'reg-seg-alumno', component: RegistroSeguimientoAlumnoComponent},
  {path: 'cert-alumno', component: CertificadoAlumnoComponent},

  //Liss
  {path: 'evaluacion-estudiante-tutor-academico', component: EvaluacionEstudianteTutorAcademicoComponent},
  {path: 'informe-final-tutor', component: InformeFinalTutorAcademicoComponent},

  {path: 'solicitud-empresa', component: SolicitudEmpresaComponent},
  {path: 'historial', component: HistorialComponent},

  {path: 'lista-convocatorias',component: ListaConvocatoriasComponent},

  {
    path: 'informe-final-tutor',
    component: InformeFinalTutorAcademicoComponent,
  },
  {path: 'gestion-visitas', component: GestionVisitasComponent},
  {path: 'lista-responsableppp', component: ListaResponsablepppComponent},

  {path: '**', component: PagenotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
