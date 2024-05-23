import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {UserRowComponent} from "../user-row/user-row.component";
import {ConfirmDeleteEventComponent} from "../../events/confirm-delete-event/confirm-delete-event.component";
import {DialogModule} from "primeng/dialog";

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

    @Input() users: UserItem[] = [];
    @Output() refresh = new EventEmitter<null>()

    emitRefresh = () => this.refresh.emit();
}
