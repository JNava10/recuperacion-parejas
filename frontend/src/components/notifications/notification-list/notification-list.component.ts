import {Component, Input, OnInit} from '@angular/core';
import {ListboxModule} from "primeng/listbox";
import {NewMatchNotification} from "../../../interfaces/api/others/notification";
import {UserService} from "../../../services/api/user.service";
import {user} from "../../../utils/const/regex.constants";
import {DatePipe} from "@angular/common";
import {StyleClassModule} from "primeng/styleclass";
import {getTimeAgo} from "../../../utils/common.utils";
import {NewMatchArgs} from "../../../interfaces/socket/notification";

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    ListboxModule,
    DatePipe,
    StyleClassModule
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllNotifications();
  }

  private getAllNotifications() {
    this.userService.getNotifications().subscribe(body => {
      this.notifications = body.data.query
    })
  }

// @Input() newMatchNotifications?: NewMatchNotification[]
  notifications?: NewMatchNotification[]
  protected readonly user = user;
  protected readonly getTimeAgo = getTimeAgo;
  protected readonly Date = Date;

  readAllNotifications() {
    this.userService.readAllNotifications().subscribe(body => {
      if (body.data.executed) {
        this.getAllNotifications()
      }
    })
  }
}
