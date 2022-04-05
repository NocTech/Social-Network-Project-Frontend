import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  public addLike(token: any, like: any): Observable<any> {
    let params = JSON.stringify(like);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.post(this.url + 'like', params, { headers: headers });
  }

  public checkLike(token: any, publicationId: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'like/' + publicationId, { headers: headers });
  }

  public deleteLike(token: any, publicationId: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.delete(this.url + 'delete-like/' + publicationId, { headers: headers });
  }

  public getLikes(token: any, publicationId: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'get-likes/' + publicationId, { headers: headers });
  }
}