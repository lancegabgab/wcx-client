import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

import {
  MyScheduleService,
  MySchedule
} from '../../services/my-schedule';

@Component({
  selector: 'app-your-schedules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './your-schedules.html',
  styleUrl: './your-schedules.css'
})
export class YourSchedulesComponent implements OnInit, OnDestroy {
  private scheduleService = inject(MyScheduleService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  schedules: MySchedule[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    // Load schedules on the first visit.
    this.loadSchedules();

    // Reload whenever navigation returns to Your Schedules.
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd &&
            event.urlAfterRedirects.split('?')[0] === '/your-schedules'
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadSchedules();
      });
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.scheduleService.getMySchedules().subscribe({
      next: (response) => {
        if (response.success) {
          this.schedules = response.data ?? [];
        } else {
          this.schedules = [];
          this.errorMessage =
            response.message || 'Failed to load your schedules.';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load schedules:', error);

        this.schedules = [];
        this.errorMessage =
          error.status === 401
            ? 'Your session has expired. Please log in again.'
            : 'Unable to load your schedules. Please try again.';

        this.isLoading = false;
      }
    });
  }

  formatTime(time: string): string {
    if (!time) {
      return '';
    }

    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  getDuration(schedule: MySchedule): number {
    const start = this.timeToMinutes(schedule.startTime);
    const end = this.timeToMinutes(schedule.endTime);

    if (end < start) {
      return 0;
    }

    return (end - start) / 60;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
