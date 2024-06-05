import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRangePreferenceFormComponent } from './create-range-preference-form.component';

describe('CreateRangePreferenceFormComponent', () => {
  let component: CreateRangePreferenceFormComponent;
  let fixture: ComponentFixture<CreateRangePreferenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRangePreferenceFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRangePreferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
