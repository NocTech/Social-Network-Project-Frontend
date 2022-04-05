import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public identity: any;
  public stats: any;
  public token: any;
  public url: string;

  constructor(public http: HttpClient) {
    this.url = GLOBAL.url;
  }

  public forgotPassword(email: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.url + 'forgot-password', { email }, { headers: headers });
  }

  public getCounters(userId = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    if (userId != null) {
      return this.http.get(this.url + 'counters/' + userId, { headers: headers });
    } else {
      return this.http.get(this.url + 'counters', { headers: headers });
    }
  }

  public getIdentity() {
    // @ts-ignore
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != undefined) {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  public getStats() {
    // @ts-ignore
    let stats = JSON.parse(localStorage.getItem('stats'));

    if (stats != "undefined") {
      this.stats = stats;
    } else {
      this.stats = null;
    }

    return this.stats;
  }

  public getToken() {
    let token = localStorage.getItem('token');
    if (token != undefined) {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

  public getUser(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.get(this.url + 'user/' + id, { headers: headers });
  }

  public getUsers(page = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.get(this.url + 'users/' + page, { headers: headers });
  }

  // The output of Observable<any> in case the rersponse from the server is
  // different from the model of the client, any type of data
  public register(user: User): Observable<any> {
    let params = JSON.stringify(user);

    //Specify the content type of the request to the server, in this case JSON
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    //The http client request is formed by the API method URL, the parameters and headers. Is a POST request
    return this.http.post(this.url + 'register', params, { headers: headers });
  }

  public resetPassword(email: any, token: any, newPassword: any): Observable<any> {
    let params = {
      email,
      token,
      "password": newPassword
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.url + 'reset-password', params, { headers: headers });
  }

  public signup(user: User, gettoken: boolean): Observable<any> {
    if (gettoken === true) {
      user = Object.assign(user, { gettoken });
    }

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.url + 'login', params, { headers: headers });
  }

  public updateUser(user: User): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());

    return this.http.put(this.url + 'update-user/' + user._id, params, { headers: headers });
  }
}
