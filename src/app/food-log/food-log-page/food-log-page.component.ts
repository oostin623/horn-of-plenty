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
      .pipe(tap(logDay => console.log('todays log day: ', logDay)))
      .pipe(first())
      .subscribe(logDay => this.initializeForm(logDay));
  }

  /** initialize form with todays values if found, else create an empty form. */
  initializeForm(logDay?: FoodLogDay) {
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

  /** clear out form when switching to a day with no entries,
   *  after the page has been initialized.
   */
  clearForm() {
    this.foodLogDayForm.reset();
    this.initializeForm();
    this.foodLogDayForm.patchValue({
      date: this.selectedDate,
    });
  }

  /** clear out form and populate with a diffrent log day. */
  switchLogDay(entry: FoodLogDay) {
    /*if(entry.eats.length < this.eats.length) {
      this.eats.controls.splice(entry.eats.length)
        .map((control, index) => this.eats.removeAt(index));
    }*/

    this.foodLogDayForm.reset(entry);
    // populate the extra controls when switching from a day wtih less to one with more
    this.eats.controls
      .map((control, index) => { if (!control.value) { this.eats.removeAt(index); } });
    // remove the extra controls when switching from a day with more to one with less
    // TODO: fix this method
    /* this.eats.controls.splice(entry.eats.length)
      .map((control, index) => this.eats.removeAt(index)); */
  }


  navagateToToday() {
    this.selectedDate = this.today;
    this.foodLogService.findLogDay(this.selectedDate)
      .pipe(first())
      .subscribe(day => this.switchLogDay(day));
  }

  createLogEntry(): void {
    this.eats.push(this.defaultEat);
  }

  deleteLogEntry(i: number) {
    this.eats.removeAt(i);
  }

  onSelectFood(foodOption: Food, i: number) {
    console.log('now selecting food ', foodOption, ' for row ', i);
    this.eats.controls[i].patchValue({
      time: this.eats.get(i).value.time,
      food: foodOption
    });
  }

  compareFoodOptions(option1: Food, option2: Food) {
    return option1 && option2 ? option1.name === option2.name : option1 === option2;
  }

  selectInitialFood(index: number): Food {
    return (this.eats.controls[index].value as Eat).food;
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

  changeLogDate(): void {
    this.foodLogService.findLogDay(this.selectedDate)
      .pipe(first())
      .subscribe(entry => !!entry
        ? this.switchLogDay(entry)
        : this.clearForm());
  }

  /*******************************************************************************************************************/

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

  /*******************************************************************************************************************/

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

