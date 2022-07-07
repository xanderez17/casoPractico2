import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesigTutorEmpresarialComponent } from './desig-tutor-empresarial.component';

describe('DesigTutorEmpresarialComponent', () => {
  let component: DesigTutorEmpresarialComponent;
  let fixture: ComponentFixture<DesigTutorEmpresarialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesigTutorEmpresarialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesigTutorEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
