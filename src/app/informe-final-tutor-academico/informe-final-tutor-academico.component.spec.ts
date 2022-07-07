import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeFinalTutorAcademicoComponent } from './informe-final-tutor-academico.component';

describe('InformeFinalTutorAcademicoComponent', () => {
  let component: InformeFinalTutorAcademicoComponent;
  let fixture: ComponentFixture<InformeFinalTutorAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeFinalTutorAcademicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeFinalTutorAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
