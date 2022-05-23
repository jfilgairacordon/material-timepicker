import { AfterViewInit, Component, OnChanges, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { AngularMaterialTimepickerBase } from './angular-material-timepicker-base';
import { timepickerAnimations } from './angular-material-timepicker.animations';
import { HourFormatPipe } from './pipes/hour-format.pipe';
import { MinuteFormatPipe } from './pipes/minute-format.pipe';
import { AngularMaterialTimepickerMode } from './types/mode-type';

@Component({
    selector: 'angular-material-timepicker',
    templateUrl: './angular-material-timepicker.component.html',
    styleUrls: ['./angular-material-timepicker.component.scss'],
    animations: [timepickerAnimations.transformTimepicker, timepickerAnimations.fadeInItems],
})
export class AngularMaterialTimepickerComponent extends AngularMaterialTimepickerBase implements OnChanges, AfterViewInit
{
    /** Mode for building the hour structure */
    mode: AngularMaterialTimepickerMode = 'pm';

    /** The current hour selected by the component to be shown */
    hour = "00";

    /** The current hour selected by the component to be shown */
    minute = "00";

    constructor()
    {
        super();
        this.buildHours();

        const _default = new Date();
        const pipe = new HourFormatPipe();
        this.hour = pipe.transform(_default.getHours());
        this.minute = pipe.transform(_default.getMinutes());

        // We always have 60 minutes 😂;
        this.minutes = Array.from(Array(60).keys());
    }

    ngAfterViewInit(): void
    {
        /**
         * Get the current hour / minute div element and do a scroll in order to show them to the user.
         *
         * We do that because if the input field (which fires the component from the directive) has a valid time format (HH:MM) the component is pre-populated with that data. So on that point, if we have a value different of "00" on the hour / minute variable, the code below shows that to the user.
         */
        const currentHourDiv = document.querySelector<HTMLDivElement>('.amt-hour.amt-current');
        const currentMinuteDiv = document.querySelector<HTMLDivElement>('.amt-minute.amt-current');
        this._animationDone
            .pipe(take(1))
            .subscribe(() =>
            {
                if (currentHourDiv!.offsetTop > 0)
                    currentHourDiv!.parentElement?.scrollTo({
                        top: currentHourDiv!.offsetTop,
                        behavior: "smooth"
                    });

                if (currentMinuteDiv!.offsetTop > 0)
                    currentMinuteDiv!.parentElement?.scrollTo({
                        top: currentMinuteDiv!.offsetTop,
                        behavior: "smooth"
                    })
            });
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if (changes["mode"])
        {
            this.buildHours(changes["mode"].currentValue);
        }
    }

    /** Builds the hour structure taking into account the mode */
    private buildHours(mode?: AngularMaterialTimepickerMode): void
    {
        const _mode = mode || this.mode;
        this.hours = Array.from(Array(_mode == 'am' ? 12 : 24).keys());
    }

    /** Sets the current hour or minutes once the user did clicked the view */
    public elementClicked(type: 'hour' | 'minute', value: number): void
    {
        let pipe: HourFormatPipe | MinuteFormatPipe;
        switch (type)
        {
            case 'hour':
                pipe = new HourFormatPipe();
                const _hour = pipe.transform(value);
                this.hour = _hour;
                this.hourClicked.emit(_hour);
                break;
            case 'minute':
                pipe = new MinuteFormatPipe();
                const _minute = pipe.transform(value);
                this.minute = _minute;
                this.minuteClicked.emit(_minute);
                break;
            default:
                pipe = new HourFormatPipe();
                this.hourClicked.emit(pipe.transform(value));
                break;
        }
    }
}
