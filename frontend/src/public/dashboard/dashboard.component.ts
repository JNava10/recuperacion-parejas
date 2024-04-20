import { Component } from '@angular/core';
import {FindMembersComponent} from "../../components/find-members/find-members.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FindMembersComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
