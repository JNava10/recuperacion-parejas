import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RoleItem, UserItem} from "../../../interfaces/api/user/user";
import {UserService} from "../../../services/api/user.service";

@Component({
  selector: 'app-select-roles',
  standalone: true,
  imports: [],
  templateUrl: './select-roles.component.html',
  styleUrl: './select-roles.component.css'
})
export class SelectRolesEditComponent implements OnInit {

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.alreadySelected?.forEach(role => {
      console.log(role)
      this.rolesSelected.add(role.id!);
    })
  }

  @Input() roles?: RoleItem[];
  @Input() user?: UserItem;
  @Input() alreadySelected?: RoleItem[];
  @Output() sendRole = new EventEmitter<{role: RoleItem, checked: boolean}>();

  protected rolesSelected = new Set<number>();

  addRole = (role: RoleItem) => {
    if (this.rolesSelected.has(role.id!)) {
      this.rolesSelected.delete(role.id!)
      this.userService.deleteRoles(this.user?.id!, [role?.id!]).subscribe()

      return;
    }

    this.rolesSelected.add(role.id!);
    this.userService.addRoles(this.user?.id!, [role?.id!]).subscribe()
  };
}
