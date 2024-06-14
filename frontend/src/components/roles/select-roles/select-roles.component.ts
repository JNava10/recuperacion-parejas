import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RoleItem, UserItem} from "../../../interfaces/api/user/user";
import {UserService} from "../../../services/api/user.service";
import {getQueryToast} from "../../../utils/common.utils";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-select-roles',
  standalone: true,
  imports: [],
  templateUrl: './select-roles.component.html',
  styleUrl: './select-roles.component.css'
})
export class SelectRolesEditComponent implements OnInit {

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.alreadySelected?.forEach(role => {
      this.rolesSelected.add(role.id!);
    })

    this.userService.getRoleUsersCount('admin').subscribe(body => {
      this.adminCount = body.data.count;
    })

    this.adminRole = this.roles?.find(role => role.name === 'admin');
  }

  @Input() roles?: RoleItem[];
  @Input() user?: UserItem;
  @Input() alreadySelected?: RoleItem[];
  @Input() onlyOneAdmin?: boolean;
  @Output() sendRole = new EventEmitter<{role: RoleItem, checked: boolean}>();

  adminRole?: RoleItem
  adminCount?: number

  protected rolesSelected = new Set<number>();

  addRole = (role: RoleItem) => {
    if (this.rolesSelected.has(role.id!)) {
      this.deleteRole(role);
      return
    }

    this.rolesSelected.add(role.id!);

    this.userService.addRoles(this.user?.id!, [role?.id!]).subscribe(body => {
      const message = getQueryToast(body.data.executed, body.message);

      this.messageService.add(message)
    })
  };

  private deleteRole(role: RoleItem) {
    this.rolesSelected.delete(role.id!)
    this.userService.deleteRoles(this.user?.id!, [role?.id!]).subscribe(body => {
      const message = getQueryToast(body.data.executed, body.message);

      this.messageService.add(message);
    })

    return;
  }
}
