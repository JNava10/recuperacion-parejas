import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User, UserItem} from "../../../interfaces/api/user/user";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {Router, RouterOutlet} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {DialogModule} from "primeng/dialog";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";
import {MessageService} from "primeng/api";
import {getQueryToast, showQueryToast} from "../../../utils/common.utils";
import {TableModule} from "primeng/table";
import {StyleClassModule} from "primeng/styleclass";
import {SidebarModule} from "primeng/sidebar";
import {AddUserComponent} from "../../../public/users/add-user/add-user.component";
import {EditUserComponent} from "../../../public/users/edit-user/edit-user.component";

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    RoleBadgeComponent,
    DialogModule,
    CustomToastComponent,
    TableModule,
    StyleClassModule,
    SidebarModule,
    AddUserComponent,
    EditUserComponent,
    RouterOutlet
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  constructor(protected router: Router, private userService: UserService, private messageService: MessageService) {}

  @Input() users: UserItem[] = [];

  showCreateForm = async () => {
    this.showCreate = true
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

  showEditUser = async (user: UserItem) => {
    this.showEdit = true
    await this.router.navigate(['/admin/users/edit'], {queryParams: {id: user.id}})
  }

  activateUser = (user: UserItem, enable: boolean) => {
    this.userService.enableOrDisableUser(user, enable).subscribe(body => {
      if (body.data.executed) this.refresh.emit()
    })
  }

  cancelDeleteUser = () => {
    this.userToDelete = undefined;
    this.deletingUser = false
  }

  showCreate = false
  userEditing?: number
  showEdit = false

  emitRefresh() {
    this.refresh.emit()
  }

  onHideEditForm = async () => {
    this.showEdit = false;
    await this.router.navigate(['/admin/users'])
  };

  onShowEditForm = async () => {
    await this.router.navigate(['/admin/users/edit'], {queryParams: {id: this.userEditing}})
  };
}
