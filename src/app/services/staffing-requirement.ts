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
  staffingGap: number;
  staffingStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffingRequirementService {

  private http = inject(HttpClient);
  private apiUrl = environment.baseApiUrl;

  getAll(): Observable<StaffingRequirement[]> {
    return this.http.get<StaffingRequirement[]>(
      `${this.apiUrl}/StaffingRequirement`,
    );
  }
}