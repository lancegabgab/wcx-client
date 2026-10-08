import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get user(): any {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    }).then(() => {

      this.router.navigate(['/login']);

    });
  }
}