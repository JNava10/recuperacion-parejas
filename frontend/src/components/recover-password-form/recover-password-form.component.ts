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
  constructor(private userService: UserService) {
  }

  getEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  handleEmail = () => {
    if (this.getEmailForm.invalid) return

    const {email} = this.getEmailForm.value;

    this.userService.sendRecoverEmail(email!);
  };

  emailSended = false;
}
