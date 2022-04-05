import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollwingComponent } from './following.component';

describe('FollwingComponent', () => {
  let component: FollwingComponent;
  let fixture: ComponentFixture<FollwingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollwingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollwingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
