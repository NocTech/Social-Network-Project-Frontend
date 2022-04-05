import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert } from './alert.model';
import { AlertSettings } from './alert-settings';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private defaultId = 'default-alert';
  private subject = new BehaviorSubject<Alert>(new Alert());

  private alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  public clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }

  public danger(message: string, options?: any) {
    this.alert(
      new Alert({ ...options, alertType: AlertSettings.DANGER, message })
    );
  }

  public error(message: string, options?: any) {
    this.alert(
      new Alert({ ...options, alertType: AlertSettings.ERROR, message })
    );
  }

  public info(message: string, options?: any) {
    this.alert(
      new Alert({ ...options, alertType: AlertSettings.INFO, message })
    );
  }

  public onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter((x) => x && x.id === id));
  }

  public success(message: string, options?: any) {
    this.alert(
      new Alert({ ...options, alertType: AlertSettings.SUCCESS, message })
    );
  }

  public warn(message: string, options?: any) {
    this.alert(
      new Alert({ ...options, alertType: AlertSettings.WARNING, message })
    );
  }
}
