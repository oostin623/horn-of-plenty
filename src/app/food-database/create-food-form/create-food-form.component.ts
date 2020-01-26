import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FoodDatabaseService } from '../food-database.service';

import { DuplicateFoodNameValidator } from 'src/app/shared/duplicate-food-name-validator';

@Component({
  selector: 'app-create-food-form',
  templateUrl: './create-food-form.component.html',
  styleUrls: ['./create-food-form.component.css']
})
/**
 * Simple form to add new foods to the stored food list.
 * Prevents submission of foods with duplicate names.
 */
export class CreateFoodFormComponent implements OnInit {

  newFoodForm: FormGroup;
  submitted = false;

  constructor(
    private foodDatabaseService: FoodDatabaseService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.resetFoodForm();
  }

  resetFoodForm(): void {
    this.newFoodForm = this.fb.group({
      name: ['', Validators.required,
        DuplicateFoodNameValidator.createValidator(this.foodDatabaseService)],
      portion: ['', Validators.required],
      macros: this.fb.group({
        f: [0, Validators.required],
        c: [0, Validators.required],
        p: [0, Validators.required],
      }),
      calories: [0, Validators.required],
      sugar: [0, Validators.required],
    },
    { validators: [],
      updateOn: 'submit'
    });
  }

  onClear() {
    this.resetFoodForm();
  }

  onSubmit() {
    this.submitted = true;
    if (this.newFoodForm.valid) {
      this.foodDatabaseService.createFood(this.newFoodForm.value);
      this.resetFoodForm();
    }
  }

  get name(): FormControl { return this.newFoodForm.get('name') as FormControl; }

}
