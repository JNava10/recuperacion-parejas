import {Component, Input} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {Router} from "@angular/router";

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
  constructor(private router: Router) {}

  @Input() users: UserItem[] = [];

  goToAddForm = () => {
    this.router.navigate(['add-user']);
  };
}
