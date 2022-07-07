import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeAcreditacionComponent } from './informe-acreditacion.component';

describe('InformeAcreditacionComponent', () => {
  let component: InformeAcreditacionComponent;
  let fixture: ComponentFixture<InformeAcreditacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeAcreditacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeAcreditacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
