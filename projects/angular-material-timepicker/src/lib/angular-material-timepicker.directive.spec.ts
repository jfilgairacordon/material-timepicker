import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialTimepickerBase } from './angular-material-timepicker-base';
import { timepickerAnimations } from './angular-material-timepicker.animations';
import { AngularMaterialTimepickerComponent } from './angular-material-timepicker.component';
import { AngularMaterialTimepickerDirective } from './angular-material-timepicker.directive';
import { HourFormatPipe } from './pipes/hour-format.pipe';
import { MinuteFormatPipe } from './pipes/minute-format.pipe';
import { TestAMTDirectiveComponent } from './test-amt-directive.component';

describe('AngularMaterialTimepickerDirective', () =>
{
    let component: TestAMTDirectiveComponent;
    let fixture: ComponentFixture<TestAMTDirectiveComponent>;
    let inputEl: DebugElement;

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({
            declarations: [
                TestAMTDirectiveComponent,
                AngularMaterialTimepickerDirective,
                AngularMaterialTimepickerComponent,
                HourFormatPipe,
                MinuteFormatPipe
            ],
            imports: [NoopAnimationsModule]
        })
            .compileComponents();
    });

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(TestAMTDirectiveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
    });

    it('should create an instance', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should popup an instance of the timepicker', () =>
    {
        inputEl.triggerEventHandler('focus', {});
        fixture.detectChanges();
        const root = inputEl.nativeElement as HTMLElement;
        const found = root.nextSibling;
        expect(found?.nodeName).toBe("ANGULAR-MATERIAL-TIMEPICKER");
    });

    it('should popup an instance of the timepicker prepopulated with 01:01', () =>
    {
        const root = inputEl.nativeElement as HTMLInputElement;
        root.value = "01:01";
        fixture.detectChanges();
        inputEl.triggerEventHandler('focus', {});
        fixture.detectChanges();
        expect(root.value).toBe("01:01");
    });

    it('should destroy an instance of the timepicker when .amt-overlay clicked', fakeAsync(() =>
    {
        inputEl.triggerEventHandler('focus', { args: '$event.target' });
        fixture.detectChanges();
        const root = inputEl.nativeElement as HTMLElement;
        const parent = root.parentElement as HTMLDivElement;
        const overlay = parent.querySelector(".amt-overlay") as HTMLDivElement;
        overlay.click();
        tick(501);
        fixture.detectChanges();
        const found = parent.querySelector('.amt');
        expect(found?.nodeName).toBe(undefined);
    }));
});
