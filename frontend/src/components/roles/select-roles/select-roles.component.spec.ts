import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRolesEditComponent } from './select-roles.component';

describe('SelectRolesComponent', () => {
  let component: SelectRolesEditComponent;
  let fixture: ComponentFixture<SelectRolesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRolesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRolesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
