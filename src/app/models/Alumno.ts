import { Carrera } from "./Carrera";
import { Persona } from "./Persona";

export class Alumno {
    idAlumno: any;
    ciclo: any;
    paralelo: any;
    promedio: any;
    persona: Persona;
    carrera: Carrera;
     
    constructor(){
        this.persona = new Persona();
        this.carrera = new Carrera();
    }
}