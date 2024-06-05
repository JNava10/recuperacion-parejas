import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRangePreferenceComponent } from './create-range-preference.component';

describe('CreateRangePreferenceComponent', () => {
  let component: CreateRangePreferenceComponent;
  let fixture: ComponentFixture<CreateRangePreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRangePreferenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRangePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
