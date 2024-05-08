import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";
import {AuthService} from "../../services/api/auth.service";
import {NgIf} from "@angular/common";
// import {FormErrorComponent} from "../messages/form-error/form-error.component";
import {MessageService} from "primeng/api";
import {MessagesModule} from "primeng/messages";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    // FormErrorComponent,
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private customValidators: ValidationService,
    private storageService: StorageService,
    private router: Router
  ) {}
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, this.customValidators.isPassword]),
  });

  handleLoginCredentials() {
    if (!this.loginForm.valid) {
      this.messageService.add({summary: 'Error', detail: 'Formulario no valido', severity: 'error'});

      return;
    }

    const email = this.loginForm.get('email')?.value!;
    const password = this.loginForm.get('password')?.value!;

    this.authService.sendLoginData(email, password).subscribe(async res => {
      if (res.data.logged) {
        await this.handleToken(res.data.token);
      } else {
        this.messageService.add({summary: 'Error', detail: res.message, severity: 'error'})
      }
    })
  }

  private handleToken = async (token: string) => {
    this.storageService.save('token', token);
    await this.router.navigate(['/dashboard']);
  }
}
