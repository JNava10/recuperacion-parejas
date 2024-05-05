import {Component, Input} from '@angular/core';
import {Message, MessageUser} from "../../../interfaces/api/chat/message";
import {SelfMessageBubbleComponent} from "../self-message-bubble/self-message-bubble.component";
import {PartnerMessageBubbleComponent} from "../partner-message-bubble/partner-message-bubble.component";

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    SelfMessageBubbleComponent,
    PartnerMessageBubbleComponent
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  @Input() messages: Map<number, Message> = new Map();

  @Input() self?: MessageUser;
  @Input() partner?: MessageUser;


}
