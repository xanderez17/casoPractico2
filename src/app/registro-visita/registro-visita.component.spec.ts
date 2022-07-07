import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVisitaComponent } from './registro-visita.component';

describe('RegistroVisitaComponent', () => {
  let component: RegistroVisitaComponent;
  let fixture: ComponentFixture<RegistroVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroVisitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
