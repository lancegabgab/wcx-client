import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffingRequirement } from './staffing-requirement';

describe('StaffingRequirement', () => {
  let component: StaffingRequirement;
  let fixture: ComponentFixture<StaffingRequirement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffingRequirement],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffingRequirement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
