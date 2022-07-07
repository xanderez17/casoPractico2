import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaspppComponent } from './consultasppp.component';

describe('ConsultaspppComponent', () => {
  let component: ConsultaspppComponent;
  let fixture: ComponentFixture<ConsultaspppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaspppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaspppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
