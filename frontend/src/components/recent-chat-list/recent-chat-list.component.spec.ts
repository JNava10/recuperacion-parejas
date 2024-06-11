import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentChatListComponent } from './recent-chat-list.component';

describe('RecentChatListComponent', () => {
  let component: RecentChatListComponent;
  let fixture: ComponentFixture<RecentChatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentChatListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecentChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
