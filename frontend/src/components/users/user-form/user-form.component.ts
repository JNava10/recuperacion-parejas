import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CreateUserItem, CreateUserResponse, RoleItem, UserItem} from "../../../interfaces/api/user/user";
import {UserService} from "../../../services/api/user.service";
import * as regex from "../../../utils/const/regex.constants";
import * as customValidators from "../../../utils/validators/customValidators";
import {NgIf} from "@angular/common";
import {SelectRolesEditComponent} from "../../roles/select-roles/select-roles.component";
import {RoleBadgeComponent} from "../../roles/role-badge/role-badge.component";
import {Message, MessageService} from "primeng/api";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";
import {getQueryToast, showQueryToast, validateFiles} from "../../../utils/common.utils";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SelectRolesEditComponent,
    RoleBadgeComponent,
    CustomToastComponent,
    ProgressSpinnerModule,
    MatProgressSpinner
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  constructor(private userService: UserService, private messageService: MessageService) {}

  @Input() roles: RoleItem[] = [];

  protected picFile?: File;
  loading = false;

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
    role: new FormControl('',[Validators.required, Validators.pattern(/[0-9]$/)]),
  }, {
    validators: [customValidators.passwordsMatch('password', 'confirmPassword')],
    updateOn: "submit"
  });

  createUser = (event: SubmitEvent) => {
    if (this.userForm.invalid) return

    event.preventDefault();

    const user = this.getUserData();

    this.userService.createUser(user).subscribe(res => {
      this.loading = true

      if (this.picFile) {
        this.changeUserAvatar(res.data.query.id, res)
        this.loading = false

      } else {
        if (res.data.errors) {
          res.data.errors.forEach(error => showQueryToast(res.data.executed, error, this.messageService))
        } else {
          showQueryToast(res.data.executed, res.message, this.messageService)
        }
        this.loading = false
      }
    });
  };

  private getUserData = () => {
    const formData = this.userForm.value;

    const user: CreateUserItem = {
      name: formData.name!,
      firstSurname: formData.firstLastname!,
      secondSurname: formData.secondLastname!,
      nickname: formData.nickname!,
      email: formData.email!,
      password: formData.passwords!.password!,
      roleIds: [Number(formData.role)]
    }

    return user;
  }

  protected handleFile = async ($event: Event) => {
    const input = $event.target as HTMLInputElement;

    const file = input.files?.item(0);
    if (file) {
      const valid = validateFiles([file], {maxCount: 1, maxSizeMb: 1}, this.messageService)

      if (!valid) return;

      this.picFile = file
    }
  };

  private changeUserAvatar = (id: number, createdRes: CreateUserResponse) => {
    this.userService.updateUserAvatar(id, this.picFile!).subscribe(res => {
      if (res.data.errors) {
        res.data.errors.forEach(error => showQueryToast(res.data.executed, error, this.messageService))
      } else {
        showQueryToast(res.data.executed, res.message, this.messageService)
      }

      this.loading = false
    });
  }
}
