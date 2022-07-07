import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesigTutorAcademicoComponent } from './desig-tutor-academico.component';

describe('DesigTutorAcademicoComponent', () => {
  let component: DesigTutorAcademicoComponent;
  let fixture: ComponentFixture<DesigTutorAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesigTutorAcademicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesigTutorAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
