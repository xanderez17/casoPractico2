import { Alumno } from "./Alumno";
import { CoordinadorVinculacion } from "./CoordinadorVinculacion";

export class Acreditacion{
    idAcreditacion:any;
    documento:any;
    alumno:Alumno;
    vinculacion:CoordinadorVinculacion

    constructor(){
        this.alumno = new Alumno();
        this.vinculacion = new CoordinadorVinculacion();
    }
}