import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistroEmpresasComponent } from './registro-empresas/registro-empresas.component';
import { RegistroDocentesComponent } from './registro-docentes/registro-docentes.component';
import { ConsultaspppComponent } from './consultasppp/consultasppp.component';
import { LoginComponent } from './login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { SeleccionEstudiantesComponent } from './seleccion-estudiantes/seleccion-estudiantes.component';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from './footer/footer.component';
import { RegistroComponent } from './auth/registro.component';
import { ConsultaConvocatoriaComponent } from './consulta-convocatoria/consulta-convocatoria.component';
import { HttpClientModule } from '@angular/common/http';
import { DesigTutorEmpresarialComponent } from './desig-tutor-empresarial/desig-tutor-empresarial.component';
import { DesigTutorAcademicoComponent } from './desig-tutor-academico/desig-tutor-academico.component';
import { ConsultasEstudiantesAsignadosComponent } from './consulta-estudiantes-asignados/consulta-estudiantes-asignados.components';
import { GestionEmpresaComponent } from './gestion-empresa/gestion-empresa.component';
import { RegistroAsistenciaComponent } from './registro-asistencia/registro-asistencia.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { SolicitudEstudianteComponent } from './solicitud-estudiante/solicitud-estudiante.component';
import { RegistroVisitaComponent } from './registro-visita/registro-visita.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConsultasReportesComponent } from './consultas-reportes/consultas-reportes.component';
import { ConsultaEstadoComponent } from './consulta-estado/consulta-estado.component';
import { InformeFinalAlumnoComponent } from './informe-finalizacion-alumno/informe-finalizacion-alumo.components';
import { EvaluacionEstudianteTutorEmpresarialComponent } from './evaluacion-estudiante-tutor-empresarial/evaluacion-estudiante-tutor-empresarial.components';
import { RegistroConvocatoriaComponent } from './registro-convocatoria/registro-convocatoria.component';
import { RegistroSeguimientoAlumnoComponent } from './registro-seguimiento/registro-seguimiento.components';
import { CertificadoAlumnoComponent } from './certificado-alumno/certificado-alumno.components';
import { EvaluacionEstudianteTutorAcademicoComponent } from './evaluacion-estudiante-tutor-academico/evaluacion-estudiante-tutor-academico.component';
import { MatTreeModule } from '@angular/material/tree';
import { InformeFinalTutorAcademicoComponent } from './informe-final-tutor-academico/informe-final-tutor-academico.component';
import { AnexosdePPPComponent } from './anexosde-ppp/anexosde-ppp.component';
import { ActaReunionComponent } from './acta-reunion/acta-reunion.component';
import { GestionVisitasComponent } from './gestion-visitas/gestion-visitas.component';
import { CrearActaComponent } from './crear-acta/crear-acta.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { ConsultaConvPublicoComponent } from './consulta-conv-publico/consulta-conv-publico.component';
import { SolicitarRequerimientosComponent } from './solicitar-requerimientos/solicitar-requerimientos.component';

import {MessageService,ConfirmationService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import { CrearCarreraComponent } from './carreras/crear-carrera/crear-carrera.component';
import { ListarCarrerasComponent } from './carreras/listar-carreras/listar-carreras.component';

import { HistorialComponent } from './historial/historial.component';
import { GestionDocentesComponent } from './gestion-docentes/gestion-docentes.component';
import { SolicitudEmpresaComponent } from './solicitud-empresa/solicitud-empresa.component';
import {StepsModule} from "primeng/steps";
import {AccordionModule} from "primeng/accordion";
import {FileUploadModule} from "primeng/fileupload";
import { ListaResponsablepppComponent } from './lista-responsableppp/lista-responsableppp.component';
import { CrearEmpleadoComponent } from './empresa/crear-empleado/crear-empleado.component';
import {OrderListModule} from 'primeng/orderlist';
import {SolicitudEmpresa} from "./models/SolicitudEmpresa";

import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ListboxModule} from 'primeng/listbox';
import {InformeAcreditacionComponent} from './informe-acreditacion/informe-acreditacion.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SidebarModule} from 'primeng/sidebar';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import { GestionConvocatoriaComponent } from './responsable/gestion-convocatoria/gestion-convocatoria.component';
import {DividerModule} from 'primeng/divider';
import {CalendarModule} from 'primeng/calendar';
import { Ng2SearchPipe, Ng2SearchPipeModule } from 'ng2-search-filter';

