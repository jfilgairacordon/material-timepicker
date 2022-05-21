/** This piece of code is extracted from the Angular Material MatMenu Github */

import
{
    trigger,
    state,
    style,
    animate,
    transition,
    AnimationTriggerMetadata,
} from '@angular/animations';

/**
 * Animations used by the angular-material-timepicker component.
 * Animation duration and timing values are based on:
 * https://material.io/guidelines/components/menus.html#menus-usage
 */
export const timepickerAnimations: {
    readonly transformTimepicker: AnimationTriggerMetadata;
    readonly fadeInItems: AnimationTriggerMetadata;
} = {
    /**
     * This animation controls the timepicker panel's entry and exit from the page.
     *
     * When the timepicker panel is added to the DOM, it scales in and fades in its border.
     *
     * When the timepicker panel is removed from the DOM, it simply fades out after a brief
     * delay to display the ripple.
     */
    transformTimepicker: trigger('transformTimepicker', [
        state(
            'void',
            style({
                opacity: 0,
                transform: 'scale(0.8)',
            }),
        ),
        transition(
            'void => enter',
            animate(
                '120ms cubic-bezier(0, 0, 0.2, 1)',
                style({
                    opacity: 1,
                    transform: 'scale(1)',
                }),
            ),
        ),
        transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 }))),
    ]),

    /**
     * This animation fades in the background color and content of the menu panel
     * after its containing element is scaled in.
     */
    fadeInItems: trigger('fadeInItems', [
        state('showing', style({ opacity: 1 })),
        transition('void => *', [
            style({ opacity: 0 }),
            animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
        ]),
    ]),
};