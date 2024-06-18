import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/api/user.service";
import {StorageService} from "../../../services/storage.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-send-code-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './send-code-form.component.html',
  styleUrl: './send-code-form.component.css'
})
export class SendCodeFormComponent implements OnInit {

  constructor(private userService: UserService, private storageService: StorageService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.queryParams['email'];
  }

  email?: string

  codeForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.min(100000), Validators.max(999999)]),
  });

  sendCode = () => {
    if (this.codeForm.invalid) return;

    const {code} = this.codeForm.value;

    this.userService.sendRecoverCode(code!, this.email!).subscribe(async res  => {
      this.storageService.save('recover-token', res.data.token);
      await this.router.navigate(['recover-password/password'])
    });
  };
}
