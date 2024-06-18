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
import {RecoverPasswordComponent} from "../public/recover-password/recover-password.component";
import {SendEmailFormComponent} from "../components/recover-password/send-email-form/send-email-form.component";
import {SendCodeFormComponent} from "../components/recover-password/send-code-form/send-code-form.component";
import {
  SendPasswordFormComponent
} from "../components/recover-password/send-password-form/send-password-form.component";
import {StartComponent} from "../public/start/start.component";
import {AdminComponent} from "../public/admin/admin.component";
import {EditProfileComponent} from "../public/edit-profile/edit-profile.component";
import {NotificationListComponent} from "../components/notifications/notification-list/notification-list.component";
import {PendingChatsComponent} from "../public/pending-chats/pending-chats.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'available-events', component: FindAvailableEventsComponent },
  { path: 'notifications', component: NotificationListComponent },
  { path: 'pending-chats', component: PendingChatsComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'event-info', component: EventInfoComponent },
  { path: 'create-choice-preference', component: CreateChoicePreferenceFormComponent },
  { path: 'create-range-preference', component: CreateRangePreferenceComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover-password/email', component: SendEmailFormComponent },
  { path: 'recover-password/code', component: SendCodeFormComponent },
  { path: 'recover-password/password', component: SendPasswordFormComponent },
  { path: 'start', component: StartComponent },
  { path: 'admin', component: AdminComponent, children: [
      { path: 'users', component: UsersComponent, children: [
          { path: 'edit', component: EditUserComponent },
          { path: 'add', component: AddUserComponent }
        ] },
      { path: 'events', component: EventsComponent },
      { path: 'preferences', component: PreferencesComponent },
    ]
  },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'recover-password',   redirectTo: '/recover-password/email', pathMatch: 'full' },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
];
