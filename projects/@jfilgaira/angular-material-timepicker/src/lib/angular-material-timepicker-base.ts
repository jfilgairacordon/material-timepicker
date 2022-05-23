import { AnimationEvent } from "@angular/animations";
import { Directive, EventEmitter, HostBinding, HostListener, Output } from "@angular/core";
import { Subject } from "rxjs";

@Directive()
export class AngularMaterialTimepickerBase
{
    /** Defines the default class for the component */
    @HostBinding('class') class = "amt"

    /** Notifier for the click on an hour */
    hourClicked = new EventEmitter<string>();

    /** Notifier for the click on a minute */
    @Output() minuteClicked = new EventEmitter<string>();

    /** Hours array that will be used to build the html nodes */
    hours: Array<number> = [];

    /** Minutes array that will be used to build the html nodes */
    minutes: Array<number> = [];

    /** Current state of the panel animation. */
    _panelAnimationState: 'void' | 'enter' = 'void';

    /** Whether the menu is animating. */
    _isAnimating!: boolean;

    /** Emits whenever an animation on the menu completes. */
    readonly _animationDone = new Subject<AnimationEvent>();

    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(event: AnimationEvent)
    {
        this._animationDone.next(event);
        this._isAnimating = false;
    }

    /** Starts the enter animation. */
    _startAnimation()
    {
        this._panelAnimationState = 'enter';
    }

    /** Resets the panel animation to its initial state. */
    _resetAnimation()
    {
        this._panelAnimationState = 'void';
    }

}