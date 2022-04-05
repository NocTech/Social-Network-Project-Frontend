import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { Message } from 'src/app/models/message';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    providers: [
        FollowService,
        MessageService,
        UserService,
        AlertService]
})
export class AddComponent implements OnInit {

    public follows: any;
    public identity: any;
    public loading: boolean;
    public message: Message;
    public status!: string;
    public title: string;
    public token;
    public url: string;

    constructor(
        private route: ActivatedRoute, private router: Router, private followService: FollowService,
        private messageService: MessageService, private userService: UserService,
        private alertService: AlertService) {
        this.title = "Send Message";
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.message = new Message('', '', '', '', this.identity._id, '');
        this.loading = true;
    }

    public getMyFollows(): void {
        this.followService.getMyFollows(this.token).subscribe(
            {
                next: response => {
                    this.follows = response.follows;
                },
                error: err => {
                    this.alertService.error(err);

                }
            }
        );
    }

    public ngOnInit(): void {
        this.loading = false;
        this.getMyFollows();
    }

    public onSubmit(form: any): void {
        this.loading = true;
        this.messageService.addMessage(this.token, this.message).subscribe(
            {
                next: response => {
                    if (response.message) {
                        this.alertService.success(response.message);
                        this.loading = false;
                        this.alertService.success('Message Sent Successfully.');
                        form.reset();
                    }
                },
                error: err => {
                    let errorMessage = <any>err;
                    if (errorMessage != null) {
                        this.alertService.error("Fail to send the message. Try again.");
                    }
                    this.loading = false;
                }
            });
    }
}