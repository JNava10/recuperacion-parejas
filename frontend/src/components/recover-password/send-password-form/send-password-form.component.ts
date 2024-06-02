import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as regex from "../../../utils/const/regex.constants";
import {UserService} from "../../../services/api/user.service";
import {StorageService} from "../../../services/storage.service";

@Component({
  selector: 'app-send-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './send-password-form.component.html',
  styleUrl: './send-password-form.component.css'
})
export class SendPasswordFormComponent {
  constructor(private userService: UserService, private storageService: StorageService) {}

  passwordsForm = new FormGroup({
    passwords: new FormGroup({
      password: new FormControl('', Validators.pattern(regex.user.password)),
      confirmPassword: new FormControl('', Validators.pattern(regex.user.password)),
    }),
  });

  sendPasswords = () => {
    if (this.passwordsForm.invalid) return;

    const {password} = this.passwordsForm.value.passwords!;
    const recoverToken = this.storageService.get('recover-token')

    this.userService.sendNewPassword(password!, recoverToken!).subscribe(executed => {});
  };
}
