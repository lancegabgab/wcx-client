import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ScheduleService,
  Schedule,
  ScheduleInput
} from '../../services/schedule';

import {
  UserService,
  UserOutput
} from '../../services/user';

@Component({
  selector: 'app-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling implements OnInit {
  private scheduleService = inject(ScheduleService);
  private userService = inject(UserService);

  agents: UserOutput[] = [];
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];

  filterAgentId = '';
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
  originalRow: Schedule | null = null;
  isNewRow = false;

  ngOnInit(): void {
    this.loadAgents();
    this.loadSchedules();
  }

  private getLocalDate(): string {
    const today = new Date();

    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
  }

  loadAgents(): void {
    this.userService.getAgents().subscribe({
      next: response => {
        this.agents = Array.isArray(response) ? response : [];
      },
      error: error => {
        console.error('Failed to load agents:', error);
        this.errorMessage = 'Failed to load agents.';
      }
    });
  }

  loadSchedules(): void {
    this.isLoading = true;

    this.scheduleService.getSchedules().subscribe({
      next: response => {
        if (!response.success || !response.data) {
          this.errorMessage =
            response.message || 'Failed to load schedules.';
          this.isLoading = false;
          return;
        }

        this.schedules = response.data.map(item => ({
          ...item,
          date: String(item.date).substring(0, 10),
          startTime: String(item.startTime).substring(0, 5),
          endTime: String(item.endTime).substring(0, 5)
        }));

        this.applyFilters();
        this.isLoading = false;
      },
      error: error => {
        console.error('Failed to load schedules:', error);

        this.errorMessage =
          error.error?.message ?? 'Failed to load schedules.';

        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filterError = '';

    if (this.dateFrom && this.dateTo && this.dateFrom > this.dateTo) {
      this.filterError = 'Date From cannot be later than Date To.';
      this.filteredSchedules = [];
      return;
    }

    if (this.timeFrom && this.timeTo && this.timeFrom >= this.timeTo) {
      this.filterError = 'Time From must be earlier than Time To.';
      this.filteredSchedules = [];
      return;
    }

    this.filteredSchedules = this.schedules.filter(item => {
      const matchesAgent =
        !this.filterAgentId || item.agentId === this.filterAgentId;

      const matchesDateFrom =
        !this.dateFrom || item.date >= this.dateFrom;

      const matchesDateTo =
        !this.dateTo || item.date <= this.dateTo;

      const matchesTimeFrom =
        !this.timeFrom || item.endTime > this.timeFrom;

      const matchesTimeTo =
        !this.timeTo || item.startTime < this.timeTo;

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

    this.applyFilters();
  }

  addSchedule(): void {
    if (
      this.editingId !== null ||
      this.isLoading ||
      this.isSaving ||
      this.isDeleting
    ) {
      return;
    }

    const newSchedule: Schedule = {
      id: 0,
      agentId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      date: this.getLocalDate(),
      startTime: '09:00',
      endTime: '17:00',
      status: 'Scheduled'
    };

    this.schedules.unshift(newSchedule);

    this.originalRow = { ...newSchedule };
    this.editingId = 0;
    this.isNewRow = true;
    this.errorMessage = '';

    this.filteredSchedules = [
      newSchedule,
      ...this.filteredSchedules.filter(row => row !== newSchedule)
    ];
  }

  editSchedule(item: Schedule): void {
    if (
      this.editingId !== null ||
      this.isSaving ||
      this.isDeleting
    ) {
      return;
    }

    this.originalRow = { ...item };
    this.editingId = item.id;
    this.isNewRow = false;
    this.errorMessage = '';
  }

  saveSchedule(item: Schedule): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';

    // Validate required fields.
    if (
      !item.agentId ||
      !item.date ||
      !item.startTime ||
      !item.endTime
    ) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    // Validate the schedule time range.
    if (item.endTime <= item.startTime) {
      this.errorMessage =
        'End Time must be later than Start Time.';
      return;
    }

    // Prevent overlapping schedules for the same agent and date.
    const hasOverlap = this.schedules.some(existing => {
      if (existing === item) {
        return false;
      }

      return (
        existing.agentId === item.agentId &&
        existing.date === item.date &&
        item.startTime < existing.endTime &&
        item.endTime > existing.startTime
      );
    });

    if (hasOverlap) {
      this.errorMessage =
        'This agent already has a schedule that overlaps with the selected time.';
      return;
    }

    const input: ScheduleInput = {
      agentId: item.agentId,
      date: item.date,
      startTime: `${item.startTime.substring(0, 5)}:00`,
      endTime: `${item.endTime.substring(0, 5)}:00`,
      // status: item.status || 'Scheduled'
    };

    this.isSaving = true;

    const request = this.isNewRow
      ? this.scheduleService.createSchedule(input)
      : this.scheduleService.updateSchedule(item.id, input);

    request.subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage =
            response.message || 'Failed to save schedule.';

          this.isSaving = false;
          return;
        }

        // Exit edit mode after the API succeeds.
        this.editingId = null;
        this.originalRow = null;
        this.isNewRow = false;
        this.isSaving = false;

        // Reload the latest schedules from the backend.
        this.loadSchedules();
      },
      error: error => {
        console.error('Failed to save schedule:', error);

        this.errorMessage =
          error.error?.message ??
          error.error?.title ??
          'Failed to save schedule.';

        this.isSaving = false;
      }
    });
  }

  cancelEdit(item: Schedule): void {
    if (this.isSaving) {
      return;
    }

    if (this.isNewRow) {
      // Remove the unsaved row.
      this.schedules = this.schedules.filter(
        row => row !== item
      );
    } else if (this.originalRow) {
      // Restore the original values.
      const index = this.schedules.findIndex(
        row => row.id === this.originalRow!.id
      );

      if (index !== -1) {
        this.schedules[index] = { ...this.originalRow };
      }
    }

    this.editingId = null;
    this.originalRow = null;
    this.isNewRow = false;
    this.errorMessage = '';

    this.applyFilters();
  }

  deleteSchedule(id: number): void {
    if (
      this.editingId !== null ||
      this.isDeleting ||
      this.isLoading ||
      this.isSaving
    ) {
      return;
    }

    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    this.errorMessage = '';
    this.isDeleting = true;

    this.scheduleService.deleteSchedule(id).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage =
            response.message || 'Failed to delete schedule.';

          this.isDeleting = false;
          return;
        }

        this.isDeleting = false;

        // Reload the latest schedules after deletion.
        this.loadSchedules();
      },
      error: error => {
        console.error('Failed to delete schedule:', error);

        this.errorMessage =
          error.error?.message ?? 'Failed to delete schedule.';

        this.isDeleting = false;
      }
    });
  }

  
  getEndTimeOptions(): string[] {
    const options: string[] = [];

    for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      options.push(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
      );
    }

    return options;
  }

  isEndTimeDisabled(
    startTime: string,
    endTime: string
  ): boolean {
    return !startTime || endTime <= startTime;
  }

  onStartTimeChange(item: Schedule): void {
    if (
      item.endTime &&
      item.endTime <= item.startTime
    ) {
      item.endTime = '';
    }
  }

  formatTime(time: string): string {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  getAgentName(agentId: string): string {
    const agent = this.agents.find(
      item => item.id === agentId
    );

    if (agent) {
      return [
        agent.firstName,
        agent.middleName,
        agent.lastName
      ].filter(Boolean).join(' ');
    }

    const schedule = this.schedules.find(
      item => item.agentId === agentId
    );

    if (schedule) {
      return [
        schedule.firstName,
        schedule.middleName,
        schedule.lastName
      ].filter(Boolean).join(' ');
    }

    return 'Unknown Agent';
  }
}
