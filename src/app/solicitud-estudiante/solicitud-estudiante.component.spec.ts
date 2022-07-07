import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEstudianteComponent } from './solicitud-estudiante.component';

describe('SolicitudEstudianteComponent', () => {
  let component: SolicitudEstudianteComponent;
  let fixture: ComponentFixture<SolicitudEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudEstudianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
