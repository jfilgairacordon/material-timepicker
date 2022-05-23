import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialTimepickerBase } from './angular-material-timepicker-base';

import { AngularMaterialTimepickerComponent } from './angular-material-timepicker.component';
import { HourFormatPipe } from './pipes/hour-format.pipe';
import { MinuteFormatPipe } from './pipes/minute-format.pipe';

describe('AngularMaterialTimepickerComponent', () =>
{
    let component: AngularMaterialTimepickerComponent;
    let fixture: ComponentFixture<AngularMaterialTimepickerComponent>;

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({
            declarations: [
                AngularMaterialTimepickerComponent,
                HourFormatPipe,
                MinuteFormatPipe,
            ],
            imports: [NoopAnimationsModule]
        })
            .compileComponents();
    });

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(AngularMaterialTimepickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should have class .amt', () =>
    {
        const found = document.querySelector('.amt');
        expect(found).toBeTruthy();
    });

    it('should have a div with class "amt-hours"', () =>
    {
        const compiled = fixture.nativeElement as HTMLElement;
        const hours = compiled.querySelector('.amt-hours');
        expect(hours).toBeTruthy();
    });

    it('should have 24 items with "amt-hour" class with mode "pm"',
        () =>
        {
            const root = fixture.nativeElement as HTMLElement;
            const elements = root.querySelectorAll('.amt-hour');
            expect(elements.length).toEqual(24);
        }
    );

    it('should have 12 items with "amt-hour" class with mode "am"',
        () =>
        {
            // Trigger ngOnChanges manually.
            component.ngOnChanges(
                {
                    mode: new SimpleChange(component.mode, 'am', true)
                }
            );
            fixture.detectChanges();
            const root = fixture.nativeElement as HTMLElement;
            const elements = root.querySelectorAll('.amt-hour');
            expect(elements.length).toEqual(12);
        }
    );

    it('should have hours array with length of 12 with mode "am"', () =>
    {
        // Trigger ngOnChanges manually.
        component.ngOnChanges(
            {
                mode: new SimpleChange(component.mode, 'am', true)
            }
        );
        fixture.detectChanges();
        expect(component.hours.length).toBe(12);
    });

    it('should have hours array with length of 24 with mode "pm"', () =>
    {
        expect(component.hours.length).toBe(24);
    });

    it('should have hours array with length of 12 with mode "am" changing the mode many times', () =>
    {
        component.ngOnChanges(
            {
                mode: new SimpleChange(component.mode, 'am', true)
            }
        );
        fixture.detectChanges();
        component.ngOnChanges(
            {
                mode: new SimpleChange(component.mode, 'pm', true)
            }
        );
        fixture.detectChanges();
        component.ngOnChanges(
            {
                mode: new SimpleChange(component.mode, 'am', true)
            }
        );
        fixture.detectChanges();
        expect(component.hours.length).toBe(12);
    });

    it('should have a div with class "amt-minutes"', () =>
    {
        const compiled = fixture.nativeElement as HTMLElement;
        const minutes = compiled.querySelector('.amt-minutes');
        expect(minutes).toBeTruthy();
    });

    it('should have minutes array with length of 60', () =>
    {
        expect(component.minutes.length).toBe(60);
    });

    it('should have 60 items with "amt-minute"',
        () =>
        {
            const root = fixture.nativeElement as HTMLElement;
            const elements = root.querySelectorAll('.amt-minute');
            expect(elements.length).toEqual(60);
        }
    );

    it("should emit hour when .amt-hour is clicked", () =>
    {
        spyOn(component.hourClicked, 'emit');
        const root = fixture.nativeElement as HTMLElement;
        const hours = root.querySelectorAll('.amt-hour');
        const hour9 = hours[9];
        hour9.dispatchEvent(new Event("click"));

        fixture.detectChanges();
        expect(component.hourClicked.emit).toHaveBeenCalledWith("09");
    });

    it("should change var hour when .amt-hour is clicked", () =>
    {
        const root = fixture.nativeElement as HTMLElement;
        const hours = root.querySelectorAll('.amt-hour');
        const hour9 = hours[9];
        hour9.dispatchEvent(new Event("click"));

        fixture.detectChanges();
        expect(component.hour).toBe("09");
    });

    it("should change var minute when .amt-minute is clicked", () =>
    {
        const root = fixture.nativeElement as HTMLElement;
        const hours = root.querySelectorAll('.amt-minute');
        const hour9 = hours[9];
        hour9.dispatchEvent(new Event("click"));

        fixture.detectChanges();
        expect(component.minute).toBe("09");
    });

    it("should emit minute when .amt-minute is clicked", () =>
    {
        spyOn(component.minuteClicked, 'emit');
        const root = fixture.nativeElement as HTMLElement;
        const minutes = root.querySelectorAll('.amt-minute');
        const minute09 = minutes[9];
        minute09.dispatchEvent(new Event("click"));

        fixture.detectChanges();
        expect(component.minuteClicked.emit).toHaveBeenCalledWith("09");
    });
});
