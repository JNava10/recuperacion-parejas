import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as regex from "../../../utils/const/regex.constants";
import {CreateUserItem, RoleItem, UserItem} from "../../../interfaces/api/user/user";
import * as customValidators from "../../../utils/validators/customValidators";
import {UserService} from "../../../services/api/user.service";
import {DialogModule} from "primeng/dialog";
import {Router} from "@angular/router";
import {ToastModule} from "primeng/toast";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";
import {MessageService} from "primeng/api";
import {MessageModule} from "primeng/message";
import {tap} from "rxjs";
import {getQueryToast} from "../../../utils/common.utils";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    DialogModule,
    ToastModule,
    CustomToastComponent,
    MessageModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  constructor(private userService: UserService, private router: Router, private messageService: MessageService) {}

  registerForm = new FormGroup({
    name: new FormControl('', Validators.pattern(regex.user.name)),
    firstLastname: new FormControl('', Validators.pattern(regex.user.firstLastname)),
    secondLastname: new FormControl('', Validators.pattern(regex.user.secondLastname)),
    email: new FormControl('', Validators.pattern(regex.user.email)),
    nickname: new FormControl('', Validators.pattern(regex.user.nickname)),
    passwords: new FormGroup({
      password: new FormControl('', Validators.pattern(regex.user.password)),
      confirmPassword: new FormControl('', Validators.pattern(regex.user.password)),
    }),
  }, {
    validators: [customValidators.passwordsMatch('password', 'confirmPassword')],
  });

  buildUserData = (event: SubmitEvent) => {
    event.preventDefault();

    if (this.registerForm.invalid) return;

    const {name, firstLastname, secondLastname, email, nickname, passwords} = this.registerForm.value;

    const user: CreateUserItem = {
      name: name!,
      firstSurname: firstLastname!,
      secondSurname: secondLastname!,
      email: email!,
      nickname: nickname!,
      password: passwords?.password!,
    }

    this.user = user;

    this.sendData()
  };

  registeredId?: number;
  user?: CreateUserItem
  showPicModal = false;

  sendData = () => {
    if (!this.user) return;

    this.userService.registerUser(this.user!).subscribe(body => {
      const message = getQueryToast(body.data.executed, body.message)

      this.messageService.add(message);

      if (body.data.executed) {
        this.registeredId = body.data.query.id;
        setTimeout(() => this.showPicModal = true, 350)
      }
    });
  };

  finishRegister = async () => {
    this.showPicModal = false;
    await this.router.navigate(['login'])
  };

  @Input() userId?: number;

  handleFiles = async ($event: Event) => {
    const input = $event.target as HTMLInputElement;

    const file = input.files?.item(0);

    if (!file) {
      this.showPicModal = false;
      await this.finishRegister()
    } else {
      console.log(this.registeredId)
      this.userService.updateUserAvatar(this.registeredId!, file!).subscribe(body => {
        const message = getQueryToast(body.data.executed, body.message)
        this.messageService.add(message)

        if (body.data.executed) {
          this.finishRegister()
        }
      })
    }
  };
}
