// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-scheduling',
//   imports: [],
//   templateUrl: './scheduling.html',
//   styleUrl: './scheduling.css',
// })
// export class Scheduling {}
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

  form: Schedule = this.emptyForm();
  editingId: number | null = null;
  originalSchedule: Schedule | null = null;
  errorMessage = '';
  successMessage = '';

  private emptyForm(): Schedule {
    return {
      id: 0,
      agentId: '',
      date: new Date().toLocaleDateString('en-CA'),
      startTime: '09:00',
      endTime: '17:00'
    };
  }

  submitSchedule(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.form.agentId ||
      !this.form.date ||
      !this.form.startTime ||
      !this.form.endTime
    ) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    if (this.form.startTime >= this.form.endTime) {
      this.errorMessage = 'Start Time must be earlier than End Time.';
      return;
    }

    const hasOverlap = this.schedules.some(schedule => {
      if (schedule.id === this.editingId) {
        return false;
      }

      const sameAgent = schedule.agentId === this.form.agentId;
      const sameDate = schedule.date === this.form.date;

      const overlaps =
        this.form.startTime < schedule.endTime &&
        this.form.endTime > schedule.startTime;

      return sameAgent && sameDate && overlaps;
    });

    if (hasOverlap) {
      this.errorMessage =
        'This agent already has a schedule that overlaps with the selected time.';
      return;
    }

    if (this.editingId !== null) {
      const index = this.schedules.findIndex(
        schedule => schedule.id === this.editingId
      );

      if (index !== -1) {
        this.schedules[index] = { ...this.form, id: this.editingId };
      }

      this.successMessage = 'Schedule updated successfully.';
    } else {
      const newId =
        Math.max(0, ...this.schedules.map(schedule => schedule.id)) + 1;

      this.schedules.unshift({ ...this.form, id: newId });
      this.successMessage = 'Schedule added successfully.';
    }

    this.cancelEdit(false);
  }

  editSchedule(schedule: Schedule): void {
    this.editingId = schedule.id;
    this.originalSchedule = { ...schedule };
    this.form = { ...schedule };
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(clearMessages = true): void {
    this.editingId = null;
    this.originalSchedule = null;
    this.form = this.emptyForm();

    if (clearMessages) {
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  deleteSchedule(id: number): void {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    this.schedules = this.schedules.filter(schedule => schedule.id !== id);

    if (this.editingId === id) {
      this.cancelEdit();
    }

    this.successMessage = 'Schedule deleted successfully.';
    this.errorMessage = '';
  }

  getAgentName(agentId: string): string {
    return this.agents.find(agent => agent.id === agentId)?.name
      ?? 'Unknown Agent';
  }
}