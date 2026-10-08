import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import {
  AuthService,
  UserInput
} from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  registerData: UserInput = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  register() {

    this.authService.register(this.registerData)
      .subscribe({

        next: (response) => {

          Swal.fire({
            icon: 'success',
            title: response.message,
            text: 'You can now login to your account.',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
          }).then(() => {

            this.router.navigate(['/login']);

          });

        },

        error: (error) => {

          console.error('Registration failed:', error);

          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.error?.message || 'Unable to create your account.',
            confirmButtonText: 'Try Again'
          });

        }

      });
  }
}