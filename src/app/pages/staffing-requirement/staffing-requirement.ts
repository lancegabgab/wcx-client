//okay
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

  editingId: number | null = null;
  originalRow: StaffingRow | null = null;

  editRequirement(item: StaffingRow): void {
    this.originalRow = { ...item };
    this.editingId = item.id;
  }

  saveRequirement(item: StaffingRow): void {
    if (item.endTime <= item.startTime) {
      alert('End Time must be later than Start Time.');
      return;
    }

    if (item.requiredAgents < 0 || !Number.isInteger(item.requiredAgents)) {
      alert('Required Agents must be a non-negative whole number.');
      return;
    }

    item.gap = item.scheduledAgents - item.requiredAgents;
    this.editingId = null;
    this.originalRow = null;
  }

  cancelEdit(item: StaffingRow): void {
    if (this.originalRow) {
      Object.assign(item, this.originalRow);
    }

    this.editingId = null;
    this.originalRow = null;
  }

  deleteRequirement(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this staffing requirement?');

    if (!confirmed) {
      return;
    }

    this.staffingRequirements =
      this.staffingRequirements.filter(item => item.id !== id);

    if (this.editingId === id) {
      this.editingId = null;
      this.originalRow = null;
    }
  }
}