import { ListarEmpleadoComponent } from './empresa/listar-empleado/listar-empleado.component';
import { GenerarCertificadoEmpresaComponent } from './tutor-empresarial/generar-certificado-empresa/generar-certificado-empresa.component';
import { NotificacionCronogramaComponent } from './notificacion-cronograma/notificacion-cronograma.component';
import { ConsultaRegistroAsistenciaComponent } from './consulta-registro-asistencia/consulta-registro-asistencia.component';
import {ListaConvocatoriasComponent} from "./responsable/lista-convocatorias/lista-convocatorias.component";
@NgModule({
  declarations: [
    AppComponent,
    AnexosdePPPComponent,
    RegistroEmpresasComponent,
    RegistroDocentesComponent,
    ConsultaspppComponent,
    LoginComponent,
    HomeComponent,
    SeleccionEstudiantesComponent,
    PagenotfoundComponent,
    FooterComponent,
    RegistroComponent,
    ConsultaConvocatoriaComponent,
    DesigTutorEmpresarialComponent,
    DesigTutorAcademicoComponent,
    ConsultasEstudiantesAsignadosComponent,
    GestionEmpresaComponent,
    RegistroAsistenciaComponent,
    RegistroVisitaComponent,
    SolicitudEstudianteComponent,
    ConsultasReportesComponent,
    ActaReunionComponent,
    ConsultasReportesComponent,
    ConsultaEstadoComponent,
    ConsultasReportesComponent,
    RegistroConvocatoriaComponent,
    //Franklin
    InformeFinalAlumnoComponent,
    EvaluacionEstudianteTutorEmpresarialComponent,
    RegistroSeguimientoAlumnoComponent,
    CertificadoAlumnoComponent,
    InformeAcreditacionComponent,
    //Lisseth
    EvaluacionEstudianteTutorAcademicoComponent,
    InformeFinalTutorAcademicoComponent,
    DashboardComponent,
    CrearActaComponent,

//Lisseth
EvaluacionEstudianteTutorAcademicoComponent,
InformeFinalTutorAcademicoComponent,
DashboardComponent,
CrearActaComponent,
CrearCarreraComponent,
ListarCarrerasComponent,

    ConsultasReportesComponent,
    ActaReunionComponent,
    ConsultasReportesComponent,
    ConsultaEstadoComponent,
    ConsultasReportesComponent,
    RegistroConvocatoriaComponent,
//Franklin
InformeFinalAlumnoComponent,
EvaluacionEstudianteTutorEmpresarialComponent,
RegistroSeguimientoAlumnoComponent,
CertificadoAlumnoComponent,



//Lisseth
EvaluacionEstudianteTutorAcademicoComponent,
InformeFinalTutorAcademicoComponent,
ConsultaConvPublicoComponent,
SolicitarRequerimientosComponent,
HistorialComponent,
GestionDocentesComponent,
SolicitudEmpresaComponent,

    //Lisseth
    EvaluacionEstudianteTutorAcademicoComponent,
    InformeFinalTutorAcademicoComponent,
    GestionVisitasComponent,
    ListaResponsablepppComponent,
    CrearEmpleadoComponent,
    ListarEmpleadoComponent,
    GestionConvocatoriaComponent,
    GenerarCertificadoEmpresaComponent,
    NotificacionCronogramaComponent,
    GestionConvocatoriaComponent,
    ListaConvocatoriasComponent,
    ConsultaRegistroAsistenciaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatMenuModule,
    TableModule,
    MatDialogModule,
    DialogModule,
    ButtonModule,
    PanelModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatTreeModule,
    TabMenuModule,
    TabViewModule,
    MatSelectModule,
    DropdownModule,
    ToastModule,
    StepsModule,
    AccordionModule,
    FileUploadModule,
    OrderListModule,
    MessagesModule,
    MessageModule,
   ListboxModule,
   OverlayPanelModule,
   SidebarModule,
   VirtualScrollerModule,
   DividerModule,
   CalendarModule

  ],
  providers: [MessageService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
