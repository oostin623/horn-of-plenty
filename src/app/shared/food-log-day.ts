import { Food } from './food';

/* represents everything eaten in a given day */
export interface FoodLogDay {
    date: Date;
    eats: Eat[];
}
/* one meal or snack */
export interface Eat {
    time: Date;
    type: EatType;
    meal: MealType;
    food: Food;
    amount: number;
}
export type EatType = ''|'snack'|'meal';
export type MealType = ''|'breakfast'|'lunch'|'dinner';
export enum MealTypeEnum {
    breakfast = 'breakfast',
    lunch = 'lunch',
    dinner = 'dinner',
}
/* a serving of food */
export interface Portion {
    food: Food;
    amount: number;
}
