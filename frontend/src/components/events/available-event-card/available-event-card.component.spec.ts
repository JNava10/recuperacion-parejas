import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableEventCardComponent } from './available-event-card.component';

describe('AvailableEventCardComponent', () => {
  let component: AvailableEventCardComponent;
  let fixture: ComponentFixture<AvailableEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableEventCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
