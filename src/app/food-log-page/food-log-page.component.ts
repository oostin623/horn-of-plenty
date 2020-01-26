import { MealType, EatType, MealTypeEnum, Eat } from './../shared/food-log-day';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FoodDatabaseService } from './../food-database/food-database.service';
import { Component, OnInit } from '@angular/core';
import { FoodLogDay } from '../shared/food-log-day';
import { Observable } from 'rxjs';
import { Food } from '../shared/food';

@Component({
  selector: 'app-food-log-page',
  templateUrl: './food-log-page.component.html',
  styleUrls: ['./food-log-page.component.css']
})
export class FoodLogPageComponent implements OnInit {

  foodLogDayForm: FormGroup;

  foodOptions$: Observable<Food[]>;
  mealOptions: MealType[] = Object.keys(MealTypeEnum) as MealType[];

  constructor(
    private foodDatabaseService: FoodDatabaseService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.foodOptions$ = this.foodDatabaseService.foodData$;
    this.resetForm();
  }

  resetForm(): void {
    this.foodLogDayForm = this.fb.group({
      date: [Date.now(), Validators.required],
      eats: this.fb.array([this.defaultEat], Validators.required),
    });
  }

  createLogEntry(): void {
    this.eats.controls.push(this.defaultEat);
  }

  selectedFoodChange(foodOption: Food, i) {
    this.eats.controls[i].patchValue({
      time: this.eats.get(i).value.time,
      food: foodOption
    });
  }

  get defaultEat(): FormGroup {
    return this.fb.group({
      time: Date.now(),
      food: {},
      amount: 1,
      type: '',
      meal: '',
    });
  }

  get foodLogDay(): FormGroup { return this.foodLogDayForm as FormGroup; }

  get logDate(): FormControl { return this.foodLogDay.get('date') as FormControl; }

  get logDateValue(): Date { return this.logDate.value as Date; }

  get eats(): FormArray { return this.foodLogDayForm.get('eats') as FormArray; }

  get totalFat(): number { return this.eats.controls
    .filter(control => !!control.value.food.macros)
    .reduce((total, ctrl) => total + ctrl.value.food.macros.f, 0); }

  get totalCarbs(): number { return this.eats.controls
    .filter(control => !!control.value.food.macros)
    .reduce((total, ctrl) => total + ctrl.value.food.macros.c, 0); }

  get totalProtein(): number { return this.eats.controls
    .filter(control => !!control.value.food.macros)
    .reduce((total, ctrl) => total + ctrl.value.food.macros.p, 0); }

  get totalCalories(): number { return this.eats.controls
    .filter(control => !!control.value.food.calories)
    .reduce((total, ctrl) => total + ctrl.value.food.calories, 0); }

  get totalSugar(): number { return this.eats.controls
    .filter(control => !!control.value.food.sugar)
    .reduce((total, ctrl) => total + ctrl.value.food.sugar, 0); }



}
