import { Routes } from '@angular/router';
import {LoginComponent} from "../public/login/login.component";
import {DashboardComponent} from "../public/dashboard/dashboard.component";
import {ChatComponent} from "../components/chatting/chat/chat.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
];
