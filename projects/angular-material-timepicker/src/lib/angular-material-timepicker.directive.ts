import { ComponentRef, Directive, HostListener, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { combineLatest, map, startWith, Subject, take, takeUntil } from 'rxjs';
import { AngularMaterialTimepickerComponent } from './angular-material-timepicker.component';

@Directive({
    selector: 'input[angularMaterialTimepicker]',
    providers: [AngularMaterialTimepickerComponent]
})
export class AngularMaterialTimepickerDirective implements OnDestroy
{
    private componentRef?: ComponentRef<AngularMaterialTimepickerComponent>;
    private notifier = new Subject<void>();
    private origin?: HTMLInputElement;

    constructor(public viewContainerRef: ViewContainerRef) { }

    public ngOnDestroy(): void
    {
        if (this.componentRef)
        {
            this.componentRef.destroy();
            this.notifier.next();
            this.notifier.complete();
        }
    }

    @HostListener('focus') onFocus()
    {
        if (!this.componentRef)
            this.loadComponent();
    }

    private loadComponent()
    {
        if (!this.componentRef)
        {
            this.componentRef = this.viewContainerRef.createComponent<AngularMaterialTimepickerComponent>
                (AngularMaterialTimepickerComponent);

            this.origin = this.viewContainerRef.element.nativeElement as HTMLInputElement;

            this.setTimeOnPickerIfNeeded();
            this.setupListeners();
            this.setupPosition();
        }
    }

    private getCurrentHourMinutes(): string[]
    {
        const _default = this.origin?.value
        if (_default && _default.match("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"))
        {
            return _default.split(":");
        }

        return [];
    }
    private setTimeOnPickerIfNeeded(): void
    {
        const currentOriginTime = this.getCurrentHourMinutes();
        this.componentRef!.instance.hour = currentOriginTime[0] || "00";
        this.componentRef!.instance.minute = currentOriginTime[1] || "00";
        this.componentRef!.changeDetectorRef.detectChanges();
    }
    private setupListeners(): void
    {
        // Setup subscription
        this.componentRef!.instance.closeNotifier
            .pipe(take(1))
            .subscribe(() =>
            {
                this.notifier.next(); // Cancel all opened subs.
                this.componentRef?.instance._resetAnimation(); // Fires the animation;

                // Once the animation is done, then we destroy the component.
                this.componentRef?.instance._animationDone
                    .pipe(take(1))
                    .subscribe(
                        () =>
                        {
                            this.componentRef?.destroy();
                            this.componentRef = undefined; // if we don't do that, it will still pointing to destroyed instance.
                        }
                    );
            });

        // Emision of the time in HH:MM format.
        let currentOriginTime = this.getCurrentHourMinutes();
        combineLatest([
            this.componentRef!.instance.hourClicked
                .pipe(startWith(currentOriginTime?.[0] || "00")),
            this.componentRef!.instance.minuteClicked
                .pipe(startWith(currentOriginTime?.[1] || "00"))
        ])
            .pipe(
                takeUntil(this.notifier),
                map(batch => `${ batch[0] }:${ batch[1] }`)
            )
            .subscribe(
                res =>
                {
                    this.origin!.value = res;
                }
            );
    }
    private setupPosition(): void
    {
        const root = this.componentRef!.location.nativeElement.firstChild as HTMLElement;
        root.style.position = "absolute";
        root.style.left = this.origin!.offsetLeft + "px";
        root.style.top = this.origin!.offsetTop + "px";

        // TODO: Handle if it's going to appear outside the viewport


        // Fire the animations.
        this.componentRef?.instance._startAnimation();
    }
}
