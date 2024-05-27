import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {SelectRolesComponent} from "../../../components/roles/select-roles/select-roles.component";
import {UserService} from "../../../services/api/user.service";
import {CreateUserItem, RoleItem, UserItem} from "../../../interfaces/api/user/user";
import * as regex from "../../../utils/const/regex.constants";
import * as customValidators from "../../../utils/validators/customValidators";

@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    SelectRolesComponent
  ],
  templateUrl: './edit-user-form.component.html',
  styleUrl: './edit-user-form.component.css'
})
export class EditUserFormComponent implements OnInit {
  constructor(private userService: UserService) {}

 ngOnInit() {
   this.setUserData()
 }

  @Input() roles: RoleItem[] = [];
  @Input() user?: UserItem;

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

  editUser = (event: SubmitEvent) => {
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

  setUserData() {
    this.userForm.patchValue({
      name: this.user!.name!,
      firstLastname: this.user!.firstSurname!,
      secondLastname: this.user!.firstSurname!,
      nickname: this.user!.nickname!,
      email: this.user!.email!,
    })
  }
  setRolesSelected(selectedRoles: RoleItem[]) {
    this.userForm.patchValue({roles: selectedRoles})
  }
}
