import { TestBed } from '@angular/core/testing';

import { MySchedule } from './my-schedule';

describe('MySchedule', () => {
  let service: MySchedule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MySchedule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
