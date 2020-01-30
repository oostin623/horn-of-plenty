import { FoodLogService } from './../food-log.service';
import { MealType, MealTypeEnum, FoodLogDay, Eat } from '../../shared/food-log-day';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ControlContainer } from '@angular/forms';
import { FoodDatabaseService } from '../../food-database/food-database.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../../shared/food';
import { first, tap, find, map } from 'rxjs/operators';

@Component({
  selector: 'app-food-log-page',
  templateUrl: './food-log-page.component.html',
  styleUrls: ['./food-log-page.component.css']
})
/**
 * View component for creating, editing, and reviewing food log entries.
 */
export class FoodLogPageComponent implements OnInit {

  foodLog$: Observable<FoodLogDay[]>;

  foodLogDayForm: FormGroup;

  foodOptions$: Observable<Food[]>;
  mealOptions: MealType[] = Object.keys(MealTypeEnum) as MealType[];

  today: Date = new Date();
  selectedDate: Date = this.today;

  constructor(
    private foodLogService: FoodLogService,
    private foodDatabaseService: FoodDatabaseService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.foodDatabaseService.fetch();
    this.foodOptions$ = this.foodDatabaseService.foodData$;
    this.foodLogService.fetch();
    this.foodLog$ = this.foodLogService.foodLog$;
    // check if entries exist for today
    this.foodLogService.findLogDay(this.today)
      .pipe(first())
      .subscribe(logDay => this.initializeForm(logDay));
  }

  /* initialize form with todays values if found, else create an empty form. */
  private initializeForm(logDay?: FoodLogDay) {
    if (!!logDay) {

      const eatsFormGroups = logDay.eats.map(eat => this.fb.group({
        time: [eat.time],
        type: [eat.type],
        meal: [eat.meal],
        food: [eat.food],
        amount: [eat.amount],
      }));

      this.foodLogDayForm = this.fb.group({
        date: [logDay.date, Validators.required],
        eats: this.fb.array(eatsFormGroups, Validators.required),
      });

    } else {
      this.foodLogDayForm = this.fb.group({
        date: [this.selectedDate, Validators.required],
        eats: this.fb.array([this.defaultEat], Validators.required),
      });
    }
  }

  /* reactive form bindings normally compare objects by address, so a custom comparison method
    is required for the food select input in order to set default selections when an
    existing log day is loaded */
  compareFoodOptions(option1: Food, option2: Food) {
    return option1 && option2 ? option1.name === option2.name : option1 === option2;
  }

  /* populated form arrays don't like having their parent form reset.
     remove all controls from the array before resetting. */
  private emptyEatsFormArray(): void {
    while(this.eats.length) {
      this.eats.removeAt(this.eats.length - 1);
    }
  }

  onNavagateToToday() {
    this.selectedDate = this.today;
    this.foodLogService.findLogDay(this.selectedDate)
      .pipe(first())
      .subscribe(day => this.switchLogDay(day));
  }

  onCreateLogEntry(): void {
    this.eats.push(this.defaultEat);
  }

  onDeleteLogEntry(i: number) {
    this.eats.removeAt(i);
  }

  onSubmit(): void {
    if (this.foodLogDayForm.valid) {
      const entry: FoodLogDay = this.foodLogDayForm.value;
      if (this.foodLogService.checkForLogDay(entry.date)) {
        this.foodLogService.updateFoodLogDay(entry);
      } else {
        this.foodLogService.saveLogDay(entry);
      }
    }
  }

  onChangeLogDate(): void {
    this.foodLogService.findLogDay(this.selectedDate)
      .pipe(first())
      .subscribe(entry => !!entry
        ? this.switchLogDay(entry)
        : this.clearForm());
  }

  /* clear out form and populate with a diffrent log day. */
  private switchLogDay(entry: FoodLogDay) {
    this.emptyEatsFormArray();
    entry.eats.map(eat => this.eats.push(this.fb.group({
      time: eat.time,
      food: eat.food,
      amount: eat.amount,
      type: eat.type,
      meal: eat.meal,
    })));
    this.foodLogDayForm.setValue(entry);
  }

  /* clear out form when switching to a day with no entries, after the page has been initialized. */
  private clearForm() {
    this.foodLogDayForm.reset();
    this.initializeForm();
    this.foodLogDayForm.patchValue({
      date: this.selectedDate,
    });
  }

  /************************************************************************************************/

  get selectedDateInput() {
    const displayDate = new Date(this.selectedDate);
    // account for time zones
    displayDate.setMinutes(displayDate.getMinutes() - displayDate.getTimezoneOffset());
    // convert to date input string
    return displayDate.toJSON().slice(0, 10); }

  set selectedDateInput(date) {
    const displayDate = new Date(date);
    // account for time zones
    displayDate.setMinutes(displayDate.getMinutes() + displayDate.getTimezoneOffset());
    this.selectedDate = displayDate;
  }

  /************************************************************************************************/

  get defaultEat(): FormGroup {
    return this.fb.group({
      time: Date.now(),
      food: null,
      amount: 1,
      type: '',
      meal: '',
    });
  }

  /************************************************************************************************/

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
  }

