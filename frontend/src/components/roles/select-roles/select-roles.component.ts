import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RoleItem} from "../../../interfaces/api/user/user";

@Component({
  selector: 'app-select-roles',
  standalone: true,
  imports: [],
  templateUrl: './select-roles.component.html',
  styleUrl: './select-roles.component.css'
})
export class SelectRolesComponent {
  @Input() roles: RoleItem[] = [];
  @Output() sendRoles = new EventEmitter<RoleItem[]>();

  rolesSelected = new Set<RoleItem>();

  addRole = (role: RoleItem) => {
    if (this.rolesSelected.has(role)) {
      this.rolesSelected.delete(role)
      this.sendRoles.emit([...this.rolesSelected]);

      return
    }

    this.rolesSelected.add(role);

    this.sendRoles.emit([...this.rolesSelected]);
  };
}
