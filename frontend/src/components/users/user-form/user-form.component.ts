import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CreateUserItem, RoleItem, UserItem} from "../../../interfaces/api/user/user";
import {UserService} from "../../../services/api/user.service";
import * as regex from "../../../utils/const/regex.constants";
import * as customValidators from "../../../utils/validators/customValidators";
import {NgIf} from "@angular/common";
import {SelectRolesEditComponent} from "../../roles/select-roles/select-roles.component";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SelectRolesEditComponent,
    RoleBadgeComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  constructor(private userService: UserService) {}

  @Input() roles: RoleItem[] = [];

  userForm = new FormGroup({
    name: new FormControl('', Validators.pattern(regex.user.name)),
    firstLastname: new FormControl('', Validators.pattern(regex.user.firstLastname)),
    secondLastname: new FormControl('', Validators.pattern(regex.user.secondLastname)),
    email: new FormControl('', Validators.pattern(regex.user.email)),
    nickname: new FormControl('', Validators.pattern(regex.user.nickname)),
    passwords: new FormGroup({
      password: new FormControl('', Validators.pattern(regex.user.password)),
      confirmPassword: new FormControl('', Validators.pattern(regex.user.password)),
    }),
    roles: new FormControl(new Array<RoleItem>(), Validators.required),
  }, {
    validators: [customValidators.passwordsMatch('password', 'confirmPassword')],
  });

  createUser = (event: SubmitEvent) => {
    if (this.userForm.invalid) return

    event.preventDefault();

    const user = this.getUserData();

    this.userService.createUser(user).subscribe();
  };

  private getUserData = () => {
    const formData = this.userForm.value;
    const roles = formData.roles?.map(role => role.id!);

    const user: CreateUserItem = {
      name: formData.name!,
      firstSurname: formData.firstLastname!,
      secondSurname: formData.secondLastname!,
      nickname: formData.nickname!,
      email: formData.email!,
      password: formData.passwords!.password!,
      picUrl: "https://www.mundodeportivo.com/files/image_449_220/files/fp/uploads/2024/05/24/6650bdf5b973a.r_d.2397-2343-902.jpeg",
      roleIds: roles!
    }

    return user;
  }
}
