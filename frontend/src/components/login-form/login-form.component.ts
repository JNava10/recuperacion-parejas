import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";
import {AuthService} from "../../services/api/auth.service";
import * as regex from "../../utils/const/regex.constants";
import {NgIf} from "@angular/common";
import {FormErrorComponent} from "../messages/form-error/form-error.component";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormErrorComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  constructor(private customValidators: ValidationService, private authService: AuthService) {}
  //
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    // password: new FormControl('', [Validators.required, this.customValidators.isPassword]),
  });

  handleLoginCredentials() {
    if (!this.loginForm.valid) {
      // TODO: Mostrar mensaje.
      console.log(this.loginForm.value)
      return;
    }

    const email = this.loginForm.get('email')?.value!;
    const password = this.loginForm.get('password')?.value!;

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
