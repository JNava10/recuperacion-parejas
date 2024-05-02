import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MessageInputComponent} from "../message-input/message-input.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {User} from "../../../interfaces/api/user/user";
import {ChatService} from "../../../services/api/chat.service";
import {ChatMessages, Message, MessageUser} from "../../../interfaces/api/chat/message";
import {MessagesComponent} from "../messages/messages.component";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MessageInputComponent,
    MessagesComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  constructor(private route: ActivatedRoute, private chatService: ChatService, private socketService: SocketService) {}

  partnerId?: number
  partner?: MessageUser
  self?: MessageUser

  messages: Message[] = [];
  emitter?: MessageUser
  receiver?: MessageUser

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.partnerId = Number(params.get('id')!);
    });

    this.chatService.getMessages(this.partnerId!).subscribe(this.getMessages)
  }

  private getMessages = (body: ChatMessages) => {
    this.messages = body.data.query.messages;
    this.partner = body.data.query.receiverUser;
    this.self = body.data.query.emitterUser;

    console.log(this.messages, this.partner)
  }

  sendMessage = (text: string) => {
    this.socketService.sendMessage(text, this.partner!.id!);
  }

  handleNewMessage = (text: string) => {
    this.sendMessage(text)
  };
}
