import {Component, Input, OnInit} from '@angular/core';
import {CustomToastComponent} from "../custom-toast/custom-toast.component";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CreateUserItem, CrudEditResponse, RoleItem, UserItem} from "../../interfaces/api/user/user";
import * as regex from "../../utils/const/regex.constants";
import * as customValidators from "../../utils/validators/customValidators";
import {Message, MessageService} from "primeng/api";
import {UserService} from "../../services/api/user.service";
import {showQueryToast} from "../../utils/common.utils";
import {addBodyClass} from "@angular/cdk/schematics";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-edit-profile-data-form',
  standalone: true,
  imports: [
    CustomToastComponent,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    MatProgressSpinner
  ],
  templateUrl: './edit-profile-data-form.component.html',
  styleUrl: './edit-profile-data-form.component.css'
})
export class EditProfileDataFormComponent implements OnInit {
  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit() {
    console.log(this.user)

    this.profileDataForm.patchValue({
      email: this.user?.email,
      name: this.user?.name,
      firstLastname: this.user?.firstSurname,
      secondLastname: this.user?.secondSurname,
      nickname: this.user?.nickname,
    })

    this.initialData = this.user
  }

  @Input() user?: UserItem
  initialData?: UserItem
  protected picFile?: File;
  loading = false;

  profileDataForm = new FormGroup({
    name: new FormControl('', Validators.pattern(regex.user.name)),
    firstLastname: new FormControl('', Validators.pattern(regex.user.firstLastname)),
    secondLastname: new FormControl('', Validators.pattern(regex.user.secondLastname)),
    email: new FormControl('', Validators.pattern(regex.user.email)),
    nickname: new FormControl('', Validators.pattern(regex.user.nickname)),
  }, {
    updateOn: "submit"
  });

  editUserData = (event: SubmitEvent) => {
    if (this.profileDataForm.invalid) return

    event.preventDefault();

    const user = this.getUserData();

    this.userService.editProfileData(user).subscribe(res => {
      if (this.picFile) {
        this.changeUserAvatar(this.user?.id!, res)
      } else {
        showQueryToast(res.data.executed, res.message, this.messageService)
      }

      this.loading = false;
    });
  };

  protected handleFile = async ($event: Event) => {
    const input = $event.target as HTMLInputElement;

    const file = input.files?.item(0);

    if (file) {
      this.picFile = file
      console.log(this.picFile)
    }
  };

  private getUserData = () => {
    const formData = this.profileDataForm.value;

    const user: CreateUserItem = {
      name: formData.name!,
      firstSurname: formData.firstLastname!,
      secondSurname: formData.secondLastname!,
      nickname: formData.nickname!,
      email: formData.email!,
    }

    return user;
  }

  private changeUserAvatar = (id: number, res: CrudEditResponse) => {
    this.userService.updateUserAvatar(id, this.picFile!).subscribe(body => {
      showQueryToast(res.data.executed, res.message, this.messageService)

      this.loading = false
    });
  }
}
