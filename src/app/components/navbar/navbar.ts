import { Component, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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

  logout(): void {

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    this.router.navigate(['/login']);
  }
}