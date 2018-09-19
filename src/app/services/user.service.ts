import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { UserDetail } from '../model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = globalVar.global_um + '/users';  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;

  constructor(private httpClient: HttpClient) { }

  getUser(): Observable<any> {
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);

    return this.httpClient.get(this.url ,{ headers: headers })
      .map(res => {
        return res;
      });
  }

  deleteUser(user:any): Observable<any>{
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);
    return this.httpClient.delete(this.url+"/"+user.Username, { headers: headers })
      .map(res => {
        return res;
      });
  }

  getUserUsername(username:string): Observable<any> {
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);

    return this.httpClient.get(this.url +"/"+username ,{ headers: headers })
      .map(res => {
        return res;
      });
  }

  getUserDetailUsername(username:string): Observable<any> {
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);
    let intUrl = globalVar.global_um + '/userd';

    return this.httpClient.get(intUrl +"/"+username ,{ headers: headers })
      .map(res => {
        return res;
      });
  }

  insertUserDetail(user:UserDetail): Observable<any>{
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);
    let intUrl = globalVar.global_um + '/userd'; 
    console.log(user);
    return this.httpClient.post(intUrl ,user, { headers: headers })
      .map(res => {
        return res;
      });
  }

  insertUser(user:any): Observable<any>{
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);
    return this.httpClient.post(this.url ,user, { headers: headers })
      .map(res => {
        return res;
      });
  }

  registerUser(user:any): Observable<any>{
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);
    return this.httpClient.post(this.url+"/register" ,user, { headers: headers })
      .map(res => {
        return res;
      });
  }

  updateUser(user:any): Observable<any>{
    this.token = JSON.parse(localStorage.getItem('currentUser'));
    const headers = this._headers.append('x-access-token', this.token.token);
    return this.httpClient.put(this.url+"/"+user.Username ,user, { headers: headers })
      .map(res => {
        return res;
      });
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

}
