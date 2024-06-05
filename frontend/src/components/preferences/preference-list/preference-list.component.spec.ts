import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceListComponent } from './preference-list.component';

describe('PreferenceListComponent', () => {
  let component: PreferenceListComponent;
  let fixture: ComponentFixture<PreferenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
