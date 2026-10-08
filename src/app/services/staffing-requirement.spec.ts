import { TestBed } from '@angular/core/testing';

import { StaffingRequirement } from './staffing-requirement';

describe('StaffingRequirement', () => {
  let service: StaffingRequirement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffingRequirement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
