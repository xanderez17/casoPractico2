import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasReportesComponent } from './consultas-reportes.component';

describe('ConsultasReportesComponent', () => {
  let component: ConsultasReportesComponent;
  let fixture: ComponentFixture<ConsultasReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultasReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
