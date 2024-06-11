import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MessageInputComponent} from "../message-input/message-input.component";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {User} from "../../../interfaces/api/user/user";
import {ChatService} from "../../../services/api/chat.service";
import {
  ChatMessages, FileMessage,
  Message,
  MessageUser,
  SendMessageApiParams,
  SendMessageSocketParams
} from "../../../interfaces/api/chat/message";
import {MessagesComponent} from "../messages/messages.component";
import {SocketService} from "../../../services/socket.service";
import {ChatJoin, MessagesRead} from "../../../interfaces/socket/chat";
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
  constructor(private route: ActivatedRoute, private chatService: ChatService, private socketService: SocketService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.partnerId = Number(params.get('id')!);
    });

    this.socketService.listenMessages((message: Message) => {
      this.pushMessage(message)
      this.socketService.sendMessageRead(this.partnerId!);
    })

    this.socketService.listenFileMessages((fileMessage: FileMessage) => {
      console.log(fileMessage.message)
      this.pushMessage(fileMessage.message)
      this.socketService.sendMessageRead(this.partnerId!);
    });

    this.socketService.joinChat(this.partnerId!)
    this.chatService.getMessages(this.partnerId!).subscribe(this.getMessages);

    this.socketService.listenJoinChat((params: ChatJoin) => this.handleJoining(params));
    this.socketService.listenReadMessages((params: MessagesRead) => this.handleMessagesRead(params));

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.socketService.sendLeavingChat(this.receiver?.id!)
      }
    });
  }

  partnerId?: number
  partner?: MessageUser

  self?: MessageUser
  messages: Map<number, Message> = new Map();
  emitter?: MessageUser
  receiver?: MessageUser

  joined = false;

  private getMessages = (body: ChatMessages) => {
    body.data.query.messages.forEach(message => {
      this.pushMessage(message)
    });

    this.partner = body.data.query.receiverUser;
    this.self = body.data.query.emitterUser;
  }

  sendMessage = (content: SendMessageSocketParams) => {
    this.socketService.sendMessage(content, this.partner!.id!);
  }

  pushMessage = (message: Message) => {
    this.messages.set(message.id, message)
  }

  handleNewMessage = (content: SendMessageApiParams) => {
    if (content.text && content.text.length > 0) {
      this.sendMessage({text: content.text})
    } else if (content.files && content.files.length > 0) {
      this.handleFilesMessage(content.files)
    }
  };

  handleJoining = (params: ChatJoin) => {
    if (params.joined) {
      this.joined = params.joined
    }
  }

  handleMessagesRead = (params: MessagesRead) => {
    if (params.messages) {
      params.messages.forEach(messageId => {
        const message = this.messages.get(messageId);

        message!.read = true;

        this.messages.set(messageId, message!);
      })
    }
  }

  handleFilesMessage(files: File[]) {
    this.chatService.uploadMessagesFile(files, this.partnerId!).subscribe(body => {
      if (body.data.files.length === files.length) {
        this.sendMessage({urls: body.data.files})
      }
    })
  }
}
