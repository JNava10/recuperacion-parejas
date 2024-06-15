import {Component, Input, OnInit} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {EventService} from "../../../services/api/event.service";
import {TableModule} from "primeng/table";
import {AvatarModule} from "primeng/avatar";
import {EventItem} from "../../../interfaces/api/event/event";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {UserService} from "../../../services/api/user.service";
import {ListboxModule} from "primeng/listbox";
import {addQueryMessage} from "../../../utils/common.utils";
import {MessageService} from "primeng/api";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";

@Component({
  selector: 'app-manage-event-members-form',
  standalone: true,
  imports: [
    TableModule,
    AvatarModule,
    OverlayPanelModule,
    ListboxModule,
    CustomToastComponent
  ],
  templateUrl: './manage-event-members-form.component.html',
  styleUrl: './manage-event-members-form.component.css'
})
export class ManageEventMembersFormComponent implements OnInit {
  constructor(private eventService: EventService, private userService: UserService, private messageService: MessageService) {}

  ngOnInit() {
    this.eventService.getEventMembers(this.event?.id!).subscribe(body => {
      this.assistants = body.data.query;
    })

    this.userService.getRoleUsers('member').subscribe(body => {
      this.allUsers = body.data.query;
    })
  }

  @Input() event?: EventItem

  assistants?: UserItem[];
  allUsers?: UserItem[];

  addToEvent = (user: UserItem) => {
    this.eventService.addMemberToEvent(this.event!.id!, user.id!).subscribe(body => {
      addQueryMessage(body.data.executed, body.message, this.messageService)
    })
  };
}
