import {Injectable, OnInit} from '@angular/core';
import { io, Socket } from "socket.io-client";
import {environment} from "../environments/environment.development";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {StorageService} from "./storage.service";
import {Message, SendMessageSocketParams} from "../interfaces/api/chat/message";
import {UserItem} from "../interfaces/api/user/user";
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket;

  constructor(private storageService: StorageService) {
    const token = this.storageService.get('socketToken')!;

    if (token) {
      this.socket = io(environment.socketUrl, {extraHeaders: {token: token}}); // En las cabeceras extra pasamos el token para la autenticación en el servidor.

      this.socket.on('connect', () => console.log('Conectado al Websocket de la API'));
    } else {
      throw new Error('Socket token not exists')
    }
  }

  sendMessage = (content: SendMessageSocketParams, idToSend: number) => {
    this.socket?.emit('msg', {content, idToSend});
  }

  joinChat = (receiverId: number) => {
    this.socket?.emit('join-chat', {receiverId});
  }

  sendLeavingChat = (receiverId: number) => {
    this.socket?.emit('leave-chat', {receiverId});
  }

  listenNewMesages = (callback: Function) => {
    this.socket?.on('new-message', (params) => callback(params));
  }

  sendMessageRead = (receiverId: number) => {
    this.socket?.emit('message-read', {receiverId});
  }

  listenMessages = (callback: Function) => {
    this.socket?.on('msg', (params) => callback(params));
  }

  listenFileMessages = (callback: Function) => {
    this.socket?.on('msg-file', (params) => callback(params));
  }

  listenJoinChat = (callback: Function) => {
    this.socket?.on('join-chat', (params) => callback(params));
  }
  listenReadMessages = (callback: Function) => {
    this.socket?.on('message-read', (params) => callback(params));
  }

  sendNewMatch = (user: UserItem) => {
    this.socket?.emit('new-match', {targetId: user.id});
  }

  listenNewMatch = (callback: Function) => {
    this.socket?.on('new-match', (params) => callback(params));
  }

  removeAllListeners = () => {
    this.socket?.removeAllListeners();
  }
}
