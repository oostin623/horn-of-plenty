import { FoodDatabaseService } from './../food-database.service';
import { Component, OnInit } from '@angular/core';
import { Food } from 'src/app/shared/food';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-food-database-page',
  templateUrl: './food-database-page.component.html',
  styleUrls: ['./food-database-page.component.css']
})
export class FoodDatabasePageComponent implements OnInit {

  foods: Food[];
  foods$: Observable<Food[]>;

  showFoodForm = false;
  showEditFoodForm = false;

  selectedFood: Food;

  constructor(private foodDatabaseService: FoodDatabaseService) { }

  ngOnInit() {
    this.foodDatabaseService.fetch();
    this.foods$ = this.foodDatabaseService.foodData$;
    this.foods$.subscribe(data => this.foods = data);
  }

  toggleShowFoodForm() {
    this.showFoodForm = !this.showFoodForm;
  }

  toggleShowEditFoodForm() {
    this.showEditFoodForm = !this.showEditFoodForm;
  }

  editFood(food: Food) {
    this.selectedFood = food;
    console.log('the food selected for edit: ', food);
    this.toggleShowEditFoodForm();
  }

  deleteFood(food: Food) {
    this.foodDatabaseService.deleteFood(food);
  }

}
