import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import {environment} from "../environments/environment.development";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {StorageService} from "./storage.service";
import {Message} from "../interfaces/api/chat/message";
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

  sendMessage = (text: string, idToSend: number) => {
    this.socket.emit('msg', {text, idToSend});
    console.log('Mensaje enviado al usuario con ID', idToSend);
  }

  joinChat = (receiverId: number) => {
    this.socket.emit('join-chat', {receiverId});
  }

  leaveChat = (uuid: string) => {

    this.socket.emit('leave-chat', {uuid});
  }

  listenMessages = (callback: Function) => {
    this.socket.on('msg', (inserted) => callback(inserted));
  }

  listenJoinChat = (callback: Function) => {
    this.socket.on('join-chat', (inserted) => callback(inserted));
  }
}
