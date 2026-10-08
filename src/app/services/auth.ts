import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserInput {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserOutput {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginOutput {
  token: string;
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = environment.baseApiUrl;

  register(
    input: UserInput
  ): Observable<Response<UserOutput>> {

    return this.http.post<Response<UserOutput>>(
      `${this.apiUrl}/auth/register`,
      input
    );
  }

  login(
    input: LoginInput
  ): Observable<Response<LoginOutput>> {

    return this.http.post<Response<LoginOutput>>(
      `${this.apiUrl}/auth/login`,
      input
    );
  }
}