import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";
import {AuthService} from "../../services/api/auth.service";
import * as regex from "../../utils/const/regex.constants";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  constructor(private customValidators: ValidationService, private authService: AuthService) {}
  //
  loginForm = new FormGroup({
    email: new FormControl('', [this.customValidators.isEmail, Validators.required]),
    password: new FormControl('', [this.customValidators.isPassword, Validators.required]),
  });

  handleLoginCredentials() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.errors)
      return
    }

    const email = this.loginForm.get('email')?.value!;
    const password = this.loginForm.get('password')?.value!;
    let token = null;

    this.authService.sendLoginData(email, password).subscribe(data => {
      if (data.logged) {
        this.handleToken(data.token);
      } else {
        // TODO: Show message.
      }
    })
  }

  private handleToken(token: string) {
    console.log(token);
  }
}
