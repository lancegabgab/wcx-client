import { Component, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  get isLoggedIn(): boolean {

    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return !!localStorage.getItem('token');
  }

  get isAdmin(): boolean {

    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const user = localStorage.getItem('user');

    if (!user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);

      return userData.role === 'Admin';

    } catch {
      return false;
    }
  }

  // logout(): void {

  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //   }

  //   this.router.navigate(['/login']);
  // }
  async logout(): Promise<void> {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to logout from your account?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    // Call your existing logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    await Swal.fire({
      title: 'Logged out!',
      text: 'You have been logged out successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });

    window.location.href = '/login';
  }
}
}