import { MealType, EatType, MealTypeEnum, Eat } from './../shared/food-log-day';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FoodDatabaseService } from './../food-database/food-database.service';
import { Component, OnInit } from '@angular/core';
import { FoodLogDay } from '../shared/food-log-day';
import { Observable } from 'rxjs';
import { Food } from '../shared/food';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-food-log-page',
  templateUrl: './food-log-page.component.html',
  styleUrls: ['./food-log-page.component.css']
})
export class FoodLogPageComponent implements OnInit {

  foodLogDayForm: FormGroup;

  foodOptions$: Observable<Food[]>;
  mealOptions: MealType[] = Object.keys(MealTypeEnum) as MealType[];

  today: Date = new Date();
  selectedDate: Date = this.today;


  constructor(
    private foodDatabaseService: FoodDatabaseService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.foodOptions$ = this.foodDatabaseService.foodData$;
    this.resetForm();
    this.selectedDate = this.today;
  }

  resetForm(): void {
    this.foodLogDayForm = this.fb.group({
      date: [this.selectedDate, Validators.required],
      eats: this.fb.array([this.defaultEat], Validators.required),
    });
  }

  navagateToToday() {
    this.selectedDate = this.today;
    this.resetForm();
  }

  createLogEntry(): void {
    this.eats.controls.push(this.defaultEat);
  }

  deleteLogEntry(i: number) {
    this.eats.removeAt(i);
  }

  onSelectFood(foodOption: Food, i) {
    this.eats.controls[i].patchValue({
      time: this.eats.get(i).value.time,
      food: foodOption
    });
  }

  /*******************************************************************************************************************/

  get defaultEat(): FormGroup {
    return this.fb.group({
      time: Date.now(),
      food: null,
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
    .filter(control => !!control.value.food)
    .reduce((total, ctrl) => total + ctrl.value.food.macros.f * ctrl.value.amount, 0); }

  get totalCarbs(): number { return this.eats.controls
    .filter(control => !!control.value.food)
    .reduce((total, ctrl) => total + ctrl.value.food.macros.c  * ctrl.value.amount, 0); }

  get totalProtein(): number { return this.eats.controls
    .filter(control => !!control.value.food)
    .reduce((total, ctrl) => total + ctrl.value.food.macros.p  * ctrl.value.amount, 0); }

  get totalCalories(): number { return this.eats.controls
    .filter(control => !!control.value.food)
    .reduce((total, ctrl) => total + ctrl.value.food.calories  * ctrl.value.amount, 0); }

  get totalSugar(): number { return this.eats.controls
    .filter(control => !!control.value.food)
    .reduce((total, ctrl) => total + ctrl.value.food.sugar  * ctrl.value.amount, 0); }

  getInputDate(date: Date): string {
    const displayDate = new Date(date);
    // account for time zones
    displayDate.setMinutes(
      displayDate.getMinutes() - displayDate.getTimezoneOffset());
    // convert to date input string
    return displayDate.toJSON().slice(0, 10);
  }

  get selectedDateInput() { return this.getInputDate(this.selectedDate); }

  set selectedDateInput(date) { this.selectedDate = new Date(date); }
  }

