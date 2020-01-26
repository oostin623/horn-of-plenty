import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { Food } from '../shared/food';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FoodDatabaseService {

  private foodDataSource: ReplaySubject<Food[]> = new ReplaySubject(1);

  private mockFoodDatabase: Food[] = [
    { name: 'apple', portion: '1 medium fruit',
      macros: { f: 0, c: 25, p: 2},
      calories: 108, sugar: 15
    },
    { name: 'bananna', portion: '1 medium fruit',
      macros: { f: 2, c: 25, p: 3},
      calories: 144, sugar: 16
    },
    { name: 'orange', portion: '1 medium fruit',
      macros: { f: 2, c: 22, p: 3},
      calories: 124, sugar: 10
    },
  ];

  foodData$ = this.foodDataSource.asObservable();

  constructor() { }

  fetch(): void {
    this.foodDataSource.next(this.mockFoodDatabase);
  }

  checkForFood(name: string): Observable<boolean> {
    return this.foodData$.pipe(
      map(foods => !!foods.find(f => f.name === name)),
    );
  }

  findFood(name: string): Observable<Food|null> {
    return this.foodData$.pipe(
      map(foods => foods.find(f => f.name === name)),
      map(result => !!result ? result : null),
    );
  }

  createFood(food: Food): void {
    this.mockFoodDatabase.push(food);
    this.fetch();
  }

  deleteFood(food: Food): void {
    const match = this.mockFoodDatabase[this.mockFoodDatabase.indexOf(food)];
    this.mockFoodDatabase = this.mockFoodDatabase.filter(f => f.name !== match.name);
    this.fetch();
  }

  updateFood(originalFood: Food, updatedFood: Food): void {
    const match = this.mockFoodDatabase[this.mockFoodDatabase.indexOf(originalFood)];
    this.mockFoodDatabase = this.mockFoodDatabase.filter(f => f.name !== match.name);
    this.mockFoodDatabase.push(updatedFood);
    this.fetch();

  }
}
