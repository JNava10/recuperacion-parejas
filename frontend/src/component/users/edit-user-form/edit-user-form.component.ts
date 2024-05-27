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

  userDataForm = new FormGroup({
    name: new FormControl('', Validators.pattern(regex.user.name)),
    firstLastname: new FormControl('', Validators.pattern(regex.user.firstLastname)),
    secondLastname: new FormControl('', Validators.pattern(regex.user.secondLastname)),
    email: new FormControl('', Validators.pattern(regex.user.email)),
    nickname: new FormControl('', Validators.pattern(regex.user.nickname)),
  },);

  passwordsForm = new FormGroup({
    passwords: new FormGroup({
      password: new FormControl('', Validators.pattern(regex.user.password)),
      confirmPassword: new FormControl('', Validators.pattern(regex.user.password)),
    }),
  }, {  validators: [customValidators.passwordsMatch('password', 'confirmPassword')], updateOn: "submit"});

  rolesControl = new FormControl(new Array<RoleItem>(), Validators.required);

  editUser = (event: SubmitEvent) => {
    if (this.userDataForm.invalid) return

    event.preventDefault();

    const user = this.getUserData();

    this.userService.editUserData(user!, this.user?.id!).subscribe();
  };

  private getRolesData = () => {
    const roles = this.rolesControl.value;
    return roles?.map(role => role.id!);
  }

  private getUserData = () => {
    const formData = this.userDataForm.value;

    const user: CreateUserItem = {
      name: formData.name!,
      firstSurname: formData.firstLastname!,
      secondSurname: formData.secondLastname!,
      nickname: formData.nickname!,
      email: formData.email!,
    }

    return user;
  }

  setUserData() {
    this.userDataForm.patchValue({
      name: this.user!.name!,
      firstLastname: this.user!.firstSurname!,
      secondLastname: this.user!.firstSurname!,
      nickname: this.user!.nickname!,
      email: this.user!.email!,
    })
  }
  setRolesSelected(selectedRoles: RoleItem[]) {
    this.rolesControl.patchValue(selectedRoles);
  }

  handleSubmitRoles = () => {
    const roleIds = this.getRolesData()

  }

  handleSubmitPassword = () => {
    if (this.passwordsForm.invalid) return;

    const password = this.passwordsForm.value.passwords?.password;

    this.userService.updatePassword(this.user?.id!, password!).subscribe();
  };
}
