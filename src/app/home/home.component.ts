import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';


// const mirador = require('mirador/dist/es/src/index');


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent{
  items: MenuItem[] | undefined;
  


}
