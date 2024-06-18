import {Component, Input, OnInit} from '@angular/core';
import {PreferenceItem, PreferenceItemWithType} from "../../../interfaces/api/preference/preferenceItem";
import {PreferenceService} from "../../../services/api/preference.service";
import {TitleCasePipe} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from "@angular/material/button";
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {TableModule} from "primeng/table";
import {StyleClassModule} from "primeng/styleclass";
import {showQueryToast} from "../../../utils/common.utils";
import {MessageService} from "primeng/api";
import {CustomToastComponent} from "../../../components/custom-toast/custom-toast.component";

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    TitleCasePipe,
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    MatButton,
    ButtonModule,
    OverlayPanelModule,
    TableModule,
    StyleClassModule,
    CustomToastComponent
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit {
  constructor(private preferenceService: PreferenceService, private router: Router, private messageService: MessageService) {}

  ngOnInit() {
    this.getPreferences();
  }

  protected getPreferences() {
    this.preferenceService.getActivatedPreferences().subscribe(body => {
        this.preferences = body.data.query
      console.log(this.preferences)
      }
    )
  }

  @Input() preferences?: PreferenceItemWithType[];

  deletePref(id: number) {
    this.preferenceService.deletePreference(id).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      if (body.data.executed) {
        this.getPreferences()
      }
    })
  }
}
