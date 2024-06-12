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
import {getQueryToast} from "../../../utils/common.utils";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SelectRolesEditComponent,
    RoleBadgeComponent,
    CustomToastComponent,
    ProgressSpinnerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  constructor(private userService: UserService, private messageService: MessageService) {}

  @Input() roles: RoleItem[] = [];

  protected picFile?: File;
  creatingUser = false;

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
      this.creatingUser = true

      if (!res.data.executed) {
        const message: Message = {summary: res.message}
        message.severity = res.data.executed ? "success" : "error"
        this.messageService.add(message);
      }

      if (this.picFile) {
        this.changeCreatedUserAvatar(res.data.query.id, res)
      } else {
        const message: Message = {summary: res.message}
        message.severity = res.data.executed ? "success" : "error"
        this.messageService.add(message);
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
      picUrl: "https://www.mundodeportivo.com/files/image_449_220/files/fp/uploads/2024/05/24/6650bdf5b973a.r_d.2397-2343-902.jpeg",
      roleIds: [Number(formData.role)]
    }

    return user;
  }

  protected handleFile = async ($event: Event) => {
    const input = $event.target as HTMLInputElement;

    const file = input.files?.item(0);

    if (file) {
      this.picFile = file
    }
  };

  private sendPic = () => {
    // this.userService.updateUserAvatar(this.registeredId!, file!).subscribe(body => {
    //   const message = getQueryToast(body.data.executed, body.message)
    //   this.messageService.add(message)
    //
    //   if (body.data.executed) {
    //     this.finishRegister()
    //   }
    // })
  }

  private changeCreatedUserAvatar = (id: number, createdRes: CreateUserResponse) => {
    this.userService.updateUserAvatar(id, this.picFile!).subscribe(() => {
      const message: Message = {summary: createdRes.message}

      message.severity = createdRes.data.executed ? "success" : "error";

      this.messageService.add(message);

      this.creatingUser = false
    });
  }
}
