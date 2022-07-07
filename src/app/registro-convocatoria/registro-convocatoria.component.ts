import { Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-registro-convocatoria',
  templateUrl: './registro-convocatoria.component.html',
  styleUrls: ['./registro-convocatoria.component.css']
})
export class RegistroConvocatoriaComponent  {

  firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    isLinear = false;

    constructor(private _formBuilder: FormBuilder) {}
  }
