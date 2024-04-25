import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import {environment} from "../environments/environment.development";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl);

    console.log(this.socket)

    this.socket.on('connect', () => console.log('connected to ws server'));
  }


  sendMessage = () => {
    this.socket.emit('msg')
  }
}
