import { TuiRootModule, TuiDialogModule, TuiAlertModule } from "@taiga-ui/core";
import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {initFlowbite} from "flowbite";
import {UserMenuComponent} from "../components/user-menu/user-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TuiRootModule, TuiDialogModule, TuiAlertModule, UserMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';


  ngOnInit(): void {
    initFlowbite();
  }
}
