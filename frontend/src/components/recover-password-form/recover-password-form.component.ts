import { Component } from '@angular/core';
import {CustomToastComponent} from "../custom-toast/custom-toast.component";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {UserService} from "../../services/api/user.service";

@Component({
  selector: 'app-recover-password-form',
  standalone: true,
    imports: [
        CustomToastComponent,
        NgIf,
        PaginatorModule,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './recover-password-form.component.html',
  styleUrl: './recover-password-form.component.css'
})
export class RecoverPasswordFormComponent {
  constructor(private userService: UserService) {}

  emailSended = false;
  codeChecked = false;

  email?: string;

  getEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  sendCodeForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.min(100000), Validators.max(999999)]),
  });

  handleEmail = () => {
    if (this.getEmailForm.invalid) return

    const {email} = this.getEmailForm.value;

    this.userService.sendRecoverEmail(email!).subscribe(sended => {
      this.emailSended = sended;
      this.email = email!
    });
  };

  sendCode = () => {
    if (this.sendCodeForm.invalid) return;

    const {code} = this.sendCodeForm.value;

    this.userService.sendRecoverCode(code!, this.email!).subscribe(checked => {
      this.codeChecked = checked;
    });
  };

}
