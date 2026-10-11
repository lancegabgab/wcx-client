import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Agents } from './pages/agents/agents';
import { Overview } from './pages/overview/overview';
import { StaffingRequirement } from './pages/staffing-requirement/staffing-requirement';
import { Scheduling } from './pages/scheduling/scheduling';
import { YourSchedulesComponent } from './pages/your-schedules/your-schedules';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'overview',
        component: Overview
    },
    {   
        path: 'scheduling', 
        component: Scheduling 
    },
    {
        path: 'staffing',
        component: StaffingRequirement
    },
    {
        path: 'requirements',
        component: StaffingRequirement
    },
    {
        path: 'agents',
        component: Agents
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'my-schedules',
        component: YourSchedulesComponent 
    },
];
