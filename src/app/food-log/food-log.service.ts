import { ReplaySubject, Observable } from 'rxjs';
import { FoodLogDay } from './../shared/food-log-day';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FoodLogService {

  foodLogSource: ReplaySubject<FoodLogDay[]> = new ReplaySubject(1);
  foodLog$: Observable<FoodLogDay[]> = this.foodLogSource.asObservable();

  today = new Date();
  yesterday = new Date();
  twoDaysAgo = new Date();

  mockFoodLogDatabase: FoodLogDay[] = [
    { // today
      date: this.today,
      eats: [{
        time: this.today,
        type: 'snack',
        meal: '',
        food: {
          name: 'apple',
          portion: '1 medium fruit',
          macros: { f: 0, c: 25, p: 2},
          calories: 108, sugar: 15
        },
        amount: 2,
      },
      {
        time: this.today,
        type: 'meal',
        meal: 'breakfast',
        food: {
          name: 'bananna',
          portion: '1 medium fruit',
          macros: { f: 2, c: 25, p: 3},
          calories: 144, sugar: 16
        },
        amount: 3.5,
      }],
    },
    { // yesterday
      date: this.yesterday,
      eats: [{
        time: this.yesterday,
        type: 'snack',
        meal: '',
        food: {
          name: 'orange',
          portion: '1 medium fruit',
          macros: { f: 2, c: 22, p: 3},
          calories: 124, sugar: 10
      },
        amount: 0.5,
      }]
    },
    { // two days ago
      date: this.twoDaysAgo,
      eats: [{
        time: this.twoDaysAgo,
        type: 'snack',
        meal: '',
        food: {
          name: 'orange',
          portion: '1 medium fruit',
          macros: { f: 2, c: 22, p: 3},
          calories: 124, sugar: 10
      },
        amount: 0.5,
      },
      {
        time: this.twoDaysAgo,
        type: 'snack',
        meal: '',
        food: {
          name: 'orange',
          portion: '1 medium fruit',
          macros: { f: 2, c: 22, p: 3},
          calories: 124, sugar: 10
      },
        amount: 2.1,
      },
      {
        time: this.twoDaysAgo,
        type: 'snack',
        meal: '',
        food: {
          name: 'orange',
          portion: '1 medium fruit',
          macros: { f: 2, c: 22, p: 3},
          calories: 124, sugar: 10
      },
        amount: 3,
      }]
    }
  ];


  constructor() {
    this.yesterday.setDate(this.today.getDate() - 1);
    this.twoDaysAgo.setDate(this.today.getDate() - 2);
   }

  fetch(): void {
    this.foodLogSource.next(this.mockFoodLogDatabase);
  }

  checkForLogDay(date: Date): Observable<boolean> {
    return this.foodLog$.pipe(
      map(entries => !!entries.find(e => this.isSameDay(e.date, date)))
    );
  }

  findLogDay(date: Date): Observable<FoodLogDay|null> {
    return this.foodLog$.pipe(
      map(entries => entries.find(e => this.isSameDay(e.date, date)),
      map(result => !!result ? result : null)),
    );
  }

  saveLogDay(day: FoodLogDay): void {
    this.mockFoodLogDatabase.push(day);
    this.fetch();
  }

  deleteLogDay(day: FoodLogDay): void {
    const match = this.mockFoodLogDatabase[this.mockFoodLogDatabase.indexOf(day)];
    this.mockFoodLogDatabase = this.mockFoodLogDatabase
      .filter(entry => !this.isSameDay(entry.date, match.date));
    this.fetch();
  }

  updateFoodLogDay(updatedEntry: FoodLogDay): void {
    this.mockFoodLogDatabase = this.mockFoodLogDatabase
      .filter(entry => !this.isSameDay(entry.date, updatedEntry.date));
    this.mockFoodLogDatabase.push(updatedEntry);
    this.fetch();

  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getDate() === date2.getDate()
      && date1.getDay() === date2.getDay();
  }

}
