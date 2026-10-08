import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Agents } from './pages/agents/agents';
import { Staffing } from './pages/staffing/staffing';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'staffing-requirements',
        component: Staffing
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
];
