import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MySchedule {
  id: number;
  agentId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface MySchedulesResponse {
  success: boolean;
  message: string;
  data: MySchedule[];
}

@Injectable({
  providedIn: 'root'
})
export class MyScheduleService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.baseApiUrl}/Schedule`;

  getMySchedules(): Observable<MySchedulesResponse> {
    return this.http.get<MySchedulesResponse>(
      `${this.apiUrl}/my-schedules`
    );
  }
}