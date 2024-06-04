import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {Router} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    RoleBadgeComponent,
    DialogModule
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  constructor(private router: Router, private userService: UserService) {}

  @Input() users: UserItem[] = [];

  goToAddForm = () => {
    this.router.navigate(['add-user']);
  };

  @Output() refresh = new EventEmitter<null>()

  deletingUser = false;
  userToDelete?: UserItem;

  showIfDeleteUser = (user: UserItem) => {
    this.userToDelete = user;
    this.deletingUser = true;
  };

  handleDeleteUser = (user?: UserItem) => {
    if (!user) this.cancelDeleteUser()

    this.userService.deleteUser(user!).subscribe(deleted => {
      this.cancelDeleteUser();

      if (deleted) this.refresh.emit()
    });
  }

  cancelDeleteUser = () => {
    this.userToDelete = undefined;
    this.deletingUser = false
  }
}
