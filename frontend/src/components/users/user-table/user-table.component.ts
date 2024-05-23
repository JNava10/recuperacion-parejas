import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {UserRowComponent} from "../user-row/user-row.component";
import {ConfirmDeleteEventComponent} from "../../events/confirm-delete-event/confirm-delete-event.component";
import {DialogModule} from "primeng/dialog";
import {UserService} from "../../../services/api/user.service";

@Component({
  selector: 'app-user-table',
  standalone: true,
    imports: [
        RoleBadgeComponent,
        UserRowComponent,
        ConfirmDeleteEventComponent,
        DialogModule
    ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
    constructor(private userService: UserService) {}

    @Input() users: UserItem[] = [];
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
