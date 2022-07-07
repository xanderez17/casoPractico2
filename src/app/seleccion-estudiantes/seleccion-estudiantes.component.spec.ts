import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionEstudiantesComponent } from './seleccion-estudiantes.component';

describe('RegistroEmpresasComponent', () => {
  let component: SeleccionEstudiantesComponent;
  let fixture: ComponentFixture<SeleccionEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
