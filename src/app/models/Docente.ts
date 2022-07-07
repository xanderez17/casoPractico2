import { Carrera } from "./Carrera";
import { Persona } from "./Persona";

export class Docente  {
    id_docente: any;
    titulo: any;
    area: any;
    abrevTitulo: any;
    persona: Persona;
    carrera: Carrera;

 constructor(){
        this.persona = new Persona();
    }

}
