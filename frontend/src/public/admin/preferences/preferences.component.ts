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
    StyleClassModule
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit {
  constructor(private preferenceService: PreferenceService, private router: Router) {}

  ngOnInit() {
    this.preferenceService.getActivatedPreferences().subscribe(preferences => {
      this.preferences = preferences
      }
    )
  }

  @Input() preferences?: PreferenceItemWithType[];


  goToCreateChoicePreference = () => {
    this.router.navigate(['create-choice-preference'])
  };
}
