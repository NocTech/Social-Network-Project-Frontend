import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Follow } from 'src/app/models/follow';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert/alert.service';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit {
  public follows: any
  public followUserOver: any;
  public identity: any;
  public next_page: any;
  public page: any;
  public pages: any;
  public prev_page: any;
  public status!: string;
  public title: string;
  public token: any;
  public total: any;
  public url: string;
  public users!: User[];

  constructor(
    private route: ActivatedRoute, private router: Router, private userService: UserService,
    private followService: FollowService, private alertService: AlertService) {
    this.title = 'People';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  public actualPage(): void {
    this.route.params.subscribe(params => {

      let page;

      if (!params['page'])
        page = 1;
      else
        page = +params['page'];


      this.page = page;

      this.next_page = page + 1;
      this.prev_page = page - 1;

      if (this.prev_page <= 0) {
        this.prev_page = 1;
      }
      //Get Users List
      this.getUsers(page);
    });
  }

  public followUser(followed: any): void {
    let follow = new Follow('', this.identity._id, followed);

    this.followService.addFollow(this.token, follow).subscribe(
      {
        next: response => {
          if (!response.follow) {
            this.alertService.error('Error following user');
          } else {
            this.alertService.success('Followed user successfully');
            this.follows.push(followed);
          }
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.alertService.error(errorMessage);
          }
        }
      }
    );
  }


  public getUsers(page: any) {
    this.userService.getUsers(page).subscribe(
      {
        next: response => {
          if (!response.users) {
            this.alertService.error('Error getting users!');
          } else {
            this.total = response.total;
            this.users = response.users;
            this.pages = response.pages;
            this.follows = response.users_following;

            if (page > this.pages) {
              this.router.navigate(['/people', 1]);
            }
          }
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.alertService.error(errorMessage);
          }

        }
      });
  }

  public mouseEnter(user_id: any): void {
    this.followUserOver = user_id;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  public mouseLeave(user_id: any): void {
    this.followUserOver = 0;
  }

  public ngOnInit(): void {
    this.actualPage();
  }

  public unfollowUser(followed: any) {
    this.followService.deleteFollow(this.token, followed).subscribe(
      {
        next: () => {
          let search = this.follows.indexOf(followed);
          if (search
            != -1) {
            this.follows.splice(search, 1);
          }
        },
        error: err => {
          let errorMessage = <any>err;
          console.log(errorMessage);

          if (errorMessage != null) {
            this.status == 'error';
          }
        }
      });
  }
}