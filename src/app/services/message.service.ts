import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable()

export class MessageService {
    public url: string; 
    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }

    public addMessage(token: any, message: any): Observable<any> {
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set("Content-Type", "application/json")
            .set("Authorization", token);

        return this.http.post(this.url + 'message', params, { headers: headers });
    }

    public getEmitMessage(token: any, page = 1): Observable<any> {
        let headers = new HttpHeaders().set("Content-Type", "application/json")
            .set("Authorization", token);
        return this.http.get(this.url + 'get-emit-messages/' + page, { headers: headers });
    }

    public getReceivedMessage(token: any, page = 1): Observable<any> {
        let headers = new HttpHeaders().set("Content-Type", "application/json")
            .set("Authorization", token);
        return this.http.get(this.url + 'get-received-messages/' + page, { headers: headers });
    }
}