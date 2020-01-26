import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Food } from 'src/app/shared/food';
import { FoodDatabaseService } from '../food-database.service';

@Component({
  selector: 'app-food-database-search',
  templateUrl: './food-database-search.component.html',
  styleUrls: ['./food-database-search.component.css']
})
/**
 * simple search component that displays foods who's name contains the entered query
 */
export class FoodDatabaseSearchComponent implements OnInit {

  foods$: Observable<Food[]>;
  searchResults$: Observable<Food[]>;
  foodSearch: string;

  constructor(private foodDatabaseService: FoodDatabaseService) { }

  ngOnInit() {
    this.foodDatabaseService.fetch();
    this.foods$ = this.foodDatabaseService.foodData$;
  }

  submitSearch() {
    this.searchResults$ = this.foods$.pipe(
      map(foods => foods.filter(food => food.name.includes(this.foodSearch)))
    );
  }

}
