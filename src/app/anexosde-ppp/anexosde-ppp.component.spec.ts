import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnexosdePPPComponent } from './anexosde-ppp.component';

describe('AnexosdePPPComponent', () => {
  let component: AnexosdePPPComponent;
  let fixture: ComponentFixture<AnexosdePPPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnexosdePPPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnexosdePPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
