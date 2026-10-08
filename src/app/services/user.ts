
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserOutput {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = environment.baseApiUrl;

  getAgents(): Observable<UserOutput[]> {
    return this.http.get<UserOutput[]>(
      `${this.apiUrl}/User/agents`
    );
  }
}