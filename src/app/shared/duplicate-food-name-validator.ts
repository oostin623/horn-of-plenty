import { FoodDatabaseService } from './../food-database/food-database.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

export class DuplicateFoodNameValidator {

    static createValidator(foodDatabaseService: FoodDatabaseService) {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return foodDatabaseService.checkForFood(control.value).pipe(
                map(found => found ? ({ duplicateFoodName : {value: control.value}}) : null),
                first(),
              );
        };
    }
}
