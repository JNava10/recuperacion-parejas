import { Routes } from '@angular/router';
import {LoginComponent} from "../public/login/login.component";
import {DashboardComponent} from "../public/dashboard/dashboard.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
];
