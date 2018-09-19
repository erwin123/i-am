import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { StatemanagementService } from '../services/statemanagement.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = globalVar.global_um + '/users';  // URL to web api

  constructor(private httpClient: HttpClient, private stateService: StatemanagementService) {
  }

  login(username, password): Observable<any> {
    return this.httpClient.post(this.url + '/login', { username: username, password: password, appcode:globalVar.global_appcode }, httpOptions)
      .map(
        res => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.stateService.setCurrentStateLogin("1");
          return res;
        }
      );
  }

  chPwd(username: string, password: string): Observable<any> {
    let token: any;
    token = JSON.parse(localStorage.getItem('currentUser'));
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', token.token);

    return this.httpClient.post(this.url + '/changepwd', { username: username, password: password }, { headers: headers })
      .map(
        res => {
          return res;
        }
      );
  }

  logout() {
    setTimeout(() => {
      localStorage.clear();
      this.stateService.setCurrentStateLogin("0");
    }, 500);
  }
}
