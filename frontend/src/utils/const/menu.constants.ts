import {MenuItem} from "primeng/api";

export const adminItems: MenuItem[] = [
  {label: 'Usuarios', icon: 'fa-solid fa-user', routerLink: './users'},
  {label: 'Preferencias', icon: 'fa-solid fa-heart', routerLink: './preferences'},
  {label: 'Eventos', icon: 'fa-solid fa-street-view', routerLink: './events'}
]


export const userMenuItems: MenuItem[] = [
  {
    separator: true
  },
  {
    label: 'Documents',
    items: [
      {
        label: 'New',
        icon: 'pi pi-plus',
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
      }
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        shortcut: '⌘+O'
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        badge: '2'
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
      }
    ]
  },
  {
    separator: true
  }
];



export const memberMenuItems: MenuItem[] = [
  {
    separator: true
  },
  {
    label: 'Documents',
    items: [
      {
        label: 'New',
        icon: 'pi pi-plus',
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
      }
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        shortcut: '⌘+O'
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        badge: '2'
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
      }
    ]
  },
  {
    separator: true
  }
];
