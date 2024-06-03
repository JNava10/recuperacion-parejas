import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../../services/api/user.service";
import {StorageService} from "../../../services/storage.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-send-email-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './send-email-form.component.html',
  styleUrl: './send-email-form.component.css'
})
export class SendEmailFormComponent {
  constructor(private userService: UserService, private router: Router) {}

  getEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  handleEmail = () => {
    if (this.getEmailForm.invalid) return

    const {email} = this.getEmailForm.value;

    this.userService.sendRecoverEmail(email!).subscribe(sended => {
      if (sended) this.router.navigate(['recover-password/code'], {queryParams: {email}})
    });
  };
}
