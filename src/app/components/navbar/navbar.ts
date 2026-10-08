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

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {

      this.router.navigate(['/login']);

    });
  }
}