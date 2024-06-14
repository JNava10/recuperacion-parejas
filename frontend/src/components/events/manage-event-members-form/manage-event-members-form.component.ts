import {Component, Input, OnInit} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {EventService} from "../../../services/api/event.service";
import {TableModule} from "primeng/table";
import {AvatarModule} from "primeng/avatar";
import {EventItem} from "../../../interfaces/api/event/event";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {UserService} from "../../../services/api/user.service";

@Component({
  selector: 'app-manage-event-members-form',
  standalone: true,
  imports: [
    TableModule,
    AvatarModule,
    OverlayPanelModule
  ],
  templateUrl: './manage-event-members-form.component.html',
  styleUrl: './manage-event-members-form.component.css'
})
export class ManageEventMembersFormComponent implements OnInit {
  constructor(private eventService: EventService, private userService: UserService) {}

  ngOnInit() {
    this.eventService.getEventMembers(this.event?.id!).subscribe(body => {
      this.assistants = body.data.query;
    })

    this.userService.getRoleUsers('member').subscribe(body => {
      this.allUsers = body.data.query;
      console.log(this.allUsers)
    })
  }

  @Input() event?: EventItem

  assistants?: UserItem[];
  allUsers?: UserItem[];
}
