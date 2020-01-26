export interface Food {
    name: string;
    portion: string;
    macros: Macros;
    calories: number;
    sugar: number;
}
export interface Macros {
    f: number;
    c: number;
    p: number;
}