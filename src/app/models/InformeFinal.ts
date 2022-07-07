import { Alumno } from "./Alumno"
export class InformeFinal{
    idInformeFinal:number;
    fechaEmision:any;
    docInformeFinal:any;
    alumno:Alumno;
    estado:String;

    constructor(){
        this.alumno = new Alumno();
    }

}