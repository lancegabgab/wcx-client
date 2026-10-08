import { Component, afterNextRender, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  UserService,
  UserOutput
} from '../../services/user';

@Component({
  selector: 'app-agents',
  imports: [DatePipe],
  templateUrl: './agents.html',
  styleUrl: './agents.css',
})
export class Agents {

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  agents: UserOutput[] = [];

  constructor() {

    afterNextRender(() => {
      this.loadAgents();
    });

  }

  loadAgents(): void {

    this.userService.getAgents().subscribe({

      next: (response) => {

        this.agents = response;

        console.log('Agents:', this.agents);

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load agents:', error);

      }

    });

  }

}
