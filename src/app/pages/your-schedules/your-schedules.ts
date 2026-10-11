import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class YourSchedulesComponent implements OnInit {
  private scheduleService = inject(MyScheduleService);

  schedules: MySchedule[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.scheduleService.getMySchedules().subscribe({
      next: (response) => {
        if (response.success) {
          this.schedules = response.data ?? [];
        } else {
          this.errorMessage =
            response.message || 'Failed to load your schedules.';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load schedules:', error);

        this.errorMessage =
          error.status === 401
            ? 'Your session has expired. Please log in again.'
            : 'Unable to load your schedules. Please try again.';

        this.isLoading = false;
      }
    });
  }
}
