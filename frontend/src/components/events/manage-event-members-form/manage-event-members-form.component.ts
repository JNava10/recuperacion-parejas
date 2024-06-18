import {Component, Input, OnInit} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {EventService} from "../../../services/api/event.service";
import {TableModule} from "primeng/table";
import {AvatarModule} from "primeng/avatar";
import {EventItem} from "../../../interfaces/api/event/event";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {UserService} from "../../../services/api/user.service";
import {ListboxModule} from "primeng/listbox";
import {showQueryToast} from "../../../utils/common.utils";
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
    this.getEventAssistants();

    this.getNonAssistants();
  }

  private getNonAssistants = () => {
    this.eventService.getNonEventAssistants(this.event?.id!).subscribe(body => {
      this.nonAssistants = body.data.query;
    })
  };

  private getEventAssistants = () => {
    this.eventService.getEventMembers(this.event?.id!).subscribe(body => {
      this.assistants = body.data.query;
    })
  };

  @Input() event?: EventItem

  assistants?: UserItem[];
  nonAssistants?: UserItem[];

  addToEvent = (user: UserItem) => {
    this.eventService.addMemberToEvent(this.event!.id!, user.id!).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      if (body.data.executed) {
        this.getEventAssistants()
        this.getNonAssistants()
      }
    })
  };

  withdrawFromEvent = (user: UserItem) => {
    console.log(user)

    this.eventService.withdrawMemberFromEvent(this.event!, user).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      if (body.data.executed) {
        this.getEventAssistants()
        this.getNonAssistants()
      }
    })
  };
}
