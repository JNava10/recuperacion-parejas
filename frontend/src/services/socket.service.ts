import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import {environment} from "../environments/environment.development";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {StorageService} from "./storage.service";
import {Message, SendMessageSocketParams} from "../interfaces/api/chat/message";
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor(private storageService: StorageService) {
    const token = storageService.get('token')!;

    this.socket = io(environment.socketUrl, {extraHeaders: {token: token}}); // En las cabeceras extra pasamos el token para la autenticación en el servidor.

    this.socket.on('connect', () => console.log('Conectado al Websocket de la API'));
  }

  sendMessage = (content: SendMessageSocketParams, idToSend: number) => {
    this.socket.emit('msg', {content, idToSend});
  }

  joinChat = (receiverId: number) => {
    this.socket.emit('join-chat', {receiverId});
  }

  sendMessageRead = (receiverId: number) => {
    this.socket.emit('message-read', {receiverId});
  }

  listenMessages = (callback: Function) => {
    this.socket.on('msg', (params) => callback(params));
  }

  listenFileMessages = (callback: Function) => {
    this.socket.on('msg-file', (params) => callback(params));
  }

  listenJoinChat = (callback: Function) => {
    this.socket.on('join-chat', (params) => callback(params));
  }

  listenReadMessages = (callback: Function) => {
    this.socket.on('message-read', (params) => callback(params));
  }
}
