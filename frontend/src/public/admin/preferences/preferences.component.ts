import {Component, Input, OnInit} from '@angular/core';
import {
  PreferenceQueryResponse,
  PreferenceItem,
  PreferenceItemWithType
} from "../../../interfaces/api/preference/preferenceItem";
import {PreferenceService} from "../../../services/api/preference.service";
import {TitleCasePipe} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {CustomToastComponent} from "../../../components/custom-toast/custom-toast.component";

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    TitleCasePipe,
    CustomToastComponent,
    RouterOutlet
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit {
  constructor(private preferenceService: PreferenceService, private router: Router, private messageService: MessageService) {}

  ngOnInit() {
    this.getPreferences();
  }

  @Input() preferences?: PreferenceItemWithType[];

  goToCreateChoicePreference = () => {
    this.router.navigate(['create-choice-preference'])
  };

  private getPreferences() {
    this.preferenceService.getActivatedPreferences().subscribe(preferences => {
        this.preferences = preferences
      }
    )
  }

  // Borrado de preferencias

  removePreference(preference: PreferenceItemWithType) {
    this.preferenceService.removePreference(preference.id!).subscribe(this.handleRemovePreference)
  }


  private handleRemovePreference = (body: PreferenceQueryResponse) => {
    const message: Message = {detail: body.message}

    message.severity = body.data.executed ? 'success' : 'error';

    this.messageService.add(message)

    this.getPreferences()
  }

  // Editar preferencias

  goToEdit = async (preference: PreferenceItemWithType) => {
    await this.router.navigate( [`admin/preferences/edit`], {queryParams: {id: preference.id}});
  };
}
