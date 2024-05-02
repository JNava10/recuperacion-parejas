import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import {environment} from "../environments/environment.development";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {StorageService} from "./storage.service";
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

  emitWithToken = (data: any) => {

  }
}
