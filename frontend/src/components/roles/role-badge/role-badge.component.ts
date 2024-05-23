import {Component, Input} from '@angular/core';
import {Role} from "../../../interfaces/api/user/user";

@Component({
  selector: 'app-role-badge',
  standalone: true,
  imports: [],
  templateUrl: './role-badge.component.html',
  styleUrl: './role-badge.component.css'
})
export class RoleBadgeComponent {
  @Input() role?: Role
}
