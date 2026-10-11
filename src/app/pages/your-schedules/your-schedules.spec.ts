import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourSchedules } from './your-schedules';

describe('YourSchedules', () => {
  let component: YourSchedules;
  let fixture: ComponentFixture<YourSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourSchedules],
    }).compileComponents();

    fixture = TestBed.createComponent(YourSchedules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
