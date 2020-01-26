import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodFormComponent } from './edit-food-form.component';

describe('EditFoodFormComponent', () => {
  let component: EditFoodFormComponent;
  let fixture: ComponentFixture<EditFoodFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFoodFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFoodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
