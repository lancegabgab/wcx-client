import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  StaffingRequirement,
  StaffingRequirementService
} from '../../services/staffing-requirement';

@Component({
  selector: 'app-staffing',
  imports: [DatePipe],
  templateUrl: './staffing.html',
  styleUrl: './staffing.css',
})
export class Staffing implements OnInit {

  private staffingService = inject(StaffingRequirementService);
  private cdr = inject(ChangeDetectorRef);

  staffingRequirements: StaffingRequirement[] = [];

  ngOnInit(): void {
    this.loadStaffingRequirements();
  }

  loadStaffingRequirements(): void {
    this.staffingService.getAll().subscribe({
      next: (data) => {
        console.log('Staffing Requirements:', data);

        this.staffingRequirements = data;

        // Force Angular to update the UI
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load staffing requirements:', error);
      }
    });
  }
}