import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialTimepickerComponent } from './angular-material-timepicker.component';
import { HourFormatPipe } from './pipes/hour-format.pipe';
import { MaterialModule } from './material.module';
import { MinuteFormatPipe } from './pipes/minute-format.pipe';
import { AngularMaterialTimepickerDirective } from './angular-material-timepicker.directive';
import { TestAMTDirectiveComponent } from './test-amt-directive.component';

@NgModule({
    declarations: [
        AngularMaterialTimepickerComponent,
        HourFormatPipe,
        MinuteFormatPipe,
        AngularMaterialTimepickerDirective,
        TestAMTDirectiveComponent,
    ],
    imports: [
        MaterialModule,
        CommonModule
    ],
    exports: [
        AngularMaterialTimepickerDirective
    ]
})
export class AngularMaterialTimepickerModule { }
