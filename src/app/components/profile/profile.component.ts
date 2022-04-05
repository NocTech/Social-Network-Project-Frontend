import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Follow } from 'src/app/models/follow';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert/alert.service';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public followed: boolean;
  public following: boolean;
  public followUserOver: any
  public identity: User;
  public loading: boolean;
  public stats: any;
  public status!: string;
  public title: string;
  public token: string;
  public url: string;
  public user!: User;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService,
    private followService: FollowService, private alertService: AlertService) {
    this.title = 'Profile';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.following = false;
    this.followed = false;
    this.loading = true;
  }

  public followUser(userId: any): void {
    let follow = new Follow('', this.identity._id, userId);

    this.followService.addFollow(this.token, follow).subscribe(
      {
        next: () => {
          this.following = true;
        },
        error: err => {
          this.alertService.error(err);
        }
      }
    );
  }

  public getCounters(userId: any): void {
    this.userService.getCounters(userId).subscribe(
      {
        next: response => {
          this.stats = response;
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.alertService.error(errorMessage);
          }
        }
      });
  }

  public getUser(userId: any): void {
    this.userService.getUser(userId).subscribe(
      {
        next: response => {
          if (response.user) {
            this.user = response.user;

            if (response.following && response.following._id) {
              this.following = true;
            } else {
              this.following = false;
            }


            if (response.followed && response.followed._id) {
              this.followed = true;
            } else {
              this.followed = false;
            }

          } else {
            this.alertService.error("error");
          }
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.alertService.error('Error');
            //In case an error, redirect to the profile page of current user
            this.router.navigate(['/profile', this.identity._id]);
          }
        }
      });
  }

  public loadPage(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    });
  }

  public mouseEnter(userId: any): void {
    this.followUserOver = userId;
  }

  public mouseLeave(): void {
    this.followUserOver = 0;
  }

  public ngOnInit(): void {
    this.loadPage();
    this.loading = false;
  }

  public unfollowUser(userId: any): void {
    this.followService.deleteFollow(this.token, userId).subscribe({
      next: () => {
        this.following = false;
      },
      error: err => {
        this.alertService.error(err);
      }
    });
  }
}
