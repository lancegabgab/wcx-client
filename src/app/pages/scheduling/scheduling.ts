import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  agentNameSearch = '';
  dateFrom = '';
  dateTo = '';
  timeFrom = '';
  timeTo = '';

  filterError = '';
  errorMessage = '';
  successMessage = '';

  editingId: number | null = null;
  originalSchedule: Schedule | null = null;

  isAdding = false;
  isLoading = false;
  isSaving = false;

  ngOnInit(): void {
    this.loadAgents();
    this.loadSchedules();
  }

  private getLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private createEmptySchedule(): Schedule {
    return {
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
  }

  // Load agents from User API
  loadAgents(): void {
    this.userService.getAgents().subscribe({
      next: response => {
        this.agents = Array.isArray(response) ? response : [];
        this.applyLocalFilters();
      },
      error: error => {
        console.error('Failed to load agents:', error);

        Swal.fire(
          'Error',
          'Unable to load agents. Please check the User API.',
          'error'
        );
      }
    });
  }

  // Load schedules from Schedule API
  loadSchedules(filters?: {
    agentId?: string;
    dateFrom?: string;
    dateTo?: string;
    timeFrom?: string;
    timeTo?: string;
  }): void {
    this.isLoading = true;

    this.scheduleService.getSchedules(filters).subscribe({
      next: response => {
        this.schedules = response.data ?? [];
        this.applyLocalFilters();
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        console.error('Failed to load schedules:', error);

        Swal.fire(
          'Error',
          error.error?.message ?? 'Unable to load schedules.',
          'error'
        );
      }
    });
  }

  // Apply filters
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

    this.loadSchedules({
      agentId: this.filterAgentId || undefined,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined,
      timeFrom: this.timeFrom || undefined,
      timeTo: this.timeTo || undefined
    });
  }

  private applyLocalFilters(): void {
    const search = this.agentNameSearch.trim().toLowerCase();

    this.filteredSchedules = this.schedules.filter(schedule => {
      const fullName = this.getAgentName(schedule.agentId).toLowerCase();

      return !search || fullName.includes(search);
    });
  }

  searchAgentName(): void {
    this.applyLocalFilters();
  }

  resetFilters(): void {
    this.filterAgentId = '';
    this.agentNameSearch = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.timeFrom = '';
    this.timeTo = '';
    this.filterError = '';

    this.loadSchedules();
  }

  // Add schedule
  addSchedule(): void {
    if (this.editingId !== null) {
      return;
    }

    const schedule = this.createEmptySchedule();

    this.schedules = [schedule, ...this.schedules];
    this.filteredSchedules = [schedule, ...this.filteredSchedules];

    this.editingId = 0;
    this.originalSchedule = null;
    this.isAdding = true;

    this.errorMessage = '';
    this.successMessage = '';
  }

  // Edit schedule
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

  // Save schedule
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
      this.errorMessage = 'End time must be later than start time.';
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

    const input: ScheduleInput = {
      agentId: schedule.agentId,
      date: schedule.date,
      startTime: `${schedule.startTime.slice(0, 5)}:00`,
      endTime: `${schedule.endTime.slice(0, 5)}:00`,
      status: schedule.status || 'Scheduled'
    };

    this.isSaving = true;

    const request = this.isAdding
      ? this.scheduleService.createSchedule(input)
      : this.scheduleService.updateSchedule(schedule.id, input);

    request.subscribe({
      next: response => {
        this.isSaving = false;

        if (!response.success) {
          this.errorMessage =
            response.message || 'Unable to save schedule.';
          return;
        }

        this.editingId = null;
        this.originalSchedule = null;
        this.isAdding = false;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Schedule saved successfully.',
          timer: 1500,
          showConfirmButton: false
        });

        this.loadSchedules({
          agentId: this.filterAgentId || undefined,
          dateFrom: this.dateFrom || undefined,
          dateTo: this.dateTo || undefined,
          timeFrom: this.timeFrom || undefined,
          timeTo: this.timeTo || undefined
        });
      },
      error: error => {
        this.isSaving = false;

        this.errorMessage =
          error.error?.message ??
          error.error?.title ??
          'Unable to save schedule. Please try again.';
      }
    });
  }

  // Cancel adding or editing
  cancelEdit(): void {
    if (this.isAdding) {
      this.schedules = this.schedules.filter(
        schedule => schedule.id !== 0
      );
    } else if (this.originalSchedule) {
      const index = this.schedules.findIndex(
        schedule => schedule.id === this.originalSchedule!.id
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

    this.applyLocalFilters();
  }

  // Delete schedule
  deleteSchedule(id: number): void {
    Swal.fire({
      title: 'Delete schedule?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545'
    }).then(result => {
      if (!result.isConfirmed) {
        return;
      }

      this.scheduleService.deleteSchedule(id).subscribe({
        next: response => {
          if (!response.success) {
            Swal.fire(
              'Error',
              response.message || 'Unable to delete schedule.',
              'error'
            );
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: response.message || 'Schedule deleted successfully.',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadSchedules({
            agentId: this.filterAgentId || undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined,
            timeFrom: this.timeFrom || undefined,
            timeTo: this.timeTo || undefined
          });
        },
        error: error => {
          Swal.fire(
            'Error',
            error.error?.message ?? 'Unable to delete schedule.',
            'error'
          );
        }
      });
    });
  }

  // Get agent's full name
  getAgentName(agentId: string): string {
    const agent = this.agents.find(item => item.id === agentId);

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
