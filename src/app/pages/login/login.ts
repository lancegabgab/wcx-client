import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import {
  AuthService,
  LoginInput
} from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginData: LoginInput = {
    email: '',
    password: ''
  };

  login() {

    this.authService.login(this.loginData)
      .subscribe({

        next: (response) => {

          // Save token
          localStorage.setItem(
            'token',
            response.data.token
          );

          // Save user information
          localStorage.setItem(
            'user',
            JSON.stringify(response.data)
          );

          Swal.fire({
            icon: 'success',
            title: response.message,
            text: `Welcome, ${response.data.firstName}!`,
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
          }).then(() => {

            this.router.navigate(['/']);

          });

        },

        error: (error) => {

          console.error('Login failed:', error);

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.error?.message || 'Invalid email or password.',
            confirmButtonText: 'Try Again'
          });

        }

      });
  }
}