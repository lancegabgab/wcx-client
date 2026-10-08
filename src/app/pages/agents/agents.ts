import { Component, OnInit, inject } from '@angular/core';
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
export class Agents implements OnInit {

  private userService = inject(UserService);

  agents: UserOutput[] = [];

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.userService.getAgents().subscribe({
      next: (response) => {
        this.agents = response;
        console.log('Agents:', this.agents);
      },
      error: (error) => {
        console.error('Failed to load agents:', error);
      }
    });
  }
}