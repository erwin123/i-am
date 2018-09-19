import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StatemanagementService {
  paramChange: EventEmitter<boolean> = new EventEmitter(false);

  private existTraffic = new BehaviorSubject<boolean>(false);
  currentExistTraffic = this.existTraffic.asObservable();

  private stateLogin = new BehaviorSubject<boolean>(localStorage.getItem('currentUser') ? true : false);
  currentStateLogin = this.stateLogin.asObservable();

  constructor(private router: Router) { 
    
  }

  setCurrentStateLogin(val?: string) {
    if (val) {
      var state = val == "1"? true:false;
      this.stateLogin.next(state);
    }
    else {
      if (localStorage.getItem('currentUser'))
        this.stateLogin.next(true);
    }
  }

  setParamChange(val) {
    this.paramChange.emit(val);
  };
  
  setTraffic(existTraffic: boolean) {
    this.existTraffic.next(existTraffic);
  }

  getStoredUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  
  redirectLogin(){
    localStorage.clear();
    this.router.navigate(['main/login']);
  }
}
