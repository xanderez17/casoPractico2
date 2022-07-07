import { Docente } from "./Docente";

export class CoordinadorVinculacion{
    idCoordinadorV:any;
    docente:Docente;

    constructor(){
        this.docente = new Docente();
    }
}