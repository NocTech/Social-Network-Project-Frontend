import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }


  public addFollow(token: any, follow: any): Observable<any> {
    let params = JSON.stringify(follow);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'follow', params, { headers: headers });
  }

  public deleteFollow(token: any, userId: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.delete(this.url + 'unfollow/' + userId, { headers: headers });
  }

  public getFollowed(token: any, userId = null, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    let url = this.url + 'followed/';

    if (userId != null) {
      url = this.url + 'followed/' + userId + '/' + page;
    }

    return this.http.get(url, { headers: headers });
  }

  public getFollowing(token: any, userId: any = null, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    let url = this.url + 'following/';

    if (userId != null) {
      url = this.url + 'following/' + userId + '/' + page;
    }

    return this.http.get(url, { headers: headers });
  }


  public getMyFollows(token: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'get-follows/' + true, { headers: headers });
  }

}