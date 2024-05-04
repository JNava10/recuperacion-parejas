import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MessageInputComponent} from "../message-input/message-input.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {User} from "../../../interfaces/api/user/user";
import {ChatService} from "../../../services/api/chat.service";
import {ChatMessages, Message, MessageUser} from "../../../interfaces/api/chat/message";
import {MessagesComponent} from "../messages/messages.component";
import {SocketService} from "../../../services/socket.service";
import {ChatJoin} from "../../../interfaces/socket/chat";
import {StorageService} from "../../../services/storage.service";

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
  constructor(private route: ActivatedRoute, private chatService: ChatService, private socketService: SocketService) { }



  partnerId?: number
  partner?: MessageUser
  self?: MessageUser

  messages: Message[] = [];
  emitter?: MessageUser
  receiver?: MessageUser
  roomUuid?: string

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.partnerId = Number(params.get('id')!);
    });

    this.socketService.listenMessages((message: Message) => this.pushMessage(message));
    this.socketService.joinChat(this.partnerId!)
    this.chatService.getMessages(this.partnerId!).subscribe(this.getMessages);

    this.socketService.listenJoinChat((params: ChatJoin) => this.handleJoining(params))
  }

  private getMessages = (body: ChatMessages) => {
    this.messages = body.data.query.messages;
    this.partner = body.data.query.receiverUser;
    this.self = body.data.query.emitterUser;
  }

  sendMessage = (text: string) => {
    this.socketService.sendMessage(text, this.partner!.id!);
  }

  pushMessage = (message: Message) => {
    this.messages.push(message)
  }

  handleNewMessage = (text: string) => {
    this.sendMessage(text)
  };

  handleJoining = (params: ChatJoin) => {
    if (params.joined) {
      this.roomUuid = params.uuid
      console.log('uuid', this.roomUuid)
    }
  }
}
