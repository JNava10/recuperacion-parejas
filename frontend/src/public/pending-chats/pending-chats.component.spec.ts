import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingChatsComponent } from './pending-chats.component';

describe('PendingChatsComponent', () => {
  let component: PendingChatsComponent;
  let fixture: ComponentFixture<PendingChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingChatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
