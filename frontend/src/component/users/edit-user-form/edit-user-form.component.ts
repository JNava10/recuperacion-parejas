import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {SelectRolesEditComponent} from "../../../components/roles/select-roles/select-roles.component";
import {UserService} from "../../../services/api/user.service";
import {
  CreateUserItem,
  CreateUserResponse,
  CrudEditResponse,
  RoleItem,
  UserItem
} from "../../../interfaces/api/user/user";
import * as regex from "../../../utils/const/regex.constants";
import * as customValidators from "../../../utils/validators/customValidators";
import {CustomToastComponent} from "../../../components/custom-toast/custom-toast.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Message, MessageService} from "primeng/api";
import {FileValidationOptions} from "../../../interfaces/fileValidation";
import {showQueryToast, validateFiles} from "../../../utils/common.utils";

@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    SelectRolesEditComponent,
    CustomToastComponent,
    MatProgressSpinner
  ],
  templateUrl: './edit-user-form.component.html',
  styleUrl: './edit-user-form.component.css'
})
export class EditUserFormComponent implements OnInit {
  constructor(private userService: UserService, private messageService: MessageService) {}

 ngOnInit() {
   this.setUserData()
 }

  @Input() roles?: RoleItem[];
  @Input() user?: UserItem;

  protected picFile?: File;
  loading = false;

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

  editUser = (event: SubmitEvent) => {

    if (this.userDataForm.invalid) return

    event.preventDefault();

    const user = this.getUserData();

    this.userService.editUserData(user!, this.user?.id!).subscribe(body => {
      this.loading = true

      if (this.picFile) {
        this.changeUserAvatar(this.user?.id!, body)
      }

      showQueryToast(body.data.executed, body.message, this.messageService)

    });
  };

  protected handleFile = async ($event: Event) => {
    const input = $event.target as HTMLInputElement;

    const file = input.files?.item(0);

    if (file) {
      const valid = validateFiles([file], {maxSizeMb: 1, maxCount: 1}, this.messageService);

      if (!valid) return;

      this.picFile = file
    }
  };

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

  setUserData = () => {
    this.userDataForm.patchValue({
      name: this.user!.name!,
      firstLastname: this.user!.firstSurname!,
      secondLastname: this.user!.secondSurname!,
      nickname: this.user!.nickname!,
      email: this.user!.email!,
    })
  };

  handleSubmitPassword = () => {
    if (this.passwordsForm.invalid) return;

    const password = this.passwordsForm.value.passwords?.password;

    this.userService.updatePassword(this.user?.id!, password!).subscribe();
  };

  private changeUserAvatar = (id: number, res: CrudEditResponse) => {
    this.userService.updateUserAvatar(id, this.picFile!).subscribe(body => {
      showQueryToast(body.data.executed, body.message, this.messageService)

      this.loading = false
    });
  }

}
