import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User, UserItem} from "../../../interfaces/api/user/user";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {Router} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {DialogModule} from "primeng/dialog";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";
import {MessageService} from "primeng/api";
import {getQueryToast, showQueryToast} from "../../../utils/common.utils";
import {TableModule} from "primeng/table";
import {StyleClassModule} from "primeng/styleclass";

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    RoleBadgeComponent,
    DialogModule,
    CustomToastComponent,
    TableModule,
    StyleClassModule
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  constructor(private router: Router, private userService: UserService, private messageService: MessageService) {}

  @Input() users: UserItem[] = [];

  goToAddForm = async () => {
    await this.router.navigate(['/admin/users/add']);
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

    this.userService.deleteUser(user!).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      if (body.data.executed) this.refresh.emit();

      this.cancelDeleteUser();
    });
  }

  goToEditUser = (user: UserItem) => {
    this.router.navigate(['/admin/users/edit'], {queryParams: {id: user.id}})
  }

  cancelDeleteUser = () => {
    this.userToDelete = undefined;
    this.deletingUser = false
  }
}
