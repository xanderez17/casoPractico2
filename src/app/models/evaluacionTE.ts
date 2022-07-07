import { Empresa } from '../services/empresa';
import { Alumno } from './Alumno';
import { TutorE } from './TutorE';

export class evaluacionTE {
  idEvaluacionTE: number;
  puntajeTotal: number;
  docEvaluacionTE: any;
  opcionA1: any;
  opcionB1: any;
  opcionC1: any;
  opcionD1: any;
  opcionE1: any;
  numHoras: any;
  desde: any;
  hasta: any;
  alumno: Alumno;

  constructor() {
    this.alumno = new Alumno();
    //this.tutorAcademico = new TutorA();
  }
}
