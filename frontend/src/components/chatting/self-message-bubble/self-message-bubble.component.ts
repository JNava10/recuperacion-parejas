import {Component, Input} from '@angular/core';
import {Message, MessageUser} from "../../../interfaces/api/chat/message";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-self-message-bubble',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './self-message-bubble.component.html',
  styleUrl: './self-message-bubble.component.css'
})
export class SelfMessageBubbleComponent {
  @Input() message?: Message;
  @Input() user?: MessageUser;
}
