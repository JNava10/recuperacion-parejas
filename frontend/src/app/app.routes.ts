import { Routes } from '@angular/router';
import {LoginComponent} from "../public/login/login.component";
import {DashboardComponent} from "../public/dashboard/dashboard.component";
import {ChatComponent} from "../components/chatting/chat/chat.component";
import {EventsComponent} from "../public/events/events.component";
import {FindAvailableEventsComponent} from "../public/events/find-available-events/find-available-events.component";
import {EventInfoComponent} from "../components/events/event-info/event-info.component";
import {UsersComponent} from "../public/admin/users/users.component";
import {AddUserComponent} from "../public/users/add-user/add-user.component";
import {EditUserComponent} from "../public/users/edit-user/edit-user.component";
import {PreferencesComponent} from "../public/admin/preferences/preferences.component";
import {CreatePreferenceComponent} from "../public/admin/preferences/create-preference/create-preference.component";
import {
  CreateChoicePreferenceFormComponent
} from "../components/preferences/create-preference-form/create-choice-preference-form.component";
import {
  CreateRangePreferenceComponent
} from "../public/admin/preferences/create-range-preference/create-range-preference.component";
import {RegisterComponent} from "../public/register/register.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'events', component: EventsComponent },
  { path: 'available-events', component: FindAvailableEventsComponent },
  { path: 'event-info', component: EventInfoComponent },
  { path: 'users', component: UsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'create-choice-preference', component: CreateChoicePreferenceFormComponent },
  { path: 'create-range-preference', component: CreateRangePreferenceComponent },
  { path: 'register', component: RegisterComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
];
