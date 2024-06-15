import { Component } from '@angular/core';
import {MenuModule} from "primeng/menu";
import {menuItems} from "../../utils/const/menu.constants";
import {StyleClassModule} from "primeng/styleclass";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MenuModule,
    StyleClassModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  menuItems = menuItems
}
