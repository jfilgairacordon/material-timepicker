import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, HostListener, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { combineLatest, concatMap, map, startWith, Subject, take, takeUntil, tap } from 'rxjs';
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

    constructor(
        public viewContainerRef: ViewContainerRef,
        public overlay: Overlay
    ) { }

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
        this.loadComponent();
    }

    /** Pop ups an instance of AMT using CDK Overlay. Also it's attached to the origin input. */
    private loadComponent()
    {
        if (!this.componentRef)
        {
            this.origin = this.viewContainerRef.element.nativeElement
            const overlayRef = this.overlay.create({
                positionStrategy: this.overlay
                    .position()
                    .flexibleConnectedTo(this.origin!)
                    .withPositions([{
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    }]),
                scrollStrategy: this.overlay.scrollStrategies.block(),
                hasBackdrop: true,
                backdropClass: "amt-overlay",
            });
            const amtPortal = new ComponentPortal(AngularMaterialTimepickerComponent);
            this.componentRef = overlayRef.attach(amtPortal);

            // Trigger animations.
            this.componentRef.instance._startAnimation();

            // Close
            overlayRef.backdropClick()
                .pipe(
                    take(1),
                    tap(
                        () =>
                        {
                            this.notifier.next();
                            this.componentRef?.instance._resetAnimation(); // Fires the animation;
                        }
                    ),
                    concatMap(() => this.componentRef!.instance._animationDone)
                )
                .subscribe(
                    () =>
                    {
                        overlayRef.dispose();
                        this.componentRef = undefined; // if we don't do that, it will still pointing to destroyed instance.
                    }
                );

            this.setTimeOnPickerIfNeeded();
            this.setupListeners();
        }
    }

    /** Retrieves a valid hour/minutes time format from the origin input. If the value is not valid, returns an empty array. */
    private getOriginInputHourMinutes(): string[]
    {
        const _default = this.origin?.value
        if (_default && _default.match("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"))
        {
            return _default.split(":");
        }

        return [];
    }

    /** Sets the origin input time to the component instance if needed and fires change detection */
    private setTimeOnPickerIfNeeded(): void
    {
        const currentOriginTime = this.getOriginInputHourMinutes();
        if (currentOriginTime.length > 0)
        {
            this.componentRef!.instance.hour = currentOriginTime[0];
            this.componentRef!.instance.minute = currentOriginTime[1];
            this.componentRef!.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Here we merged both emiters (hour and minutes) with combineLatest in order to generate a valid hour format for the input.
     */
    private setupListeners(): void
    {
        const _instance = this.componentRef!.instance;
        const currentOriginTime = this.getOriginInputHourMinutes();
        combineLatest(
            [
                _instance.hourClicked
                    .pipe(startWith(currentOriginTime?.[0] || _instance.hour)),
                _instance.minuteClicked
                    .pipe(startWith(currentOriginTime?.[1] || _instance.minute))
            ]
        )
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
}
