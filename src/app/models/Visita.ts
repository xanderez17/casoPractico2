import { Alumno } from './Alumno';

export class Visita {
  idRegistroVisitaE?: any;
  alumno?: Alumno;
  observaciones?: any;
  docRegistroVisita?: any;

  constructor() {
    this.alumno = new Alumno();
  }
}

export class InformeVisita {
  idInformeVisita: number;
  asunto?: String;
  actividades?: String;
  observaciones?: String;
  horaInicio?: String;
  horaFin?: String;
  fecha?: Date;
  registroVisitaEmpresa?: Visita;
  constructor() {
    this.registroVisitaEmpresa = new Visita();
  }
}
