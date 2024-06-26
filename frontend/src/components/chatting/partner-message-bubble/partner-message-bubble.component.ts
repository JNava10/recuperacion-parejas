import {Component, Input} from '@angular/core';
import {Message, MessageUser} from "../../../interfaces/api/chat/message";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-partner-message-bubble',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './partner-message-bubble.component.html',
  styleUrl: './partner-message-bubble.component.css'
})
export class PartnerMessageBubbleComponent {
  @Input() message?: Message;
  @Input() user?: MessageUser;
}
