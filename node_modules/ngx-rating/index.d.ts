import { OnInit, EventEmitter } from "@angular/core";
import { ControlValueAccessor, Validator, AbstractControl } from "@angular/forms";
export declare class Rating implements OnInit, ControlValueAccessor, Validator {
    iconClass: string;
    fullIcon: string;
    emptyIcon: string;
    readonly: boolean;
    disabled: boolean;
    required: boolean;
    float: boolean;
    titles: string[];
    max: number;
    onHover: EventEmitter<{}>;
    onLeave: EventEmitter<{}>;
    model: number;
    ratingRange: number[];
    hovered: number;
    hoveredPercent: number;
    private _max;
    private onChange;
    private onTouched;
    writeValue(value: number): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    validate(c: AbstractControl): {
        required: boolean;
    };
    ngOnInit(): void;
    onKeydown(event: KeyboardEvent): void;
    calculateWidth(item: number): number;
    setHovered(hovered: number): void;
    changeHovered(event: MouseEvent): void;
    resetHovered(): void;
    rate(value: number): void;
    private buildRanges();
    private range(start, end);
}
export declare class RatingModule {
}
