import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/home'],
        routerLinkActiveOptions: {
          exact: true
        },
        
      },
      {
        label: 'Team',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/team'],
        routerLinkActiveOptions: {
          exact: true
        },
      },
      {
        label: 'Manuscript',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/viewer'],
        routerLinkActiveOptions: {
          exact: true
        },
      },
    ];
  }

}
