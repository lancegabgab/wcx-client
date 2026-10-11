import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StaffingRequirement {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  requiredAgents: number;
  scheduledAgents: number;
}

export interface StaffingRequirementInput {
  date: string;
  startTime: string;
  endTime: string;
  requiredAgents: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

@Injectable({
  providedIn: 'root'
})
export class StaffingRequirementService {
  private http = inject(HttpClient);

  private readonly apiUrl =`${environment.baseApiUrl}/StaffingRequirement`;

  getAll(): Observable<ApiResponse<StaffingRequirement[]>> {
    return this.http.get<ApiResponse<StaffingRequirement[]>>(
      this.apiUrl
    );
  }

  getById(id: number): Observable<ApiResponse<StaffingRequirement>> {
    return this.http.get<ApiResponse<StaffingRequirement>>(
      `${this.apiUrl}/${id}`
    );
  }

  create(
    input: StaffingRequirementInput
  ): Observable<ApiResponse<StaffingRequirement>> {
    return this.http.post<ApiResponse<StaffingRequirement>>(
      this.apiUrl,
      input
    );
  }

  update(
    id: number,
    input: StaffingRequirementInput
  ): Observable<ApiResponse<StaffingRequirement>> {
    return this.http.put<ApiResponse<StaffingRequirement>>(
      `${this.apiUrl}/${id}`,
      input
    );
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.apiUrl}/${id}`
    );
  }
}