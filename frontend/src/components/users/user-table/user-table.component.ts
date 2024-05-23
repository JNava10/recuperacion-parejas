import {Component, Input} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    RoleBadgeComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  @Input() users: UserItem[] = [];
}
