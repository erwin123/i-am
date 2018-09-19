import { Component, OnInit } from '@angular/core';
import { trigger, animate, style, group, animateChild, query, stagger, transition, state } from '@angular/animations';
import { LoginService } from '../services/login.service';
import { StatemanagementService } from '../services/statemanagement.service';
import { Router } from '@angular/router';
import {PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('routerTransition', [
      transition('* => landing', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })
          , { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('landing => *', [
        group([
          query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true }),
        ])
      ])
    ])
  ]
})
export class MainComponent implements OnInit {

  constructor(private platformLocation: PlatformLocation,private loginService:LoginService, private stateService:StatemanagementService, private router:Router) { }
  titleMenu:string = "Identity Access Management";
  ngOnInit() {
   
  }

  logout(){
    this.loginService.logout();
    this.stateService.setParamChange(false);
    this.router.navigate(['/login']);
    setTimeout(() => {
      window.location.href = (this.platformLocation as any).location.origin;
    }, 600);
    
  }

  setTitle(title:string){
    this.titleMenu = title;
  }
}
