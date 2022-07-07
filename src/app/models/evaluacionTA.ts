import { Empresa } from '../services/empresa';
import { Alumno } from './Alumno';
import { TutorA } from './TutorA';

export class evaluacionTA {
  idEvaluacionTA: number;
  puntajeTotal: number;
  docEvaluacionTA: any;
  opcionA: any;
  opcionB: any;
  opcionC: any;
  opcionD: any;
  opcionE: any;
  numHoras: any;
  desde: any;
  hasta: any;
  alumno: Alumno;
  tutorAcademico:TutorA;

  constructor() {
    this.alumno = new Alumno();
    this.tutorAcademico=new TutorA();
    //this.tutorAcademico = new TutorA();
  }
}
