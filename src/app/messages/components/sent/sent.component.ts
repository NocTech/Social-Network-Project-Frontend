import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Message } from '../../../models/message';
import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
    selector: 'app-sent',
    templateUrl: './sent.component.html',
    styleUrls: ['./sent.component.scss'],
    providers: [
        FollowService,
        MessageService,
        UserService,
        AlertService
    ]
})
export class SentComponent implements OnInit {

    public follows: any;
    public identity: any;
    public loading: boolean;
    public messages!: Message[];
    public next_page: any;
    public page: any;
    public pages: any;
    public prev_page: any;
    public status!: string;
    public title: string;
    public token: any;
    public total: any;
    public url: string;

    constructor(private route: ActivatedRoute, private router: Router, private followService: FollowService,
        private messageService: MessageService, private userService: UserService, private alertService: AlertService) {
        this.title = 'Sent messages';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.loading = true;
    }

    public actualPage(): void {
        this.route.params.subscribe(params => {
            let page = +params['page'];
            this.page = page;

            if (!params['page']) {
                page = 1;
            }

            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page <= 0) {
                    this.prev_page = 1;
                }
            }

            //Get Users List
            this.getMessages(this.token, this.page);
            this.loading = false;
        });
    }

    public getMessages(token: any, page: any): void {
        this.messageService.getEmitMessage(token, page).subscribe(
            {
                next: response => {
                    if (response.messages) {
                        this.messages = response.messages;
                        this.total = response.total;
                        this.pages = response.pages;
                    }
                },
                error: err => {
                    this.alertService.error(err);
                }
            });
    }

    public ngOnInit(): void {
        this.actualPage();
    }
}
