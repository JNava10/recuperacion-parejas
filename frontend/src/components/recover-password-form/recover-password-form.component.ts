import { Component } from '@angular/core';
import {CustomToastComponent} from "../custom-toast/custom-toast.component";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {UserService} from "../../services/api/user.service";
import * as regex from "../../utils/const/regex.constants";
import {StorageService} from "../../services/storage.service";

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
  constructor(private userService: UserService, private storageService: StorageService) {}

  emailSended = false;
  codeChecked = false;

  email?: string;

}
