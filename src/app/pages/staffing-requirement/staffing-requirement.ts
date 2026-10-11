import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StaffingRow {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  requiredAgents: number;
  scheduledAgents: number;
  gap: number;
}

@Component({
  selector: 'app-staffing-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staffing-requirement.html',
  styleUrl: './staffing-requirement.css'
})
export class StaffingRequirementComponent {
  staffingRequirements: StaffingRow[] = [
    {
      id: 1,
      date: '2026-10-05',
      startTime: '09:00',
      endTime: '09:59',
      requiredAgents: 10,
      scheduledAgents: 8,
      gap: -2
    },
    {
      id: 2,
      date: '2026-10-05',
      startTime: '10:00',
      endTime: '10:59',
      requiredAgents: 12,
      scheduledAgents: 12,
      gap: 0
    },
    {
      id: 3,
      date: '2026-10-05',
      startTime: '11:00',
      endTime: '11:59',
      requiredAgents: 15,
      scheduledAgents: 16,
      gap: 1
    }
  ];

  filteredStaffingRequirements: StaffingRow[] = [];

  dateFrom = '';
  dateTo = '';
  timeFrom = '';
  timeTo = '';

  filterError = '';

  editingId: number | null = null;
  originalRow: StaffingRow | null = null;

  constructor() {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filterError = '';

    if (this.dateFrom && this.dateTo && this.dateFrom > this.dateTo) {
      this.filterError = 'Date From cannot be later than Date To.';
      return;
    }

    if (this.timeFrom && this.timeTo && this.timeFrom >= this.timeTo) {
      this.filterError = 'Time From must be earlier than Time To.';
      return;
    }

    this.filteredStaffingRequirements = this.staffingRequirements.filter(item => {
      const matchesDateFrom = !this.dateFrom || item.date >= this.dateFrom;
      const matchesDateTo = !this.dateTo || item.date <= this.dateTo;

      // Match time periods that overlap the selected time range.
      const matchesTimeFrom = !this.timeFrom || item.endTime > this.timeFrom;
      const matchesTimeTo = !this.timeTo || item.startTime < this.timeTo;

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
    this.filterError = '';
    this.applyFilters();
  }

  addRequirement(): void {
    const newId = Math.max(
      0,
      ...this.staffingRequirements.map(item => item.id)
    ) + 1;

    const newRequirement: StaffingRow = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      requiredAgents: 1,
      scheduledAgents: 0,
      gap: -1
    };

    this.staffingRequirements.unshift(newRequirement);
    this.applyFilters();
    this.editRequirement(newRequirement);
  }

  editRequirement(item: StaffingRow): void {
    this.originalRow = { ...item };
    this.editingId = item.id;
  }

  saveRequirement(item: StaffingRow): void {
    if (!item.date || !item.startTime || !item.endTime) {
      alert('Please complete the date and time fields.');
      return;
    }

    if (item.endTime <= item.startTime) {
      alert('End Time must be later than Start Time.');
      return;
    }

    if (
      item.requiredAgents < 0 ||
      !Number.isInteger(item.requiredAgents)
    ) {
      alert('Required Agents must be a non-negative whole number.');
      return;
    }

    item.gap = item.scheduledAgents - item.requiredAgents;

    this.editingId = null;
    this.originalRow = null;

    this.applyFilters();
  }

  cancelEdit(item: StaffingRow): void {
    if (this.originalRow) {
      Object.assign(item, this.originalRow);
    }

    this.editingId = null;
    this.originalRow = null;

    this.applyFilters();
  }

  deleteRequirement(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this staffing requirement?'
    );

    if (!confirmed) {
      return;
    }

    this.staffingRequirements = this.staffingRequirements.filter(
      item => item.id !== id
    );

    if (this.editingId === id) {
      this.editingId = null;
      this.originalRow = null;
    }

    this.applyFilters();
  }
}