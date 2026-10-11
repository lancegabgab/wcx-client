import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Schedule {
  id: number;
  agentId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ScheduleInput {
  agentId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ScheduleFilters {
  agentId?: string;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseApiUrl}/Schedule`;

  // GET: api/Schedule
  getSchedules(
    filters?: ScheduleFilters
  ): Observable<ApiResponse<Schedule[]>> {
    let params = new HttpParams();

    if (filters?.agentId) {
      params = params.set('agentId', filters.agentId);
    }

    if (filters?.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom);
    }

    if (filters?.dateTo) {
      params = params.set('dateTo', filters.dateTo);
    }

    if (filters?.timeFrom) {
      params = params.set('timeFrom', `${filters.timeFrom}:00`);
    }

    if (filters?.timeTo) {
      params = params.set('timeTo', `${filters.timeTo}:00`);
    }

    return this.http.get<ApiResponse<Schedule[]>>(
      this.apiUrl,
      { params }
    );
  }

  // GET: api/Schedule/{id}
  getScheduleById(
    id: number
  ): Observable<ApiResponse<Schedule>> {
    return this.http.get<ApiResponse<Schedule>>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST: api/Schedule
  createSchedule(
    input: ScheduleInput
  ): Observable<ApiResponse<Schedule>> {
    return this.http.post<ApiResponse<Schedule>>(
      this.apiUrl,
      input
    );
  }

  // PUT: api/Schedule/{id}
  updateSchedule(
    id: number,
    input: ScheduleInput
  ): Observable<ApiResponse<Schedule>> {
    return this.http.put<ApiResponse<Schedule>>(
      `${this.apiUrl}/${id}`,
      input
    );
  }

  // DELETE: api/Schedule/{id}
  deleteSchedule(
    id: number
  ): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.apiUrl}/${id}`
    );
  }

  // GET: api/Schedule/my-schedules
  getMySchedules(): Observable<ApiResponse<Schedule[]>> {
    return this.http.get<ApiResponse<Schedule[]>>(
      `${this.apiUrl}/my-schedules`
    );
  }
}
