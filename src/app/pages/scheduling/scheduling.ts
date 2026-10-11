import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AgentOption {
  id: string;
  name: string;
}

interface Schedule {
  id: number;
  agentId: string;
  date: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling {
  agents: AgentOption[] = [
    { id: '1', name: 'Juan Dela Cruz' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Reyes' }
  ];

  schedules: Schedule[] = [
    {
      id: 1,
      agentId: '1',
      date: '2026-10-12',
      startTime: '09:00',
      endTime: '17:00'
    },
    {
      id: 2,
      agentId: '2',
      date: '2026-10-12',
      startTime: '10:00',
      endTime: '18:00'
    }
  ];

  filteredSchedules: Schedule[] = [];

  filterAgentId = '';
  dateFrom = '';
  dateTo = '';
  timeFrom = '';
  timeTo = '';
  filterError = '';

  editingId: number | null = null;
  originalSchedule: Schedule | null = null;
  isAdding = false;

  errorMessage = '';
  successMessage = '';

  constructor() {
    this.applyFilters();
  }

  private createEmptySchedule(): Schedule {
    return {
      id: 0,
      agentId: '',
      date: new Date().toLocaleDateString('en-CA'),
      startTime: '09:00',
      endTime: '17:00'
    };
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

    this.filteredSchedules = this.schedules.filter(schedule => {
      const matchesAgent =
        !this.filterAgentId || schedule.agentId === this.filterAgentId;

      const matchesDateFrom =
        !this.dateFrom || schedule.date >= this.dateFrom;

      const matchesDateTo =
        !this.dateTo || schedule.date <= this.dateTo;

      const matchesTimeFrom =
        !this.timeFrom || schedule.endTime > this.timeFrom;

      const matchesTimeTo =
        !this.timeTo || schedule.startTime < this.timeTo;

      return (
        matchesAgent &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesTimeFrom &&
        matchesTimeTo
      );
    });
  }

  resetFilters(): void {
    this.filterAgentId = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.timeFrom = '';
    this.timeTo = '';
    this.filterError = '';

    this.applyFilters();
  }

  addSchedule(): void {
    if (this.editingId !== null) {
      return;
    }

    const newId =
      Math.max(0, ...this.schedules.map(schedule => schedule.id)) + 1;

    const newSchedule: Schedule = {
      ...this.createEmptySchedule(),
      id: newId
    };

    this.schedules.unshift(newSchedule);

    // Show the new row even when existing filters are active.
    this.resetFilters();

    this.editingId = newId;
    this.originalSchedule = null;
    this.isAdding = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  editSchedule(schedule: Schedule): void {
    if (this.editingId !== null) {
      return;
    }

    this.editingId = schedule.id;
    this.originalSchedule = { ...schedule };
    this.isAdding = false;

    this.errorMessage = '';
    this.successMessage = '';
  }

  saveSchedule(schedule: Schedule): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !schedule.agentId ||
      !schedule.date ||
      !schedule.startTime ||
      !schedule.endTime
    ) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    if (schedule.startTime >= schedule.endTime) {
      this.errorMessage = 'Start Time must be earlier than End Time.';
      return;
    }

    const hasOverlap = this.schedules.some(existing => {
      if (existing.id === schedule.id) {
        return false;
      }

      const sameAgent = existing.agentId === schedule.agentId;
      const sameDate = existing.date === schedule.date;

      const overlaps =
        schedule.startTime < existing.endTime &&
        schedule.endTime > existing.startTime;

      return sameAgent && sameDate && overlaps;
    });

    if (hasOverlap) {
      this.errorMessage =
        'This agent already has a schedule that overlaps with the selected time.';
      return;
    }

    this.editingId = null;
    this.originalSchedule = null;
    this.isAdding = false;

    this.successMessage = 'Schedule saved successfully.';
    this.applyFilters();
  }

  cancelEdit(): void {
    if (this.isAdding && this.editingId !== null) {
      this.schedules = this.schedules.filter(
        schedule => schedule.id !== this.editingId
      );
    } else if (this.originalSchedule && this.editingId !== null) {
      const index = this.schedules.findIndex(
        schedule => schedule.id === this.editingId
      );

      if (index !== -1) {
        this.schedules[index] = { ...this.originalSchedule };
      }
    }

    this.editingId = null;
    this.originalSchedule = null;
    this.isAdding = false;
    this.errorMessage = '';
    this.successMessage = '';

    this.applyFilters();
  }

  deleteSchedule(id: number): void {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    this.schedules = this.schedules.filter(
      schedule => schedule.id !== id
    );

    this.successMessage = 'Schedule deleted successfully.';
    this.errorMessage = '';

    this.applyFilters();
  }

  getAgentName(agentId: string): string {
    return this.agents.find(agent => agent.id === agentId)?.name
      ?? 'Unknown Agent';
  }
}