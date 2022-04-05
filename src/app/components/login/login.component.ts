import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public identity: any;
  public loginError: boolean = false;
  public status: string = '';
  public title: string;
  public token: any;
  public user: User;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService,
    private alertService: AlertService) {
    this.title = 'Login';
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  public getCounters(): void {
    this.userService.getCounters().subscribe(
      {
        next: response => {
          localStorage.setItem('stats', JSON.stringify(response));
          this.status = 'success';
          this.router.navigate(['/']);
        },

        error: err => {
          this.alertService.error(err);
        }
      });
  }

  public getToken(): void {
    //User Login with data
    this.userService.signup(this.user, true).subscribe(
      {
        next: response => {
          this.token = response.token;
          if (this.token.length <= 0) {
            this.alertService.error('Token not generated');
            // this.status == 'error';
          } else {
            localStorage.setItem('token', this.token);
            this.getCounters();
          }
          // this.status = 'success';
          this.alertService.success('Token successful');
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.alertService.error(errorMessage);
          }
        }
      });
  }

  public ngOnInit(): void {

  }

  public onSubmit(): void {
    //User Login with data
    this.userService.signup(this.user, false).subscribe(
      {
        next: response => {
          this.identity = response.user;
          if (!this.identity && !this.identity._id) {
            this.alertService.error("Login failed");
            this.loginError = true;
          } else {
            localStorage.setItem('identity', JSON.stringify(this.identity));
            this.getToken();
          }
          this.alertService.success('Login successful');
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.alertService.error(errorMessage);
          }

        }
      });
  }
}
