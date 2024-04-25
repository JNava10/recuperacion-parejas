import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/api/user.service";
import {SearchResponse, User} from "../../interfaces/api/user/search";
import {AvatarComponent} from "../avatar/avatar.component";

@Component({
  selector: 'app-find-members',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AvatarComponent
  ],
  templateUrl: './find-members.component.html',
  styleUrl: './find-members.component.css'
})
export class FindMembersComponent {
  constructor(private userService: UserService) {}

  members?: User[];
  timeout?: NodeJS.Timeout;

  searchInput = new FormControl('');

  protected waitWriteStop = () => {
    clearTimeout(this.timeout);

    // Establecemos un tiempo de espera hasta que el usuario termine de escribir (si es que termina). Así no mandará una llamada a la API por cada vez que pulse.
    this.timeout = setTimeout(() => this.handleInputValue(this.searchInput.value!), 1000);
  }

  private handleInputValue = (value: string) => {
    if (value.length < 1 || value == " ") return;
    this.userService.searchMember(value).subscribe(this.showResults)
  }

  private showResults = (body: SearchResponse) => {
    this.members = body.data.results;
  };
}
