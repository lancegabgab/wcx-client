import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Staffing } from './staffing';

describe('Staffing', () => {
  let component: Staffing;
  let fixture: ComponentFixture<Staffing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Staffing],
    }).compileComponents();

    fixture = TestBed.createComponent(Staffing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
