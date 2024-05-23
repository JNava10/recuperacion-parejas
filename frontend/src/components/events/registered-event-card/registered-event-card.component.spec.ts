import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredEventCardComponent } from './registered-event-card.component';

describe('RegisteredEventCardComponent', () => {
  let component: RegisteredEventCardComponent;
  let fixture: ComponentFixture<RegisteredEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredEventCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteredEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
