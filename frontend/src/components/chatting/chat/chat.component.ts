import {Component, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MessageInputComponent} from "../message-input/message-input.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {User} from "../../../interfaces/api/user/user";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MessageInputComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService) {}

  partnerId?: string
  partner?: User

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.partnerId = params.get('id')!;
    });

    this.userService.
  }
}
