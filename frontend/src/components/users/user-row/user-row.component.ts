import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {UserItem} from "../../../interfaces/api/user/user";
import {UserService} from "../../../services/api/user.service";
import {ConfirmDeleteEventComponent} from "../../events/confirm-delete-event/confirm-delete-event.component";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-user-row',
  standalone: true,
  imports: [
    RoleBadgeComponent,
    ConfirmDeleteEventComponent,
    DialogModule
  ],
  templateUrl: './user-row.component.html',
  styleUrl: './user-row.component.css'
})
export class UserRowComponent {
  constructor(private userService: UserService) {}

  @Input() user?: UserItem
  @Output() refresh = new EventEmitter<null>()

  deletingUser = false;

  handleDeleteUser = (confirmDelete: boolean) => {
    if (!confirmDelete) this.deletingUser = false;

    this.userService.deleteUser(this.user!).subscribe(deleted => {
      if (deleted) this.refresh.emit()
    });
  }
}