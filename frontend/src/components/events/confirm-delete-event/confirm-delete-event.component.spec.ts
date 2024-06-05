import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteEventComponent } from './confirm-delete-event.component';

describe('ConfirmDeleteEventComponent', () => {
  let component: ConfirmDeleteEventComponent;
  let fixture: ComponentFixture<ConfirmDeleteEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
