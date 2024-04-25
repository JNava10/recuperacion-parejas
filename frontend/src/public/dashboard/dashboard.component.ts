import {Component, OnInit} from '@angular/core';
import {FindMembersComponent} from "../../components/find-members/find-members.component";
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FindMembersComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.socketService.sendMessage();
  }

}
