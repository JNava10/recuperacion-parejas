import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {MenuService} from "../../services/menu.service";

export const adminItems: MenuItem[] = [
  {label: 'Usuarios', icon: 'fa-solid fa-user', routerLink: './users'},
  {label: 'Preferencias', icon: 'fa-solid fa-heart', routerLink: './preferences'},
  {label: 'Eventos', icon: 'fa-solid fa-street-view', routerLink: './events'}
]

export const adminMenuItems: MenuItem[] = [
  {
    label: 'Admin',
    items: [
      {label: 'Usuarios', icon: 'fa-solid fa-user', routerLink: '/admin/users'},
      {label: 'Preferencias', icon: 'fa-solid fa-heart', routerLink: '/admin/preferences'},
      {label: 'Eventos', icon: 'fa-solid fa-street-view', routerLink: '/admin/events'}
    ]
  }
];

export const memberMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    items: [
      {label: 'Buscar amigos', icon: 'fa-solid fa-user', routerLink: '/dashboard'},
      {label: 'Eventos disponibles', icon: 'fa-solid fa-heart', routerLink: '/available-events'},
      {label: 'Chats', icon: 'fa-solid fa-comments', routerLink: '/pending-chats'}
    ]
  }
];
