import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionEstudianteTutorAcademicoComponent } from './evaluacion-estudiante-tutor-academico.component';

describe('EvaluacionEstudianteTutorAcademicoComponent', () => {
  let component: EvaluacionEstudianteTutorAcademicoComponent;
  let fixture: ComponentFixture<EvaluacionEstudianteTutorAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionEstudianteTutorAcademicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionEstudianteTutorAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
