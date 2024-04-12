import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";
import {AuthService} from "../../services/api/auth.service";

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

  loginForm = new FormGroup({
    email: new FormControl('', [this.customValidators.isEmail, Validators.required]),
    password: new FormControl('', [this.customValidators.isPassword, Validators.required]),
  });

  handleLoginCredentials() {
    const email = this.loginForm.get('email');
    const password = this.loginForm.get('password');


  }
}
