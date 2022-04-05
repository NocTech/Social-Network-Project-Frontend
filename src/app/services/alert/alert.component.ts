import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertSettings } from './alert-settings';
import { Alert } from './alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  public alerts: Alert[] = [];
  public alertSubscription!: Subscription;
  @Input() public id = 'default-alert';
  public routeSubscription!: Subscription;

  constructor(private router: Router, private alertService: AlertService) { }

  public cssClass(alert: Alert) {
    if (!alert) return;
    const classes = ['alert', 'alert-dismissable'];
    const alertTypeClass = {
      [AlertSettings.SUCCESS]: 'alert alert-success',
      [AlertSettings.ERROR]: 'alert alert-error',
      [AlertSettings.INFO]: 'alert alert-info',
      [AlertSettings.WARNING]: 'alert alert-warning',
      [AlertSettings.DANGER]: 'alert alert-danger',
    };
    classes.push(alertTypeClass[alert.alertType]);
    return classes.join(' ');
  }

  public ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public ngOnInit() {
    this.alertSubscription = this.alertService
      .onAlert(this.id)
      .subscribe((alert) => {
        if (!alert.message) {
          this.alerts = [];
          return;
        }
        this.alerts.push(alert);
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  public removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) return;
    this.alerts = this.alerts.filter((x) => x !== alert);
    setTimeout(() => {
      this.alerts = this.alerts.filter((x) => x !== alert);
    }, 250);
  }
}
