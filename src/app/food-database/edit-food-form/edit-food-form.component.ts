import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Food } from 'src/app/shared/food';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FoodDatabaseService } from '../food-database.service';

import { DuplicateFoodNameValidator } from 'src/app/shared/duplicate-food-name-validator';

@Component({
  selector: 'app-edit-food-form',
  templateUrl: './edit-food-form.component.html',
  styleUrls: ['./edit-food-form.component.css']
})
export class EditFoodFormComponent implements OnInit {

  @Input() food: Food;
  @Output() close: EventEmitter<any> = new EventEmitter();


  editFoodForm: FormGroup;
  submitted = false;

  constructor(
    private foodDatabaseService: FoodDatabaseService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.populateFoodForm(this.food);
  }

  populateFoodForm(food: Food): void {
    this.editFoodForm = this.fb.group({
      name: [food.name, Validators.required, 
        DuplicateFoodNameValidator.createValidator(this.foodDatabaseService)],
      portion: [food.portion, Validators.required],
      macros: this.fb.group({
        f: [food.macros.f, Validators.required],
        c: [food.macros.c, Validators.required],
        p: [food.macros.p, Validators.required],
      }),
      calories: [0, Validators.required],
      sugar: [0, Validators.required],
    },
    { validators: [],
      updateOn: 'submit'
    });
  }

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.editFoodForm.valid) {
      this.foodDatabaseService.updateFood(this.food, this.editFoodForm.value);
      this.close.emit();
    }
  }

  get name(): FormControl { return this.editFoodForm.get('name') as FormControl; }

}
