import { Routes } from '@angular/router';
import {LoginComponent} from "../public/login/login.component";
import {LoginFormComponent} from "../components/login-form/login-form.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'a', component: LoginFormComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
];
