import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FoodDatabasePageComponent } from './food-database/food-database-page/food-database-page.component';
import { FoodDatabaseSearchComponent } from './food-database/food-database-search/food-database-search.component';
import { CreateFoodFormComponent } from './food-database/create-food-form/create-food-form.component';

@NgModule({
  declarations: [
    AppComponent,
    FoodDatabasePageComponent,
    FoodDatabaseSearchComponent,
    CreateFoodFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
