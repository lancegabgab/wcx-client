import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  StaffingRequirementService,
  StaffingRequirement as StaffingRequirementModel,
  StaffingRequirementInput
} from '../../services/staffing-requirement';

@Component({
  selector: 'app-staffing-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staffing-requirement.html',
  styleUrl: './staffing-requirement.css'
})

export class StaffingRequirement implements OnInit {
  private staffingService = inject(StaffingRequirementService);

  staffingRequirements: StaffingRequirementModel[] = [];
  filteredStaffingRequirements: StaffingRequirementModel[] = [];

  dateFrom = '';
  dateTo = '';
  timeFrom = '';
  timeTo = '';

  filterError = '';
  errorMessage = '';

  isLoading = false;
  isSaving = false;
  isDeleting = false;

  editingId: number | null = null;
  originalRow: StaffingRequirementModel | null = null;
  isNewRow = false;

  ngOnInit(): void {
    this.loadRequirements();
  }

  loadRequirements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.staffingService.getAll().subscribe({
      next: (response) => {
        if (!response.success || !response.data) {
          this.errorMessage =
            response.message || 'Failed to load staffing requirements.';
          this.isLoading = false;
          return;
        }

        this.staffingRequirements = response.data.map(item => ({
          ...item,
          date: String(item.date).substring(0, 10),
          startTime: String(item.startTime).substring(0, 5),
          endTime: String(item.endTime).substring(0, 5)
        }));

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage =
          error.error?.message ?? 'Failed to load staffing requirements.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filterError = '';

    if (this.dateFrom && this.dateTo && this.dateFrom > this.dateTo) {
      this.filterError = 'Date From cannot be later than Date To.';
      this.filteredStaffingRequirements = [];
      return;
    }

    if (this.timeFrom && this.timeTo && this.timeFrom >= this.timeTo) {
      this.filterError = 'Time From must be earlier than Time To.';
      this.filteredStaffingRequirements = [];
      return;
    }

    this.filteredStaffingRequirements =
      this.staffingRequirements.filter(item => {
        const matchesDateFrom =
          !this.dateFrom || item.date >= this.dateFrom;

        const matchesDateTo =
          !this.dateTo || item.date <= this.dateTo;

        const matchesTimeFrom =
          !this.timeFrom || item.endTime > this.timeFrom;

        const matchesTimeTo =
          !this.timeTo || item.startTime < this.timeTo;

        return (
          matchesDateFrom &&
          matchesDateTo &&
          matchesTimeFrom &&
          matchesTimeTo
        );
      });
  }

  resetFilters(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.timeFrom = '';
    this.timeTo = '';
    this.applyFilters();
  }

  addRequirement(): void {
    if (this.editingId !== null || this.isLoading || this.isSaving) {
      return;
    }

    const today = new Date();

    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    const newRequirement: StaffingRequirementModel = {
      id: 0,
      date: localDate,
      startTime: '09:00',
      endTime: '10:00',
      requiredAgents: 1,
      scheduledAgents: 0
    };

    this.staffingRequirements.unshift(newRequirement);
    this.originalRow = { ...newRequirement };
    this.editingId = 0;
    this.isNewRow = true;

    this.filteredStaffingRequirements = [
      newRequirement,
      ...this.filteredStaffingRequirements.filter(
        item => item !== newRequirement
      )
    ];
  }

  editRequirement(item: StaffingRequirementModel): void {
    if (this.editingId !== null || this.isSaving) {
      return;
    }

    this.originalRow = { ...item };
    this.editingId = item.id;
    this.isNewRow = false;
  }

  saveRequirement(item: StaffingRequirementModel): void {
    if (this.isSaving) {
      return;
    }

    if (!item.date || !item.startTime || !item.endTime) {
      this.errorMessage = 'Please complete the date and time fields.';
      return;
    }

    if (item.endTime <= item.startTime) {
      this.errorMessage = 'End Time must be later than Start Time.';
      return;
    }

    const requiredAgents = Number(item.requiredAgents);

    if (!Number.isInteger(requiredAgents) || requiredAgents < 1) {
      this.errorMessage =
        'Required Agents must be a positive whole number.';
      return;
    }

    const input: StaffingRequirementInput = {
      date: item.date,
      startTime: `${item.startTime}:00`,
      endTime: `${item.endTime}:00`,
      requiredAgents
    };

    this.errorMessage = '';
    this.isSaving = true;

    const request = this.isNewRow
      ? this.staffingService.create(input)
      : this.staffingService.update(item.id, input);

    request.subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage =
            response.message || 'Failed to save staffing requirement.';
          this.isSaving = false;
          return;
        }

        this.editingId = null;
        this.originalRow = null;
        this.isNewRow = false;
        this.isSaving = false;

        // Reload to get the latest ScheduledAgents and Gap.
        this.loadRequirements();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage =
          error.error?.message ?? 'Failed to save staffing requirement.';
        this.isSaving = false;
      }
    });
  }

  cancelEdit(item: StaffingRequirementModel): void {
    if (this.isSaving) {
      return;
    }

    if (this.isNewRow) {
      this.staffingRequirements =
        this.staffingRequirements.filter(row => row !== item);
    } else if (this.originalRow) {
      Object.assign(item, this.originalRow);
    }

    this.editingId = null;
    this.originalRow = null;
    this.isNewRow = false;

    this.applyFilters();
  }

  deleteRequirement(id: number): void {
    if (
      this.editingId !== null ||
      this.isDeleting ||
      this.isLoading
    ) {
      return;
    }

    if (!confirm('Are you sure you want to delete this staffing requirement?')) {
      return;
    }

    this.errorMessage = '';
    this.isDeleting = true;

    this.staffingService.delete(id).subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage =
            response.message || 'Failed to delete staffing requirement.';
          this.isDeleting = false;
          return;
        }

        this.isDeleting = false;
        this.loadRequirements();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage =
          error.error?.message ?? 'Failed to delete staffing requirement.';
        this.isDeleting = false;
      }
    });
  }

  formatTime(time: string): string {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }
  
  getGap(item: StaffingRequirementModel): number {
    return item.scheduledAgents - item.requiredAgents;
  }

  getStatus(item: StaffingRequirementModel): string {
  const gap = this.getGap(item);

    if (gap < 0) {
      return 'Understaffed';
    }

    if (gap === 0) {
      return 'Complete';
    }

    return 'Overstaffed';
  }
}
