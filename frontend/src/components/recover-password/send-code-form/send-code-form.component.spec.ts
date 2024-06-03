import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCodeFormComponent } from './send-code-form.component';

describe('SendCodeFormComponent', () => {
  let component: SendCodeFormComponent;
  let fixture: ComponentFixture<SendCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendCodeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
