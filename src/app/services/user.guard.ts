import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  public canActivate() {
    let identity = this.userService.getIdentity();

    if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')) {
      return true;
    } else {
      this.router.navigate(['/(login)']);
      return false;
    }
  }
}