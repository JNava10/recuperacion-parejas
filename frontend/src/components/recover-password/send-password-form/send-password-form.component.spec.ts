import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPasswordFormComponent } from './send-password-form.component';

describe('SendPasswordFormComponent', () => {
  let component: SendPasswordFormComponent;
  let fixture: ComponentFixture<SendPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendPasswordFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
