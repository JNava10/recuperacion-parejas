import { Routes } from '@angular/router';
import {LoginComponent} from "../public/login/login.component";
import {DashboardComponent} from "../public/dashboard/dashboard.component";
import {ChatComponent} from "../components/chatting/chat/chat.component";
import {EventsComponent} from "../public/events/events.component";
import {FindAvailableEventsComponent} from "../public/events/find-available-events/find-available-events.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'events', component: EventsComponent },
  { path: 'available-events', component: FindAvailableEventsComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
];
