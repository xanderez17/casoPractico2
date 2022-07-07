import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaReunionComponent } from './acta-reunion.component';

describe('ActaReunionComponent', () => {
  let component: ActaReunionComponent;
  let fixture: ComponentFixture<ActaReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActaReunionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActaReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
