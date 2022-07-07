import { Component, OnInit } from '@angular/core';
import { CarreraService } from 'src/app/services/carrera.service';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { Carrera } from 'src/app/models/Carrera';

import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public carreras: Array<any> = []
  public carreraind: any

  base64Output : string;

  constructor(
    private carreraService: CarreraService 
    ) {

      this.carreraService.getCarreras().subscribe((resp: any)=>{
        console.log(resp.data)
        this.carreras = resp.data
      })

     }

  ngOnInit(): void {
  }

  
  infoCarrera: boolean = false;
  showDialog(carrera) {
    console.log(carrera)
    this.carreraind=carrera;
    this.infoCarrera = true;
}

  //https://drive.google.com/uc?export=download&id=1fxvfKsDHpCSrfpa2zy_NV6ySmUfHttf6

  nombre= "nombre de prueba";

 
  generate(nom) {
    loadFile("http://localhost:8082/files/anexo1.docx", function(
      error,
      content
    ) {
      if (error) {
        throw error;
      }


  
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.setData({
        rpp: nom,
        numestudiantes: "2501"
      });
      try {
        // Se reemplaza en el documento: {rpp} -> John, {numestudiantes} -> Doe ....
        doc.render();
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(
              error,
              key
            ) {
              error[key] = value[key];
              return error;
            },
            {});
          }
          return value;
        }
        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function(error) {
              return error.properties.explanation;
            })
            .join("\n");
          console.log("errorMessages", errorMessages);

        }
        throw error;
      }
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // Output the document using Data-URI
      saveAs(out, "output.docx");
    });
  }

  //Subir un archivo a la base

  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
    });
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }
}
